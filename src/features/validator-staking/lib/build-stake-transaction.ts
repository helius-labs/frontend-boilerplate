// Build stake delegation transactions (VALD-03)
// Split into two transactions for Phantom Connect social wallet compatibility:
// Tx 1: Create stake account + initialize authorities
// Tx 2: Delegate stake to validator (must contain only the stake operation)
import {
  PublicKey,
  StakeProgram,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

// Rent exemption for stake account (constant on Solana)
// This is the minimum balance required to keep a stake account rent-free
export const STAKE_ACCOUNT_RENT_EXEMPTION = BigInt(2282880); // ~0.00228 SOL

// Suggested minimum stake amount (rent + some meaningful value)
export const SUGGESTED_MIN_STAKE = BigInt(10_000_000); // 0.01 SOL

export function validateStakeAmount(
  amountLamports: bigint,
  walletBalance: bigint
): StakeAmountValidation {
  const totalRequired = amountLamports + STAKE_ACCOUNT_RENT_EXEMPTION + BigInt(10000); // +10000 for 2 tx fees

  if (amountLamports < SUGGESTED_MIN_STAKE) {
    return {
      valid: false,
      error: `Minimum stake amount is ${Number(SUGGESTED_MIN_STAKE) / 1_000_000_000} SOL`,
      suggestedMinimum: SUGGESTED_MIN_STAKE,
    };
  }

  if (totalRequired > walletBalance) {
    return {
      valid: false,
      error: `Insufficient balance. Need ${Number(totalRequired) / 1_000_000_000} SOL (stake + rent + fees)`,
      suggestedMinimum: SUGGESTED_MIN_STAKE,
    };
  }

  return {
    valid: true,
    suggestedMinimum: SUGGESTED_MIN_STAKE,
  };
}

/**
 * Generate a unique seed for the stake account.
 * Uses timestamp + random suffix to avoid collisions.
 */
function generateStakeSeed(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `stake:${timestamp}${random}`;
}

async function fetchBlockhash(): Promise<string> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getLatestBlockhash',
      params: [{ commitment: 'confirmed' }],
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Failed to get blockhash: ${data.error.message || data.error}`);
  }

  return data.result.value.blockhash;
}

export async function buildStakeTransaction(
  params: StakeTransactionParams
): Promise<StakeTransactionResult> {
  const { walletAddress, validatorVoteAccount, amountLamports } = params;

  const walletPubkey = new PublicKey(walletAddress);
  const validatorPubkey = new PublicKey(validatorVoteAccount);

  // Derive stake account address from wallet using a seed
  // This means only the wallet needs to sign (no separate keypair)
  // Compatible with Phantom Connect embedded wallets (Google/Apple login)
  const seed = generateStakeSeed();
  const stakeAccountPubkey = await PublicKey.createWithSeed(
    walletPubkey,
    seed,
    StakeProgram.programId
  );
  const stakeAccountAddress = stakeAccountPubkey.toBase58();

  const blockhash = await fetchBlockhash();

  // Total lamports needed = stake amount + rent exemption
  const totalLamports = BigInt(amountLamports) + STAKE_ACCOUNT_RENT_EXEMPTION;

  // Transaction 1: Create stake account + initialize authorities
  const initInstructions = [
    SystemProgram.createAccountWithSeed({
      fromPubkey: walletPubkey,
      newAccountPubkey: stakeAccountPubkey,
      basePubkey: walletPubkey,
      seed,
      lamports: Number(totalLamports),
      space: 200,
      programId: StakeProgram.programId,
    }),
    StakeProgram.initialize({
      stakePubkey: stakeAccountPubkey,
      authorized: {
        staker: walletPubkey,
        withdrawer: walletPubkey,
      },
    }),
  ];

  const initMessage = new TransactionMessage({
    payerKey: walletPubkey,
    recentBlockhash: blockhash,
    instructions: initInstructions,
  }).compileToV0Message();

  const initTransaction = new VersionedTransaction(initMessage);

  // Transaction 2: Delegate stake to validator (only stake operation)
  const delegateInstructions = [
    ...StakeProgram.delegate({
      stakePubkey: stakeAccountPubkey,
      authorizedPubkey: walletPubkey,
      votePubkey: validatorPubkey,
    }).instructions,
  ];

  const delegateMessage = new TransactionMessage({
    payerKey: walletPubkey,
    recentBlockhash: blockhash,
    instructions: delegateInstructions,
  }).compileToV0Message();

  const delegateTransaction = new VersionedTransaction(delegateMessage);

  return {
    initTransaction: initTransaction.serialize(),
    delegateTransaction: delegateTransaction.serialize(),
    stakeAccountAddress,
    estimatedRentExemption: STAKE_ACCOUNT_RENT_EXEMPTION,
  };
}

/**
 * Build just the delegate transaction with a fresh blockhash.
 * Used when submitting the second transaction after the init tx confirms.
 */
export async function buildDelegateTransaction(
  params: DelegateTransactionParams
): Promise<Uint8Array> {
  const walletPubkey = new PublicKey(params.walletAddress);
  const stakeAccountPubkey = new PublicKey(params.stakeAccountAddress);
  const validatorPubkey = new PublicKey(params.validatorVoteAccount);

  const blockhash = await fetchBlockhash();

  const instructions = [
    ...StakeProgram.delegate({
      stakePubkey: stakeAccountPubkey,
      authorizedPubkey: walletPubkey,
      votePubkey: validatorPubkey,
    }).instructions,
  ];

  const messageV0 = new TransactionMessage({
    payerKey: walletPubkey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0).serialize();
}

/**
 * Poll for transaction confirmation.
 * Returns once the transaction reaches 'confirmed' or 'finalized' status.
 */
export async function waitForConfirmation(signature: string, timeout = 30000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const response = await fetch('/api/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'getSignatureStatuses',
        params: [[signature], { searchTransactionHistory: false }],
      }),
    });

    const data = await response.json();
    const status = data.result?.value?.[0];

    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
      if (status.err) {
        throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`);
      }
      return;
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Transaction confirmation timed out');
}

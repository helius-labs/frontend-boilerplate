// Build stake delegation transaction (VALD-03)
// Uses @solana/web3.js StakeProgram for real transaction building
// Uses createAccountWithSeed so only the wallet needs to sign (Phantom Connect compatible)
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
  const totalRequired = amountLamports + STAKE_ACCOUNT_RENT_EXEMPTION + BigInt(5000); // +5000 for fees

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

  // Get latest blockhash for transaction
  const blockhashResponse = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getLatestBlockhash',
      params: [{ commitment: 'confirmed' }],
    }),
  });

  const blockhashData = await blockhashResponse.json();
  if (blockhashData.error) {
    throw new Error(
      `Failed to get blockhash: ${blockhashData.error.message || blockhashData.error}`
    );
  }

  const { blockhash } = blockhashData.result.value;

  // Total lamports needed = stake amount + rent exemption
  const totalLamports = BigInt(amountLamports) + STAKE_ACCOUNT_RENT_EXEMPTION;

  // Build instructions using createAccountWithSeed (single-signer)
  const instructions = [
    // 1. Create stake account with seed (only wallet signs)
    SystemProgram.createAccountWithSeed({
      fromPubkey: walletPubkey,
      newAccountPubkey: stakeAccountPubkey,
      basePubkey: walletPubkey,
      seed,
      lamports: Number(totalLamports),
      space: 200, // Stake account data size
      programId: StakeProgram.programId,
    }),
    // 2. Initialize stake account with authorities
    StakeProgram.initialize({
      stakePubkey: stakeAccountPubkey,
      authorized: {
        staker: walletPubkey,
        withdrawer: walletPubkey,
      },
    }),
    // 3. Delegate stake to validator
    ...StakeProgram.delegate({
      stakePubkey: stakeAccountPubkey,
      authorizedPubkey: walletPubkey,
      votePubkey: validatorPubkey,
    }).instructions,
  ];

  // Build VersionedTransaction (required by Phantom Connect SDK)
  const messageV0 = new TransactionMessage({
    payerKey: walletPubkey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  // No partial signing needed - only the wallet signs this transaction
  const serializedTx = transaction.serialize();

  return {
    transaction: serializedTx,
    stakeAccountAddress,
    estimatedRentExemption: STAKE_ACCOUNT_RENT_EXEMPTION,
  };
}

// Build stake delegation transaction (VALD-03)
// Uses @solana/web3.js StakeProgram for real transaction building
import { Keypair, PublicKey, StakeProgram, SystemProgram, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

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

export async function buildStakeTransaction(
  params: StakeTransactionParams
): Promise<StakeTransactionResult> {
  const { walletAddress, validatorVoteAccount, amountLamports } = params;

  // Generate new stake account keypair
  // IMPORTANT: Generate fresh keypair for each transaction attempt
  const stakeAccountKeypair = Keypair.generate();
  const stakeAccountAddress = stakeAccountKeypair.publicKey.toBase58();

  // Convert addresses to PublicKey
  const walletPubkey = new PublicKey(walletAddress);
  const validatorPubkey = new PublicKey(validatorVoteAccount);

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

  const { blockhash, lastValidBlockHeight } = blockhashData.result.value;

  // Total lamports needed = stake amount + rent exemption
  const totalLamports = BigInt(amountLamports) + STAKE_ACCOUNT_RENT_EXEMPTION;

  // Build transaction with 3 instructions
  const transaction = new Transaction({
    feePayer: walletPubkey,
    blockhash,
    lastValidBlockHeight,
  });

  // 1. Create stake account (owned by Stake Program)
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: walletPubkey,
      newAccountPubkey: stakeAccountKeypair.publicKey,
      lamports: Number(totalLamports),
      space: 200, // Stake account data size
      programId: StakeProgram.programId,
    })
  );

  // 2. Initialize stake account with authorities
  transaction.add(
    StakeProgram.initialize({
      stakePubkey: stakeAccountKeypair.publicKey,
      authorized: {
        staker: walletPubkey,
        withdrawer: walletPubkey,
      },
    })
  );

  // 3. Delegate stake to validator
  transaction.add(
    StakeProgram.delegate({
      stakePubkey: stakeAccountKeypair.publicKey,
      authorizedPubkey: walletPubkey,
      votePubkey: validatorPubkey,
    })
  );

  // Partial sign with stake account keypair (wallet will sign later)
  transaction.partialSign(stakeAccountKeypair);

  // Serialize transaction (without wallet signature - wallet will sign)
  const serializedTx = transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  return {
    transaction: serializedTx,
    stakeAccountKeypair,
    stakeAccountAddress,
    estimatedRentExemption: STAKE_ACCOUNT_RENT_EXEMPTION,
  };
}

// Re-export types/utils for other modules
export { bs58, Keypair };

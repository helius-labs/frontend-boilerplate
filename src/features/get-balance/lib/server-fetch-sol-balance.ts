// Server-side SOL balance fetch
// Uses Helius SDK directly - ONLY import in server components
import { address as createAddress } from '@solana/kit';
import { getHeliusClient } from '@/shared/lib/helius-client';

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);

/**
 * Fetch SOL balance for an address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchSolBalance(address: string): Promise<SolBalanceResult> {
  const helius = getHeliusClient();

  // Convert string to Address type
  const solAddress = createAddress(address);

  // getBalance returns { context: { slot }, value: lamports }
  const response = await helius.raw.getBalance(solAddress);
  const lamports = BigInt(response.value);

  return {
    lamports,
    sol: Number(lamports) / Number(LAMPORTS_PER_SOL),
  };
}

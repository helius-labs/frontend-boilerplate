// Server-side specific token balance fetch
// Uses Helius SDK directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';

// Common token decimals cache (extend as needed)
const TOKEN_DECIMALS: Record<string, number> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 6, // USDC
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 6, // USDT
  So11111111111111111111111111111111111111112: 9, // Wrapped SOL
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: 5, // BONK
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: 6, // JUP
};

/**
 * Fetch specific token balance for an address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchTokenBalance(
  ownerAddress: string,
  mintAddress: string
): Promise<SpecificTokenResult> {
  const helius = getHeliusClient();

  const result = await helius.getTokenAccounts({
    owner: ownerAddress,
    mint: mintAddress,
    limit: 1,
  });

  if (!result.token_accounts?.length) {
    return { found: false, mint: mintAddress };
  }

  const account = result.token_accounts[0];

  // Get decimals from cache or default to 9
  const decimals = TOKEN_DECIMALS[mintAddress] ?? 9;
  const amount = account.amount ?? 0;
  const uiAmount = (amount / Math.pow(10, decimals)).toFixed(decimals);

  return {
    found: true,
    mint: mintAddress,
    balance: {
      amount: amount.toString(),
      decimals,
      uiAmount,
    },
  };
}

// Server-side filtered transactions fetch
// Uses Helius Enhanced API directly - ONLY import in server components
import { env } from '@/shared/config/env';

const BASE_URL = 'https://api.helius.xyz';

/**
 * Fetch transactions filtered by type using Enhanced API.
 * Server-side only - do not import in client components.
 */
export async function serverFetchFilteredTransactions(
  address: string,
  type: FilterableTransactionType,
  limit: number = 20
): Promise<EnhancedTransaction[]> {
  const apiKey = env.heliusApiKey();

  const url = new URL(`${BASE_URL}/v0/addresses/${address}/transactions`);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('type', type);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('sort-order', 'desc');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Helius API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data || [];
}

// Server-side paginated transactions fetch
// Uses Helius RPC directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';

interface ServerFetchPaginatedOptions {
  limit?: number;
  paginationToken?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch paginated transaction history using RPC method.
 * Server-side only - do not import in client components.
 */
export async function serverFetchPaginatedTransactions(
  address: string,
  options: ServerFetchPaginatedOptions = {}
): Promise<PaginatedResult> {
  const { limit = 25, paginationToken, sortOrder = 'desc' } = options;

  const helius = getHeliusClient();

  const params: Record<string, unknown> = {
    transactionDetails: 'signatures',
    limit,
    sortOrder,
    filters: {
      status: 'any',
      tokenAccounts: 'balanceChanged',
    },
  };

  if (paginationToken) {
    params.paginationToken = paginationToken;
  }

  const result = await helius.getTransactionsForAddress([address, params] as Parameters<
    typeof helius.getTransactionsForAddress
  >[0]);

  // Type assertion for the response structure
  const typedResult = result as unknown as PaginatedTransactionsResponse;

  return {
    data: typedResult.data || [],
    paginationToken: typedResult.paginationToken || null,
    hasMore: typedResult.paginationToken !== null,
  };
}

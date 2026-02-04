// Use Case 3: Paginated Transaction History
// Uses RPC getTransactionsForAddress for keyset pagination
// Source: https://www.helius.dev/docs/api-reference/rpc/http/gettransactionsforaddress

interface RpcProxyResponse {
  result?: PaginatedTransactionsResponse;
  error?: string;
}

interface FetchPaginatedOptions {
  limit?: number;
  paginationToken?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'succeeded' | 'failed' | 'any';
}

/**
 * Fetch paginated transaction history using RPC method.
 * Demonstrates keyset pagination for large transaction histories.
 *
 * @param address - Wallet address to query
 * @param options - Pagination and filter options
 * @returns Transaction signatures with pagination token
 */
export async function fetchPaginatedTransactions(
  address: string,
  options: FetchPaginatedOptions = {}
): Promise<PaginatedResult> {
  const { limit = 25, paginationToken, sortOrder = 'desc', status = 'any' } = options;

  const params: Record<string, unknown> = {
    transactionDetails: 'signatures', // Faster, up to 1000
    limit,
    sortOrder,
    filters: {
      status,
      tokenAccounts: 'balanceChanged', // Include token account transactions
    },
  };

  if (paginationToken) {
    params.paginationToken = paginationToken;
  }

  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getTransactionsForAddress',
      params: [address, params],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const data: RpcProxyResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const result = data.result!;

  return {
    data: result.data,
    paginationToken: result.paginationToken,
    hasMore: result.paginationToken !== null,
  };
}

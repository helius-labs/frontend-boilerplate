// Use Case 2: Transactions Filtered by Type
// Uses Enhanced API with type parameter
// Source: https://www.helius.dev/docs/api-reference/enhanced-transactions/gettransactionsbyaddress

interface EnhancedApiResponse {
  result?: EnhancedTransaction[];
  error?: string;
}

/**
 * Fetch transactions filtered by type using Enhanced API.
 * @param address - Wallet address to query
 * @param type - Transaction type filter (e.g., 'TRANSFER', 'SWAP')
 * @param limit - Maximum number of transactions to return
 */
export async function fetchFilteredTransactions(
  address: string,
  type: FilterableTransactionType,
  limit: number = 20
): Promise<EnhancedTransaction[]> {
  const response = await fetch('/api/helius/enhanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: 'getTransactionsByAddress',
      params: {
        address,
        type, // Filter by transaction type
        limit,
        'sort-order': 'desc',
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const data: EnhancedApiResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result || [];
}

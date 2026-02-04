// Use Case 1: Recent Transactions with Enhanced Data
// Uses Enhanced API for human-readable transaction data
// Source: https://www.helius.dev/docs/api-reference/enhanced-transactions/gettransactionsbyaddress

interface EnhancedApiResponse {
  result?: EnhancedTransaction[];
  error?: string;
}

/**
 * Fetch recent transactions for an address using Enhanced API.
 * Returns parsed transactions with type, description and transfers.
 */
export async function fetchRecentTransactions(
  address: string,
  limit: number = 20
): Promise<EnhancedTransaction[]> {
  const response = await fetch('/api/helius/enhanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: 'getTransactionsByAddress',
      params: {
        address,
        limit,
        'sort-order': 'desc', // Newest first
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

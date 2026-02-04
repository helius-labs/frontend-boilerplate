// Code examples for each use case
// Used in demo page to show copy-pasteable code

export const CODE_EXAMPLES: Record<TransactionUseCase, CodeExample> = {
  recent: {
    typescript: `// Get recent transactions for a wallet address
// Uses Enhanced API for human-readable transaction data
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getRecentTransactions(address: string) {
  // Enhanced API endpoint returns parsed transaction data
  const response = await fetch(
    \`https://api.helius.xyz/v0/addresses/\${address}/transactions?api-key=YOUR_API_KEY&limit=20\`
  );

  const transactions = await response.json();

  return transactions.map(tx => ({
    signature: tx.signature,
    type: tx.type,           // e.g., 'TRANSFER', 'SWAP', 'NFT_SALE'
    description: tx.description,
    timestamp: tx.timestamp,
    fee: tx.fee,
    nativeTransfers: tx.nativeTransfers,
    tokenTransfers: tx.tokenTransfers,
  }));
}

// Usage
const transactions = await getRecentTransactions('86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY');
transactions.forEach(tx => {
  console.log(\`\${tx.type}: \${tx.description}\`);
});`,

    curl: `# Get recent transactions using Helius Enhanced API
# Returns human-readable transaction data with type classification

curl "https://api.helius.xyz/v0/addresses/86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY/transactions?api-key=YOUR_API_KEY&limit=20"

# Response includes parsed transaction data:
# - type: TRANSFER, SWAP, NFT_SALE, NFT_MINT, STAKE_SOL, etc.
# - description: Human-readable summary
# - nativeTransfers: SOL movement details
# - tokenTransfers: SPL token movement details

# Optional parameters:
# &type=TRANSFER         Filter by transaction type
# &source=MAGIC_EDEN     Filter by source program
# &sort-order=desc       Sort by timestamp (default: desc)`,
  },

  filtered: {
    typescript: `// Get transactions filtered by type
// Uses Enhanced API with type parameter
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getFilteredTransactions(
  address: string,
  type: 'TRANSFER' | 'SWAP' | 'NFT_SALE' | 'STAKE_SOL' // etc.
) {
  // Add type parameter to filter results
  const response = await fetch(
    \`https://api.helius.xyz/v0/addresses/\${address}/transactions?api-key=YOUR_API_KEY&type=\${type}&limit=20\`
  );

  const transactions = await response.json();
  return transactions;
}

// Example: Get only SWAP transactions
const swaps = await getFilteredTransactions(
  '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY',
  'SWAP'
);

console.log(\`Found \${swaps.length} swap transactions\`);
swaps.forEach(tx => {
  console.log(\`  \${tx.description}\`);
});`,

    curl: `# Get transactions filtered by type using Enhanced API
# Supported types: TRANSFER, SWAP, NFT_SALE, NFT_LISTING, NFT_BID,
#                  NFT_MINT, STAKE_SOL, UNSTAKE_SOL, BURN, TOKEN_MINT

# Example: Get only SWAP transactions
curl "https://api.helius.xyz/v0/addresses/86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY/transactions?api-key=YOUR_API_KEY&type=SWAP&limit=20"

# Example: Get NFT sales
curl "https://api.helius.xyz/v0/addresses/86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY/transactions?api-key=YOUR_API_KEY&type=NFT_SALE&limit=20"

# Example: Get staking transactions
curl "https://api.helius.xyz/v0/addresses/86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY/transactions?api-key=YOUR_API_KEY&type=STAKE_SOL&limit=20"`,
  },

  paginated: {
    typescript: `// Paginated transaction history using RPC method
// Uses keyset pagination for efficient large history queries
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function* getTransactionHistory(address: string) {
  let paginationToken: string | null = null;

  do {
    // Use getTransactionsForAddress RPC method
    const response = await helius.rpc.getTransactionsForAddress(address, {
      transactionDetails: 'signatures', // Fast mode, up to 1000 per page
      limit: 100,
      sortOrder: 'desc',
      ...(paginationToken && { paginationToken }),
    });

    yield response.data;
    paginationToken = response.paginationToken;
  } while (paginationToken);
}

// Usage with async iterator
const address = '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY';
let count = 0;

for await (const page of getTransactionHistory(address)) {
  count += page.length;
  console.log(\`Loaded \${count} transactions...\`);

  // Process each signature
  page.forEach(sig => {
    console.log(\`  \${sig.signature} - \${sig.blockTime}\`);
  });
}`,

    curl: `# Paginated transaction history using Helius RPC
# Supports keyset pagination for large histories

# First request (no pagination token)
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getTransactionsForAddress",
    "params": [
      "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      {
        "transactionDetails": "signatures",
        "limit": 100,
        "sortOrder": "desc"
      }
    ]
  }'

# Response includes paginationToken for next page:
# { "data": [...], "paginationToken": "abc123..." }

# Subsequent requests include the pagination token:
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getTransactionsForAddress",
    "params": [
      "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      {
        "transactionDetails": "signatures",
        "limit": 100,
        "sortOrder": "desc",
        "paginationToken": "abc123..."
      }
    ]
  }'`,
  },
};

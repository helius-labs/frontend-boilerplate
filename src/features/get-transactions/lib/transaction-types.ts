// Transaction type labels and icons
// Source: https://www.helius.dev/docs/webhooks/transaction-types

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  UNKNOWN: 'Unknown',
  TRANSFER: 'Transfer',
  SWAP: 'Swap',
  NFT_SALE: 'NFT Sale',
  NFT_LISTING: 'NFT Listing',
  NFT_BID: 'NFT Bid',
  NFT_BID_CANCELLED: 'Bid Cancelled',
  NFT_CANCEL_LISTING: 'Listing Cancelled',
  NFT_MINT: 'NFT Mint',
  STAKE_SOL: 'Stake SOL',
  UNSTAKE_SOL: 'Unstake SOL',
  BURN: 'Burn',
  TOKEN_MINT: 'Token Mint',
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw',
  ADD_LIQUIDITY: 'Add Liquidity',
  WITHDRAW_LIQUIDITY: 'Remove Liquidity',
};

// Transaction type colors for badges
export const TRANSACTION_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  TRANSFER: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-800 dark:text-blue-200',
  },
  SWAP: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    text: 'text-purple-800 dark:text-purple-200',
  },
  NFT_SALE: {
    bg: 'bg-pink-100 dark:bg-pink-900',
    text: 'text-pink-800 dark:text-pink-200',
  },
  NFT_LISTING: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-800 dark:text-orange-200',
  },
  NFT_MINT: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
  },
  STAKE_SOL: {
    bg: 'bg-cyan-100 dark:bg-cyan-900',
    text: 'text-cyan-800 dark:text-cyan-200',
  },
  UNSTAKE_SOL: {
    bg: 'bg-cyan-100 dark:bg-cyan-900',
    text: 'text-cyan-800 dark:text-cyan-200',
  },
  BURN: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
  },
  TOKEN_MINT: {
    bg: 'bg-emerald-100 dark:bg-emerald-900',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  DEFAULT: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
  },
};

// Filterable types for dropdown
export const FILTERABLE_TYPES: Array<{
  value: FilterableTransactionType;
  label: string;
}> = [
  { value: 'TRANSFER', label: 'Transfers' },
  { value: 'SWAP', label: 'Swaps' },
  { value: 'NFT_SALE', label: 'NFT Sales' },
  { value: 'NFT_LISTING', label: 'NFT Listings' },
  { value: 'NFT_BID', label: 'NFT Bids' },
  { value: 'STAKE_SOL', label: 'Stake SOL' },
  { value: 'UNSTAKE_SOL', label: 'Unstake SOL' },
  { value: 'BURN', label: 'Burns' },
  { value: 'TOKEN_MINT', label: 'Token Mints' },
];

/**
 * Get human-readable label for transaction type.
 */
export function getTransactionTypeLabel(type: string): string {
  return TRANSACTION_TYPE_LABELS[type] || type;
}

/**
 * Get color classes for transaction type badge.
 */
export function getTransactionTypeColor(type: string): {
  bg: string;
  text: string;
} {
  return TRANSACTION_TYPE_COLORS[type] || TRANSACTION_TYPE_COLORS.DEFAULT;
}

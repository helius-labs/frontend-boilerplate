export const GET_TRANSACTIONS_NAV_ITEMS: SubNavItem[] = [
  {
    href: '/get-transactions/recent',
    title: 'Recent',
    method: 'getTransactionsByAddress',
    description: 'View recent transactions with parsed details',
  },
  {
    href: '/get-transactions/by-type',
    title: 'Filter by Type',
    method: 'getTransactionsByAddress',
    description: 'Filter by TRANSFER, SWAP, NFT_SALE, etc.',
  },
  {
    href: '/get-transactions/paginated',
    title: 'Paginated History',
    method: 'getSignaturesForAddress',
    description: 'Browse full history with keyset pagination',
  },
];

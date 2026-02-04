export const GET_BALANCE_NAV_ITEMS: SubNavItem[] = [
  {
    href: '/get-balances/sol-only',
    title: 'SOL Balance',
    method: 'getBalance',
    description: 'Standard RPC method for native SOL balance',
  },
  {
    href: '/get-balances/all-tokens',
    title: 'All Tokens',
    method: 'getAssetsByOwner',
    description: 'DAS API for complete portfolio view',
  },
  {
    href: '/get-balances/specific-token',
    title: 'Specific Token',
    method: 'getTokenAccounts',
    description: 'DAS API filtered by mint address',
  },
];

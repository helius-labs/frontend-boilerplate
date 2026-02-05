export const PHANTOM_CONNECT_NAV_ITEMS: SubNavItem[] = [
  {
    href: '/phantom-connect/integration',
    title: 'Integration Setup',
    method: '@phantom/react-sdk',
    description: 'Install SDK, configure provider, enable wallet connections',
  },
  {
    href: '/phantom-connect/connection-types',
    title: 'Connection Types',
    method: 'useModal().open()',
    description: 'Connect via Phantom, social login, or other wallets',
  },
  {
    href: '/phantom-connect/wallet-interactions',
    title: 'Wallet Interactions',
    method: 'signTransaction()',
    description: 'Sign transactions, stake SOL, interact with programs',
  },
];

export const GET_ASSETS_BY_OWNER_NAV_ITEMS: SubNavItem[] = [
  {
    href: '/list-wallet-assets/all-nfts',
    title: 'All NFTs',
    method: 'getAssetsByOwner',
    description: 'View all NFTs including standard and pNFTs',
  },
  {
    href: '/list-wallet-assets/fungible-tokens',
    title: 'Fungible Tokens',
    method: 'getAssetsByOwner',
    description: 'View all SPL tokens with balances and prices',
  },
  {
    href: '/list-wallet-assets/compressed-nfts',
    title: 'Compressed NFTs',
    method: 'getAssetsByOwner',
    description: 'View all cNFTs owned by a wallet',
  },
];

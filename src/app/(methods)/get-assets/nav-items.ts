export const GET_ASSET_NAV_ITEMS: SubNavItem[] = [
  {
    href: '/get-assets/nft-metadata',
    title: 'NFT Metadata',
    method: 'getAsset',
    description: 'Get NFT image, attributes, and collection info',
  },
  {
    href: '/get-assets/fungible-token',
    title: 'Fungible Token',
    method: 'getAsset',
    description: 'Get token supply, decimals, and price data',
  },
  {
    href: '/get-assets/compressed-nft',
    title: 'Compressed NFT',
    method: 'getAsset',
    description: 'Get cNFT metadata with Merkle tree details',
  },
];

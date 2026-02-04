// Interface type constants for filtering assets

export const NFT_INTERFACES: AssetsByOwnerInterface[] = [
  'V1_NFT',
  'V1_PRINT',
  'V2_NFT',
  'ProgrammableNFT',
  'LEGACY_NFT',
];

export const FUNGIBLE_INTERFACES: AssetsByOwnerInterface[] = ['FungibleToken', 'FungibleAsset'];

/**
 * Check if an asset is an NFT based on its interface
 */
export function isNFTInterface(interfaceType: AssetsByOwnerInterface): boolean {
  return NFT_INTERFACES.includes(interfaceType);
}

/**
 * Check if an asset is fungible based on its interface
 */
export function isFungibleInterface(interfaceType: AssetsByOwnerInterface): boolean {
  return FUNGIBLE_INTERFACES.includes(interfaceType);
}

/**
 * Check if an asset is compressed
 */
export function isCompressed(asset: RawHeliusAsset): boolean {
  return asset.compression?.compressed === true;
}

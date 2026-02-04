// Barrel export for get-assets-by-owner feature
// All public APIs should be exported here

// Components
export { AssetsDemo } from './components/assets-demo';
export { AssetGrid } from './components/asset-grid';
export { AssetCard } from './components/asset-card';
export { AssetThumbnail } from './components/asset-thumbnail';
export { AssetSkeletonGrid } from './components/asset-skeleton-grid';
export { EmptyState } from './components/empty-state';

// Hooks
export {
  useAssetsByOwner,
  useNFTs,
  useFungibleTokens,
  useCompressedNFTs,
} from './hooks/use-assets-by-owner';

// Client fetch functions (for direct use or custom hooks)
export { fetchNFTs } from './lib/fetch-nfts';
export { fetchFungibleTokens } from './lib/fetch-fungible-tokens';
export { fetchCompressedNFTs } from './lib/fetch-compressed-nfts';

// Server fetch functions (for server components - do not import in client components)
export { serverFetchNFTs } from './lib/server-fetch-nfts';
export { serverFetchFungibleTokens } from './lib/server-fetch-fungible-tokens';
export { serverFetchCompressedNFTs } from './lib/server-fetch-compressed-nfts';

// Utilities
export {
  NFT_INTERFACES,
  FUNGIBLE_INTERFACES,
  isNFTInterface,
  isFungibleInterface,
  isCompressed,
} from './lib/filter-by-interface';

// Code examples
export { CODE_EXAMPLES } from './lib/code-examples';

// Barrel export for get-asset feature
// All public APIs should be exported here

// Components
export { AssetDemo } from './components/asset-demo';
export { NftMetadataDisplay } from './components/nft-metadata-display';
export { FungibleTokenDisplay } from './components/fungible-token-display';
export { CompressedNftDisplay } from './components/compressed-nft-display';
export { JsonHighlight } from './components/json-highlight';

// Hooks
export { useAsset } from './hooks/use-asset';

// Client fetch functions
export { fetchAsset, getAssetDisplayType } from './lib/fetch-asset';

// Server fetch functions (for server components - do not import in client components)
export { serverFetchAsset, getServerAssetDisplayType } from './lib/server-fetch-asset';

// Code examples
export { CODE_EXAMPLES } from './lib/code-examples';

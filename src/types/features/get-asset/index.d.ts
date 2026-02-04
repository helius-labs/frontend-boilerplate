// Type definitions for get-asset feature
// Based on Helius DAS API getAsset response

type AssetInterface =
  | 'V1_NFT'
  | 'V1_PRINT'
  | 'LEGACY_NFT'
  | 'V2_NFT'
  | 'FungibleAsset'
  | 'FungibleToken'
  | 'Custom'
  | 'Identity'
  | 'Executable'
  | 'ProgrammableNFT';

interface HeliusAssetResponse {
  interface: AssetInterface;
  id: string;
  content?: AssetContent;
  authorities?: AssetAuthority[];
  compression?: AssetCompression;
  grouping?: AssetGrouping[];
  royalty?: AssetRoyalty;
  creators?: AssetCreator[];
  ownership?: AssetOwnership;
  supply?: AssetSupply;
  token_info?: AssetTokenInfo;
  mutable?: boolean;
  burnt?: boolean;
}

interface AssetContent {
  $schema?: string;
  json_uri?: string;
  files?: AssetFile[];
  metadata?: AssetMetadata;
  links?: AssetLinks;
}

interface AssetMetadata {
  name?: string;
  symbol?: string;
  description?: string;
  attributes?: AssetAttribute[];
  token_standard?: string;
}

interface AssetAttribute {
  trait_type: string;
  value: string | number;
}

interface AssetFile {
  uri: string;
  mime?: string;
  cdn_uri?: string;
}

interface AssetLinks {
  image?: string;
  external_url?: string;
  animation_url?: string;
}

interface AssetCompression {
  eligible: boolean;
  compressed: boolean;
  data_hash?: string;
  creator_hash?: string;
  asset_hash?: string;
  tree?: string;
  seq?: number;
  leaf_id?: number;
}

interface AssetOwnership {
  owner: string;
  frozen: boolean;
  delegated: boolean;
  delegate?: string;
  ownership_model: 'single' | 'token';
}

interface AssetRoyalty {
  royalty_model: string;
  target?: string;
  percent: number;
  basis_points: number;
  primary_sale_happened: boolean;
  locked: boolean;
}

interface AssetCreator {
  address: string;
  share: number;
  verified: boolean;
}

interface AssetGrouping {
  group_key: string;
  group_value: string;
  verified?: boolean;
  collection_metadata?: CollectionMetadata;
}

interface CollectionMetadata {
  name?: string;
  symbol?: string;
  image?: string;
  description?: string;
  external_url?: string;
}

interface AssetAuthority {
  address: string;
  scopes: string[];
}

interface AssetSupply {
  print_max_supply?: number;
  print_current_supply?: number;
  edition_nonce?: number;
}

interface AssetTokenInfo {
  supply?: number;
  decimals?: number;
  token_program?: string;
  mint_authority?: string;
  freeze_authority?: string;
  price_info?: TokenPriceInfo;
}

interface TokenPriceInfo {
  price_per_token: number;
  total_price: number;
  currency: string;
}

interface AssetDisplayOptions {
  showUnverifiedCollections?: boolean;
  showCollectionMetadata?: boolean;
  showFungible?: boolean;
  showInscription?: boolean;
}

interface AssetError {
  code: 'INVALID_ADDRESS' | 'NOT_FOUND' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

type AssetUseCase = 'nft-metadata' | 'fungible-token' | 'compressed-nft';

// Component Props

interface AssetDemoProps {
  defaultAssetId?: string;
}

interface CompressedNftDisplayProps {
  asset: HeliusAssetResponse;
  className?: string;
}

interface FungibleTokenDisplayProps {
  asset: HeliusAssetResponse;
  className?: string;
}

interface JsonHighlightProps {
  data: unknown;
  className?: string;
}

interface NftMetadataDisplayProps {
  asset: HeliusAssetResponse;
  className?: string;
}

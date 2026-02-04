// Type definitions for get-assets-by-owner feature
// Based on Helius DAS API getAssetsByOwner response

type AssetsByOwnerInterface =
  | 'V1_NFT'
  | 'V1_PRINT'
  | 'V2_NFT'
  | 'ProgrammableNFT'
  | 'FungibleToken'
  | 'FungibleAsset'
  | 'Custom'
  | 'Identity'
  | 'Executable'
  | 'LEGACY_NFT';

interface BaseAsset {
  id: string;
  interface: AssetsByOwnerInterface;
  name: string;
  image: string;
  cdnImage: string;
}

interface NFTAsset extends BaseAsset {
  collection?: {
    name: string;
    verified: boolean;
  };
  compressed: boolean;
}

interface FungibleAsset extends BaseAsset {
  symbol: string;
  balance: number;
  decimals: number;
  uiAmount: string;
  priceInfo?: {
    pricePerToken: number;
    totalPrice: number;
    currency: string;
  };
}

interface GetAssetsByOwnerParams {
  ownerAddress: string;
  page?: number;
  limit?: number;
  displayOptions?: {
    showFungible?: boolean;
    showNativeBalance?: boolean;
    showUnverifiedCollections?: boolean;
    showCollectionMetadata?: boolean;
    showZeroBalance?: boolean;
  };
}

interface RawHeliusAsset {
  interface: AssetsByOwnerInterface;
  id: string;
  content?: {
    metadata?: {
      name?: string;
      symbol?: string;
      description?: string;
    };
    files?: Array<{
      uri: string;
      cdn_uri?: string;
      mime?: string;
    }>;
    json_uri?: string;
  };
  grouping?: Array<{
    group_key: string;
    group_value: string;
    verified?: boolean;
    collection_metadata?: {
      name?: string;
    };
  }>;
  compression?: {
    compressed: boolean;
    tree?: string;
    leaf_id?: number;
  };
  token_info?: {
    balance: number;
    decimals: number;
    price_info?: {
      price_per_token: number;
      total_price: number;
      currency: string;
    };
  };
}

interface HeliusAssetsByOwnerResult {
  items: RawHeliusAsset[];
  total?: number;
  limit?: number;
  page?: number;
}

interface AssetsByOwnerError {
  code: 'INVALID_ADDRESS' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

type AssetsByOwnerUseCase = 'nfts' | 'tokens' | 'compressed';

// Component Props

interface AssetCardProps {
  name: string;
  image: string;
  cdnImage?: string;
  collection?: string;
  compressed?: boolean;
  symbol?: string;
  balance?: string;
  priceUsd?: number;
}

interface AssetGridProps {
  children: React.ReactNode;
  className?: string;
}

interface AssetThumbnailProps {
  src: string;
  cdnSrc?: string;
  alt: string;
  className?: string;
}

interface AssetSkeletonGridProps {
  count?: number;
}

interface AssetsDemoProps {
  connectedWallet?: string;
}

interface EmptyStateProps {
  type: AssetsByOwnerUseCase;
}

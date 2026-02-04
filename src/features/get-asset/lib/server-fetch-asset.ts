// Server-side asset fetch
// Uses Helius SDK directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';

interface ServerAssetOptions {
  showUnverifiedCollections?: boolean;
  showCollectionMetadata?: boolean;
  showFungible?: boolean;
}

/**
 * Fetch asset metadata by ID.
 * Server-side only - do not import in client components.
 */
export async function serverFetchAsset(
  assetId: string,
  options: ServerAssetOptions = {}
): Promise<HeliusAssetResponse> {
  const helius = getHeliusClient();

  // Use type assertion for SDK compatibility
  const params = {
    id: assetId,
    displayOptions: {
      showUnverifiedCollections: options.showUnverifiedCollections ?? false,
      showCollectionMetadata: options.showCollectionMetadata ?? true,
      showFungible: options.showFungible ?? true,
    },
  } as Parameters<typeof helius.getAsset>[0];

  const result = await helius.getAsset(params);

  return result as HeliusAssetResponse;
}

/**
 * Determine which display type to use based on asset interface.
 * Server-compatible version.
 */
export function getServerAssetDisplayType(
  asset: HeliusAssetResponse
): 'nft' | 'fungible' | 'compressed' {
  // Check for compressed NFT first
  if (asset.compression?.compressed) {
    return 'compressed';
  }

  // Check for fungible tokens
  if (asset.interface === 'FungibleToken' || asset.interface === 'FungibleAsset') {
    return 'fungible';
  }

  // Default to NFT display
  return 'nft';
}

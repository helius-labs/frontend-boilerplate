// Single fetch function for all asset types
// Uses Helius DAS API getAsset method
// Source: https://helius.mintlify.app/api-reference/das/getasset

export async function fetchAsset(
  assetId: string,
  options: AssetDisplayOptions = {}
): Promise<HeliusAssetResponse> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getAsset',
      params: [
        {
          id: assetId,
          displayOptions: {
            showUnverifiedCollections: options.showUnverifiedCollections ?? false,
            showCollectionMetadata: options.showCollectionMetadata ?? true,
            showFungible: options.showFungible ?? true,
          },
        },
      ],
    }),
  });

  const data: RpcProxyResponse<HeliusAssetResponse> = await response.json();

  if (data.error) {
    // Parse specific error messages for better UX
    if (data.error.includes('RecordNotFound') || data.error.includes('Asset Not Found')) {
      throw new Error('Asset not found. Verify the asset ID is correct.');
    }
    throw new Error(data.error);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return data.result!;
}

/**
 * Determine which display type to use based on asset interface.
 * Used by components to render appropriate view.
 */
export function getAssetDisplayType(asset: HeliusAssetResponse): 'nft' | 'fungible' | 'compressed' {
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

// Use Case 1: All NFTs Only
// Uses DAS API getAssetsByOwner with NFT interface filtering
import { isCompressed, isNFTInterface } from './filter-by-interface';

// Reduced limit to avoid "Response is too big" errors from Helius API
const PAGE_LIMIT = 10;
const MAX_PAGES = 10;

/**
 * Parse raw Helius asset to NFTAsset
 */
function parseNFTAsset(asset: RawHeliusAsset): NFTAsset {
  const collection = asset.grouping?.find((g) => g.group_key === 'collection');

  return {
    id: asset.id,
    interface: asset.interface,
    name: asset.content?.metadata?.name || 'Unnamed NFT',
    image: asset.content?.files?.[0]?.uri || asset.content?.json_uri || '',
    cdnImage: asset.content?.files?.[0]?.cdn_uri || '',
    collection: collection
      ? {
          name: collection.collection_metadata?.name || 'Unknown Collection',
          verified: collection.verified || false,
        }
      : undefined,
    compressed: isCompressed(asset),
  };
}

async function fetchAssetsPage(
  address: string,
  page: number
): Promise<RpcProxyResponse<HeliusAssetsByOwnerResult>> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getAssetsByOwner',
      params: [
        {
          ownerAddress: address,
          page,
          limit: PAGE_LIMIT,
          displayOptions: {
            showFungible: false,
            showNativeBalance: false,
            showCollectionMetadata: true,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all NFTs for a wallet address.
 * Filters for NFT interfaces: V1_NFT, V1_PRINT, V2_NFT, ProgrammableNFT, LEGACY_NFT
 */
export async function fetchNFTs(address: string): Promise<NFTAsset[]> {
  const firstPageData = await fetchAssetsPage(address, 1);

  if (firstPageData.error) {
    throw new Error(firstPageData.error);
  }

  const firstResult = firstPageData.result;
  if (!firstResult?.items) {
    return [];
  }

  const allItems: RawHeliusAsset[] = [...firstResult.items];

  // Fetch additional pages if there are more items
  const totalItems = firstResult.total ?? 0;
  const totalPages = Math.min(Math.ceil(totalItems / PAGE_LIMIT), MAX_PAGES);

  if (totalPages > 1) {
    const pagePromises: Promise<RpcProxyResponse<HeliusAssetsByOwnerResult>>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(fetchAssetsPage(address, page));
    }

    const pageResults = await Promise.all(pagePromises);
    for (const pageData of pageResults) {
      if (pageData.result?.items) {
        allItems.push(...pageData.result.items);
      }
    }
  }

  // Filter to only NFT interfaces and parse
  return allItems.filter((asset) => isNFTInterface(asset.interface)).map(parseNFTAsset);
}

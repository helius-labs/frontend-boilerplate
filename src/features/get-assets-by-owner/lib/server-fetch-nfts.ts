// Server-side NFTs fetch
// Uses Helius SDK directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';
import { isCompressed, isNFTInterface } from './filter-by-interface';

// Reduced limit to avoid "Response is too big" errors from Helius API
const PAGE_LIMIT = 10;
const MAX_PAGES = 10;

interface ServerRawAsset {
  interface: AssetsByOwnerInterface;
  id: string;
  content?: {
    metadata?: {
      name?: string;
      symbol?: string;
    };
    files?: Array<{
      uri: string;
      cdn_uri?: string;
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
}

function parseNFTAsset(asset: ServerRawAsset): NFTAsset {
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
    compressed: isCompressed(asset as RawHeliusAsset),
  };
}

/**
 * Fetch all NFTs for a wallet address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchNFTs(address: string): Promise<NFTAsset[]> {
  const helius = getHeliusClient();

  // Fetch first page
  const firstResult = await helius.getAssetsByOwner({
    ownerAddress: address,
    page: 1,
    limit: PAGE_LIMIT,
    displayOptions: {
      showFungible: false,
      showNativeBalance: false,
      showCollectionMetadata: true,
    },
  });

  if (!firstResult?.items) {
    return [];
  }

  const allItems: ServerRawAsset[] = [...(firstResult.items as ServerRawAsset[])];

  // Fetch additional pages if there are more items
  const totalItems = firstResult.total;
  const totalPages = Math.min(Math.ceil(totalItems / PAGE_LIMIT), MAX_PAGES);

  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        helius.getAssetsByOwner({
          ownerAddress: address,
          page,
          limit: PAGE_LIMIT,
          displayOptions: {
            showFungible: false,
            showNativeBalance: false,
            showCollectionMetadata: true,
          },
        })
      );
    }

    const pageResults = await Promise.all(pagePromises);
    for (const pageResult of pageResults) {
      if (pageResult.items) {
        allItems.push(...(pageResult.items as ServerRawAsset[]));
      }
    }
  }

  return allItems.filter((asset) => isNFTInterface(asset.interface)).map(parseNFTAsset);
}

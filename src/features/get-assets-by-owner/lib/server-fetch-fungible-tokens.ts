// Server-side fungible tokens fetch
// Uses Helius SDK directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';
import { isFungibleInterface } from './filter-by-interface';

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

function parseFungibleAsset(asset: ServerRawAsset): FungibleAsset {
  const balance = asset.token_info?.balance ?? 0;
  const decimals = asset.token_info?.decimals ?? 0;
  const uiAmount =
    decimals > 0
      ? (balance / Math.pow(10, decimals)).toFixed(Math.min(decimals, 6))
      : balance.toString();

  return {
    id: asset.id,
    interface: asset.interface,
    name: asset.content?.metadata?.name || 'Unknown Token',
    symbol: asset.content?.metadata?.symbol || '???',
    image: asset.content?.files?.[0]?.uri || '',
    cdnImage: asset.content?.files?.[0]?.cdn_uri || '',
    balance,
    decimals,
    uiAmount,
    priceInfo: asset.token_info?.price_info
      ? {
          pricePerToken: asset.token_info.price_info.price_per_token,
          totalPrice: asset.token_info.price_info.total_price,
          currency: asset.token_info.price_info.currency,
        }
      : undefined,
  };
}

/**
 * Fetch all fungible tokens for a wallet address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchFungibleTokens(address: string): Promise<FungibleAsset[]> {
  const helius = getHeliusClient();

  // Fetch first page
  const firstResult = await helius.getAssetsByOwner({
    ownerAddress: address,
    page: 1,
    limit: PAGE_LIMIT,
    displayOptions: {
      showFungible: true,
      showNativeBalance: false,
      showZeroBalance: false,
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
            showFungible: true,
            showNativeBalance: false,
            showZeroBalance: false,
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

  return allItems.filter((asset) => isFungibleInterface(asset.interface)).map(parseFungibleAsset);
}

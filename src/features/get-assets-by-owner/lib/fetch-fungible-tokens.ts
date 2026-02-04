// Use Case 2: Fungible Tokens Only
// Uses DAS API getAssetsByOwner with showFungible option
import { isFungibleInterface } from './filter-by-interface';

// Reduced limit to avoid "Response is too big" errors from Helius API
const PAGE_LIMIT = 10;
const MAX_PAGES = 10;

/**
 * Parse raw Helius asset to FungibleAsset
 */
function parseFungibleAsset(asset: RawHeliusAsset): FungibleAsset {
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
            showFungible: true,
            showNativeBalance: false,
            showZeroBalance: false,
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
 * Fetch all fungible tokens for a wallet address.
 * Filters for fungible interfaces: FungibleToken, FungibleAsset
 */
export async function fetchFungibleTokens(address: string): Promise<FungibleAsset[]> {
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

  // Filter to only fungible interfaces and parse
  return allItems.filter((asset) => isFungibleInterface(asset.interface)).map(parseFungibleAsset);
}

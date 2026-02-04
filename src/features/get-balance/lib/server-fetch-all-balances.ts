// Server-side all balances fetch (SOL + tokens)
// Uses Helius SDK directly - ONLY import in server components
import { getHeliusClient } from '@/shared/lib/helius-client';

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);
// Reduced limit to avoid "Response is too big" errors from Helius API
const PAGE_LIMIT = 10;
const MAX_PAGES = 10; // Safety limit to prevent infinite loops

interface HeliusAssetItem {
  interface: string;
  id: string;
  content?: {
    metadata?: {
      name?: string;
      symbol?: string;
    };
    links?: {
      image?: string;
    };
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

/**
 * Fetch all balances (SOL + tokens) for an address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchAllBalances(address: string): Promise<AllBalancesResult> {
  const helius = getHeliusClient();

  // Fetch first page to get native balance and initial items
  const firstResult = await helius.getAssetsByOwner({
    ownerAddress: address,
    page: 1,
    limit: PAGE_LIMIT,
    displayOptions: {
      showFungible: true,
      showNativeBalance: true,
    },
  });

  const allItems: HeliusAssetItem[] = [...(firstResult.items as HeliusAssetItem[])];

  // Fetch additional pages if there are more items
  const totalItems = firstResult.total;
  const totalPages = Math.min(Math.ceil(totalItems / PAGE_LIMIT), MAX_PAGES);

  if (totalPages > 1) {
    // Fetch remaining pages in parallel
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        helius.getAssetsByOwner({
          ownerAddress: address,
          page,
          limit: PAGE_LIMIT,
          displayOptions: {
            showFungible: true,
            showNativeBalance: true,
          },
        })
      );
    }

    const pageResults = await Promise.all(pagePromises);
    for (const pageResult of pageResults) {
      if (pageResult.items) {
        allItems.push(...(pageResult.items as HeliusAssetItem[]));
      }
    }
  }

  const result = firstResult;

  // Parse native SOL balance
  const nativeLamports = BigInt(result.nativeBalance?.lamports ?? 0);
  const nativeBalance: SolBalanceResult = {
    lamports: nativeLamports,
    sol: Number(nativeLamports) / Number(LAMPORTS_PER_SOL),
  };

  // Parse token balances (filter for fungible tokens only)
  const tokens: TokenBalance[] = allItems
    .filter((item) => item.interface === 'FungibleToken' || item.interface === 'FungibleAsset')
    .map((item) => {
      const balance = item.token_info?.balance ?? 0;
      const decimals = item.token_info?.decimals ?? 0;
      const uiAmount = (balance / Math.pow(10, decimals)).toFixed(decimals);

      return {
        mint: item.id,
        name: item.content?.metadata?.name ?? 'Unknown Token',
        symbol: item.content?.metadata?.symbol ?? '???',
        amount: balance.toString(),
        decimals,
        uiAmount,
        logoUri: item.content?.links?.image,
        priceInfo: item.token_info?.price_info
          ? {
              pricePerToken: item.token_info.price_info.price_per_token,
              totalPrice: item.token_info.price_info.total_price,
              currency: item.token_info.price_info.currency,
            }
          : undefined,
      };
    });

  // Calculate total USD value if price data available
  let totalValueUsd: number | undefined;
  const solPrice = result.nativeBalance?.price_per_sol;
  if (solPrice) {
    const solValue = nativeBalance.sol * solPrice;
    const tokenValue = tokens.reduce((sum, t) => sum + (t.priceInfo?.totalPrice ?? 0), 0);
    totalValueUsd = solValue + tokenValue;
  }

  return {
    nativeBalance,
    tokens,
    totalValueUsd,
  };
}

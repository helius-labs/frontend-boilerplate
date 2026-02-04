// Use Case 2: All Balances (SOL + Tokens)
// Uses DAS API getAssetsByOwner with displayOptions

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);
// Reduced limit to avoid "Response is too big" errors from Helius API
const PAGE_LIMIT = 10;
const MAX_PAGES = 10; // Safety limit to prevent infinite loops

interface HeliusAssetsByOwnerResponse {
  total: number;
  limit: number;
  page: number;
  nativeBalance?: {
    lamports: number;
    price_per_sol?: number;
    total_price?: number;
  };
  items: HeliusAssetItem[];
}

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

async function fetchAssetsPage(
  address: string,
  page: number
): Promise<RpcProxyResponse<HeliusAssetsByOwnerResponse>> {
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
            showNativeBalance: true,
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

export async function fetchAllBalances(address: string): Promise<AllBalancesResult> {
  // Fetch first page to get native balance and initial items
  const firstPageData = await fetchAssetsPage(address, 1);

  if (firstPageData.error) {
    throw new Error(firstPageData.error);
  }

  const firstResult = firstPageData.result!;
  const allItems: HeliusAssetItem[] = [...firstResult.items];

  // Fetch additional pages if there are more items
  const totalItems = firstResult.total;
  const totalPages = Math.min(Math.ceil(totalItems / PAGE_LIMIT), MAX_PAGES);

  if (totalPages > 1) {
    // Fetch remaining pages in parallel
    const pagePromises: Promise<RpcProxyResponse<HeliusAssetsByOwnerResponse>>[] = [];
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

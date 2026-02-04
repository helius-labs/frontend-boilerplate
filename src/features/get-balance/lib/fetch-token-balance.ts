// Use Case 3: Specific Token Balance
// Uses DAS API getTokenAccounts with mint filter

interface HeliusTokenAccountsResponse {
  total: number;
  limit: number;
  token_accounts: HeliusTokenAccount[];
}

interface HeliusTokenAccount {
  address: string;
  mint: string;
  owner: string;
  amount: number;
  delegated_amount: number;
  frozen: boolean;
}

// Common token decimals cache (extend as needed)
const TOKEN_DECIMALS: Record<string, number> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 6, // USDC
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: 6, // USDT
  So11111111111111111111111111111111111111112: 9, // Wrapped SOL
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: 5, // BONK
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: 6, // JUP
};

export async function fetchTokenBalance(
  ownerAddress: string,
  mintAddress: string
): Promise<SpecificTokenResult> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getTokenAccounts',
      params: [
        {
          owner: ownerAddress,
          mint: mintAddress,
          limit: 1,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: RpcProxyResponse<HeliusTokenAccountsResponse> = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const result = data.result!;

  if (!result.token_accounts?.length) {
    return { found: false, mint: mintAddress };
  }

  const account = result.token_accounts[0];

  // Get decimals from cache or default to 9
  const decimals = TOKEN_DECIMALS[mintAddress] ?? 9;
  const uiAmount = (account.amount / Math.pow(10, decimals)).toFixed(decimals);

  return {
    found: true,
    mint: mintAddress,
    balance: {
      amount: account.amount.toString(),
      decimals,
      uiAmount,
    },
  };
}

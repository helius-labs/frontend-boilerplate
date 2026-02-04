// Type definitions for get-balance feature

interface SolBalanceResult {
  lamports: bigint;
  sol: number;
}

interface TokenBalance {
  mint: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
  uiAmount: string;
  logoUri?: string;
  priceInfo?: {
    pricePerToken: number;
    totalPrice: number;
    currency: string;
  };
}

interface AllBalancesResult {
  nativeBalance: SolBalanceResult;
  tokens: TokenBalance[];
  totalValueUsd?: number;
}

interface SpecificTokenResult {
  found: boolean;
  mint: string;
  balance?: {
    amount: string;
    decimals: number;
    uiAmount: string;
  };
}

interface BalanceError {
  code: 'INVALID_ADDRESS' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

type BalanceUseCase = 'sol-only' | 'all-tokens' | 'specific-token';

// Component Props

interface BalanceDemoProps {
  connectedWallet?: string;
}

interface SolBalanceDisplayProps {
  balance: SolBalanceResult | undefined;
  isLoading: boolean;
  error: BalanceError | null;
}

interface SpecificTokenDisplayProps {
  result: SpecificTokenResult | undefined;
  isLoading: boolean;
  error: BalanceError | null;
}

interface TokenBalanceListProps {
  balances: AllBalancesResult | undefined;
  isLoading: boolean;
  error: BalanceError | null;
}

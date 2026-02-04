'use client';

// SWR hook for balance queries with debouncing and error handling
// Source: https://swr.vercel.app/docs/getting-started
import { isAddress } from '@solana/kit';
import useSWR, { SWRConfiguration } from 'swr';
import { fetchAllBalances } from '../lib/fetch-all-balances';
import { fetchSolBalance } from '../lib/fetch-sol-balance';
import { fetchTokenBalance } from '../lib/fetch-token-balance';

interface UseBalanceOptions {
  useCase: BalanceUseCase;
  address: string;
  mintAddress?: string; // Required for 'specific-token' use case
  enabled?: boolean; // Disable fetching if false
}

interface UseBalanceReturn<T> {
  data: T | undefined;
  error: BalanceError | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}

const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000, // 5s deduplication (prevents spam)
  errorRetryCount: 2,
  errorRetryInterval: 3000,
};

function parseError(error: unknown): BalanceError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid') && message.includes('address')) {
      return { code: 'INVALID_ADDRESS', message: 'Invalid Solana address', retryable: false };
    }
    if (message.includes('429') || message.includes('rate')) {
      return { code: 'RATE_LIMITED', message: 'Too many requests. Please wait.', retryable: true };
    }
    if (message.includes('network') || message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Check your connection.',
        retryable: true,
      };
    }

    return { code: 'SERVER_ERROR', message: error.message, retryable: true };
  }

  return { code: 'SERVER_ERROR', message: 'Something went wrong', retryable: true };
}

export function useBalance<T = SolBalanceResult | AllBalancesResult | SpecificTokenResult>(
  options: UseBalanceOptions
): UseBalanceReturn<T> {
  const { useCase, address, mintAddress, enabled = true } = options;

  // Validate address before fetching
  const isValidAddress = address && isAddress(address);
  const shouldFetch = enabled && isValidAddress;

  // Build cache key based on use case
  const cacheKey = shouldFetch
    ? useCase === 'specific-token'
      ? `balance:${useCase}:${address}:${mintAddress}`
      : `balance:${useCase}:${address}`
    : null;

  // Select fetcher based on use case
  const fetcher = async (): Promise<T> => {
    switch (useCase) {
      case 'sol-only':
        return fetchSolBalance(address) as Promise<T>;
      case 'all-tokens':
        return fetchAllBalances(address) as Promise<T>;
      case 'specific-token':
        if (!mintAddress) {
          throw new Error('Mint address required for specific-token use case');
        }
        return fetchTokenBalance(address, mintAddress) as Promise<T>;
      default:
        throw new Error(`Unknown use case: ${useCase}`);
    }
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(cacheKey, fetcher, SWR_CONFIG);

  return {
    data,
    error: error ? parseError(error) : null,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  };
}

// Convenience hooks for specific use cases
export function useSolBalance(address: string, enabled = true) {
  return useBalance<SolBalanceResult>({
    useCase: 'sol-only',
    address,
    enabled,
  });
}

export function useAllBalances(address: string, enabled = true) {
  return useBalance<AllBalancesResult>({
    useCase: 'all-tokens',
    address,
    enabled,
  });
}

export function useTokenBalance(address: string, mintAddress: string, enabled = true) {
  return useBalance<SpecificTokenResult>({
    useCase: 'specific-token',
    address,
    mintAddress,
    enabled,
  });
}

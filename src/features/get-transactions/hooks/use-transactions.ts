'use client';

// SWR hooks for transaction queries with address validation and error handling
import { useCallback, useState } from 'react';
import { isAddress } from '@solana/kit';
import useSWR, { type SWRConfiguration } from 'swr';
import { fetchFilteredTransactions } from '../lib/fetch-filtered-transactions';
import { fetchPaginatedTransactions } from '../lib/fetch-paginated-transactions';
import { fetchRecentTransactions } from '../lib/fetch-recent-transactions';

// SWR configuration with 5s deduplication for rate limit protection
const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000, // 5s deduplication (project standard)
  errorRetryCount: 2,
  errorRetryInterval: 3000,
};

/**
 * Parse error into user-friendly TransactionError format.
 */
function parseError(error: unknown): TransactionError {
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

// Return types for hooks
interface UseTransactionsReturn<T> {
  data: T | undefined;
  error: TransactionError | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}

/**
 * Use Case 1: Fetch recent transactions with Enhanced API.
 * Returns human-readable transaction data with type, description and transfers.
 */
export function useRecentTransactions(
  address: string,
  limit: number = 20,
  enabled: boolean = true
): UseTransactionsReturn<EnhancedTransaction[]> {
  // Validate address before fetching
  const isValidAddress = address && isAddress(address);
  const shouldFetch = enabled && isValidAddress;

  const cacheKey = shouldFetch ? `transactions:recent:${address}:${limit}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<EnhancedTransaction[]>(
    cacheKey,
    () => fetchRecentTransactions(address, limit),
    SWR_CONFIG
  );

  return {
    data,
    error: error ? parseError(error) : null,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  };
}

/**
 * Use Case 2: Fetch transactions filtered by type with Enhanced API.
 * Filters by transaction type (e.g., TRANSFER, SWAP, NFT_SALE).
 */
export function useFilteredTransactions(
  address: string,
  type: FilterableTransactionType,
  limit: number = 20,
  enabled: boolean = true
): UseTransactionsReturn<EnhancedTransaction[]> {
  const isValidAddress = address && isAddress(address);
  const shouldFetch = enabled && isValidAddress;

  const cacheKey = shouldFetch ? `transactions:filtered:${address}:${type}:${limit}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<EnhancedTransaction[]>(
    cacheKey,
    () => fetchFilteredTransactions(address, type, limit),
    SWR_CONFIG
  );

  return {
    data,
    error: error ? parseError(error) : null,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  };
}

/**
 * Use Case 3: Fetch paginated transactions with RPC method.
 * Supports keyset pagination for large transaction histories.
 */
export function usePaginatedTransactions(address: string, enabled: boolean = true) {
  const [pages, setPages] = useState<SignatureResult[]>([]);
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<TransactionError | null>(null);

  const isValidAddress = address && isAddress(address);
  const shouldFetch = enabled && isValidAddress;

  // Initial fetch
  const cacheKey = shouldFetch ? `transactions:paginated:${address}` : null;

  const { data, isLoading, isValidating, mutate } = useSWR<PaginatedResult>(
    cacheKey,
    () => fetchPaginatedTransactions(address, { limit: 25 }),
    {
      ...SWR_CONFIG,
      onSuccess: (result) => {
        setPages(result.data);
        setPaginationToken(result.paginationToken);
        setHasMore(result.hasMore);
        setError(null);
      },
      onError: (err) => {
        setError(parseError(err));
      },
    }
  );

  // Load next page
  const loadMore = useCallback(async () => {
    if (!shouldFetch || !paginationToken || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const result = await fetchPaginatedTransactions(address, {
        limit: 25,
        paginationToken,
      });

      setPages((prev) => [...prev, ...result.data]);
      setPaginationToken(result.paginationToken);
      setHasMore(result.hasMore);
      setError(null);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setIsLoadingMore(false);
    }
  }, [shouldFetch, address, paginationToken, isLoadingMore]);

  // Reset pagination when address changes
  const reset = useCallback(() => {
    setPages([]);
    setPaginationToken(null);
    setHasMore(true);
    setError(null);
    mutate();
  }, [mutate]);

  return {
    data: pages.length > 0 ? pages : data?.data,
    error,
    isLoading,
    isValidating,
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
    mutate: reset,
  };
}

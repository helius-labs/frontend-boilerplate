'use client';

// SWR hook for asset queries with debouncing and error handling
import { isAddress } from '@solana/kit';
import useSWR, { SWRConfiguration } from 'swr';
import { fetchAsset } from '../lib/fetch-asset';

interface UseAssetOptions {
  assetId: string;
  displayOptions?: AssetDisplayOptions;
  enabled?: boolean;
}

interface UseAssetReturn {
  data: HeliusAssetResponse | undefined;
  error: AssetError | null;
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

function parseError(error: unknown): AssetError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid') && message.includes('address')) {
      return {
        code: 'INVALID_ADDRESS',
        message: 'Invalid Solana address format',
        retryable: false,
      };
    }
    if (message.includes('not found')) {
      return {
        code: 'NOT_FOUND',
        message: 'Asset not found. Check the mint address.',
        retryable: false,
      };
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

export function useAsset(options: UseAssetOptions): UseAssetReturn {
  const { assetId, displayOptions = {}, enabled = true } = options;

  // Validate address before fetching
  const isValidAddress = assetId && isAddress(assetId);
  const shouldFetch = enabled && isValidAddress;

  // Build cache key
  const cacheKey = shouldFetch ? `asset:${assetId}:${JSON.stringify(displayOptions)}` : null;

  // Fetcher function
  const fetcher = async (): Promise<HeliusAssetResponse> => {
    return fetchAsset(assetId, displayOptions);
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<HeliusAssetResponse>(
    cacheKey,
    fetcher,
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

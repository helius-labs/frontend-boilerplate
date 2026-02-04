'use client';

// SWR hook for asset queries with address validation and error handling
import { isAddress } from '@solana/kit';
import useSWR, { type SWRConfiguration } from 'swr';
import { fetchCompressedNFTs } from '../lib/fetch-compressed-nfts';
import { fetchFungibleTokens } from '../lib/fetch-fungible-tokens';
import { fetchNFTs } from '../lib/fetch-nfts';

interface UseAssetsByOwnerOptions {
  useCase: AssetsByOwnerUseCase;
  address: string;
  enabled?: boolean;
}

interface UseAssetsByOwnerReturn<T> {
  data: T[] | undefined;
  error: AssetsByOwnerError | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => void;
}

const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 10000, // 10s deduplication (assets change less frequently)
  errorRetryCount: 2,
  errorRetryInterval: 3000,
};

function parseError(error: unknown): AssetsByOwnerError {
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

/**
 * SWR hook for fetching assets by owner.
 * Supports three use cases: nfts, tokens, compressed.
 */
export function useAssetsByOwner<T = NFTAsset | FungibleAsset>(
  options: UseAssetsByOwnerOptions
): UseAssetsByOwnerReturn<T> {
  const { useCase, address, enabled = true } = options;

  // Validate address before fetching
  const isValidAddress = address && isAddress(address);
  const shouldFetch = enabled && isValidAddress;

  // Build cache key based on use case
  const cacheKey = shouldFetch ? `assets:${useCase}:${address}` : null;

  // Select fetcher based on use case
  const fetcher = async (): Promise<T[]> => {
    switch (useCase) {
      case 'nfts':
        return fetchNFTs(address) as Promise<T[]>;
      case 'tokens':
        return fetchFungibleTokens(address) as Promise<T[]>;
      case 'compressed':
        return fetchCompressedNFTs(address) as Promise<T[]>;
      default:
        throw new Error(`Unknown use case: ${useCase}`);
    }
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<T[]>(
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

// Convenience hooks for specific use cases
export function useNFTs(address: string, enabled = true) {
  return useAssetsByOwner<NFTAsset>({
    useCase: 'nfts',
    address,
    enabled,
  });
}

export function useFungibleTokens(address: string, enabled = true) {
  return useAssetsByOwner<FungibleAsset>({
    useCase: 'tokens',
    address,
    enabled,
  });
}

export function useCompressedNFTs(address: string, enabled = true) {
  return useAssetsByOwner<NFTAsset>({
    useCase: 'compressed',
    address,
    enabled,
  });
}

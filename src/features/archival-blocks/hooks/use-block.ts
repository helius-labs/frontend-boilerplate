'use client';

import useSWR, { SWRConfiguration } from 'swr';
import { fetchBlock } from '../lib/fetch-block';

const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 60s - blocks are immutable
  errorRetryCount: 2,
  errorRetryInterval: 3000,
};

interface UseBlockOptions {
  slot: number | null;
  enabled?: boolean;
}

export function useBlock(options: UseBlockOptions) {
  const { slot, enabled = true } = options;

  const shouldFetch = enabled && slot !== null && slot >= 0;
  const cacheKey = shouldFetch ? `block:${slot}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    cacheKey,
    () => fetchBlock(slot!),
    SWR_CONFIG
  );

  // Parse error to user-friendly format
  let parsedError: ArchivalBlockError | null = null;
  if (error) {
    if ('code' in error && 'message' in error) {
      parsedError = error as ArchivalBlockError;
    } else if (error instanceof Error) {
      // Check for archival-related messages
      const msg = error.message.toLowerCase();
      if (msg.includes('skipped') || msg.includes('not found') || msg.includes('not available')) {
        parsedError = {
          code: 'NOT_FOUND',
          message: error.message,
          suggestion: 'This slot may have been skipped. Try a nearby slot.',
        };
      } else {
        parsedError = {
          code: 'NETWORK_ERROR',
          message: error.message,
        };
      }
    } else {
      parsedError = {
        code: 'NETWORK_ERROR',
        message: 'Something went wrong',
      };
    }
  }

  return {
    data,
    error: parsedError,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  };
}

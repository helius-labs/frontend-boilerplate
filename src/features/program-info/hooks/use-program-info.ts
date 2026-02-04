'use client';

import { isAddress } from '@solana/kit';
import useSWR, { SWRConfiguration } from 'swr';
import { fetchProgramIdl, getRpcUrlForIdl } from '../lib/fetch-idl';
import { fetchProgramInfo } from '../lib/fetch-program-info';
import { fetchProgramWithAuthority } from '../lib/fetch-upgrade-authority';

interface UseProgramInfoOptions {
  programId: string;
  useCase: ProgramInfoUseCase;
  enabled?: boolean;
}

const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 10000, // 10s - program data changes rarely
  errorRetryCount: 2,
  errorRetryInterval: 3000,
};

export function useProgramInfo(options: UseProgramInfoOptions) {
  const { programId, useCase, enabled = true } = options;

  const isValidAddress = programId && isAddress(programId);
  const shouldFetch = enabled && isValidAddress;

  const cacheKey = shouldFetch ? `program:${useCase}:${programId}` : null;

  const fetcher = async () => {
    switch (useCase) {
      case 'metadata':
        return fetchProgramInfo(programId);
      case 'upgrade-authority':
        return fetchProgramWithAuthority(programId);
      case 'idl':
        return fetchProgramIdl(programId, getRpcUrlForIdl());
      default:
        throw new Error(`Unknown use case: ${useCase}`);
    }
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(cacheKey, fetcher, SWR_CONFIG);

  // Parse error to user-friendly format
  let parsedError: ProgramInfoError | null = null;
  if (error) {
    if ('code' in error && 'message' in error) {
      parsedError = error as ProgramInfoError;
    } else if (error instanceof Error) {
      parsedError = {
        code: 'NETWORK_ERROR',
        message: error.message,
      };
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

// Convenience hooks
export function useProgramMetadata(programId: string, enabled = true) {
  return useProgramInfo({ programId, useCase: 'metadata', enabled });
}

export function useProgramAuthority(programId: string, enabled = true) {
  return useProgramInfo({ programId, useCase: 'upgrade-authority', enabled });
}

export function useProgramIdl(programId: string, enabled = true) {
  return useProgramInfo({ programId, useCase: 'idl', enabled });
}

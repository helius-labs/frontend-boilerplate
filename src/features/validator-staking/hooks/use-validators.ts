'use client';

import { useMemo, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { fetchValidators } from '../lib/fetch-validators';

const SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 30000, // 30s - validator data changes slowly
  errorRetryCount: 2,
  errorRetryInterval: 5000,
};

const ITEMS_PER_PAGE = 20;

export function useValidators(enabled = true) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [showDelinquent, setShowDelinquent] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ValidatorListResult>(
    enabled ? 'validators:list' : null,
    fetchValidators,
    SWR_CONFIG
  );

  // Filter validators based on search and delinquent filter
  const filtered = useMemo(() => {
    if (!data?.validators) return [];

    let validators = data.validators;

    // Filter by status
    if (!showDelinquent) {
      validators = validators.filter((v) => v.status === 'current');
    }

    // Filter by search (name, vote pubkey, or node pubkey)
    if (search) {
      const searchLower = search.toLowerCase();
      validators = validators.filter(
        (v) =>
          v.votePubkey.toLowerCase().includes(searchLower) ||
          v.nodePubkey.toLowerCase().includes(searchLower) ||
          v.name?.toLowerCase().includes(searchLower)
      );
    }

    return validators;
  }, [data?.validators, search, showDelinquent]);

  // Paginate filtered results
  const paginated = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return {
    // Data
    validators: paginated,
    allValidators: data?.validators || [],
    totalStake: data?.totalStake || BigInt(0),
    totalCount: filtered.length,

    // Pagination
    page,
    setPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,

    // Filters
    search,
    setSearch,
    showDelinquent,
    setShowDelinquent,

    // Status
    error,
    isLoading,
    isValidating,
    mutate: () => mutate(),
  };
}

// Hook for single validator details
export function useValidatorDetails(votePubkey: string | null) {
  const { allValidators, totalStake, isLoading, error } = useValidators(!!votePubkey);

  const validator = useMemo(() => {
    if (!votePubkey || !allValidators.length) return null;
    return allValidators.find((v) => v.votePubkey === votePubkey) || null;
  }, [votePubkey, allValidators]);

  const details = useMemo((): ValidatorDetails | null => {
    if (!validator) return null;

    const stakePercentage =
      totalStake > BigInt(0)
        ? Number((validator.activatedStake * BigInt(10000)) / totalStake) / 100
        : 0;

    // Use Stakewiz APY estimate if available, otherwise calculate estimate
    const estimatedApy = validator.apyEstimate
      ? validator.apyEstimate / 100 // Stakewiz returns percentage, we use decimal
      : 0.07 * (1 - validator.commission / 100);

    return {
      ...validator,
      estimatedApy,
      stakePercentage,
      epochCredits: [],
    };
  }, [validator, totalStake]);

  return {
    validator: details,
    isLoading,
    error,
  };
}

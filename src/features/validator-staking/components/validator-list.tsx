'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { useValidators } from '../hooks/use-validators';

export function ValidatorList({ onSelectValidator, selectedVotePubkey }: ValidatorListProps) {
  const {
    validators,
    totalCount,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    showDelinquent,
    setShowDelinquent,
    isLoading,
    error,
  } = useValidators();

  if (isLoading) {
    return <ValidatorListSkeleton />;
  }

  if (error) {
    return (
      <div className={cn('p-4 rounded-lg', 'bg-destructive/10 border border-destructive')}>
        <p className="font-medium text-destructive">Failed to load validators</p>
        <p className="text-sm text-destructive/80">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by name or pubkey..."
            className={cn(
              'w-full pl-10 pr-4 py-2',
              'border rounded-lg bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showDelinquent}
            onChange={(e) => {
              setShowDelinquent(e.target.checked);
              setPage(0);
            }}
            className="rounded border-muted"
          />
          Show delinquent
        </label>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {validators.length} of {totalCount} validators
      </p>

      {/* Validator table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2 font-medium">Validator</th>
              <th className="pb-2 font-medium text-right">Stake</th>
              <th className="pb-2 font-medium text-right">APY</th>
              <th className="pb-2 font-medium text-right">Commission</th>
              <th className="pb-2 font-medium text-center">Status</th>
              <th className="pb-2 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator) => (
              <tr
                key={validator.votePubkey}
                className={cn(
                  'border-b cursor-pointer transition-colors',
                  'hover:bg-muted/50',
                  selectedVotePubkey === validator.votePubkey && 'bg-primary/10'
                )}
                onClick={() => onSelectValidator(validator)}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {validator.image ? (
                      <Image
                        src={validator.image}
                        alt={validator.name || 'Validator'}
                        width={24}
                        height={24}
                        className="size-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="size-6 rounded-full bg-muted shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {validator.name || `${validator.votePubkey.slice(0, 8)}...`}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {validator.votePubkey.slice(0, 4)}...{validator.votePubkey.slice(-4)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-right">{formatStake(validator.activatedStake)}</td>
                <td className="py-3 text-right text-green-600 dark:text-green-400">
                  {validator.apyEstimate ? `${validator.apyEstimate.toFixed(2)}%` : '-'}
                </td>
                <td className="py-3 text-right">{validator.commission}%</td>
                <td className="py-3 text-center">
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs rounded-full',
                      validator.status === 'current'
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    )}
                  >
                    {validator.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectValidator(validator);
                    }}
                    className="px-3 py-1 text-xs"
                  >
                    Stake
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="gap-1"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="gap-1"
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ValidatorListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-20 ml-auto" />
          <div className="h-4 bg-muted rounded w-12" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>
      ))}
    </div>
  );
}

function formatStake(lamports: bigint): string {
  const sol = Number(lamports) / 1_000_000_000;
  if (sol >= 1_000_000) {
    return `${(sol / 1_000_000).toFixed(2)}M SOL`;
  }
  if (sol >= 1_000) {
    return `${(sol / 1_000).toFixed(2)}K SOL`;
  }
  return `${sol.toFixed(2)} SOL`;
}

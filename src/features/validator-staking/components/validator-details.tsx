'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { useValidatorDetails } from '../hooks/use-validators';

export function ValidatorDetails({ votePubkey, onClose, onStake }: ValidatorDetailsProps) {
  const { validator, isLoading, error } = useValidatorDetails(votePubkey);

  if (isLoading) {
    return <ValidatorDetailsSkeleton onClose={onClose} />;
  }

  if (error || !validator) {
    return (
      <div className="p-4 bg-card border rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <p className="text-destructive">Failed to load validator details</p>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-card border rounded-lg space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {validator.image ? (
            <Image
              src={validator.image}
              alt={validator.name || 'Validator'}
              width={48}
              height={48}
              className="size-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-12 rounded-full bg-muted shrink-0" />
          )}
          <div>
            <h3 className="text-lg font-semibold">{validator.name || 'Unknown Validator'}</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {validator.votePubkey.slice(0, 16)}...
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Activated Stake</p>
          <p className="text-lg font-semibold">{formatLargeStake(validator.activatedStake)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Network Share</p>
          <p className="text-lg font-semibold">{validator.stakePercentage.toFixed(4)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Commission</p>
          <p className="text-lg font-semibold">{validator.commission}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Est. APY</p>
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {(validator.estimatedApy * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'px-2 py-1 text-xs rounded-full',
            validator.status === 'current'
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          )}
        >
          {validator.status === 'current' ? 'Active' : 'Delinquent'}
        </span>
        <span className="text-xs text-muted-foreground">
          Last vote: slot {validator.lastVote.toLocaleString()}
        </span>
      </div>

      {/* Addresses */}
      <div className="text-sm space-y-2">
        <div>
          <span className="text-muted-foreground">Vote Account: </span>
          <code className="text-xs bg-muted px-1 rounded break-all">{validator.votePubkey}</code>
        </div>
        <div>
          <span className="text-muted-foreground">Node: </span>
          <code className="text-xs bg-muted px-1 rounded break-all">{validator.nodePubkey}</code>
        </div>
      </div>

      {/* Warning for delinquent */}
      {validator.status === 'delinquent' && (
        <div className={cn('p-3 rounded-lg', 'bg-amber-500/10 border border-amber-500/20')}>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This validator is currently delinquent. Staking to delinquent validators may result in
            reduced rewards.
          </p>
        </div>
      )}

      {/* Stake button */}
      <Button onClick={onStake} variant="destructive" className="w-full py-3 rounded-lg">
        Stake SOL to This Validator
      </Button>
    </div>
  );
}

function ValidatorDetailsSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-4 md:p-6 bg-card border rounded-lg animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-6 bg-muted rounded w-32" />
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 bg-muted rounded w-16 mb-2" />
            <div className="h-6 bg-muted rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatLargeStake(lamports: bigint): string {
  const sol = Number(lamports) / 1_000_000_000;
  if (sol >= 1_000_000) return `${(sol / 1_000_000).toFixed(2)}M SOL`;
  if (sol >= 1_000) return `${(sol / 1_000).toFixed(2)}K SOL`;
  return `${sol.toFixed(2)} SOL`;
}

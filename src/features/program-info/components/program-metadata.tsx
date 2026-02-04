'use client';

import { cn } from '@/lib/utils';
import { findCommonProgram } from '../constants/common-programs';

export function ProgramMetadata({ data, isLoading, error }: ProgramMetadataProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 rounded-lg', 'bg-destructive/10 border border-destructive/20')}>
        <p className="font-medium text-destructive">{error.message}</p>
        {error.suggestion && <p className="text-sm text-destructive/80 mt-1">{error.suggestion}</p>}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Enter a program ID to view metadata
      </div>
    );
  }

  // Check if this is a known program
  const knownProgram = data.programDataAddress ? undefined : findCommonProgram(data.owner); // Native programs

  const formatLamports = (lamports: bigint) => {
    const sol = Number(lamports) / 1_000_000_000;
    return `${sol.toFixed(6)} SOL`;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Executable" value={data.executable ? 'Yes' : 'No'} />
        <InfoRow label="Owner" value={truncateAddress(data.owner)} copyValue={data.owner} />
        <InfoRow label="Balance" value={formatLamports(data.lamports)} />
        <InfoRow label="Data Size" value={`${data.space.toLocaleString()} bytes`} />

        {data.programDataAddress && (
          <InfoRow
            label="Program Data"
            value={truncateAddress(data.programDataAddress)}
            copyValue={data.programDataAddress}
            className="sm:col-span-2"
          />
        )}

        {data.upgradeAuthority !== undefined && (
          <InfoRow
            label="Upgrade Authority"
            value={
              data.upgradeAuthority ? truncateAddress(data.upgradeAuthority) : 'Immutable (frozen)'
            }
            copyValue={data.upgradeAuthority || undefined}
            highlight={!data.upgradeAuthority}
            className="sm:col-span-2"
          />
        )}

        {data.lastDeploySlot !== undefined && data.lastDeploySlot > 0 && (
          <InfoRow label="Last Deploy Slot" value={data.lastDeploySlot.toLocaleString()} />
        )}
      </div>

      {knownProgram && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="font-medium">{knownProgram.name}</p>
          <p className="text-sm text-muted-foreground">{knownProgram.description}</p>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  className,
}: {
  label: string;
  value: string;
  copyValue?: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('font-mono text-sm', highlight && 'text-amber-500')}>{value}</p>
    </div>
  );
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

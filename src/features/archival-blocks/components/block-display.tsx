'use client';

import { cn } from '@/lib/utils';

export function BlockDisplay({ block, slot, isLoading, error }: BlockDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="font-medium text-destructive">{error.message}</p>
        {error.suggestion && (
          <p className="text-sm text-muted-foreground mt-1">{error.suggestion}</p>
        )}
      </div>
    );
  }

  if (!block) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-muted-foreground">Enter a slot number to fetch block data</p>
      </div>
    );
  }

  const blockTime = block.blockTime ? new Date(block.blockTime * 1000).toLocaleString() : 'Unknown';

  return (
    <div className="space-y-6">
      {/* Block header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-helius-orange/20 flex items-center justify-center">
          <svg
            className="size-5 text-helius-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h3>Block at Slot {slot.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground">{blockTime}</p>
        </div>
      </div>

      {/* Block details grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Blockhash" value={block.blockhash} mono truncate />
        <InfoCard label="Previous Blockhash" value={block.previousBlockhash} mono truncate />
        <InfoCard label="Parent Slot" value={block.parentSlot.toLocaleString()} />
        <InfoCard label="Block Height" value={block.blockHeight?.toLocaleString() ?? 'N/A'} />
        <InfoCard label="Transactions" value={(block.transactions?.length ?? 0).toLocaleString()} />
        <InfoCard label="Rewards" value={(block.rewards?.length ?? 0).toLocaleString()} />
      </div>

      {/* Genesis block special highlight */}
      {slot === 0 && (
        <div className="p-4 bg-helius-orange/10 border border-helius-orange/20 rounded-lg">
          <p className="font-medium text-helius-orange">Genesis Block</p>
          <p className="text-sm text-muted-foreground mt-1">
            This is the very first block of the Solana blockchain, created at network launch. It
            contains the initial validator setup and system configuration.
          </p>
        </div>
      )}

      {/* Transaction signatures preview */}
      {block.transactions && block.transactions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">
            Transaction Signatures ({Math.min(5, block.transactions.length)} of{' '}
            {block.transactions.length})
          </h4>
          <div className="space-y-1">
            {block.transactions.slice(0, 5).map((tx, i) => (
              <div
                key={i}
                className={cn(
                  'px-3 py-2 rounded text-xs font-mono',
                  'bg-muted/50 text-muted-foreground',
                  'truncate'
                )}
              >
                {tx.signature}
              </div>
            ))}
            {block.transactions.length > 5 && (
              <p className="text-xs text-muted-foreground">
                ...and {block.transactions.length - 5} more transactions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
  truncate = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={cn('text-sm font-medium', mono && 'font-mono', truncate && 'truncate')}
        title={truncate ? value : undefined}
      >
        {value}
      </p>
    </div>
  );
}

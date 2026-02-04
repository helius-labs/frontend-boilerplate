'use client';

// SOL balance display component

export function SolBalanceDisplay({ balance, isLoading, error }: SolBalanceDisplayProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-muted rounded w-40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        <p className="font-medium">Error</p>
        <p className="text-sm text-destructive/80">{error.message}</p>
        {error.retryable && <p className="text-xs text-muted-foreground mt-1">You can try again</p>}
      </div>
    );
  }

  if (!balance) {
    return <div className="text-muted-foreground">Enter an address to view balance</div>;
  }

  const formattedSol = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  }).format(balance.sol);

  return (
    <div className="space-y-2">
      <div className="text-3xl font-bold">
        {formattedSol} <span className="text-muted-foreground text-xl">SOL</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {balance.lamports.toLocaleString()} lamports
      </div>
    </div>
  );
}

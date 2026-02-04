'use client';

// Specific token balance display component

export function SpecificTokenDisplay({ result, isLoading, error }: SpecificTokenDisplayProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 bg-muted rounded w-32" />
        <div className="h-4 bg-muted rounded w-48" />
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

  if (!result) {
    return <div className="text-muted-foreground">Enter addresses to look up token balance</div>;
  }

  if (!result.found) {
    return (
      <div className="space-y-2">
        <p className="text-muted-foreground">Token not found in wallet</p>
        <p className="text-sm text-muted-foreground">
          The wallet may have a balance of 0 for this token, or the token account doesn&apos;t
          exist.
        </p>
        <p className="text-xs font-mono text-muted-foreground">Mint: {result.mint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-3xl font-bold">{result.balance!.uiAmount}</div>
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>Raw amount: {result.balance!.amount}</p>
        <p>Decimals: {result.balance!.decimals}</p>
        <p className="font-mono break-all">Mint: {result.mint}</p>
      </div>
    </div>
  );
}

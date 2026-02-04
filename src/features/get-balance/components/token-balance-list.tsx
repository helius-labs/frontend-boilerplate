'use client';

// Token balance list component
import Image from 'next/image';

export function TokenBalanceList({ balances, isLoading, error }: TokenBalanceListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-3">
            <div className="size-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-16" />
            </div>
            <div className="h-4 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!balances) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Enter an address to view balances
      </div>
    );
  }

  const formattedSol = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  }).format(balances.nativeBalance.sol);

  return (
    <div className="space-y-4">
      {/* Native SOL balance */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <p className="font-medium">Solana</p>
            <p className="text-sm text-muted-foreground">SOL</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{formattedSol} SOL</p>
          {balances.nativeBalance.sol > 0 && balances.totalValueUsd && (
            <p className="text-sm text-muted-foreground">
              $
              {(
                balances.nativeBalance.sol *
                (balances.totalValueUsd / balances.nativeBalance.sol)
              ).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Token balances */}
      {balances.tokens.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No tokens found</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Tokens ({balances.tokens.length})
          </p>
          {balances.tokens.map((token) => (
            <div
              key={token.mint}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {token.logoUri ? (
                  <Image
                    src={token.logoUri}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{token.name}</p>
                  <p className="text-xs text-muted-foreground">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{token.uiAmount}</p>
                {token.priceInfo && (
                  <p className="text-xs text-muted-foreground">
                    ${token.priceInfo.totalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total value */}
      {balances.totalValueUsd !== undefined && (
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Value</span>
            <span className="text-xl font-bold">
              $
              {balances.totalValueUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

// Fungible token display
// Use Case 2: Fungible Token Info
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function FungibleTokenDisplay({ asset, className }: FungibleTokenDisplayProps) {
  const metadata = asset.content?.metadata;
  const tokenInfo = asset.token_info;
  const logoUrl = asset.content?.links?.image;

  // Format large numbers
  const formatSupply = (supply: number, decimals: number) => {
    const adjusted = supply / Math.pow(10, decimals);
    if (adjusted >= 1_000_000_000) {
      return `${(adjusted / 1_000_000_000).toFixed(2)}B`;
    }
    if (adjusted >= 1_000_000) {
      return `${(adjusted / 1_000_000).toFixed(2)}M`;
    }
    if (adjusted >= 1_000) {
      return `${(adjusted / 1_000).toFixed(2)}K`;
    }
    return adjusted.toLocaleString();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-start gap-4">
        {/* Logo */}
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={metadata?.symbol || 'Token'}
            width={64}
            height={64}
            className="size-16 rounded-full"
          />
        ) : (
          <div className="size-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
            {metadata?.symbol?.slice(0, 2) || '??'}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-xl font-semibold">{metadata?.name || 'Unknown Token'}</h3>
          <p className="text-muted-foreground">{metadata?.symbol || '???'}</p>
        </div>

        {/* Price */}
        {tokenInfo?.price_info && (
          <div className="text-right">
            <p className="text-2xl font-bold">
              $
              {tokenInfo.price_info.price_per_token.toFixed(
                tokenInfo.price_info.price_per_token < 0.01 ? 6 : 2
              )}
            </p>
            <p className="text-xs text-muted-foreground">Price (10-min cache)</p>
          </div>
        )}
      </div>

      {metadata?.description && (
        <p className="text-sm text-muted-foreground">{metadata.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Supply</p>
          <p className="font-semibold">
            {tokenInfo?.supply && tokenInfo?.decimals !== undefined
              ? formatSupply(tokenInfo.supply, tokenInfo.decimals)
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Decimals</p>
          <p className="font-semibold">{tokenInfo?.decimals ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Token Program</p>
          <p className="font-mono text-sm truncate">{tokenInfo?.token_program?.slice(0, 8)}...</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Mint Authority</p>
          <p className="font-mono text-sm truncate">
            {tokenInfo?.mint_authority?.slice(0, 8) || 'None'}...
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Mint Address: <span className="font-mono">{asset.id}</span>
      </div>
    </div>
  );
}

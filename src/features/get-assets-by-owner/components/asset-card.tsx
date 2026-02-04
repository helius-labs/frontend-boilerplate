'use client';

import { AssetThumbnail } from '@/features/get-assets-by-owner/components/asset-thumbnail';
import { cn } from '@/lib/utils';

/**
 * Card component for displaying NFT or token.
 * Adapts display based on provided props.
 */
export function AssetCard({
  name,
  image,
  cdnImage,
  collection,
  compressed,
  symbol,
  balance,
  priceUsd,
}: AssetCardProps) {
  const isToken = !!symbol && !!balance;

  return (
    <div
      className={cn(
        // Layout
        'group relative rounded-lg border overflow-hidden',
        // Colors
        'bg-card',
        // Interaction
        'transition-shadow hover:shadow-md'
      )}
    >
      {/* Thumbnail */}
      <AssetThumbnail src={image} cdnSrc={cdnImage} alt={name} />

      {/* Compressed badge */}
      {compressed && (
        <span
          className={cn(
            'absolute top-2 right-2',
            'px-2 py-0.5',
            'text-xs font-medium',
            'bg-primary/90 text-primary-foreground',
            'rounded'
          )}
        >
          Compressed
        </span>
      )}

      {/* Metadata */}
      <div className="p-3 space-y-1">
        <p className="truncate font-medium text-sm" title={name}>
          {name}
        </p>

        {/* NFT: Show collection */}
        {collection && !isToken && (
          <p className="truncate text-xs text-muted-foreground" title={collection}>
            {collection}
          </p>
        )}

        {/* Token: Show balance and symbol */}
        {isToken && (
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">
              {balance} {symbol}
            </p>
            {priceUsd !== undefined && (
              <p className="text-xs text-muted-foreground">${priceUsd.toFixed(2)}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

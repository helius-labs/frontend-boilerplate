import { AssetGrid } from '@/features/get-assets-by-owner/components/asset-grid';

/**
 * Loading skeleton grid matching asset card dimensions.
 * Prevents layout shift during loading.
 */
export function AssetSkeletonGrid({ count = 12 }: AssetSkeletonGridProps) {
  return (
    <AssetGrid>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          {/* Thumbnail skeleton */}
          <div className="aspect-square bg-muted animate-pulse" />
          {/* Metadata skeleton */}
          <div className="p-3 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </AssetGrid>
  );
}

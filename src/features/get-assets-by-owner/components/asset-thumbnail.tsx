'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Asset thumbnail with fallback chain.
 * Priority: CDN URI -> Raw URI -> Placeholder
 */
export function AssetThumbnail({ src, cdnSrc, alt, className }: AssetThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(cdnSrc || src);

  // Show placeholder if both CDN and raw URI failed or no source
  if (imageError || (!src && !cdnSrc)) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted aspect-square rounded-lg',
          className
        )}
      >
        <ImageIcon className="size-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn('relative aspect-square overflow-hidden rounded-lg bg-muted', className)}>
      <Image
        src={currentSrc}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
        loading="lazy"
        onError={() => {
          // If CDN failed and we have a raw URI, try it
          if (currentSrc === cdnSrc && src && src !== cdnSrc) {
            setCurrentSrc(src);
          } else {
            // Both failed, show placeholder
            setImageError(true);
          }
        }}
        unoptimized // External URLs (IPFS/CDN) bypass Next.js optimization
      />
    </div>
  );
}

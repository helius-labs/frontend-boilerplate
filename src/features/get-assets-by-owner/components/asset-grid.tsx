'use client';

import { cn } from '@/lib/utils';

/**
 * Responsive grid for asset cards.
 * Uses CSS Grid auto-fit for true responsiveness without JS.
 */
export function AssetGrid({ children, className }: AssetGridProps) {
  return (
    <div
      className={cn(
        // Base grid
        'grid gap-4',
        // Responsive: 2 cols on mobile, auto-fit on larger screens
        'grid-cols-2',
        'sm:grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))]',
        'md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]',
        'lg:grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))]',
        className
      )}
    >
      {children}
    </div>
  );
}

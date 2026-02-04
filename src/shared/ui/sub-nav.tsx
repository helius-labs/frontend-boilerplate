'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Link } from '@/shared/ui/link';

export function SubNav({ items, className }: SubNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Sub-navigation" className={cn('mb-8', className)}>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              variant="unstyled"
              className={cn(
                // Layout
                'group flex items-start justify-between gap-3 p-4 rounded-lg',
                // Base styles
                'text-left transition-colors',
                // Border
                'border',
                // Active state
                isActive
                  ? 'border-solana-purple bg-solana-purple/5'
                  : 'border-border hover:border-primary hover:bg-primary/5'
              )}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs font-mono text-muted-foreground mb-1">{item.method}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <svg
                className={cn(
                  'size-5 shrink-0 mt-0.5 transition-colors',
                  isActive
                    ? 'text-solana-purple'
                    : 'text-muted-foreground/40 group-hover:text-muted-foreground'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

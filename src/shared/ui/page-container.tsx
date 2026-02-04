import { cn } from '@/lib/utils';

/**
 * Consistent page container used on all method pages.
 * Provides max-width, padding, and centering.
 */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('container mx-auto max-w-6xl px-4 py-8', className)}>
      {children}
    </div>
  );
}

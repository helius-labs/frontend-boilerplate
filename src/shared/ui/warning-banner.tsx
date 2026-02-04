import { cn } from '@/lib/utils';

/**
 * Warning/info banner with amber styling.
 * Used for important notices, real transaction warnings, etc.
 */
export function WarningBanner({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        'bg-amber-500/10 border border-amber-500/20',
        className
      )}
    >
      <p className="font-medium text-amber-600 dark:text-amber-400">{title}</p>
      <div className="text-sm text-muted-foreground mt-1">{children}</div>
    </div>
  );
}

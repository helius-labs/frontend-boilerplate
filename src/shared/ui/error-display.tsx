import { cn } from '@/lib/utils';
import { Button } from './button';

/**
 * Error display with optional retry button.
 * Used for showing API errors and other failures.
 */
export function ErrorDisplay({
  title = 'Error',
  message,
  onRetry,
  className,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        'bg-destructive/10 border border-destructive',
        className
      )}
    >
      <p className="font-medium text-destructive">{title}</p>
      <p className="text-sm text-destructive/80">{message}</p>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="mt-2 text-primary hover:underline p-0 h-auto"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

'use client';

import { Loader2 } from 'lucide-react';
import { useDemoContext } from '@/features/demo-framework/context/demo-context';
import { cn } from '@/lib/utils';

/**
 * Response display with loading/success/error states (DEMO-03).
 * Shows distinct visual feedback for each state.
 */
export function DemoResponse({
  className,
  idleMessage = 'Enter an address and run the demo to see results',
}: DemoResponseProps) {
  const { status, response, error } = useDemoContext();

  // Loading state
  if (status === 'loading') {
    return (
      <div
        className={cn('flex items-center justify-center p-8 bg-muted rounded-lg', className)}
        role="status"
        aria-label="Loading"
      >
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Error state
  if (status === 'error' && error) {
    return (
      <div
        className={cn('p-4 bg-destructive/10 border border-destructive rounded-lg', className)}
        role="alert"
      >
        <p className="text-sm font-medium text-destructive">Error</p>
        <p className="text-sm text-destructive/80 mt-1">{error}</p>
      </div>
    );
  }

  // Success state
  if (status === 'success' && response !== null) {
    return (
      <div
        className={cn('p-4 bg-muted rounded-lg overflow-x-auto', className)}
        role="region"
        aria-label="Response data"
      >
        <pre className="text-sm">
          <code>{JSON.stringify(response, null, 2)}</code>
        </pre>
      </div>
    );
  }

  // Idle state
  return (
    <div className={cn('p-8 bg-muted/50 rounded-lg text-center', className)}>
      <p className="text-muted-foreground">{idleMessage}</p>
    </div>
  );
}

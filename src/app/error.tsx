'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Link } from '@/shared/ui/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 md:px-6">
      <div
        className={cn(
          // Layout
          'max-w-md w-full rounded-xl p-8 text-center',
          // Glass effect - light mode
          'bg-black/[0.03] border border-black/[0.08] shadow-sm',
          // Glass effect - dark mode
          'dark:bg-white/5 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
          // Backdrop
          'backdrop-blur-xl'
        )}
      >
        <h1 className="text-2xl font-bold mb-2">An error occurred</h1>
        <p className="text-muted-foreground mb-6">
          Something went wrong. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={reset} variant="solana" className="gap-2 rounded-full px-6 py-2.5">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try again
          </Button>
          <Link
            href="/"
            variant="unstyled"
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 rounded-full px-6 py-2.5')}
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

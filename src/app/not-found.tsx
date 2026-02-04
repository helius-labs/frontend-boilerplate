import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/shared/ui/button';

export default function NotFound() {
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
        <div className="text-6xl font-bold text-solana-purple mb-2">404</div>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'solana' }), 'gap-2 rounded-full px-6 py-2.5')}
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
  );
}

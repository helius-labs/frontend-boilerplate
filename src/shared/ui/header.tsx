import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/shared/ui/theme-toggle';

// Dynamic import - wallet section only renders on client
// This prevents hydration mismatch from wallet state differences
const WalletSection = dynamic(
  () => import('@/shared/ui/wallet-section').then((mod) => mod.WalletSection),
  {
    ssr: false,
    loading: () => <div className="h-10 w-32 animate-pulse bg-muted rounded-lg" />,
  }
);

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-xl',
        // Light mode: light glass effect matching cards
        'bg-black/[0.03] border-black/[0.08] text-foreground',
        // Dark mode: semi-transparent background
        'dark:bg-background/80 dark:border-border/50 dark:text-foreground',
        className
      )}
    >
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Brand logos - hidden on mobile to give room for wallet/actions */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Powered by</span>
          <Link
            href="https://helius.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            aria-label="Helius - Open in new tab"
          >
            <Image
              src="/helius-logo.svg"
              alt="Helius"
              width={90}
              height={19}
              className="h-5 w-auto"
              priority
            />
          </Link>
          <span className="text-muted-foreground">+</span>
          <Link
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            aria-label="Solana - Open in new tab"
          >
            <Image
              src="/solana-logo.svg"
              alt="Solana"
              width={100}
              height={15}
              className="h-4 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Wallet section - client-side only to prevent hydration errors */}
          <WalletSection />

          {/* GitHub link */}
          <Link
            href="https://github.com/helius-labs/frontend-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'hidden sm:inline-flex size-9 items-center justify-center rounded-md transition-colors',
              'border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06]',
              'dark:border-white/20 dark:bg-background/50 dark:hover:bg-accent'
            )}
            aria-label="GitHub repository"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

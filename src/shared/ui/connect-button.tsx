// Wallet connect button component
// Shows available wallets or install CTA
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/shared/hooks/use-wallet';
import { Button } from '@/shared/ui/button';
import { ExternalLink } from '@/shared/ui/link';

/**
 * Button to connect a Solana wallet.
 * Shows all detected wallets (Phantom, Solflare, Backpack, etc.).
 * Shows install CTA if no wallets detected.
 *
 * WALL-01: Phantom Connect SDK (via ConnectorKit)
 * WALL-02: Alternative wallets (Solflare, Backpack)
 */
export function ConnectButton({ className = '' }: { className?: string }) {
  const { connectors, connect, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount before showing content
  // This prevents flash of "Install Wallet" during wallet detection
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: single mount-time render for SSR hydration
    setMounted(true);
  }, []);

  // Show skeleton during initial mount/detection
  if (!mounted) {
    return (
      <div
        className={cn(
          'h-9 w-28 animate-pulse rounded-md',
          'bg-black/[0.03] dark:bg-muted',
          className
        )}
      />
    );
  }

  // No wallets detected - show install CTA
  if (connectors.length === 0) {
    return (
      <ExternalLink
        href="https://phantom.app/"
        variant="unstyled"
        className={cn(
          'inline-flex items-center justify-center h-9 px-3 rounded-md transition-colors text-sm font-medium',
          'border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06]',
          'dark:border-white/20 dark:bg-background/50 dark:hover:bg-accent',
          className
        )}
      >
        Install Wallet
      </ExternalLink>
    );
  }

  // Single wallet - show direct connect
  if (connectors.length === 1) {
    const wallet = connectors[0];
    return (
      <Button
        onClick={() => connect(wallet.id)}
        disabled={isConnecting || !wallet.ready}
        variant="solana"
        size="sm"
        className={className}
      >
        {isConnecting ? 'Connecting...' : `Connect ${wallet.name}`}
      </Button>
    );
  }

  // Multiple wallets - show dropdown or list
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {connectors.map((wallet) => (
        <Button
          key={wallet.id}
          onClick={() => connect(wallet.id)}
          disabled={isConnecting || !wallet.ready}
          variant="solana"
          size="sm"
        >
          {isConnecting ? '...' : wallet.name}
        </Button>
      ))}
    </div>
  );
}

// Connected wallet dropdown menu
// Shows address, balance, and disconnect option
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSolBalance } from '@/features/get-balance';
import { useWallet } from '@/shared/hooks/use-wallet';
import { AddressDisplay } from '@/shared/ui/address-display';
import { Button } from '@/shared/ui/button';
import { ExternalLink } from '@/shared/ui/link';

/**
 * Dropdown menu for connected wallet.
 * Shows truncated address, copy button, and disconnect.
 *
 * WALL-03: Disconnect available from any page (via header)
 * WALL-05: Shows connected address in header
 */
export function WalletDropdown({ className = '' }: { className?: string }) {
  const { address, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch SOL balance when dropdown is open
  const { data: balance, isLoading: balanceLoading } = useSolBalance(address ?? '', isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!address) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDisconnect = async () => {
    setIsOpen(false);
    await disconnect();
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'gap-2 px-3 py-2',
          'border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06]',
          'dark:border-white/20 dark:bg-background/50 dark:hover:bg-accent'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="size-2 rounded-full bg-green-500" aria-label="Connected" />
        <AddressDisplay address={address} />
        <svg
          className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg z-50">
          {/* Balance section */}
          <div className="p-4 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            {balanceLoading ? (
              <div className="h-7 w-24 bg-muted rounded animate-pulse" />
            ) : balance ? (
              <p className="text-xl font-semibold tabular-nums">
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }).format(balance.sol)}{' '}
                <span className="text-muted-foreground text-sm font-normal">SOL</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">--</p>
            )}
          </div>

          {/* Address section */}
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-1">Wallet address</p>
            <div className="flex items-start gap-2">
              <p className="font-mono text-xs break-all flex-1">{address}</p>
              <button
                onClick={handleCopy}
                className={cn(
                  'shrink-0 p-1 rounded transition-colors',
                  'hover:bg-muted',
                  copied ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                )}
                aria-label={copied ? 'Copied' : 'Copy address'}
              >
                {copied ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* External link */}
          <div className="p-1 border-b border-border">
            <ExternalLink
              href={`https://orbmarkets.io/address/${address}`}
              variant="muted"
              className="w-full px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
            >
              View on Orb
            </ExternalLink>
          </div>

          {/* Disconnect */}
          <div className="p-1">
            <Button
              variant="ghost"
              onClick={handleDisconnect}
              className="w-full justify-start px-3 py-2 text-sm rounded text-destructive hover:text-destructive"
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useModal } from '@phantom/react-sdk';
import { cn } from '@/lib/utils';
import { useWallet } from '@/shared/hooks/use-wallet';
import { Button } from '@/shared/ui/button';

/**
 * Interactive demo showing different connection methods.
 * Displays connection state and wallet address when connected.
 */
export function ConnectionDemo() {
  const { open, isOpened } = useModal();
  const { isConnected, isConnecting, address, disconnect } = useWallet();

  const handleConnect = () => {
    if (typeof open === 'function') {
      open();
    } else {
      console.error('Phantom modal open function not available');
    }
  };

  if (isConnected && address) {
    return (
      <div className={cn('p-6 rounded-lg border', 'bg-green-500/10 border-green-500/30')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
            <p className="font-mono text-sm">
              {address.slice(0, 8)}...{address.slice(-8)}
            </p>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={disconnect}
            className="text-destructive hover:text-destructive hover:no-underline"
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-6 rounded-lg border', 'bg-muted/50')}>
      <p className="text-muted-foreground mb-4">
        Click the button below to open the Phantom Connect modal. You can connect with:
      </p>
      <ul className="list-disc list-inside text-sm text-muted-foreground mb-6 space-y-1">
        <li>Phantom browser extension or mobile app</li>
        <li>Google account (creates embedded wallet)</li>
        <li>Apple account (creates embedded wallet)</li>
        <li>Other Solana wallets (Solflare, Backpack, Exodus, etc.)</li>
      </ul>
      <Button
        onClick={handleConnect}
        disabled={isConnecting || isOpened}
        variant="solana"
        size="lg"
        className="w-full sm:w-auto"
      >
        {isConnecting ? 'Connecting...' : 'Open Phantom Connect'}
      </Button>
    </div>
  );
}

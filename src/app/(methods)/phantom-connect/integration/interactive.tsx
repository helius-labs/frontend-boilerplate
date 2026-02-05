'use client';

import { cn } from '@/lib/utils';
import { useWallet } from '@/shared/hooks/use-wallet';

/**
 * Simple component showing the current SDK integration status.
 * Displays whether the PhantomProvider is properly configured.
 */
export function IntegrationStatus() {
  const { isConnected, address } = useWallet();

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        isConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-muted/50'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'size-3 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-muted-foreground/30'
          )}
        />
        <div>
          <p className="font-medium text-sm">{isConnected ? 'SDK Connected' : 'SDK Ready'}</p>
          <p className="text-xs text-muted-foreground">
            {isConnected
              ? `Wallet: ${address?.slice(0, 8)}...${address?.slice(-4)}`
              : 'PhantomProvider is configured correctly'}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

/**
 * Main Laserstream demo component.
 * Handles graceful degradation when API key not configured. (LSTR-02, LSTR-04)
 */
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { useLaserstream } from '../hooks/use-laserstream';
import { BlockStream } from './block-stream';
import { ConnectionStatus } from './connection-status';

export function LaserstreamDemo({ className }: LaserstreamDemoProps) {
  const { status, blocks, error, connect, disconnect, isConfigured } = useLaserstream();

  // Graceful degradation when key not configured (LSTR-02, LSTR-04)
  if (!isConfigured) {
    return (
      <div className={cn('rounded-lg border border-border p-4 md:p-6 bg-muted/50', className)}>
        <h3 className="text-lg mb-2">Laserstream Demo</h3>
        <p className="text-muted-foreground mb-4">
          Laserstream provides real-time block streaming for high-performance Solana applications
          with sub-50ms latency.
        </p>

        {/* Informational message about paid plan (LSTR-04) */}
        <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-4 mb-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Note:</strong> Laserstream requires a paid Helius Professional plan. Configure{' '}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">LASERSTREAM_API_KEY</code> in
            your environment to enable this demo.
          </p>
        </div>

        {/* Links to learn more */}
        <div className="flex flex-wrap gap-3">
          <a
            href="https://helius.dev/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View Helius Pricing
          </a>
          <span className="text-muted-foreground">|</span>
          <a
            href="https://www.helius.dev/blog/introducing-laserstream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Learn About Laserstream
          </a>
        </div>

        {/* Feature highlights */}
        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-3">What Laserstream offers:</h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-helius-orange" />
              Sub-50ms block latency
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-helius-orange" />
              Real-time slot streaming
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-helius-orange" />
              Account change notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-helius-orange" />
              Transaction confirmations
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Connected state - show full demo
  return (
    <div className={cn('rounded-lg border border-border p-4 md:p-6', className)}>
      {/* Header with status */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">Laserstream Demo</h3>
        <ConnectionStatus status={status} />
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={connect}
          disabled={status === 'connected' || status === 'connecting'}
          variant="solana"
        >
          Connect
        </Button>
        <Button onClick={disconnect} disabled={status === 'disconnected'} variant="outline">
          Disconnect
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Block stream display (LSTR-01) */}
      <BlockStream blocks={blocks} />

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
        <p>
          Streaming real-time Solana mainnet blocks via Helius Laserstream. Blocks appear as they
          are confirmed (~400ms block time).
        </p>
      </div>
    </div>
  );
}

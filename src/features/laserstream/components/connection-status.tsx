'use client';

/**
 * Visual indicator for WebSocket connection status.
 * Shows colored dot with pulse animation when live. (LSTR-03)
 */
import { cn } from '@/lib/utils';

const statusConfig: Record<ConnectionStatus, { color: string; text: string; pulse: boolean }> = {
  disconnected: {
    color: 'bg-gray-400',
    text: 'Disconnected',
    pulse: false,
  },
  connecting: {
    color: 'bg-yellow-400',
    text: 'Connecting...',
    pulse: true,
  },
  connected: {
    color: 'bg-green-500',
    text: 'Live',
    pulse: true,
  },
  error: {
    color: 'bg-red-500',
    text: 'Error',
    pulse: false,
  },
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn('size-3 rounded-full', config.color, config.pulse && 'animate-pulse')}
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}

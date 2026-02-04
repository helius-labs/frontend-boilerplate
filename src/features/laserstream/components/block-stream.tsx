'use client';

/**
 * Displays streaming block updates in a scrollable list.
 * Shows slot number, timestamp and parent slot.
 */
import { cn } from '@/lib/utils';

export function BlockStream({ blocks }: BlockStreamProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No blocks received yet.</p>
        <p className="text-sm mt-1">Connect to start streaming.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {blocks.map((block, index) => (
        <div
          key={`${block.slot}-${block.timestamp}`}
          className={cn(
            'flex items-center justify-between p-3 rounded-lg',
            'transition-colors duration-300',
            index === 0
              ? 'bg-primary/10 border border-primary/20'
              : 'bg-muted/50 border border-border'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Slot number */}
            <div>
              <span className="text-xs text-muted-foreground">Slot</span>
              <p className="font-mono font-semibold">{block.slot.toLocaleString()}</p>
            </div>

            {/* Parent slot */}
            {block.parentSlot !== undefined && (
              <div>
                <span className="text-xs text-muted-foreground">Parent</span>
                <p className="font-mono text-sm text-muted-foreground">
                  {block.parentSlot.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Received</span>
            <p className="text-sm font-mono">{new Date(block.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

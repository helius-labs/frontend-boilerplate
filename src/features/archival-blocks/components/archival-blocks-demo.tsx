'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { useBlock } from '../hooks/use-block';
import { NOTABLE_SLOTS } from '../lib/fetch-block';
import { BlockDisplay } from './block-display';

export function ArchivalBlocksDemo({ defaultSlot = 0 }: ArchivalBlocksDemoProps) {
  const [slotInput, setSlotInput] = useState(defaultSlot.toString());
  const [submittedSlot, setSubmittedSlot] = useState<number | null>(defaultSlot);

  const {
    data: block,
    error,
    isLoading,
  } = useBlock({
    slot: submittedSlot,
    enabled: submittedSlot !== null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(slotInput, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setSubmittedSlot(parsed);
    }
  };

  const handleQuickSelect = (slot: number) => {
    setSlotInput(slot.toString());
    setSubmittedSlot(slot);
  };

  return (
    <div className="space-y-6">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="slot" className="text-sm font-medium">
            Slot Number
          </label>
          <input
            id="slot"
            type="number"
            min="0"
            value={slotInput}
            onChange={(e) => setSlotInput(e.target.value)}
            placeholder="Enter slot number (e.g., 0 for genesis)"
            className={cn(
              'w-full px-3 py-2 rounded-lg font-mono text-sm',
              'border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>

        {/* Quick select notable slots */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {NOTABLE_SLOTS.map((notable) => (
              <Button
                key={notable.slot}
                type="button"
                variant={submittedSlot === notable.slot ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleQuickSelect(notable.slot)}
                className="px-3 py-1 text-xs rounded-full h-auto"
                title={notable.description}
              >
                {notable.label}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="solana">
          Fetch Block
        </Button>
      </form>

      {/* Results */}
      <div className="p-4 md:p-6 border rounded-lg bg-card">
        <BlockDisplay
          block={block ?? null}
          slot={submittedSlot ?? 0}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

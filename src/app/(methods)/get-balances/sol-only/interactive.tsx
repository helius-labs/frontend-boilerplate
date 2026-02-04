'use client';

// Interactive SOL balance lookup component
import { useState } from 'react';
import { SolBalanceDisplay, useSolBalance } from '@/features/get-balance';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveSolBalance({ defaultAddress = '' }: { defaultAddress?: string }) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);
  const { data, isLoading, error } = useSolBalance(address, submitted && address.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setSubmitted(true);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setSubmitted(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Enter a Solana wallet address..."
          className={cn(
            'flex-1 px-3 py-2 rounded-md border',
            'bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          )}
        />
        <Button type="submit" disabled={!address.trim()}>
          Lookup
        </Button>
      </form>

      {submitted && <SolBalanceDisplay balance={data} isLoading={isLoading} error={error} />}
    </div>
  );
}

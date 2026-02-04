'use client';

// Interactive all tokens balance lookup component
import { useState } from 'react';
import { TokenBalanceList, useAllBalances } from '@/features/get-balance';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveAllTokens({ defaultAddress = '' }: { defaultAddress?: string }) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);
  const { data, isLoading, error } = useAllBalances(address, submitted && address.length > 0);

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

      {submitted && <TokenBalanceList balances={data} isLoading={isLoading} error={error} />}
    </div>
  );
}

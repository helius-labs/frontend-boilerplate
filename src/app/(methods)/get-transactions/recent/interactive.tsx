'use client';

// Interactive recent transactions lookup component
import { useState } from 'react';
import {
  TransactionErrorDisplay,
  TransactionList,
  useRecentTransactions,
} from '@/features/get-transactions';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveRecentTransactions({
  defaultAddress = '',
}: { defaultAddress?: string }) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);
  const { data, isLoading, error, mutate } = useRecentTransactions(
    address,
    20, // limit
    submitted && address.length > 0 // enabled
  );

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

      {submitted && isLoading && <TransactionList transactions={[]} isLoading={true} />}

      {submitted && error && (
        <TransactionErrorDisplay
          error={error}
          onRetry={error.retryable ? () => mutate() : undefined}
        />
      )}

      {submitted && data && !isLoading && (
        <>
          <p className="text-sm text-muted-foreground">Found {data.length} recent transactions</p>
          <TransactionList transactions={data} />
        </>
      )}
    </div>
  );
}

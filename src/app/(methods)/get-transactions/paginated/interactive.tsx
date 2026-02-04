'use client';

// Interactive paginated transactions lookup component
import { useState } from 'react';
import {
  SignatureList,
  TransactionErrorDisplay,
  usePaginatedTransactions,
} from '@/features/get-transactions';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractivePaginatedTransactions({
  defaultAddress = '',
}: {
  defaultAddress?: string;
}) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);

  const { data, isLoading, error, loadMore, hasMore, mutate } = usePaginatedTransactions(
    address,
    submitted && address.length > 0
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

      {submitted && isLoading && !data && <SignatureList signatures={[]} isLoading={true} />}

      {submitted && error && (
        <TransactionErrorDisplay
          error={error}
          onRetry={error.retryable ? () => mutate() : undefined}
        />
      )}

      {submitted && data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Loaded {data.length} signatures</p>
            {hasMore && (
              <Button onClick={loadMore} disabled={isLoading} variant="outline" size="sm">
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </div>
          <SignatureList signatures={data} />
          {hasMore && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load More Transactions'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

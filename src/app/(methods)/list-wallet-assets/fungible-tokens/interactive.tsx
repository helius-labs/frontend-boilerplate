'use client';

// Interactive fungible tokens lookup component
import { useState } from 'react';
import {
  AssetCard,
  AssetGrid,
  AssetSkeletonGrid,
  EmptyState,
  useFungibleTokens,
} from '@/features/get-assets-by-owner';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveFungibleTokens({ defaultAddress = '' }: { defaultAddress?: string }) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);
  const { data, isLoading, error } = useFungibleTokens(address, submitted && address.length > 0);

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

      {submitted && isLoading && <AssetSkeletonGrid count={6} />}

      {submitted && error && (
        <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {submitted && data && data.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">Found {data.length} tokens</p>
          <AssetGrid>
            {data.map((token) => (
              <AssetCard
                key={token.id}
                name={token.name}
                image={token.image}
                cdnImage={token.cdnImage}
                symbol={token.symbol}
                balance={token.uiAmount}
                priceUsd={token.priceInfo?.totalPrice}
              />
            ))}
          </AssetGrid>
        </>
      )}

      {submitted && data && data.length === 0 && !isLoading && <EmptyState type="tokens" />}
    </div>
  );
}

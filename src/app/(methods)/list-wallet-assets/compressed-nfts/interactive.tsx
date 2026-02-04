'use client';

// Interactive compressed NFTs lookup component
import { useState } from 'react';
import {
  AssetCard,
  AssetGrid,
  AssetSkeletonGrid,
  EmptyState,
  useCompressedNFTs,
} from '@/features/get-assets-by-owner';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveCompressedNFTs({ defaultAddress = '' }: { defaultAddress?: string }) {
  const [address, setAddress] = useState(defaultAddress);
  const [submitted, setSubmitted] = useState(!!defaultAddress);
  const { data, isLoading, error } = useCompressedNFTs(address, submitted && address.length > 0);

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

      <p className="text-xs text-muted-foreground">
        Tip: Try a wallet that has received DRiP NFTs or Helium Mobile rewards.
      </p>

      {submitted && isLoading && <AssetSkeletonGrid count={6} />}

      {submitted && error && (
        <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {submitted && data && data.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">Found {data.length} compressed NFTs</p>
          <AssetGrid>
            {data.map((nft) => (
              <AssetCard
                key={nft.id}
                name={nft.name}
                image={nft.image}
                cdnImage={nft.cdnImage}
                collection={nft.collection?.name}
                compressed={true}
              />
            ))}
          </AssetGrid>
        </>
      )}

      {submitted && data && data.length === 0 && !isLoading && <EmptyState type="compressed" />}
    </div>
  );
}

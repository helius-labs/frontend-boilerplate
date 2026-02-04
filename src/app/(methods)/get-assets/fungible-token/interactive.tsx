'use client';

// Interactive fungible token lookup component
import { useState } from 'react';
import { FungibleTokenDisplay, getAssetDisplayType, useAsset } from '@/features/get-asset';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveFungibleToken({
  defaultMintAddress = '',
}: {
  defaultMintAddress?: string;
}) {
  const [mintAddress, setMintAddress] = useState(defaultMintAddress);
  const [submitted, setSubmitted] = useState(!!defaultMintAddress);
  const { data, isLoading, error } = useAsset({
    assetId: mintAddress,
    enabled: submitted && mintAddress.length > 0,
    displayOptions: { showFungible: true },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mintAddress.trim()) {
      setSubmitted(true);
    }
  };

  const handleMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
    setSubmitted(false);
  };

  const displayType = data ? getAssetDisplayType(data) : null;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={mintAddress}
          onChange={handleMintChange}
          placeholder="Enter a token mint address..."
          className={cn(
            'flex-1 px-3 py-2 rounded-md border',
            'bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          )}
        />
        <Button type="submit" disabled={!mintAddress.trim()}>
          Lookup
        </Button>
      </form>

      {submitted && isLoading && (
        <div className="animate-pulse space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </div>
          <div className="h-24 bg-muted rounded" />
        </div>
      )}

      {submitted && error && (
        <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {submitted && data && displayType === 'fungible' && <FungibleTokenDisplay asset={data} />}

      {submitted && data && displayType !== 'fungible' && (
        <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
          <p className="font-medium">Different Asset Type Detected</p>
          <p className="text-sm">
            This asset is {displayType === 'nft' ? 'an NFT' : 'a compressed NFT'}. Try the{' '}
            {displayType === 'nft' ? 'NFT Metadata' : 'Compressed NFT'} page for a better view.
          </p>
        </div>
      )}
    </div>
  );
}

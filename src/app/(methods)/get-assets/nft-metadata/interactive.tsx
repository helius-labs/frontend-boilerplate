'use client';

// Interactive NFT metadata lookup component
import { useState } from 'react';
import { NftMetadataDisplay, getAssetDisplayType, useAsset } from '@/features/get-asset';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function InteractiveNftMetadata({ defaultAssetId = '' }: { defaultAssetId?: string }) {
  const [assetId, setAssetId] = useState(defaultAssetId);
  const [submitted, setSubmitted] = useState(!!defaultAssetId);
  const { data, isLoading, error } = useAsset({
    assetId,
    enabled: submitted && assetId.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assetId.trim()) {
      setSubmitted(true);
    }
  };

  const handleAssetIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetId(e.target.value);
    setSubmitted(false);
  };

  const displayType = data ? getAssetDisplayType(data) : null;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={assetId}
          onChange={handleAssetIdChange}
          placeholder="Enter an NFT mint address..."
          className={cn(
            'flex-1 px-3 py-2 rounded-md border',
            'bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          )}
        />
        <Button type="submit" disabled={!assetId.trim()}>
          Lookup
        </Button>
      </form>

      {submitted && isLoading && (
        <div className="animate-pulse space-y-4">
          <div className="flex gap-4">
            <div className="w-48 h-48 bg-muted rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      )}

      {submitted && error && (
        <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {submitted && data && displayType === 'nft' && <NftMetadataDisplay asset={data} />}

      {submitted && data && displayType !== 'nft' && (
        <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
          <p className="font-medium">Different Asset Type Detected</p>
          <p className="text-sm">
            This asset is a {displayType === 'fungible' ? 'fungible token' : 'compressed NFT'}. Try
            the {displayType === 'fungible' ? 'Fungible Token' : 'Compressed NFT'} page for a better
            view.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

// Interactive compressed NFT lookup component
import { useState } from 'react';
import {
  CompressedNftDisplay,
  NftMetadataDisplay,
  getAssetDisplayType,
  useAsset,
} from '@/features/get-asset';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Link } from '@/shared/ui/link';

export function InteractiveCompressedNft({ defaultAssetId = '' }: { defaultAssetId?: string }) {
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
          placeholder="Enter a compressed NFT asset ID..."
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

      <p className="text-xs text-muted-foreground">
        Tip: Find cNFT asset IDs by querying{' '}
        <Link href="/list-wallet-assets/compressed-nfts">getAssetsByOwner</Link> for a wallet that
        holds compressed NFTs.
      </p>

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

      {submitted && data && displayType === 'compressed' && <CompressedNftDisplay asset={data} />}

      {submitted && data && displayType === 'nft' && (
        <div>
          <div className="p-4 mb-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
            <p className="font-medium">Standard NFT Detected</p>
            <p className="text-sm">
              This is a standard (non-compressed) NFT. Showing standard NFT view instead.
            </p>
          </div>
          <NftMetadataDisplay asset={data} />
        </div>
      )}

      {submitted && data && displayType === 'fungible' && (
        <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg">
          <p className="font-medium">Fungible Token Detected</p>
          <p className="text-sm">
            This asset is a fungible token, not a compressed NFT. Try the Fungible Token page for a
            better view.
          </p>
        </div>
      )}
    </div>
  );
}

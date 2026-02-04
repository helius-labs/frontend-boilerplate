'use client';

// Main asset demo component with tabs for 3 use cases
// Integrates with Phase 4 demo framework
import { useState } from 'react';
import { CompressedNftDisplay } from '@/features/get-asset/components/compressed-nft-display';
import { FungibleTokenDisplay } from '@/features/get-asset/components/fungible-token-display';
import { JsonHighlight } from '@/features/get-asset/components/json-highlight';
import { NftMetadataDisplay } from '@/features/get-asset/components/nft-metadata-display';
import { useAsset } from '@/features/get-asset/hooks/use-asset';
import { getAssetDisplayType } from '@/features/get-asset/lib/fetch-asset';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

// Example addresses for each use case
const EXAMPLES: Record<AssetUseCase, { address: string; name: string }> = {
  'nft-metadata': {
    address: 'F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk',
    name: 'Mad Lads #8420',
  },
  'fungible-token': {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USDC',
  },
  'compressed-nft': {
    address: '', // User must provide - no universal example
    name: 'Enter cNFT Asset ID',
  },
};

export function AssetDemo({ defaultAssetId }: AssetDemoProps) {
  const [activeTab, setActiveTab] = useState<AssetUseCase>('nft-metadata');
  const [assetId, setAssetId] = useState(defaultAssetId || EXAMPLES['nft-metadata'].address);
  const [submitted, setSubmitted] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const {
    data: asset,
    error,
    isLoading,
  } = useAsset({
    assetId,
    enabled: submitted && !!assetId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTabChange = (tab: AssetUseCase) => {
    setActiveTab(tab);
    setShowJson(false);
    // Update example when tab changes (if no default provided)
    if (!defaultAssetId) {
      setAssetId(EXAMPLES[tab].address);
      setSubmitted(false);
    }
  };

  const tabs: { id: AssetUseCase; label: string }[] = [
    { id: 'nft-metadata', label: 'NFT Metadata' },
    { id: 'fungible-token', label: 'Fungible Token' },
    { id: 'compressed-nft', label: 'Compressed NFT' },
  ];

  // Determine which display component to use based on actual response
  const displayType = asset ? getAssetDisplayType(asset) : null;

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 rounded-none',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-transparent'
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="asset-id" className="text-sm font-medium">
            {activeTab === 'compressed-nft' ? 'Asset ID' : 'Mint Address'}
          </label>
          <input
            id="asset-id"
            type="text"
            value={assetId}
            onChange={(e) => {
              setAssetId(e.target.value);
              setSubmitted(false);
            }}
            placeholder={
              activeTab === 'compressed-nft'
                ? 'Enter compressed NFT asset ID...'
                : 'Enter mint address...'
            }
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Example: {EXAMPLES[activeTab].name}
            {EXAMPLES[activeTab].address && ` (${EXAMPLES[activeTab].address.slice(0, 8)}...)`}
          </p>
        </div>

        <Button type="submit" variant="solana" disabled={!assetId}>
          Look Up Asset
        </Button>
      </form>

      {/* Results */}
      <div className="border rounded-lg bg-card overflow-hidden">
        {/* Toggle header */}
        {asset && (
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <span className="text-sm font-medium">Result</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowJson(!showJson)}
              className="text-primary hover:underline p-0 h-auto"
            >
              {showJson ? 'Show Formatted' : 'Show JSON'}
            </Button>
          </div>
        )}

        <div className="p-4 md:p-6">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error.message}</p>
              {error.retryable && <p className="text-xs mt-1">You can try again.</p>}
            </div>
          )}

          {/* Success state */}
          {asset &&
            !isLoading &&
            (showJson ? (
              <JsonHighlight data={asset} />
            ) : (
              <>
                {displayType === 'nft' && <NftMetadataDisplay asset={asset} />}
                {displayType === 'fungible' && <FungibleTokenDisplay asset={asset} />}
                {displayType === 'compressed' && <CompressedNftDisplay asset={asset} />}
              </>
            ))}

          {/* Idle state */}
          {!asset && !isLoading && !error && (
            <div className="text-muted-foreground text-center py-12">
              Enter an {activeTab === 'compressed-nft' ? 'asset ID' : 'address'} to view metadata
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

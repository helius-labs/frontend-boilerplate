'use client';

import { useState } from 'react';
import { AssetCard } from '@/features/get-assets-by-owner/components/asset-card';
import { AssetGrid } from '@/features/get-assets-by-owner/components/asset-grid';
import { AssetSkeletonGrid } from '@/features/get-assets-by-owner/components/asset-skeleton-grid';
import { EmptyState } from '@/features/get-assets-by-owner/components/empty-state';
import {
  useCompressedNFTs,
  useFungibleTokens,
  useNFTs,
} from '@/features/get-assets-by-owner/hooks/use-assets-by-owner';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

/**
 * Main demo component for getAssetsByOwner.
 * Displays three tabbed use cases: NFTs, Tokens, Compressed.
 */
export function AssetsDemo({ connectedWallet }: AssetsDemoProps) {
  const [activeTab, setActiveTab] = useState<AssetsByOwnerUseCase>('nfts');
  const [walletAddress, setWalletAddress] = useState(connectedWallet || '');
  const [submitted, setSubmitted] = useState(false);

  // Use appropriate hook based on active tab
  const nfts = useNFTs(walletAddress, submitted && activeTab === 'nfts');
  const tokens = useFungibleTokens(walletAddress, submitted && activeTab === 'tokens');
  const compressed = useCompressedNFTs(walletAddress, submitted && activeTab === 'compressed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTabChange = (tab: AssetsByOwnerUseCase) => {
    setActiveTab(tab);
    // Don't reset submitted - allow switching between fetched results
  };

  const tabs: { id: AssetsByOwnerUseCase; label: string }[] = [
    { id: 'nfts', label: 'All NFTs' },
    { id: 'tokens', label: 'Fungible Tokens' },
    { id: 'compressed', label: 'Compressed NFTs' },
  ];

  // Get current state based on active tab
  const getCurrentState = () => {
    switch (activeTab) {
      case 'nfts':
        return nfts;
      case 'tokens':
        return tokens;
      case 'compressed':
        return compressed;
    }
  };

  const currentState = getCurrentState();

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
          <label htmlFor="wallet" className="text-sm font-medium">
            Wallet Address
          </label>
          <input
            id="wallet"
            type="text"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter Solana wallet address..."
            className={cn(
              'w-full px-3 py-2 rounded-lg',
              'border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>

        <Button type="submit" variant="solana">
          View Assets
        </Button>
      </form>

      {/* Results */}
      <div className="min-h-[400px]">
        {currentState.isLoading && <AssetSkeletonGrid count={12} />}

        {currentState.error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="font-medium text-destructive">Error</p>
            <p className="text-sm text-destructive/80">{currentState.error.message}</p>
            {currentState.error.retryable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => currentState.mutate()}
                className="mt-2 text-primary hover:underline p-0 h-auto"
              >
                Try again
              </Button>
            )}
          </div>
        )}

        {!currentState.isLoading && !currentState.error && currentState.data && (
          <>
            {currentState.data.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {currentState.data.length} {activeTab === 'tokens' ? 'tokens' : 'NFTs'} found
                </p>
                <AssetGrid>
                  {activeTab === 'tokens'
                    ? (currentState.data as FungibleAsset[]).map((token) => (
                        <AssetCard
                          key={token.id}
                          name={token.name}
                          image={token.image}
                          cdnImage={token.cdnImage}
                          symbol={token.symbol}
                          balance={token.uiAmount}
                          priceUsd={token.priceInfo?.totalPrice}
                        />
                      ))
                    : (currentState.data as NFTAsset[]).map((nft) => (
                        <AssetCard
                          key={nft.id}
                          name={nft.name}
                          image={nft.image}
                          cdnImage={nft.cdnImage}
                          collection={nft.collection?.name}
                          compressed={nft.compressed}
                        />
                      ))}
                </AssetGrid>
              </>
            )}
          </>
        )}

        {!currentState.isLoading && !currentState.error && !currentState.data && !submitted && (
          <div className="text-center py-12 text-muted-foreground">
            Enter a wallet address to view assets
          </div>
        )}
      </div>
    </div>
  );
}

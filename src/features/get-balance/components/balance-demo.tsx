'use client';

// Main balance demo component with tabs for 3 use cases
// Integrates with Phase 4 demo framework
import { useState } from 'react';
import { SolBalanceDisplay } from '@/features/get-balance/components/sol-balance-display';
import { TokenBalanceList } from '@/features/get-balance/components/token-balance-list';
import {
  useAllBalances,
  useSolBalance,
  useTokenBalance,
} from '@/features/get-balance/hooks/use-balance';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

// Example USDC mint for demos
const EXAMPLE_USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function BalanceDemo({ connectedWallet }: BalanceDemoProps) {
  const [activeTab, setActiveTab] = useState<BalanceUseCase>('sol-only');
  const [walletAddress, setWalletAddress] = useState(connectedWallet || '');
  const [mintAddress, setMintAddress] = useState(EXAMPLE_USDC_MINT);
  const [submitted, setSubmitted] = useState(false);

  // Use the appropriate hook based on active tab
  const solBalance = useSolBalance(walletAddress, submitted && activeTab === 'sol-only');
  const allBalances = useAllBalances(walletAddress, submitted && activeTab === 'all-tokens');
  const tokenBalance = useTokenBalance(
    walletAddress,
    mintAddress,
    submitted && activeTab === 'specific-token'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTabChange = (tab: BalanceUseCase) => {
    setActiveTab(tab);
    setSubmitted(false);
  };

  const tabs: { id: BalanceUseCase; label: string }[] = [
    { id: 'sol-only', label: 'SOL Balance' },
    { id: 'all-tokens', label: 'All Tokens' },
    { id: 'specific-token', label: 'Specific Token' },
  ];

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
            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {activeTab === 'specific-token' && (
          <div className="space-y-2">
            <label htmlFor="mint" className="text-sm font-medium">
              Token Mint Address
            </label>
            <input
              id="mint"
              type="text"
              value={mintAddress}
              onChange={(e) => {
                setMintAddress(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Enter token mint address..."
              className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Example: USDC = EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
            </p>
          </div>
        )}

        <Button type="submit" variant="solana">
          Look Up Balance
        </Button>
      </form>

      {/* Results */}
      <div className="p-4 md:p-6 border rounded-lg bg-card">
        {activeTab === 'sol-only' && (
          <SolBalanceDisplay
            balance={solBalance.data}
            isLoading={solBalance.isLoading}
            error={solBalance.error}
          />
        )}

        {activeTab === 'all-tokens' && (
          <TokenBalanceList
            balances={allBalances.data}
            isLoading={allBalances.isLoading}
            error={allBalances.error}
          />
        )}

        {activeTab === 'specific-token' && (
          <div>
            {tokenBalance.isLoading && <div className="animate-pulse h-8 bg-muted rounded w-32" />}
            {tokenBalance.error && (
              <div className="text-destructive">
                <p className="font-medium">Error</p>
                <p className="text-sm">{tokenBalance.error.message}</p>
              </div>
            )}
            {tokenBalance.data && !tokenBalance.isLoading && (
              <div>
                {tokenBalance.data.found ? (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{tokenBalance.data.balance!.uiAmount}</p>
                    <p className="text-sm text-muted-foreground">
                      Mint: {tokenBalance.data.mint.slice(0, 8)}...
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Token not found in wallet (balance may be 0)
                  </p>
                )}
              </div>
            )}
            {!tokenBalance.data && !tokenBalance.isLoading && !tokenBalance.error && (
              <p className="text-muted-foreground">Enter addresses to look up token balance</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

// Main demo component for getTransactionsForAddress with three use cases
import { useEffect, useState } from 'react';
import { TransactionFilters } from '@/features/get-transactions/components/transaction-filters';
import {
  SignatureList,
  TransactionErrorDisplay,
  TransactionList,
} from '@/features/get-transactions/components/transaction-list';
import {
  useFilteredTransactions,
  usePaginatedTransactions,
  useRecentTransactions,
} from '@/features/get-transactions/hooks/use-transactions';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

/**
 * Main demo component for transaction queries.
 * Displays three tabbed use cases: Recent, Filtered, Paginated.
 */
export function TransactionsDemo({ connectedWallet }: TransactionsDemoProps) {
  const [activeTab, setActiveTab] = useState<TransactionUseCase>('recent');
  const [walletAddress, setWalletAddress] = useState(connectedWallet || '');
  const [submitted, setSubmitted] = useState(false);
  const [filterType, setFilterType] = useState<FilterableTransactionType>('TRANSFER');

  // Sync wallet address when connected wallet changes
  useEffect(() => {
    if (connectedWallet && !walletAddress) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: one-time sync when wallet connects
      setWalletAddress(connectedWallet);
    }
  }, [connectedWallet, walletAddress]);

  // Use appropriate hook based on active tab
  const recentTx = useRecentTransactions(walletAddress, 20, submitted && activeTab === 'recent');
  const filteredTx = useFilteredTransactions(
    walletAddress,
    filterType,
    20,
    submitted && activeTab === 'filtered'
  );
  const paginatedTx = usePaginatedTransactions(
    walletAddress,
    submitted && activeTab === 'paginated'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTabChange = (tab: TransactionUseCase) => {
    setActiveTab(tab);
    // Don't reset submitted - allow switching between fetched results
  };

  const handleAddressChange = (value: string) => {
    setWalletAddress(value);
    setSubmitted(false);
    // Reset pagination when address changes
    if (paginatedTx.reset) {
      paginatedTx.reset();
    }
  };

  const tabs: { id: TransactionUseCase; label: string }[] = [
    { id: 'recent', label: 'Recent' },
    { id: 'filtered', label: 'By Type' },
    { id: 'paginated', label: 'Paginated' },
  ];

  // Get current loading/error state based on active tab
  const getCurrentState = () => {
    switch (activeTab) {
      case 'recent':
        return {
          isLoading: recentTx.isLoading,
          error: recentTx.error,
          mutate: recentTx.mutate,
        };
      case 'filtered':
        return {
          isLoading: filteredTx.isLoading,
          error: filteredTx.error,
          mutate: filteredTx.mutate,
        };
      case 'paginated':
        return {
          isLoading: paginatedTx.isLoading,
          error: paginatedTx.error,
          mutate: paginatedTx.mutate,
        };
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
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Enter Solana wallet address..."
            className={cn(
              'w-full px-3 py-2 rounded-lg',
              'border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary'
            )}
          />
        </div>

        {/* Type filter for filtered tab */}
        {activeTab === 'filtered' && (
          <TransactionFilters
            selectedType={filterType}
            onChange={(type) => {
              setFilterType(type);
              setSubmitted(false);
            }}
          />
        )}

        <Button type="submit" variant="solana">
          View Transactions
        </Button>
      </form>

      {/* Results */}
      <div className="min-h-[400px] border rounded-lg bg-card overflow-hidden">
        {currentState.isLoading && (
          <div className="p-4">
            {activeTab === 'paginated' ? (
              <SignatureList signatures={[]} isLoading />
            ) : (
              <TransactionList transactions={[]} isLoading />
            )}
          </div>
        )}

        {currentState.error && (
          <div className="p-4">
            <TransactionErrorDisplay
              error={currentState.error}
              onRetry={currentState.error.retryable ? currentState.mutate : undefined}
            />
          </div>
        )}

        {!currentState.isLoading && !currentState.error && (
          <>
            {/* Recent transactions */}
            {activeTab === 'recent' && recentTx.data && (
              <div>
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {recentTx.data.length} recent transactions
                  </p>
                </div>
                <TransactionList
                  transactions={recentTx.data}
                  emptyMessage="No recent transactions found"
                />
              </div>
            )}

            {/* Filtered transactions */}
            {activeTab === 'filtered' && filteredTx.data && (
              <div>
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {filteredTx.data.length} {filterType.toLowerCase().replace('_', ' ')}{' '}
                    transactions
                  </p>
                </div>
                <TransactionList
                  transactions={filteredTx.data}
                  emptyMessage={`No ${filterType.toLowerCase().replace('_', ' ')} transactions found`}
                />
              </div>
            )}

            {/* Paginated signatures */}
            {activeTab === 'paginated' && paginatedTx.data && (
              <div>
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {paginatedTx.data.length} signatures loaded
                  </p>
                </div>
                <SignatureList signatures={paginatedTx.data} emptyMessage="No transactions found" />
                {paginatedTx.hasMore && (
                  <div className="p-4 border-t">
                    <Button
                      variant="outline"
                      onClick={paginatedTx.loadMore}
                      disabled={paginatedTx.isLoadingMore}
                      className="w-full"
                    >
                      {paginatedTx.isLoadingMore ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Initial state - no data yet */}
            {!submitted && (
              <div className="text-center py-12 text-muted-foreground">
                Enter a wallet address to view transactions
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

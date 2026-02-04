'use client';

// Interactive filtered transactions lookup component
import { useEffect, useState } from 'react';
import {
  TransactionErrorDisplay,
  TransactionList,
  useFilteredTransactions,
} from '@/features/get-transactions';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

const TRANSACTION_TYPES: FilterableTransactionType[] = [
  'TRANSFER',
  'SWAP',
  'NFT_SALE',
  'NFT_LISTING',
  'NFT_BID',
  'STAKE_SOL',
  'UNSTAKE_SOL',
  'BURN',
  'TOKEN_MINT',
];

export function InteractiveFilteredTransactions({
  defaultAddress = '',
}: {
  defaultAddress?: string;
}) {
  const [address, setAddress] = useState(defaultAddress);
  const [selectedType, setSelectedType] = useState<FilterableTransactionType>('TRANSFER');
  const [shouldFetch, setShouldFetch] = useState(!!defaultAddress);

  const { data, isLoading, error, mutate } = useFilteredTransactions(
    address,
    selectedType,
    20, // limit
    shouldFetch && address.length > 0 // enabled
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setShouldFetch(false);
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && address.trim()) {
      e.preventDefault();
      setShouldFetch(true);
    }
  };

  const handleTypeClick = (type: FilterableTransactionType) => {
    setSelectedType(type);
    // Auto-trigger lookup if address is filled
    if (address.trim()) {
      setShouldFetch(true);
    }
  };

  // Re-fetch when type changes and we already have an address
  useEffect(() => {
    if (address.trim() && shouldFetch) {
      mutate();
    }
  }, [selectedType, address, shouldFetch, mutate]);

  return (
    <div className="space-y-4">
      {/* Address input */}
      <div>
        <label htmlFor="address" className="text-sm font-medium mb-1.5 block">
          Wallet Address
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={handleAddressChange}
          onKeyDown={handleAddressKeyDown}
          placeholder="Enter a Solana wallet address and press Enter..."
          className={cn(
            'w-full px-3 py-2 rounded-md border',
            'bg-background text-foreground',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          )}
        />
      </div>

      {/* Transaction type chips */}
      <div>
        <label className="text-sm font-medium mb-1.5 block">Transaction Type</label>
        <div className="flex flex-wrap gap-2">
          {TRANSACTION_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeClick(type)}
              className="font-mono"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {shouldFetch && isLoading && <TransactionList transactions={[]} isLoading={true} />}

      {shouldFetch && error && (
        <TransactionErrorDisplay
          error={error}
          onRetry={error.retryable ? () => mutate() : undefined}
        />
      )}

      {shouldFetch && data && !isLoading && (
        <>
          <p className="text-sm text-muted-foreground">
            Found {data.length} {selectedType.toLowerCase()} transactions
          </p>
          <TransactionList
            transactions={data}
            emptyMessage={`No ${selectedType} transactions found for this wallet`}
          />
        </>
      )}
    </div>
  );
}

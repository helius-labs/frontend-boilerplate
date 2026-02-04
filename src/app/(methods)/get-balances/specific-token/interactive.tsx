'use client';

// Interactive specific token balance lookup component
import { useState } from 'react';
import { SpecificTokenDisplay, useTokenBalance } from '@/features/get-balance';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

const DEFAULT_USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function InteractiveTokenBalance({
  defaultWalletAddress = '',
  defaultMintAddress = DEFAULT_USDC_MINT,
}: {
  defaultWalletAddress?: string;
  defaultMintAddress?: string;
}) {
  const [walletAddress, setWalletAddress] = useState(defaultWalletAddress);
  const [mintAddress, setMintAddress] = useState(defaultMintAddress);
  const [submitted, setSubmitted] = useState(!!defaultWalletAddress);

  const { data, isLoading, error } = useTokenBalance(
    walletAddress,
    mintAddress,
    submitted && walletAddress.length > 0 && mintAddress.length > 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim() && mintAddress.trim()) {
      setSubmitted(true);
    }
  };

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
    setSubmitted(false);
  };

  const handleMintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
    setSubmitted(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="wallet" className="text-sm font-medium">
            Wallet Address
          </label>
          <input
            id="wallet"
            type="text"
            value={walletAddress}
            onChange={handleWalletChange}
            placeholder="Enter a Solana wallet address..."
            className={cn(
              'w-full px-3 py-2 rounded-md border',
              'bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            )}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mint" className="text-sm font-medium">
            Token Mint Address
          </label>
          <input
            id="mint"
            type="text"
            value={mintAddress}
            onChange={handleMintChange}
            placeholder="Enter token mint address..."
            className={cn(
              'w-full px-3 py-2 rounded-md border',
              'bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            )}
          />
          <p className="text-xs text-muted-foreground">Default: USDC mint address</p>
        </div>

        <Button type="submit" disabled={!walletAddress.trim() || !mintAddress.trim()}>
          Lookup Balance
        </Button>
      </form>

      {submitted && <SpecificTokenDisplay result={data} isLoading={isLoading} error={error} />}
    </div>
  );
}

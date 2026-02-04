'use client';

import { useEffect } from 'react';
import { useDemoContext } from '@/features/demo-framework/context/demo-context';
import { validateSolanaAddress } from '@/features/demo-framework/lib/validate-address';
import { cn } from '@/lib/utils';
import { useWallet } from '@/shared/hooks/use-wallet';
import { Input } from '@/shared/ui/input';

/**
 * Wallet-aware address input for demos.
 * Pre-populates with connected wallet address (DEMO-02).
 * Validates Solana addresses with visual feedback.
 */
export function DemoInput({
  placeholder = 'Enter Solana address...',
  label = 'Address',
  className,
}: DemoInputProps) {
  const { inputValue, setInputValue } = useDemoContext();
  const { address, isConnected } = useWallet();

  // Pre-populate with connected wallet address (DEMO-02)
  // Only if input is empty (don't override user input)
  useEffect(() => {
    if (isConnected && address && !inputValue) {
      setInputValue(address);
    }
  }, [isConnected, address, inputValue, setInputValue]);

  const validation = validateSolanaAddress(inputValue);

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor="demo-address" className="text-sm font-medium">
        {label}
      </label>
      <Input
        id="demo-address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(validation.error && 'border-destructive focus-visible:ring-destructive')}
        aria-invalid={!!validation.error}
        aria-describedby={validation.error ? 'demo-address-error' : undefined}
      />
      {validation.error && (
        <p id="demo-address-error" className="text-sm text-destructive">
          {validation.error}
        </p>
      )}
    </div>
  );
}

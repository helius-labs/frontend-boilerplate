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
  mcpToolName = 'queryByAddress',
  mcpToolDescription = 'Query Solana on-chain data for a given wallet or mint address.',
}: DemoInputProps & { mcpToolName?: string; mcpToolDescription?: string }) {
  const { inputValue, setInputValue } = useDemoContext();
  const { address, isConnected } = useWallet();

  useEffect(() => {
    if (isConnected && address && !inputValue) {
      setInputValue(address);
    }
  }, [isConnected, address, inputValue, setInputValue]);

  const validation = validateSolanaAddress(inputValue);

  return (
    <form
      className={cn('space-y-2', className)}
      data-mcp-tool={mcpToolName}
      data-mcp-description={mcpToolDescription}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="demo-address" className="text-sm font-medium">
        {label}
      </label>
      <Input
        id="demo-address"
        name="address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(validation.error && 'border-destructive focus-visible:ring-destructive')}
        aria-invalid={!!validation.error}
        aria-describedby={validation.error ? 'demo-address-error' : undefined}
        data-mcp-parameter="address"
        data-mcp-parameter-type="string"
        data-mcp-parameter-format="solana-address"
        data-mcp-parameter-description="Base58-encoded Solana public key (32 bytes). Accepts wallet addresses, mint addresses, and program IDs."
        data-mcp-parameter-required="true"
      />
      {validation.error && (
        <p id="demo-address-error" className="text-sm text-destructive">
          {validation.error}
        </p>
      )}
    </form>
  );
}

// Truncated address display component
'use client';

import { cn } from '@/lib/utils';
import { truncateAddress } from '@/shared/lib/wallet-utils';

/**
 * Display a Solana address in truncated format.
 * Shows full address on hover via title attribute.
 *
 * @example
 * <AddressDisplay address="HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH" />
 * // Renders: "HN7c...WrH"
 */
export function AddressDisplay({
  address,
  prefixLength = 4,
  suffixLength = 4,
  className = '',
  showCopy = false,
}: {
  address: string;
  prefixLength?: number;
  suffixLength?: number;
  className?: string;
  showCopy?: boolean;
}) {
  const truncated = truncateAddress(address, prefixLength, suffixLength);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      // Could add toast notification here in future
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <span
      className={cn('font-mono text-sm', className)}
      title={address}
      onClick={showCopy ? handleCopy : undefined}
      role={showCopy ? 'button' : undefined}
      tabIndex={showCopy ? 0 : undefined}
      style={showCopy ? { cursor: 'pointer' } : undefined}
    >
      {truncated}
    </span>
  );
}

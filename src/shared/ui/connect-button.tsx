// Wallet connect button component
// Opens Phantom modal for wallet connection
'use client';

import { useModal } from '@phantom/react-sdk';
import { useWallet } from '@/shared/hooks/use-wallet';
import { Button } from '@/shared/ui/button';

/**
 * Button to connect a Solana wallet.
 * Opens Phantom's modal with all auth options (Google, Apple, extension wallets).
 */
export function ConnectButton({ className = '' }: { className?: string }) {
  const { open } = useModal();
  const { isConnecting } = useWallet();

  return (
    <Button onClick={open} disabled={isConnecting} variant="solana" size="sm" className={className}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}

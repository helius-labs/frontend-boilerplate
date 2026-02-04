// Header wallet section
// Shows connect button or connected wallet dropdown
'use client';

import { useWallet } from '@/shared/hooks/use-wallet';
import { ConnectButton } from '@/shared/ui/connect-button';
import { WalletDropdown } from '@/shared/ui/wallet-dropdown';

/**
 * Wallet section for the site header.
 * - Disconnected: Shows ConnectButton with available wallets
 * - Connected: Shows WalletDropdown with address and disconnect
 * - Reconnecting: Shows skeleton while auto-connect resolves
 *
 * WALL-03: Disconnect available on all pages (header is global)
 * WALL-05: Connected address in header
 */
export function WalletSection() {
  const { isConnected, isConnecting, isReconnecting } = useWallet();

  // Show loading state during connection or reconnection
  // This prevents flicker when navigating between pages
  if (isConnecting || isReconnecting) {
    return <div className="h-10 w-32 animate-pulse bg-muted rounded-lg" />;
  }

  // Connected - show dropdown with address and disconnect
  if (isConnected) {
    return <WalletDropdown />;
  }

  // Disconnected - show connect button(s)
  return <ConnectButton />;
}

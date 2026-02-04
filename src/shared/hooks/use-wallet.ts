// Wallet connection hook wrapper
// Provides simplified interface over Phantom SDK's hooks
'use client';

import { useEffect, useState } from 'react';
import {
  AddressType,
  useAccounts,
  useConnect,
  useDisconnect,
  useDiscoveredWallets,
  useModal,
  usePhantom,
} from '@phantom/react-sdk';

// WalletConnectorId is now just a string (wallet ID)
export type WalletConnectorId = string;

/**
 * Hook for wallet connection state and actions.
 * Wraps Phantom SDK's hooks with a simpler interface.
 *
 * Auto-connect is handled by the SDK configuration.
 *
 * @example
 * const { isConnected, address, connect, disconnect, connectors } = useWallet();
 * if (isConnected) {
 *   console.log(`Connected: ${address}`);
 * }
 *
 * // Connect to a specific wallet
 * const phantom = connectors.find(c => c.name.includes('Phantom'));
 * if (phantom?.ready) {
 *   await connect(phantom.id);
 * }
 */
export function useWallet(): WalletState {
  const { isConnected, isLoading } = usePhantom();
  const { connect: connectWallet, isConnecting } = useConnect();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { open: openModal } = useModal();
  const accounts = useAccounts();
  const { wallets: discoveredWallets } = useDiscoveredWallets();

  const [mounted, setMounted] = useState(false);

  // Track mount state for SSR hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: single mount-time render for SSR hydration
    setMounted(true);
  }, []);

  // Get Solana address from accounts
  const solanaAccount = accounts?.find((a) => a.addressType === AddressType.solana);
  const address = solanaAccount?.address ?? null;

  // Map discovered wallets to connector format
  const connectors = (discoveredWallets ?? []).map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    icon: wallet.icon,
    ready: true,
  }));

  // Show reconnecting state while SDK is loading and we expect a connection
  const isReconnecting = isLoading && mounted;

  return {
    connectors,
    connect: async (connectorId: WalletConnectorId) => {
      // For injected wallets, connect directly with walletId
      // For modal-based connection (no specific wallet), open the modal
      if (connectorId) {
        await connectWallet({ provider: 'injected', walletId: connectorId });
      } else {
        openModal();
      }
    },
    disconnect: async () => {
      await disconnectWallet();
    },
    isConnected,
    isConnecting,
    isReconnecting: isReconnecting && !isConnected,
    address,
  };
}

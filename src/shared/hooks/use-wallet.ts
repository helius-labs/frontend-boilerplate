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

/** Connector ID for a discovered wallet */
export type WalletConnectorId = string;

/** Wallet connector info */
export interface WalletConnector {
  id: WalletConnectorId;
  name: string;
  icon?: string;
  ready: boolean;
}

/**
 * Hook for wallet connection state and actions.
 * Wraps Phantom SDK's hooks with a simpler interface.
 *
 * @example
 * const { isConnected, address, connect, disconnect, connectors } = useWallet();
 *
 * // Connect via modal (shows all options)
 * await connect();
 *
 * // Connect to a specific wallet
 * const phantom = connectors.find(c => c.name.includes('Phantom'));
 * if (phantom?.ready) {
 *   await connect(phantom.id);
 * }
 */
export function useWallet(): WalletState {
  const { isConnected, isLoading, isConnecting } = usePhantom();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { connect: connectWallet } = useConnect();
  const { open: openModal } = useModal();
  const { wallets: discoveredWallets } = useDiscoveredWallets();
  const accounts = useAccounts();

  const [mounted, setMounted] = useState(false);

  // Track mount state for SSR hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: single mount-time render for SSR hydration
    setMounted(true);
  }, []);

  // Get Solana address from accounts
  const solanaAccount = accounts?.find((a) => a.addressType === AddressType.solana);
  const address = solanaAccount?.address ?? null;

  // Show reconnecting state while SDK is loading and we expect a connection
  const isReconnecting = isLoading && mounted;

  // Map discovered wallets to connector format
  const connectors: WalletConnector[] = (discoveredWallets ?? []).map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    icon: wallet.icon,
    ready: true,
  }));

  return {
    connectors,
    connect: async (connectorId?: WalletConnectorId) => {
      // For modal-based connection (no specific wallet), open the modal
      if (!connectorId) {
        openModal();
        return;
      }

      // Find the wallet to check if it's Phantom
      const wallet = connectors.find((w) => w.id === connectorId);
      const isPhantom = wallet?.name.toLowerCase().includes('phantom');

      // Phantom connects via its injected provider, other wallets need walletId
      if (isPhantom) {
        // Connect directly to Phantom extension
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- window.phantom is injected by browser extension
        const phantom = (window as any).phantom?.solana;
        if (phantom?.isPhantom) {
          await phantom.connect();
        } else {
          openModal(); // Fallback to modal if extension not found
        }
      } else {
        await connectWallet({ provider: 'injected', walletId: connectorId });
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

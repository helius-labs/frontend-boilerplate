// Wallet connection hook wrapper
// Provides simplified interface over ConnectorKit's hooks
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  type WalletConnectorId,
  useConnectWallet,
  useWallet as useConnectorWallet,
  useDisconnectWallet,
  useWalletConnectors,
} from '@solana/connector/react';

// Re-export the WalletConnectorId type for consumers
export type { WalletConnectorId };

// Key for storing connection state in sessionStorage
const WALLET_CONNECTED_KEY = 'wallet-was-connected';

/**
 * Hook for wallet connection state and actions.
 * Wraps ConnectorKit's hooks with a simpler interface.
 *
 * Tracks reconnection state to prevent UI flicker on page navigation.
 * When a user was previously connected, shows loading state while
 * auto-connect resolves instead of flashing connect buttons.
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
  const { isConnected, isConnecting, account } = useConnectorWallet();
  const connectorList = useWalletConnectors();
  const { connect: connectWallet } = useConnectWallet();
  const { disconnect: disconnectWallet } = useDisconnectWallet();

  // Track if we're waiting for auto-reconnect
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use ref to track latest isConnected for timeout callback
  const isConnectedRef = useRef(isConnected);

  // Keep ref in sync with latest isConnected value
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // On mount, check if we were previously connected
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: single mount-time render for SSR hydration
    setMounted(true);
    const wasConnected = sessionStorage.getItem(WALLET_CONNECTED_KEY) === 'true';
    if (wasConnected) {
      setIsReconnecting(true);
    }
  }, []);

  // Update sessionStorage and reconnecting state when connection changes
  useEffect(() => {
    if (!mounted) return;

    if (isConnected) {
      sessionStorage.setItem(WALLET_CONNECTED_KEY, 'true');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: sync state with external connection status
      setIsReconnecting(false);
    }
  }, [isConnected, mounted]);

  // Handle timeout for reconnection - uses ref to check latest state
  useEffect(() => {
    if (!mounted || !isReconnecting) return;

    const timeout = setTimeout(() => {
      // Check ref for current value, not stale closure
      if (!isConnectedRef.current) {
        sessionStorage.removeItem(WALLET_CONNECTED_KEY);
        setIsReconnecting(false);
      }
    }, 2500); // Give auto-connect more time

    return () => clearTimeout(timeout);
  }, [mounted, isReconnecting]);

  return {
    connectors: connectorList.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      ready: c.ready ?? false,
    })),
    connect: async (connectorId: WalletConnectorId) => {
      await connectWallet(connectorId);
    },
    disconnect: async () => {
      sessionStorage.removeItem(WALLET_CONNECTED_KEY);
      await disconnectWallet();
    },
    isConnected,
    isConnecting,
    isReconnecting: isReconnecting && !isConnected,
    address: account ?? null,
  };
}

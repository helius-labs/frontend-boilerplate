// Wallet connection hook wrapper
// Provides simplified interface over Phantom SDK's hooks
'use client';

import { useEffect, useState } from 'react';
import {
  AddressType,
  useAccounts,
  useDisconnect,
  usePhantom,
} from '@phantom/react-sdk';

/**
 * Hook for wallet connection state and actions.
 * Wraps Phantom SDK's hooks with a simpler interface.
 *
 * Auto-connect is handled by the SDK configuration.
 * Use the ConnectButton component or useModal().open() to connect.
 *
 * @example
 * const { isConnected, address, disconnect } = useWallet();
 * if (isConnected) {
 *   console.log(`Connected: ${address}`);
 * }
 */
export function useWallet(): WalletState {
  const { isConnected, isLoading, isConnecting } = usePhantom();
  const { disconnect: disconnectWallet } = useDisconnect();
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

  return {
    disconnect: async () => {
      await disconnectWallet();
    },
    isConnected,
    isConnecting,
    isReconnecting: isReconnecting && !isConnected,
    address,
  };
}

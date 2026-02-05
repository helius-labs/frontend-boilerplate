// Types for shared hooks

interface WalletState {
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  address: string | null;
}

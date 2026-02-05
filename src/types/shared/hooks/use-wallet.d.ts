// Types for shared hooks

/** Connector ID for a discovered wallet */
type WalletConnectorId = string;

/** Wallet connector info */
interface WalletConnector {
  id: WalletConnectorId;
  name: string;
  icon?: string;
  ready: boolean;
}

interface WalletState {
  connectors: WalletConnector[];
  connect: (connectorId?: WalletConnectorId) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  address: string | null;
}

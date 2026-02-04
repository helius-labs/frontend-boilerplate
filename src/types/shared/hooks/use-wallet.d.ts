// Types for shared hooks

interface ConnectorInfo {
  id: import('@solana/connector/react').WalletConnectorId;
  name: string;
  icon?: string;
  ready: boolean;
}

interface WalletState {
  connectors: ConnectorInfo[];
  connect: (connectorId: import('@solana/connector/react').WalletConnectorId) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  address: string | null;
}

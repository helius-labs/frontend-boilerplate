// Types for shared hooks

interface ConnectorInfo {
  id: string;
  name: string;
  icon?: string;
  ready: boolean;
}

interface WalletState {
  connectors: ConnectorInfo[];
  connect: (connectorId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  address: string | null;
}

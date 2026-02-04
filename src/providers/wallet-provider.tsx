// ConnectorKit wallet provider
// Source: https://github.com/solana-foundation/connectorkit
'use client';

import { AppProvider, getDefaultConfig } from '@solana/connector/react';

const config = getDefaultConfig({
  appName: 'Helius Showcase',
  autoConnect: true, // WALL-04: Persists connection across refresh
});

export function WalletProvider({ children }: WalletProviderProps) {
  return <AppProvider connectorConfig={config}>{children}</AppProvider>;
}

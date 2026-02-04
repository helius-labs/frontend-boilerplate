// Phantom wallet provider
// Source: https://phantom.com/portal
'use client';

import { AddressType, PhantomProvider, darkTheme } from '@phantom/react-sdk';

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <PhantomProvider
      config={{
        providers: ['google', 'apple', 'injected'],
        appId: 'e0380c88-f74a-4b74-baa4-1176f1feea45',
        addressTypes: [AddressType.solana],
      }}
      theme={darkTheme}
      appIcon="https://phantom-portal20240925173430423400000001.s3.ca-central-1.amazonaws.com/icons/d2b8df4c-2738-4e19-b84c-8a614acffb3d.png"
      appName="Helius Boilerplate"
    >
      {children}
    </PhantomProvider>
  );
}

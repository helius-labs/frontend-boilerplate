'use client';

import { WalletProvider } from '@/providers/wallet-provider';

/**
 * Combined providers wrapper.
 * WalletProvider enables wallet connection with autoConnect.
 */
export function Providers({ children }: ProvidersProps) {
  return <WalletProvider>{children}</WalletProvider>;
}

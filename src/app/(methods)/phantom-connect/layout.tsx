import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phantom Connect | Wallet Integration for Solana dApps',
  description:
    'Integrate Phantom Connect into your Solana app. Handle social logins, wallet connections, and transaction signing with working TypeScript code.',
  keywords: [
    'phantom connect',
    'phantom wallet',
    'solana wallet integration',
    'phantom sdk',
    'wallet connection',
    'social login wallet',
  ],
  openGraph: {
    title: 'Phantom Connect | Wallet Integration for Solana dApps',
    description: 'Working code to integrate wallet connections with Phantom Connect.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phantom Connect | Wallet Integration for Solana dApps',
    description: 'Working code to integrate wallet connections with Phantom Connect',
  },
  alternates: {
    canonical: '/phantom-connect',
  },
};

export default function PhantomConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

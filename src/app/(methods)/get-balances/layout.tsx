import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Get Wallet Balance on Solana | Code Examples',
  description:
    'Get SOL balance, all token holdings, or check specific SPL tokens. Copy-paste TypeScript and cURL code that works with Helius RPC.',
  keywords: [
    'how to get solana balance',
    'solana wallet balance',
    'getBalance solana',
    'SPL token balance',
    'helius rpc',
  ],
  openGraph: {
    title: 'How to Get Wallet Balance on Solana',
    description: 'Working TypeScript code to fetch SOL and token balances. Copy and use today.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Get Wallet Balance on Solana',
    description: 'Working TypeScript code to fetch SOL and token balances',
  },
  alternates: {
    canonical: '/get-balances',
  },
};

export default function GetBalanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

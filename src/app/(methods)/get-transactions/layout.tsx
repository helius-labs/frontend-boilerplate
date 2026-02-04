import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Get Transaction History on Solana | Code Examples',
  description:
    'Fetch recent transactions, filter by type (swaps, transfers, NFT sales), or paginate full history. Copy the TypeScript code.',
  keywords: [
    'how to get solana transactions',
    'solana transaction history',
    'getTransactionsForAddress',
    'helius enhanced api',
    'solana swap history',
  ],
  openGraph: {
    title: 'How to Get Transaction History on Solana',
    description: 'Working code to fetch and filter transaction history with Helius Enhanced API.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Get Transaction History on Solana',
    description: 'Working code to fetch and filter transaction history',
  },
  alternates: {
    canonical: '/get-transactions',
  },
};

export default function GetTransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

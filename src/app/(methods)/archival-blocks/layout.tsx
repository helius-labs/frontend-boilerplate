import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Fetch Historical Blocks on Solana | Code Examples',
  description:
    'Access archival Solana data with getBlock. Fetch the genesis block, explore early network history, and retrieve any historical block. Copy the TypeScript code.',
  keywords: [
    'how to get solana block',
    'solana archival data',
    'getBlock solana',
    'solana genesis block',
    'historical blockchain data',
    'helius archival',
  ],
  openGraph: {
    title: 'How to Fetch Historical Blocks on Solana',
    description: 'Working code to access archival Solana data and fetch any historical block.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Fetch Historical Blocks on Solana',
    description: 'Working code to access archival Solana data and fetch any historical block',
  },
  alternates: {
    canonical: '/archival-blocks',
  },
};

export default function ArchivalBlocksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

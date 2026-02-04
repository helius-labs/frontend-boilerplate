import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Stream Solana Blocks in Real-Time | Code Examples',
  description:
    'Connect to Helius Laserstream WebSocket for live slot, block, and transaction updates with sub-50ms latency. Copy the code.',
  keywords: [
    'how to stream solana blocks',
    'solana websocket',
    'helius laserstream',
    'real-time solana data',
    'solana slot updates',
  ],
  openGraph: {
    title: 'How to Stream Solana Blocks in Real-Time',
    description: 'Working WebSocket code for live Solana block updates with Helius Laserstream.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Stream Solana Blocks in Real-Time',
    description: 'Working WebSocket code for live Solana block updates',
  },
  alternates: {
    canonical: '/laserstream',
  },
};

export default function LaserstreamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

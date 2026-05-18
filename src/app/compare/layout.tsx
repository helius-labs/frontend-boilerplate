import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Helius vs QuickNode, Alchemy, Triton, Syndica | Solana RPC Comparison',
  description:
    'Side-by-side comparison of Solana RPC providers — Helius vs QuickNode, Alchemy, Triton, and Syndica. DAS API, Laserstream, webhooks, free tier, priority fees, and pricing.',
  alternates: { canonical: '/compare' },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

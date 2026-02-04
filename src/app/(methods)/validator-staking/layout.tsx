import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Stake SOL Programmatically | Code Examples',
  description:
    'Fetch validators, build stake transactions, sign with Phantom. Working TypeScript code to add staking to your Solana app.',
  keywords: [
    'how to stake sol',
    'solana staking code',
    'stake transaction solana',
    'phantom wallet staking',
    'solana validator api',
  ],
  openGraph: {
    title: 'How to Stake SOL Programmatically',
    description: 'Working code to fetch validators and build stake transactions.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Stake SOL Programmatically',
    description: 'Working code to fetch validators and build stake transactions',
  },
  alternates: {
    canonical: '/validator-staking',
  },
};

export default function ValidatorStakingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

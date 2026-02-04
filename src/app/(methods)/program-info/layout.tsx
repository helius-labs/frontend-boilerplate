import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Inspect a Solana Program | Code Examples',
  description:
    'Check if a program is upgradeable, fetch the Anchor IDL, view program metadata. Copy the TypeScript code for your app.',
  keywords: [
    'how to inspect solana program',
    'solana program upgrade authority',
    'anchor idl',
    'getAccountInfo solana',
    'solana smart contract',
  ],
  openGraph: {
    title: 'How to Inspect a Solana Program',
    description: 'Working code to check upgrade authority and fetch Anchor IDL.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Inspect a Solana Program',
    description: 'Working code to check upgrade authority and fetch Anchor IDL',
  },
  alternates: {
    canonical: '/program-info',
  },
};

export default function ProgramInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

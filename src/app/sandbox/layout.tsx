import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sandbox / Devnet | Solana dApp Example',
  description:
    'Run every demo endpoint against Solana devnet by passing ?network=devnet. The sandbox is for non-production testing, transaction simulation, and CI.',
  alternates: { canonical: '/sandbox' },
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

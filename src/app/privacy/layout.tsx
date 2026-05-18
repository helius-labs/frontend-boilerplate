import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy | Solana dApp Example',
  description:
    'Privacy policy for the Helius Solana dApp Example demo: what is collected, what is forwarded to Helius RPC, and third-party services used.',
  alternates: {
    canonical: '/privacy',
  },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

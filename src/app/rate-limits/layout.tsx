import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rate Limits | Solana dApp Example',
  description:
    'Rate-limit documentation for the demo proxy and the underlying Helius RPC tiers: limits, response headers, retry guidance, and how to upgrade.',
  alternates: {
    canonical: '/rate-limits',
  },
};

export default function RateLimitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webhooks | Solana dApp Example',
  description:
    'Receive Solana on-chain events via Helius webhooks: NFT sales, token transfers, swaps, custom address activity. Includes signature verification example.',
  alternates: { canonical: '/webhooks' },
};

export default function WebhooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

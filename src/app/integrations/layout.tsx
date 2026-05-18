import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Platform Integrations | Solana dApp Example',
  description:
    'Plug the Helius demo and Helius RPC into Claude.ai, Cursor, VS Code (Continue), Goose, ChatGPT, and Perplexity. Copy-paste configs for each platform.',
  alternates: { canonical: '/integrations' },
};

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

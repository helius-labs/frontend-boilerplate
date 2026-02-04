import { Suspense } from 'react';
import { Metadata } from 'next';
import { LaserstreamDemo } from '@/features/laserstream';
import { LASERSTREAM_CODE_EXAMPLES } from '@/features/laserstream/constants/code-examples';
import {
  BASE_URL,
  JsonLdMultiple,
  createBreadcrumbSchema,
  createTechArticleSchema,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { CodeTabsClient } from '@/shared/ui/code-tabs';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { WarningBanner } from '@/shared/ui/warning-banner';

export const metadata: Metadata = {
  title: 'How to Stream Solana Blocks in Real-Time | Solana dApp Example',
  description:
    'Learn how to use Helius Laserstream for real-time block, slot, and transaction streaming with sub-50ms latency via WebSocket.',
  openGraph: {
    title: 'How to Stream Solana Blocks in Real-Time | Solana dApp Example',
    description:
      'Working code to connect to Laserstream WebSocket and stream real-time Solana data.',
  },
  alternates: {
    canonical: '/laserstream',
  },
};

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Laserstream', url: `${BASE_URL}/laserstream` },
];

export default function LaserstreamPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Stream Solana Blocks in Real-Time',
    headline: 'Stream Solana Blocks in Real-Time with Laserstream',
    description:
      'Learn how to use Helius Laserstream for real-time block, slot, and transaction streaming with sub-50ms latency via WebSocket.',
    url: `${BASE_URL}/laserstream`,
    keywords: [
      'Solana',
      'Laserstream',
      'WebSocket',
      'real-time',
      'block streaming',
      'Helius',
      'slot subscribe',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[techArticleSchema, createBreadcrumbSchema(BREADCRUMB)]} />
      <PageContainer className="space-y-8">
      <Breadcrumb />

      <PageHeader
        title="How to stream Solana blocks in real-time"
        description="Use Helius Laserstream to get real-time block, slot, and transaction updates with sub-50ms latency via WebSocket. Copy the code below to add streaming to your own app."
        className="mb-0"
      />

      <WarningBanner title="Professional Plan Required">
        Laserstream is available on Helius Professional plans and above. The demo below requires a
        valid API key configured in your environment.
      </WarningBanner>

      {/* Interactive demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Interactive Demo</h2>
        <Suspense fallback={<DemoSkeleton />}>
          <LaserstreamDemo />
        </Suspense>
      </section>

      {/* Code examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Copy the code</h2>
        <p className="text-muted-foreground text-sm">
          These snippets show exactly how to connect and subscribe to Laserstream. Paste them into
          your project.
        </p>

        {/* Connect to WebSocket */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">1. Connect to WebSocket</h3>
          <p className="text-sm text-muted-foreground">
            Establish a WebSocket connection and subscribe to slot notifications.
          </p>
          <CodeTabsClient code={LASERSTREAM_CODE_EXAMPLES['connect-websocket']} />
        </div>

        {/* Block Subscribe */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">2. Subscribe to Blocks</h3>
          <p className="text-sm text-muted-foreground">
            Get full block data including transactions as they are confirmed.
          </p>
          <CodeTabsClient code={LASERSTREAM_CODE_EXAMPLES['block-subscribe']} />
        </div>

        {/* Account Subscribe */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">3. Monitor Account Changes</h3>
          <p className="text-sm text-muted-foreground">
            Subscribe to real-time updates for specific accounts like wallets or program accounts.
          </p>
          <CodeTabsClient code={LASERSTREAM_CODE_EXAMPLES['account-subscribe']} />
        </div>
      </section>

      {/* Use cases */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When to use Laserstream</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Trading Bots</p>
            <p className="text-sm text-muted-foreground mt-1">
              React to on-chain events in milliseconds. Monitor DEX trades, liquidations, or
              arbitrage opportunities as they happen.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Live Dashboards</p>
            <p className="text-sm text-muted-foreground mt-1">
              Build real-time analytics showing network activity, transaction throughput, or
              protocol metrics.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Wallet Notifications</p>
            <p className="text-sm text-muted-foreground mt-1">
              Alert users instantly when their wallet receives tokens, NFTs, or when transactions
              confirm.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Program Monitoring</p>
            <p className="text-sm text-muted-foreground mt-1">
              Watch your program accounts for state changes and trigger backend logic in response.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation links */}
      <LearnMoreBox>
        <li>
          <ExternalLink href="https://www.helius.dev/blog/introducing-laserstream">
            Introducing Laserstream (Blog Post)
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://docs.helius.dev/websockets/enhanced-websockets">
            Enhanced WebSockets Documentation
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://helius.dev/pricing">
            Helius Pricing (Professional plan required)
          </ExternalLink>
        </li>
      </LearnMoreBox>
      </PageContainer>
    </>
  );
}

function DemoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded w-full" />
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}

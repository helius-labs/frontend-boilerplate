// Connection Types Sub-Page
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PHANTOM_CONNECT_NAV_ITEMS } from '@/app/(methods)/phantom-connect/nav-items';
import {
  ConnectionDemo,
  DirectWalletConnect,
  PHANTOM_CONNECT_CODE_EXAMPLES,
} from '@/features/phantom-connect';
import {
  BASE_URL,
  JsonLdMultiple,
  createBreadcrumbSchema,
  createCodeExampleSchema,
  createFAQSchema,
  createTechArticleSchema,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { CodeTabsClient } from '@/shared/ui/code-tabs';
import { FAQ } from '@/shared/ui/faq';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { PageSection } from '@/shared/ui/page-section';
import { SubNav } from '@/shared/ui/sub-nav';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Phantom Connect', url: `${BASE_URL}/phantom-connect` },
  { name: 'Connection Types', url: `${BASE_URL}/phantom-connect/connection-types` },
];

export const metadata: Metadata = {
  title: 'How to Use Different Connection Types | Phantom Connect',
  description:
    'Connect wallets via Phantom extension, Google login, Apple login, or other Solana wallets. Interactive demo with TypeScript code.',
  openGraph: {
    title: 'How to Use Different Connection Types',
    description: 'Phantom, Google, Apple, and wallet-standard connections explained',
    type: 'website',
  },
  alternates: {
    canonical: '/phantom-connect/connection-types',
  },
};

const FAQ_ITEMS = [
  {
    question: 'What is social login for wallets?',
    answer:
      'Social login lets users create a Solana wallet using their Google or Apple account. No browser extension needed. Phantom creates a non-custodial embedded wallet linked to their social identity.',
  },
  {
    question: 'Can users connect with Solflare, Backpack, or Exodus?',
    answer:
      'Yes, Phantom Connect supports the Solana wallet standard. Any compatible wallet (Solflare, Backpack, Exodus, Glow, etc.) will appear in the connection modal automatically.',
  },
  {
    question: 'Is social login secure?',
    answer:
      "Yes, social login wallets are non-custodial. Phantom uses secure enclaves and the user's OAuth credentials to derive keys. Only the user can access their wallet.",
  },
  {
    question: 'How do I test the connection modal?',
    answer:
      'Click the "Open Phantom Connect" button in the demo above. The modal will show all available connection options based on what wallets the user has installed.',
  },
];

export default function ConnectionTypesPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Use Different Connection Types',
    headline: 'Connect via Phantom, Social Login, or Other Wallets',
    description:
      'Learn how to connect wallets using Phantom extension, Google, Apple, or other Solana wallets with the wallet standard.',
    url: `${BASE_URL}/phantom-connect/connection-types`,
    keywords: [
      'wallet connection',
      'Phantom login',
      'Google wallet',
      'Apple wallet',
      'Solflare',
      'wallet standard',
      'social login',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Open Connection Modal',
    description: 'TypeScript code showing how to open the Phantom Connect modal.',
    programmingLanguage: 'TypeScript',
    codeText: PHANTOM_CONNECT_CODE_EXAMPLES['open-modal'].typescript,
    url: `${BASE_URL}/phantom-connect/connection-types`,
  });

  return (
    <>
      <JsonLdMultiple
        schemas={[
          techArticleSchema,
          createBreadcrumbSchema(BREADCRUMB),
          faqSchema,
          codeExampleSchema,
        ]}
      />

      <PageContainer>
        <Breadcrumb />
        <SubNav items={PHANTOM_CONNECT_NAV_ITEMS} />

        <PageHeader
          title="How to use different connection types"
          description="Connect users via Phantom extension, social login (Google/Apple), or any wallet-standard compatible wallet."
        />

        <PageSection title="Try It">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Unified Modal (Recommended)
              </h3>
              <Suspense fallback={<DemoSkeleton />}>
                <ConnectionDemo />
              </Suspense>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Direct Wallet Connection
              </h3>
              <Suspense fallback={<DemoSkeleton />}>
                <DirectWalletConnect />
              </Suspense>
            </div>
          </div>
        </PageSection>

        <PageSection title="Open the Modal" className="mt-8">
          <p className="text-muted-foreground mb-4">
            The simplest way to connect is by opening the modal. It handles all connection types
            automatically.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['open-modal']} />
        </PageSection>

        <PageSection title="Social Login" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Connect users directly with their Google or Apple account. No wallet extension needed.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['social-login']} />
        </PageSection>

        <PageSection title="Direct Wallet Connection" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Connect directly to a specific wallet using its injected provider. Useful when you want
            branded wallet buttons with custom styling.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['direct-connect']} />
        </PageSection>

        <PageSection title="Wallet Standard Support" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Phantom Connect automatically detects wallet-standard wallets like Solflare, Backpack,
            and others.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['wallet-standard']} />
        </PageSection>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-8">
          <li>
            <ExternalLink href="https://phantom.com/portal">Phantom Developer Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/social-login">
              Social Login Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://github.com/solana-labs/wallet-standard">
              Solana Wallet Standard
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/hooks/use-modal">
              useModal Hook Reference
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

function DemoSkeleton() {
  return (
    <div className="p-6 rounded-lg border bg-muted/50 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
      <div className="h-10 bg-muted rounded w-48" />
    </div>
  );
}

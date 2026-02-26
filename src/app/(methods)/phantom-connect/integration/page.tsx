// Phantom Connect Integration Sub-Page
import { Metadata } from 'next';
import { PHANTOM_CONNECT_NAV_ITEMS } from '@/app/(methods)/phantom-connect/nav-items';
import { CopyButton } from '@/features/demo-framework/components/copy-button';
import { PHANTOM_CONNECT_CODE_EXAMPLES } from '@/features/phantom-connect';
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
  { name: 'Integration', url: `${BASE_URL}/phantom-connect/integration` },
];

export const metadata: Metadata = {
  title: 'How to Integrate Phantom Connect | SDK Setup Guide',
  description:
    'Install the Phantom SDK, configure the provider, and enable wallet connections in your React app. Step-by-step TypeScript code examples.',
  openGraph: {
    title: 'How to Integrate Phantom Connect',
    description: 'Step-by-step guide to adding Phantom Connect to your Solana dApp',
    type: 'website',
  },
  alternates: {
    canonical: '/phantom-connect/integration',
  },
};

const FAQ_ITEMS = [
  {
    question: 'How do I install the Phantom SDK?',
    answer:
      'Install @phantom/react-sdk using npm, yarn, or pnpm. Then wrap your app with PhantomProvider in your layout or _app file.',
  },
  {
    question: 'Do I need an App ID from Phantom?',
    answer:
      'An App ID is optional but recommended for production apps. It enables analytics and allows you to customize the connection modal. Get one from the Phantom Developer Portal at phantom.com/portal.',
  },
  {
    question: 'Does Phantom Connect work with Next.js?',
    answer:
      'Yes, Phantom Connect works with Next.js. The SDK is client-side only, so make sure to use "use client" in components that use the hooks, or wrap the provider at the layout level.',
  },
  {
    question: 'Can I customize the connection modal theme?',
    answer:
      'Yes, pass a theme prop to PhantomProvider. Options include "light", "dark", or "system" to match the user\'s preference.',
  },
];

export default function IntegrationPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Integrate Phantom Connect',
    headline: 'Add Wallet Connections to Your Solana App',
    description:
      'Step-by-step guide to installing the Phantom SDK, configuring the provider, and enabling wallet connections in React.',
    url: `${BASE_URL}/phantom-connect/integration`,
    keywords: [
      'Phantom SDK',
      'phantom/react-sdk',
      'wallet provider',
      'React wallet',
      'Solana dApp',
      'wallet integration',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Phantom Provider Setup',
    description: 'TypeScript code showing how to configure PhantomProvider in a React app.',
    programmingLanguage: 'TypeScript',
    codeText: PHANTOM_CONNECT_CODE_EXAMPLES['provider-setup'].typescript,
    url: `${BASE_URL}/phantom-connect/integration`,
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
          title="How to integrate Phantom Connect"
          description={
            <>
              Install the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">@phantom/react-sdk</code>{' '}
              package, wrap your app with the provider, and start using wallet hooks.
            </>
          }
        />

        <PageSection title="1. Install the SDK">
          <p className="text-muted-foreground mb-4">
            Add the Phantom SDK to your project with your preferred package manager.
          </p>
          <div className="relative group">
            <pre className="p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed bg-zinc-900 dark:bg-zinc-950 text-zinc-100">
              <code>{`npm install @phantom/react-sdk`}</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton code="npm install @phantom/react-sdk" />
            </div>
          </div>
        </PageSection>

        <PageSection title="2. Configure the Provider" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Wrap your application with PhantomProvider. This enables all wallet hooks throughout
            your app.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['provider-setup']} />
        </PageSection>

        <PageSection title="3. Use Wallet Hooks" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Access wallet state with hooks like usePhantom, useAccounts, and useDisconnect.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['use-wallet-hook']} />
        </PageSection>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-8">
          <li>
            <ExternalLink href="https://phantom.com/portal">Phantom Developer Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/getting-started">
              Phantom Connect Getting Started
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.npmjs.com/package/@phantom/react-sdk">
              @phantom/react-sdk on npm
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/configuration">
              Configuration Options
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

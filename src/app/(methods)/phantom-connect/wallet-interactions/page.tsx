// Wallet Interactions Sub-Page
// Reuses the ValidatorStakingDemo from the validator-staking feature
import { Suspense } from 'react';
import { Metadata } from 'next';
import { PHANTOM_CONNECT_NAV_ITEMS } from '@/app/(methods)/phantom-connect/nav-items';
import { PHANTOM_CONNECT_CODE_EXAMPLES } from '@/features/phantom-connect';
import {
  VALIDATOR_STAKING_CODE_EXAMPLES,
  ValidatorStakingDemo,
} from '@/features/validator-staking';
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
import { WarningBanner } from '@/shared/ui/warning-banner';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Phantom Connect', url: `${BASE_URL}/phantom-connect` },
  { name: 'Wallet Interactions', url: `${BASE_URL}/phantom-connect/wallet-interactions` },
];

export const metadata: Metadata = {
  title: 'How to Interact with the Wallet | Sign Transactions & Stake SOL',
  description:
    'Sign messages, send transactions, and stake SOL using Phantom Connect. Interactive staking demo with TypeScript code examples.',
  openGraph: {
    title: 'How to Interact with the Wallet',
    description: 'Sign transactions and stake SOL using Phantom wallet',
    type: 'website',
  },
  alternates: {
    canonical: '/phantom-connect/wallet-interactions',
  },
};

const FAQ_ITEMS = [
  {
    question: 'How do I sign a transaction with Phantom?',
    answer:
      'Use signAndSendTransaction() to sign and broadcast in one step, or signTransaction() to get the signed transaction back for manual submission.',
  },
  {
    question: 'What is the difference between signMessage and signTransaction?',
    answer:
      'signMessage signs arbitrary data (like login verification) without creating a blockchain transaction. signTransaction signs an actual Solana transaction that will modify state on-chain.',
  },
  {
    question: 'How do I stake SOL programmatically?',
    answer:
      "Build a stake transaction using @solana-program/stake, then use Phantom's signAndSendTransaction to submit it. See the interactive demo above.",
  },
  {
    question: 'Can I simulate transactions before signing?',
    answer:
      'Yes, use the simulateTransaction RPC method before signing. This catches errors and estimates fees without submitting to the network.',
  },
];

export default function WalletInteractionsPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Interact with the Wallet',
    headline: 'Sign Transactions and Stake SOL with Phantom',
    description:
      'Learn how to sign messages, send transactions, and stake SOL using Phantom Connect. Working TypeScript code examples.',
    url: `${BASE_URL}/phantom-connect/wallet-interactions`,
    keywords: [
      'sign transaction',
      'Phantom signing',
      'stake SOL',
      'signAndSendTransaction',
      'signMessage',
      'Solana staking',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Sign and Send Transaction',
    description: 'TypeScript code showing how to sign and send SOL with Phantom.',
    programmingLanguage: 'TypeScript',
    codeText: PHANTOM_CONNECT_CODE_EXAMPLES['sign-transaction'].typescript,
    url: `${BASE_URL}/phantom-connect/wallet-interactions`,
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
          title="How to interact with the wallet"
          description="Sign messages, send transactions, and stake SOL. The interactive demo below lets you stake real SOL to a validator."
        />

        <WarningBanner title="Real Transactions">
          This demo submits real transactions to Solana mainnet. Staked SOL will be delegated to
          your chosen validator. Make sure you understand the warmup and cooldown periods before
          staking.
        </WarningBanner>

        <PageSection title="Staking Demo" className="mt-6">
          <p className="text-muted-foreground mb-4">
            Connect your wallet to stake SOL to any Solana validator. This demo uses Phantom&apos;s
            signAndSendTransaction method.
          </p>
          <Suspense fallback={<DemoSkeleton />}>
            <ValidatorStakingDemo />
          </Suspense>
        </PageSection>

        <PageSection title="Sign a Message" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Use signMessage for wallet verification without creating an on-chain transaction.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['sign-message']} />
        </PageSection>

        <PageSection title="Sign and Send Transaction" className="mt-8">
          <p className="text-muted-foreground mb-4">
            Build a transaction, then use Phantom to sign and submit it to the network.
          </p>
          <CodeTabsClient code={PHANTOM_CONNECT_CODE_EXAMPLES['sign-transaction']} />
        </PageSection>

        <PageSection title="Build a Stake Transaction" className="mt-8">
          <p className="text-muted-foreground mb-4">
            The staking demo above uses this code to build and submit stake transactions.
          </p>
          <CodeTabsClient code={VALIDATOR_STAKING_CODE_EXAMPLES['stake-sol']} />
        </PageSection>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-8">
          <li>
            <ExternalLink href="https://phantom.com/portal">Phantom Developer Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/signing-transactions">
              Phantom Transaction Signing
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/docs/core/tokens#staking">
              Solana Staking Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://stakewiz.com">Stakewiz Validator Explorer</ExternalLink>
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

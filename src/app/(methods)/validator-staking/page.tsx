import { Suspense } from 'react';
import { Metadata } from 'next';
import { ValidatorStakingDemo } from '@/features/validator-staking/components/validator-staking-demo';
import { VALIDATOR_STAKING_CODE_EXAMPLES } from '@/features/validator-staking/constants/code-examples';
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
  title: 'How to Stake SOL | Solana dApp Example',
  description:
    'Learn how to stake SOL programmatically. Fetch validators, build stake transactions, and sign with Phantom. Working code examples.',
  openGraph: {
    title: 'How to Stake SOL Programmatically | Solana dApp Example',
    description:
      'Working code to fetch validators, build stake transactions, and sign with Phantom wallet.',
  },
  alternates: {
    canonical: '/validator-staking',
  },
};

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Validator Staking', url: `${BASE_URL}/validator-staking` },
];

export default function ValidatorStakingPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Stake SOL Programmatically',
    headline: 'Stake SOL to Validators with TypeScript',
    description:
      'Learn how to stake SOL programmatically. Fetch validators, build stake transactions, and sign with Phantom wallet.',
    url: `${BASE_URL}/validator-staking`,
    keywords: [
      'Solana',
      'staking',
      'validator',
      'stake SOL',
      'Phantom wallet',
      'delegation',
      'APY',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[techArticleSchema, createBreadcrumbSchema(BREADCRUMB)]} />
      <PageContainer className="space-y-8">
        <Breadcrumb />

        <PageHeader
          title="How to stake SOL programmatically"
          description="Fetch validators, build stake transactions, and sign with Phantom. Copy the code below to add staking to your own app."
          className="mb-0"
        />

        <WarningBanner title="Real Transactions">
          This demo submits real transactions to Solana mainnet. Staked SOL will be delegated to
          your chosen validator. Make sure you understand the warmup and cooldown periods before
          staking.
        </WarningBanner>

        {/* Main demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Interactive Demo</h2>
          <Suspense fallback={<DemoSkeleton />}>
            <ValidatorStakingDemo />
          </Suspense>
        </section>

        {/* Code examples */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Copy the code</h2>
          <p className="text-muted-foreground text-sm">
            These snippets show exactly how to implement staking. Paste them into your project.
          </p>

          {/* Validator List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">1. Fetch Validator List</h3>
            <p className="text-sm text-muted-foreground">
              Use the Stakewiz API to fetch validators with names, images, APY estimates, and more.
            </p>
            <CodeTabsClient code={VALIDATOR_STAKING_CODE_EXAMPLES['validator-list']} />
          </div>

          {/* Stake SOL */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">2. Stake SOL to Validator</h3>
            <p className="text-sm text-muted-foreground">
              Build and submit a stake delegation transaction using @solana-program/stake.
            </p>
            <CodeTabsClient code={VALIDATOR_STAKING_CODE_EXAMPLES['stake-sol']} />
          </div>

          {/* Simulate Transaction */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">3. Simulate Before Signing</h3>
            <p className="text-sm text-muted-foreground">
              Always simulate transactions before signing to catch errors and estimate fees.
            </p>
            <CodeTabsClient code={VALIDATOR_STAKING_CODE_EXAMPLES['simulate-transaction']} />
          </div>
        </section>

        {/* Staking info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">About Solana Staking</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Warmup Period</p>
              <p className="text-sm text-muted-foreground mt-1">
                When you stake SOL, it takes 1-2 epochs (~2-4 days) for your stake to become active
                and start earning rewards.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Cooldown Period</p>
              <p className="text-sm text-muted-foreground mt-1">
                When you unstake, your SOL is locked for another 1-2 epochs before you can withdraw
                it.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Commission</p>
              <p className="text-sm text-muted-foreground mt-1">
                Validators take a percentage of rewards as commission. Lower commission means more
                rewards for you.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Delinquent Validators</p>
              <p className="text-sm text-muted-foreground mt-1">
                Validators that miss votes are marked delinquent. Staking to them may result in
                reduced rewards.
              </p>
            </div>
          </div>
        </section>

        {/* Documentation links */}
        <LearnMoreBox>
          <li>
            <ExternalLink href="https://stakewiz.com">Stakewiz Validator API</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/docs/rpc/http/sendtransaction">
              Solana sendTransaction RPC Reference
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/docs/core/tokens#staking">
              Solana Staking Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.app/developer-guides/provider-api">
              Phantom Wallet Provider API
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

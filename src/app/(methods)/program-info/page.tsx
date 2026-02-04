// Program Info Demo Page
// Look up Solana program account data, upgrade authority and on-chain IDL
import { Metadata } from 'next';
import { ProgramInfoDemo } from '@/features/program-info';
import { PROGRAM_INFO_CODE_EXAMPLES } from '@/features/program-info/constants/code-examples';
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
import { PageSection } from '@/shared/ui/page-section';
import { WarningBanner } from '@/shared/ui/warning-banner';

export const metadata: Metadata = {
  title: 'How to Inspect a Solana Program | Solana dApp Example',
  description:
    'Learn how to fetch program account data, check upgrade authority, and retrieve Anchor IDL. Working code examples for Solana developers.',
  openGraph: {
    title: 'How to Inspect a Solana Program | Solana dApp Example',
    description:
      'Working code to fetch program metadata, check upgrade authority, and retrieve Anchor IDL.',
    type: 'website',
  },
  alternates: {
    canonical: '/program-info',
  },
};

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Program Info', url: `${BASE_URL}/program-info` },
];

export default function ProgramInfoPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Inspect a Solana Program',
    headline: 'Inspect Solana Programs - Upgrade Authority & IDL',
    description:
      'Working code examples showing how to fetch program metadata, check upgrade authority, and retrieve Anchor IDL using Helius RPC.',
    url: `${BASE_URL}/program-info`,
    keywords: [
      'Solana program',
      'getAccountInfo',
      'Anchor IDL',
      'upgrade authority',
      'program metadata',
      'Helius RPC',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[techArticleSchema, createBreadcrumbSchema(BREADCRUMB)]} />

      <PageContainer>
        <Breadcrumb />

        <PageHeader
          title="How to inspect a Solana program"
          description={
            <>
              Fetch program metadata, check if it&apos;s upgradeable, and retrieve the Anchor IDL.
              Copy the code below to add program inspection to your app.
            </>
          }
        />

        <PageSection title="Interactive Demo" className="mb-8">
          <ProgramInfoDemo />
        </PageSection>

        {/* Code examples */}
        <section className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">Copy the code</h2>
          <p className="text-muted-foreground text-sm">
            These snippets show exactly how to inspect programs. Paste them into your project.
          </p>

          <PageSection title="1. Fetch program metadata">
            <p className="text-sm text-muted-foreground mb-4">
              Use <code className="bg-muted px-1 rounded">getAccountInfo</code> with jsonParsed
              encoding to get program details.
            </p>
            <CodeTabsClient code={PROGRAM_INFO_CODE_EXAMPLES.metadata} />
          </PageSection>

          <PageSection title="2. Check upgrade authority">
            <p className="text-sm text-muted-foreground mb-4">
              Determine if a program is upgradeable and who controls it by fetching the ProgramData
              account.
            </p>
            <CodeTabsClient code={PROGRAM_INFO_CODE_EXAMPLES['upgrade-authority']} />
          </PageSection>

          <PageSection title="3. Retrieve Anchor IDL">
            <p className="text-sm text-muted-foreground mb-4">
              Fetch the on-chain IDL for Anchor programs using @coral-xyz/anchor.
            </p>
            <CodeTabsClient code={PROGRAM_INFO_CODE_EXAMPLES.idl} />
          </PageSection>
        </section>

        {/* API Reference */}
        <section className="p-4 bg-muted/50 rounded-lg mb-8">
          <h3 className="font-medium mb-2">RPC Methods Used</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            <li>
              <code className="text-xs bg-background px-1 rounded">getAccountInfo</code> - Fetch any
              account&apos;s data with jsonParsed encoding
            </li>
          </ul>
          <p className="text-sm mt-4">
            <ExternalLink href="https://solana.com/docs/rpc/http/getaccountinfo">
              View Solana RPC Documentation
            </ExternalLink>
          </p>
        </section>

        <WarningBanner title="Notes" className="mb-0">
          <ul className="mt-1 space-y-1">
            <li>
              - Not all programs have on-chain IDLs. Only Anchor programs with published IDLs can be
              fetched.
            </li>
            <li>
              - Programs owned by BPFLoaderUpgradeab1e are upgradeable; their upgrade authority is
              stored in a separate ProgramData account.
            </li>
            <li>
              - Native programs (System, Token, etc.) don&apos;t have upgrade authority -
              they&apos;re built into the validator.
            </li>
          </ul>
        </WarningBanner>

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/rpc/getaccountinfo">
              Helius getAccountInfo API Reference
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.anchor-lang.com/docs/cli#idl">
              Anchor IDL Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/docs/core/programs">
              Solana Programs Overview
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

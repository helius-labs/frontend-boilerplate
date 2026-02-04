// SOL Balance Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { GET_BALANCE_NAV_ITEMS } from '@/app/(methods)/get-balances/nav-items';
import { InteractiveSolBalance } from '@/app/(methods)/get-balances/sol-only/interactive';
import { CODE_EXAMPLES } from '@/features/get-balance';
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

// Preset example wallet
const EXAMPLE_WALLET = '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Balances', url: `${BASE_URL}/get-balances` },
  { name: 'SOL Only', url: `${BASE_URL}/get-balances/sol-only` },
];

export const metadata: Metadata = {
  title: 'SOL Balance | getBalance Demo',
  description:
    'Get native SOL balance using the standard getBalance RPC method. Interactive demo with TypeScript and cURL code examples.',
  openGraph: {
    title: 'SOL Balance | getBalance Demo',
    description: 'Get native SOL balance using the getBalance RPC method',
    type: 'website',
  },
  alternates: {
    canonical: '/get-balances/sol-only',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I get a wallet balance on Solana?',
    answer:
      'Use the getBalance RPC method with a wallet address. It returns the balance in lamports (1 SOL = 1,000,000,000 lamports). Divide by 1e9 to convert to SOL.',
  },
  {
    question: 'What are lamports?',
    answer:
      'Lamports are the smallest unit of SOL, similar to how satoshis are to Bitcoin. 1 SOL equals 1 billion lamports (1e9). The getBalance method returns lamports.',
  },
  {
    question: 'Is getBalance free to call?',
    answer:
      'Yes, getBalance is a standard RPC method included in free tier plans. It only reads data and does not require any transaction fees.',
  },
];

export default function SolOnlyPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get SOL Balance on Solana',
    headline: 'Get Native SOL Balance with getBalance RPC',
    description:
      'Get native SOL balance for a Solana wallet address using the getBalance RPC method. Working TypeScript and cURL code examples.',
    url: `${BASE_URL}/get-balances/sol-only`,
    keywords: ['Solana', 'SOL', 'balance', 'getBalance', 'RPC', 'wallet', 'lamports'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get SOL Balance with Helius SDK',
    description:
      'TypeScript code example showing how to fetch native SOL balance using the Helius SDK and getBalance RPC method.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['sol-only'].typescript,
    url: `${BASE_URL}/get-balances/sol-only`,
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
        <SubNav items={GET_BALANCE_NAV_ITEMS} />

        <PageHeader
          title="SOL Balance"
          description={
            <>
              Get native SOL balance using the standard{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getBalance</code> RPC method.
              This is the simplest and fastest way to check a wallet&apos;s SOL balance.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveSolBalance defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabs code={CODE_EXAMPLES['sol-only']} />
        </PageSection>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-8">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/rpc/guides/getbalance">
              Helius getBalance Guide
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/docs/rpc/http/getbalance">
              Solana RPC Documentation
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

// Code tabs component (server-compatible wrapper)
function CodeTabs({ code }: { code: { typescript: string; curl: string } }) {
  return <CodeTabsClient code={code} />;
}

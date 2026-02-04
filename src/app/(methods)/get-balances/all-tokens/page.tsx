// All Tokens Balance Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveAllTokens } from '@/app/(methods)/get-balances/all-tokens/interactive';
import { GET_BALANCE_NAV_ITEMS } from '@/app/(methods)/get-balances/nav-items';
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
import { InfoBox } from '@/shared/ui/info-box';
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
  { name: 'All Tokens', url: `${BASE_URL}/get-balances/all-tokens` },
];

export const metadata: Metadata = {
  title: 'All Token Balances | getBalance Demo',
  description:
    'Get complete portfolio view with SOL and all token balances using getAssetsByOwner DAS API. Interactive demo with TypeScript and cURL examples.',
  openGraph: {
    title: 'All Token Balances | getBalance Demo',
    description: 'Get SOL and all token balances using getAssetsByOwner DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/get-balances/all-tokens',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I get all token balances for a Solana wallet?',
    answer:
      'Use the getAssetsByOwner DAS API with showFungible: true and showNativeBalance: true in displayOptions. This returns all SPL tokens plus native SOL balance in a single call.',
  },
  {
    question: 'Does getAssetsByOwner include price data?',
    answer:
      'Yes, token prices are included when available. Prices are cached with a 10-minute TTL. Not all tokens have price data - mainly established tokens with sufficient liquidity.',
  },
  {
    question: 'How do I handle wallets with many tokens?',
    answer:
      'Use pagination with the page and limit parameters. Set limit up to 1000 per page and increment the page number to fetch more results.',
  },
];

export default function AllTokensPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get All Token Balances on Solana',
    headline: 'Get All Token Balances',
    description:
      'Get complete portfolio view with SOL and all token balances for a Solana wallet using the getAssetsByOwner DAS API',
    url: `${BASE_URL}/get-balances/all-tokens`,
    keywords: ['Solana', 'SOL', 'tokens', 'balance', 'getAssetsByOwner', 'DAS API', 'portfolio'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get All Token Balances with Helius SDK',
    description:
      'TypeScript code example showing how to fetch all token balances including SOL using the getAssetsByOwner DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['all-tokens'].typescript,
    url: `${BASE_URL}/get-balances/all-tokens`,
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
          title="All Token Balances"
          description={
            <>
              Get a complete portfolio view with SOL and all token balances using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAssetsByOwner</code> DAS
              API. Includes price data and total portfolio value.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveAllTokens defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES['all-tokens']} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Display options:</strong> Use{' '}
              <code className="bg-muted px-1 rounded">showFungible: true</code> and{' '}
              <code className="bg-muted px-1 rounded">showNativeBalance: true</code> to get complete
              balance data.
            </li>
            <li>
              <strong>Price data:</strong> Token prices are cached with a 10-minute TTL. Not all
              tokens have price data available.
            </li>
            <li>
              <strong>Pagination:</strong> For wallets with many tokens, use pagination with{' '}
              <code className="bg-muted px-1 rounded">page</code> and{' '}
              <code className="bg-muted px-1 rounded">limit</code> parameters.
            </li>
          </ul>
        </InfoBox>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/getassetsbyowner">
              getAssetsByOwner API Reference
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/blog/all-you-need-to-know-about-solanas-new-das-api">
              DAS API Deep Dive
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

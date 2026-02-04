// Fungible Token Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveFungibleToken } from '@/app/(methods)/get-assets/fungible-token/interactive';
import { GET_ASSET_NAV_ITEMS } from '@/app/(methods)/get-assets/nav-items';
import { CODE_EXAMPLES } from '@/features/get-asset';
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

// Preset example: USDC
const EXAMPLE_TOKEN = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Assets', url: `${BASE_URL}/get-assets` },
  { name: 'Fungible Token', url: `${BASE_URL}/get-assets/fungible-token` },
];

export const metadata: Metadata = {
  title: 'Fungible Token Info | getAsset Demo',
  description:
    'Get fungible token info including supply, decimals, and price data using the getAsset DAS API.',
  openGraph: {
    title: 'Fungible Token Info | getAsset Demo',
    description: 'Get fungible token info using the getAsset DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/get-assets/fungible-token',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I get token supply and decimals on Solana?',
    answer:
      'Use the getAsset DAS API with the token mint address and showFungible: true in displayOptions. The response includes supply, decimals, and price data in the token_info field.',
  },
  {
    question: 'Why do I need showFungible: true?',
    answer:
      'By default, getAsset returns minimal data. Setting showFungible: true includes the token_info object with supply, decimals, token standard, and price information.',
  },
  {
    question: 'Does the API include token prices?',
    answer:
      'Yes, price data is included for tokens with sufficient liquidity. Prices are cached with a 10-minute TTL. Check the token_info.price_info field for price per token and total price.',
  },
];

export default function FungibleTokenPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get Fungible Token Info on Solana',
    headline: 'Get Fungible Token Info',
    description:
      'Get fungible token info including supply, decimals, and price data using the getAsset DAS API',
    url: `${BASE_URL}/get-assets/fungible-token`,
    keywords: ['Solana', 'SPL token', 'fungible', 'getAsset', 'DAS API', 'USDC', 'token info'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get Fungible Token Info with Helius SDK',
    description:
      'TypeScript code example showing how to fetch fungible token information including supply, decimals, and price using the getAsset DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['fungible-token'].typescript,
    url: `${BASE_URL}/get-assets/fungible-token`,
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
        <SubNav items={GET_ASSET_NAV_ITEMS} />

        <PageHeader
          title="Fungible Token Info"
          description={
            <>
              Get fungible token info using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAsset</code> DAS API with{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">showFungible: true</code>.
              Returns supply, decimals, token program, and price data.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveFungibleToken defaultMintAddress={EXAMPLE_TOKEN} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES['fungible-token']} />
        </PageSection>

        {/* Common tokens */}
        <InfoBox title="Common Token Mints" className="mt-8 mb-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">USDC</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">USDT</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">BONK</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">JUP</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
              </code>
            </div>
          </div>
        </InfoBox>

        {/* API tips */}
        <InfoBox title="API Tips" className="mt-6 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Important:</strong> Always include{' '}
              <code className="bg-muted px-1 rounded">showFungible: true</code> in displayOptions to
              get token details (supply, decimals, price).
            </li>
            <li>
              <strong>Price data:</strong> Token prices are cached with a 10-minute TTL. Not all
              tokens have price data.
            </li>
            <li>
              <strong>Interface types:</strong> Fungible tokens return either
              &quot;FungibleToken&quot; or &quot;FungibleAsset&quot; interface.
            </li>
          </ul>
        </InfoBox>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        {/* Documentation links */}
        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/getasset">
              Helius getAsset API Reference
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://spl.solana.com/token">
              SPL Token Program Documentation
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

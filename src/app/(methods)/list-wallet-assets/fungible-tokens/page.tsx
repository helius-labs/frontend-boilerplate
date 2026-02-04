// Fungible Tokens Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveFungibleTokens } from '@/app/(methods)/list-wallet-assets/fungible-tokens/interactive';
import { GET_ASSETS_BY_OWNER_NAV_ITEMS } from '@/app/(methods)/list-wallet-assets/nav-items';
import { CODE_EXAMPLES } from '@/features/get-assets-by-owner';
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
  { name: 'List Wallet Assets', url: `${BASE_URL}/list-wallet-assets` },
  { name: 'Fungible Tokens', url: `${BASE_URL}/list-wallet-assets/fungible-tokens` },
];

export const metadata: Metadata = {
  title: 'Fungible Tokens | getAssetsByOwner Demo',
  description:
    'View all SPL tokens owned by a Solana wallet with balances and price info using getAssetsByOwner DAS API.',
  openGraph: {
    title: 'Fungible Tokens | getAssetsByOwner Demo',
    description: 'View all SPL tokens owned by a Solana wallet using getAssetsByOwner DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/list-wallet-assets/fungible-tokens',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I list all tokens in a Solana wallet?',
    answer:
      'Use getAssetsByOwner with showFungible: true in displayOptions. Filter the response for FungibleToken or FungibleAsset interfaces to get only fungible tokens.',
  },
  {
    question: 'How do I exclude tokens with zero balance?',
    answer:
      'Add showZeroBalance: false to displayOptions. This filters out token accounts that have been emptied but still exist on-chain.',
  },
  {
    question: 'Does the API return token prices?',
    answer:
      'Yes, price data is included in token_info.price_info for tokens with sufficient liquidity. Prices are cached with a 10-minute TTL.',
  },
];

export default function FungibleTokensPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to List Fungible Tokens in a Solana Wallet',
    headline: 'List Fungible Tokens',
    description:
      'View all SPL tokens owned by a Solana wallet with balances and price info using the getAssetsByOwner DAS API',
    url: `${BASE_URL}/list-wallet-assets/fungible-tokens`,
    keywords: ['Solana', 'SPL token', 'portfolio', 'getAssetsByOwner', 'DAS API', 'balance'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'List Fungible Tokens with Helius SDK',
    description:
      'TypeScript code example showing how to list all SPL tokens in a Solana wallet with balances and prices using the getAssetsByOwner DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.tokens.typescript,
    url: `${BASE_URL}/list-wallet-assets/fungible-tokens`,
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
        <SubNav items={GET_ASSETS_BY_OWNER_NAV_ITEMS} />

        <PageHeader
          title="Fungible Tokens"
          description={
            <>
              View all SPL tokens owned by a wallet using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAssetsByOwner</code> DAS
              API with{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">showFungible: true</code>.
              Includes balances and price data.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveFungibleTokens defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES.tokens} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Important:</strong> Set{' '}
              <code className="bg-muted px-1 rounded">showFungible: true</code> in displayOptions to
              include tokens.
            </li>
            <li>
              <strong>Interface filtering:</strong> Fungible tokens use{' '}
              <code className="bg-muted px-1 rounded">FungibleToken</code> or{' '}
              <code className="bg-muted px-1 rounded">FungibleAsset</code> interfaces.
            </li>
            <li>
              <strong>Zero balances:</strong> Use{' '}
              <code className="bg-muted px-1 rounded">showZeroBalance: false</code> to exclude
              tokens with 0 balance.
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
            <ExternalLink href="https://spl.solana.com/token">
              SPL Token Program Documentation
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

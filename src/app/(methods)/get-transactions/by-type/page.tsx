// Transactions by Type Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveFilteredTransactions } from '@/app/(methods)/get-transactions/by-type/interactive';
import { GET_TRANSACTIONS_NAV_ITEMS } from '@/app/(methods)/get-transactions/nav-items';
import { CODE_EXAMPLES } from '@/features/get-transactions';
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
  { name: 'Get Transactions', url: `${BASE_URL}/get-transactions` },
  { name: 'By Type', url: `${BASE_URL}/get-transactions/by-type` },
];

export const metadata: Metadata = {
  title: 'How to Filter Solana Transactions by Type | Swaps, Transfers, NFT Sales',
  description:
    'Learn how to filter transactions by type (TRANSFER, SWAP, NFT_SALE). Working code examples using Helius Enhanced API.',
  openGraph: {
    title: 'How to Filter Solana Transactions by Type',
    description:
      'Working code to filter transactions by SWAP, TRANSFER, NFT_SALE and more using Helius.',
    type: 'website',
  },
  alternates: {
    canonical: '/get-transactions/by-type',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I filter transactions by type on Solana?',
    answer:
      'Add the type parameter to the Helius Enhanced API request, e.g., type=SWAP for only swap transactions. You can filter by TRANSFER, SWAP, NFT_SALE, NFT_MINT, STAKE_SOL, and more.',
  },
  {
    question: 'Can I filter by DEX or marketplace source?',
    answer:
      'Yes, use the source parameter. For example, source=JUPITER for Jupiter swaps, source=MAGIC_EDEN for Magic Eden NFT transactions, or source=RAYDIUM for Raydium trades.',
  },
  {
    question: 'Can I combine type and source filters?',
    answer:
      'Yes, combine parameters like type=SWAP&source=JUPITER to get only Jupiter swap transactions. This is useful for analyzing activity on specific protocols.',
  },
];

export default function FilterByTypePage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Filter Solana Transactions by Type',
    headline: 'Filter Transactions by Type',
    description:
      'Working code examples showing how to filter transactions by SWAP, TRANSFER, NFT_SALE using Helius Enhanced API',
    url: `${BASE_URL}/get-transactions/by-type`,
    keywords: [
      'how to filter Solana transactions',
      'transaction types',
      'SWAP filter',
      'TRANSFER filter',
      'NFT_SALE',
      'Helius',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Filter Transactions by Type with Helius Enhanced API',
    description:
      'TypeScript code example showing how to filter Solana transactions by type (SWAP, TRANSFER, NFT_SALE) using the Helius Enhanced API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.filtered.typescript,
    url: `${BASE_URL}/get-transactions/by-type`,
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
        <SubNav items={GET_TRANSACTIONS_NAV_ITEMS} />

        <PageHeader
          title="How to filter transactions by type"
          description={
            <>
              Query only swaps, transfers, NFT sales, or other specific transaction types. Pass the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">type</code> parameter to the
              Helius Enhanced API.
            </>
          }
        />

        <PageSection title="Try it with different types" className="mb-8">
          <InteractiveFilteredTransactions defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Copy the code">
          <CodeTabsClient code={CODE_EXAMPLES.filtered} />
        </PageSection>

        <InfoBox title="How to use filters" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Filter by type:</strong> Add{' '}
              <code className="bg-muted px-1 rounded">type=SWAP</code> to get only swap
              transactions. Other types: TRANSFER, NFT_SALE, NFT_MINT, STAKE_SOL.
            </li>
            <li>
              <strong>Filter by source:</strong> Add{' '}
              <code className="bg-muted px-1 rounded">source=JUPITER</code> to get swaps from a
              specific DEX. Works with MAGIC_EDEN, TENSOR, RAYDIUM, etc.
            </li>
            <li>
              <strong>Combine both:</strong> Use{' '}
              <code className="bg-muted px-1 rounded">type=SWAP&source=JUPITER</code> to get only
              Jupiter swaps.
            </li>
          </ul>
        </InfoBox>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/enhanced-transactions/gettransactionsbyaddress">
              Enhanced API: getTransactionsByAddress
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/webhooks/transaction-types">
              Transaction Type Reference
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

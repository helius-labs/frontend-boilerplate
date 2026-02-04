// Recent Transactions Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { GET_TRANSACTIONS_NAV_ITEMS } from '@/app/(methods)/get-transactions/nav-items';
import { InteractiveRecentTransactions } from '@/app/(methods)/get-transactions/recent/interactive';
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
  { name: 'Recent', url: `${BASE_URL}/get-transactions/recent` },
];

export const metadata: Metadata = {
  title: 'Recent Transactions | getTransactionsForAddress Demo',
  description:
    'View recent transactions with human-readable type and description using Helius Enhanced API.',
  openGraph: {
    title: 'Recent Transactions | getTransactionsForAddress Demo',
    description: 'View recent transactions using Helius Enhanced API',
    type: 'website',
  },
  alternates: {
    canonical: '/get-transactions/recent',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I get transaction history for a Solana wallet?',
    answer:
      'Use the Helius Enhanced API endpoint /v0/addresses/{address}/transactions. It returns parsed transaction data with human-readable types like TRANSFER, SWAP, and NFT_SALE.',
  },
  {
    question: 'What transaction types are available?',
    answer:
      'Common types include TRANSFER (SOL/token transfers), SWAP (DEX trades), NFT_SALE, NFT_MINT, NFT_LISTING, STAKE_SOL, UNSTAKE_SOL, BURN, and TOKEN_MINT. See the Transaction Type Reference for the full list.',
  },
  {
    question: 'How do I load more transactions?',
    answer:
      'Use cursor-based pagination with the before parameter. Pass the signature of the last transaction to get older results. The API returns transactions in reverse chronological order.',
  },
];

export default function RecentTransactionsPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get Recent Transactions on Solana',
    headline: 'Get Recent Transactions',
    description:
      'View recent transactions for a Solana wallet with human-readable type and description using Helius Enhanced API',
    url: `${BASE_URL}/get-transactions/recent`,
    keywords: ['Solana', 'transactions', 'history', 'Enhanced API', 'Helius', 'wallet activity'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get Recent Transactions with Helius Enhanced API',
    description:
      'TypeScript code example showing how to fetch recent wallet transactions with human-readable types and descriptions using the Helius Enhanced API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.recent.typescript,
    url: `${BASE_URL}/get-transactions/recent`,
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
          title="Recent Transactions"
          description={
            <>
              View recent transactions with human-readable type and description using the{' '}
              <strong>Helius Enhanced API</strong>. Returns parsed transaction data with type
              classification (TRANSFER, SWAP, NFT_SALE, etc.) and descriptions.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveRecentTransactions defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES.recent} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Enhanced API:</strong> Returns human-readable data with type classification,
              descriptions, and parsed transfer details.
            </li>
            <li>
              <strong>Transaction types:</strong> TRANSFER, SWAP, NFT_SALE, NFT_MINT, STAKE_SOL,
              UNSTAKE_SOL, BURN, TOKEN_MINT, and more.
            </li>
            <li>
              <strong>Pagination:</strong> Use{' '}
              <code className="bg-muted px-1 rounded">before-signature</code> to load older
              transactions.
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

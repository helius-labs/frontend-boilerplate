// Paginated Transactions Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { GET_TRANSACTIONS_NAV_ITEMS } from '@/app/(methods)/get-transactions/nav-items';
import { InteractivePaginatedTransactions } from '@/app/(methods)/get-transactions/paginated/interactive';
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
import { ExternalLink, Link } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { PageSection } from '@/shared/ui/page-section';
import { SubNav } from '@/shared/ui/sub-nav';

// Preset example wallet
const EXAMPLE_WALLET = '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Transactions', url: `${BASE_URL}/get-transactions` },
  { name: 'Paginated', url: `${BASE_URL}/get-transactions/paginated` },
];

export const metadata: Metadata = {
  title: 'Paginated History | getTransactionsForAddress Demo',
  description: 'Browse full transaction history with keyset pagination using Helius RPC method.',
  openGraph: {
    title: 'Paginated History | getTransactionsForAddress Demo',
    description: 'Browse transaction history with keyset pagination using Helius RPC',
    type: 'website',
  },
  alternates: {
    canonical: '/get-transactions/paginated',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'What is keyset pagination?',
    answer:
      'Keyset pagination uses a cursor token instead of page numbers. Pass the paginationToken from the response to get the next page. This is more efficient than offset pagination for large datasets.',
  },
  {
    question: 'How many transactions can I fetch per page?',
    answer:
      'With transactionDetails set to "signatures", you can fetch up to 1000 transactions per page. This is ideal for indexing full wallet history.',
  },
  {
    question: 'When should I use RPC pagination vs Enhanced API?',
    answer:
      'Use RPC pagination for indexing or analytics where you need raw data fast. Use the Enhanced API for user-facing activity feeds where you need parsed transaction types and descriptions.',
  },
];

export default function PaginatedPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Paginate Transaction History on Solana',
    headline: 'Paginated Transaction History',
    description: 'Browse full transaction history with keyset pagination using Helius RPC method',
    url: `${BASE_URL}/get-transactions/paginated`,
    keywords: ['Solana', 'transactions', 'pagination', 'history', 'RPC', 'keyset pagination'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Paginate Transaction History with Helius RPC',
    description:
      'TypeScript code example showing how to efficiently paginate through full transaction history using keyset pagination with the Helius RPC method.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.paginated.typescript,
    url: `${BASE_URL}/get-transactions/paginated`,
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
          title="Paginated History"
          description={
            <>
              Browse full transaction history with efficient keyset pagination using the{' '}
              <strong>Helius RPC method</strong>. Best for indexing or loading large histories with
              up to 1000 transactions per page.
            </>
          }
        />

        {/* Info about RPC vs Enhanced API */}
        <div className="mb-8 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
          <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">RPC vs Enhanced API</h3>
          <p className="text-sm text-muted-foreground">
            This uses the RPC{' '}
            <code className="bg-muted px-1 rounded">getTransactionsForAddress</code> method which
            returns raw signature data with keyset pagination tokens. It&apos;s faster and supports
            larger page sizes than the Enhanced API, but doesn&apos;t include parsed transaction
            types or descriptions.
          </p>
        </div>

        <PageSection title="Try It" className="mb-8">
          <InteractivePaginatedTransactions defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES.paginated} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Keyset pagination:</strong> Use the{' '}
              <code className="bg-muted px-1 rounded">paginationToken</code> from the response to
              fetch the next page efficiently.
            </li>
            <li>
              <strong>Page size:</strong> With{' '}
              <code className="bg-muted px-1 rounded">
                transactionDetails: &quot;signatures&quot;
              </code>
              , you can request up to 1000 transactions per page.
            </li>
            <li>
              <strong>Use case:</strong> Ideal for indexing full wallet history or analytics. For
              user-facing activity feeds, prefer the{' '}
              <Link href="/get-transactions/recent" className="text-primary hover:underline">
                Enhanced API
              </Link>
              .
            </li>
          </ul>
        </InfoBox>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/rpc/http/gettransactionsforaddress">
              RPC Method: getTransactionsForAddress
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/rpc/pagination">
              Helius Pagination Guide
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

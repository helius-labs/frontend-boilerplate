// Get Transactions Overview Page
// Links to sub-pages for each use case
import {
  BASE_URL,
  JsonLdMultiple,
  createFAQSchema,
  createWebPageSchema,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { InfoBox } from '@/shared/ui/info-box';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { MethodComparison } from '@/shared/ui/method-comparison';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { SubNav } from '@/shared/ui/sub-nav';
import { GET_TRANSACTIONS_NAV_ITEMS } from './nav-items';

const FAQ_ITEMS = [
  {
    question: 'Which API should I use?',
    answer:
      'Use the Enhanced API for user-facing transaction feeds with human-readable descriptions like "Swapped 10 SOL for USDC" and parsed type classification. Use the RPC method (getTransactionsForAddress) for indexing or analytics with efficient keyset pagination over wallets with thousands of transactions. The Enhanced API classifies transactions into types like TRANSFER, SWAP, NFT_SALE, NFT_MINT, and STAKE_SOL.',
  },
];

export default function GetTransactionsPage() {
  const jsonLdData = createWebPageSchema({
    name: 'How to Get Transaction History on Solana',
    description:
      "Fetch recent transactions, filter by type (swaps, transfers, NFT sales), or paginate through a wallet's full history.",
    url: `${BASE_URL}/get-transactions`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Get Transactions', url: `${BASE_URL}/get-transactions` },
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[jsonLdData, createFAQSchema(FAQ_ITEMS)]} />
      <PageContainer>
        <Breadcrumb />
        <SubNav items={GET_TRANSACTIONS_NAV_ITEMS} />

        <PageHeader
          title="How to get transaction history on Solana"
          description={
            <>
              Fetch recent transactions, filter by type (swaps, transfers, NFT sales), or paginate
              through a wallet&apos;s full history.
            </>
          }
          path="/get-transactions"
        />

        {/* Overview section */}
        <MethodComparison
          title="Which API should I use?"
          description="Use the Enhanced API for user-facing transaction feeds with human-readable descriptions. Use the RPC method for indexing or analytics with efficient keyset pagination."
          items={[
            {
              title: 'Show recent activity',
              description:
                'Enhanced API returns parsed transactions with type labels like "Swapped 10 SOL for USDC" ready to display.',
            },
            {
              title: 'Filter by type',
              description:
                'Query only SWAP, TRANSFER, NFT_SALE, NFT_MINT, STAKE_SOL, or other specific transaction types.',
            },
            {
              title: 'Paginate full history',
              description:
                'Use keyset pagination for wallets with thousands of transactions. Efficient for indexing and analytics.',
            },
          ]}
        />

        {/* API notes */}
        <InfoBox title="API Notes">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Enhanced API:</strong> Best for user-facing transaction feeds. Returns parsed
              data with type classification and human-readable descriptions.
            </li>
            <li>
              <strong>RPC Method:</strong> Best for indexing or analytics. Supports efficient keyset
              pagination for wallets with 1000s of transactions.
            </li>
            <li>
              <strong>Transaction types:</strong> Enhanced API classifies transactions into types
              like TRANSFER, SWAP, NFT_SALE, NFT_MINT, STAKE_SOL and more.
            </li>
            <li>
              <strong>Rate limits:</strong> Both endpoints share the same rate limits. Use
              appropriate caching and pagination to avoid hitting limits.
            </li>
          </ul>
        </InfoBox>

        {/* Documentation links */}
        <LearnMoreBox>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/enhanced-transactions/gettransactionsbyaddress">
              Enhanced API: getTransactionsByAddress
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/rpc/http/gettransactionsforaddress">
              RPC Method: getTransactionsForAddress
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

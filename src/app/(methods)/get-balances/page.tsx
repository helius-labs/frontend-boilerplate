// Get Balance Overview Page
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
import { GET_BALANCE_NAV_ITEMS } from './nav-items';

const FAQ_ITEMS = [
  {
    question: 'Which method should I use?',
    answer:
      'Choose the right approach based on what you need. Use getBalance for the fastest way to check native SOL (returns lamports which you divide by 1e9). Use getAssetsByOwner with showNativeBalance to get all tokens plus SOL in one call with metadata and prices. Use getTokenAccounts filtered by mint to check a specific SPL token like USDC, USDT, or any other token efficiently.',
  },
];

export default function GetBalancePage() {
  const jsonLdData = createWebPageSchema({
    name: 'How to Get Wallet Balance on Solana',
    description:
      'Fetch SOL balance, all token holdings, or check a specific token. Copy the code snippets to use in your own project.',
    url: `${BASE_URL}/get-balances`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Get Balances', url: `${BASE_URL}/get-balances` },
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[jsonLdData, createFAQSchema(FAQ_ITEMS)]} />
      <PageContainer>
        <Breadcrumb />
        <SubNav items={GET_BALANCE_NAV_ITEMS} />

        <PageHeader
          title="How to get wallet balances on Solana"
          description="Fetch SOL balance, all token holdings, or check a specific token. Copy the code snippets below to use in your own project."
        />

        {/* Overview section */}
        <MethodComparison
          title="Which method should I use?"
          description="Choose the right approach based on what you need. Each method below includes working code you can copy directly into your project."
          items={[
            {
              title: 'Just SOL balance',
              description: (
                <>
                  Use <code className="bg-muted px-1 rounded">getBalance</code> for the fastest way
                  to check native SOL. Returns lamports which you divide by 1e9.
                </>
              ),
            },
            {
              title: 'All tokens + SOL',
              description: (
                <>
                  Use <code className="bg-muted px-1 rounded">getAssetsByOwner</code> with{' '}
                  <code className="bg-muted px-1 rounded">showNativeBalance</code> to get everything
                  in one call with metadata and prices.
                </>
              ),
            },
            {
              title: 'One specific token',
              description: (
                <>
                  Use <code className="bg-muted px-1 rounded">getTokenAccounts</code> filtered by
                  mint to check USDC, USDT, or any SPL token balance efficiently.
                </>
              ),
            },
          ]}
        />

        {/* API notes */}
        <InfoBox title="API Notes">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>getBalance:</strong> Standard RPC method. Returns lamports (1 SOL = 1 billion
              lamports). Divide by <code className="text-xs bg-muted px-1 rounded">1e9</code> for
              SOL.
            </li>
            <li>
              <strong>getAssetsByOwner:</strong> DAS API returns all tokens with metadata. Enable{' '}
              <code className="text-xs bg-muted px-1 rounded">showNativeBalance: true</code> for
              SOL.
            </li>
            <li>
              <strong>getTokenAccounts:</strong> DAS API filtered by mint address. Best for checking
              specific token holdings without fetching all assets.
            </li>
          </ul>
        </InfoBox>

        {/* Documentation links */}
        <LearnMoreBox>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/rpc/guides/getbalance">
              Helius getBalance Guide
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/getassetsbyowner">
              getAssetsByOwner API Reference
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/gettokenaccounts">
              getTokenAccounts API Reference
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

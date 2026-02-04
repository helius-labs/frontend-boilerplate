// Specific Token Balance Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { GET_BALANCE_NAV_ITEMS } from '@/app/(methods)/get-balances/nav-items';
import { InteractiveTokenBalance } from '@/app/(methods)/get-balances/specific-token/interactive';
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

// Preset example addresses
const EXAMPLE_WALLET = '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY';
const EXAMPLE_USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Balances', url: `${BASE_URL}/get-balances` },
  { name: 'Specific Token', url: `${BASE_URL}/get-balances/specific-token` },
];

export const metadata: Metadata = {
  title: 'Specific Token Balance | getBalance Demo',
  description:
    'Get balance of a specific token using getTokenAccounts DAS API. Filter by mint address to check holdings of any SPL token.',
  openGraph: {
    title: 'Specific Token Balance | getBalance Demo',
    description: 'Get balance of a specific token using getTokenAccounts DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/get-balances/specific-token',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I check if a wallet holds a specific token?',
    answer:
      'Use the getTokenAccounts DAS API with both the owner (wallet) address and the mint (token) address. If the response contains token_accounts, the wallet holds that token.',
  },
  {
    question: 'What is a mint address?',
    answer:
      'A mint address is the unique identifier for a token on Solana. For example, USDC has mint address EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v. You need this to query a specific token balance.',
  },
  {
    question: 'Why use getTokenAccounts instead of getAssetsByOwner?',
    answer:
      'getTokenAccounts is more efficient when you only need one specific token. getAssetsByOwner fetches all tokens which uses more bandwidth if you only care about checking USDC or another single token.',
  },
];

export default function SpecificTokenPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get Specific Token Balance on Solana',
    headline: 'Get Specific Token Balance',
    description:
      'Get balance of a specific SPL token for a Solana wallet using the getTokenAccounts DAS API',
    url: `${BASE_URL}/get-balances/specific-token`,
    keywords: ['Solana', 'SPL token', 'balance', 'getTokenAccounts', 'DAS API', 'USDC'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get Specific Token Balance with Helius SDK',
    description:
      'TypeScript code example showing how to check a specific SPL token balance using the getTokenAccounts DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['specific-token'].typescript,
    url: `${BASE_URL}/get-balances/specific-token`,
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
          title="Specific Token Balance"
          description={
            <>
              Get the balance of a specific SPL token using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getTokenAccounts</code> DAS
              API. Perfect for checking holdings of USDC, USDT, or any other token by mint address.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveTokenBalance
            defaultWalletAddress={EXAMPLE_WALLET}
            defaultMintAddress={EXAMPLE_USDC_MINT}
          />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES['specific-token']} />
        </PageSection>

        <InfoBox title="Common Token Mints" className="mt-8 mb-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Wrapped SOL</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                So11111111111111111111111111111111111111112
              </code>
            </div>
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

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/gettokenaccounts">
              getTokenAccounts API Reference
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

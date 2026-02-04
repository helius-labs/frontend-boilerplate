// All NFTs Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveNFTs } from '@/app/(methods)/list-wallet-assets/all-nfts/interactive';
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
  { name: 'All NFTs', url: `${BASE_URL}/list-wallet-assets/all-nfts` },
];

export const metadata: Metadata = {
  title: 'All NFTs | getAssetsByOwner Demo',
  description:
    'View all NFTs owned by a Solana wallet including standard and programmable NFTs using getAssetsByOwner DAS API.',
  openGraph: {
    title: 'All NFTs | getAssetsByOwner Demo',
    description: 'View all NFTs owned by a Solana wallet using getAssetsByOwner DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/list-wallet-assets/all-nfts',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I list all NFTs in a Solana wallet?',
    answer:
      'Use the getAssetsByOwner DAS API with the wallet address. Filter the response for NFT interfaces like V1_NFT, V2_NFT, and ProgrammableNFT to get only NFTs.',
  },
  {
    question: 'What is the difference between V1_NFT and ProgrammableNFT?',
    answer:
      'V1_NFT is the original Metaplex standard. ProgrammableNFT (pNFT) adds on-chain rules like enforced royalties. Both are returned by getAssetsByOwner - check the interface field to distinguish them.',
  },
  {
    question: 'How do I get faster image loading for NFTs?',
    answer:
      'Use the cdn_uri field instead of the raw uri. Helius provides CDN-cached images that load faster and more reliably than fetching directly from IPFS or Arweave.',
  },
];

export default function AllNftsPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to List All NFTs in a Solana Wallet',
    headline: 'List All NFTs',
    description:
      'View all NFTs owned by a Solana wallet including standard and programmable NFTs using the getAssetsByOwner DAS API',
    url: `${BASE_URL}/list-wallet-assets/all-nfts`,
    keywords: ['Solana', 'NFT', 'portfolio', 'getAssetsByOwner', 'DAS API', 'collection'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'List All NFTs with Helius SDK',
    description:
      'TypeScript code example showing how to list all NFTs in a Solana wallet including standard NFTs and pNFTs using the getAssetsByOwner DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.nfts.typescript,
    url: `${BASE_URL}/list-wallet-assets/all-nfts`,
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
          title="All NFTs"
          description={
            <>
              View all NFTs owned by a wallet using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAssetsByOwner</code> DAS
              API. Includes standard NFTs, programmable NFTs (pNFTs), and collection metadata.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveNFTs defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES.nfts} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Interface filtering:</strong> NFTs use interfaces like{' '}
              <code className="bg-muted px-1 rounded">V1_NFT</code>,{' '}
              <code className="bg-muted px-1 rounded">ProgrammableNFT</code>,{' '}
              <code className="bg-muted px-1 rounded">V2_NFT</code>.
            </li>
            <li>
              <strong>CDN images:</strong> Prefer{' '}
              <code className="bg-muted px-1 rounded">cdn_uri</code> over raw{' '}
              <code className="bg-muted px-1 rounded">uri</code> for faster image loading.
            </li>
            <li>
              <strong>Pagination:</strong> Use <code className="bg-muted px-1 rounded">page</code>{' '}
              and <code className="bg-muted px-1 rounded">limit</code> for wallets with many assets.
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
            <ExternalLink href="https://www.helius.dev/docs/das-api">
              Helius DAS API Overview
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

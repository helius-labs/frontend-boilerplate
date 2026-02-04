// NFT Metadata Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { GET_ASSET_NAV_ITEMS } from '@/app/(methods)/get-assets/nav-items';
import { InteractiveNftMetadata } from '@/app/(methods)/get-assets/nft-metadata/interactive';
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

// Preset example: Mad Lads #8420
const EXAMPLE_NFT = 'F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Assets', url: `${BASE_URL}/get-assets` },
  { name: 'NFT Metadata', url: `${BASE_URL}/get-assets/nft-metadata` },
];

export const metadata: Metadata = {
  title: 'NFT Metadata | getAsset Demo',
  description:
    'Get NFT metadata including image, attributes, collection, and creator info using the getAsset DAS API.',
  openGraph: {
    title: 'NFT Metadata | getAsset Demo',
    description: 'Get NFT metadata using the getAsset DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/get-assets/nft-metadata',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I get NFT metadata on Solana?',
    answer:
      'Use the getAsset DAS API with the NFT mint address. It returns metadata including name, image, attributes, collection info, royalties, and creator details in a single call.',
  },
  {
    question: 'What is the difference between standard NFTs and pNFTs?',
    answer:
      'Programmable NFTs (pNFTs) have additional on-chain rules enforced by the Token Metadata program, like royalty enforcement. The getAsset API handles both types - check the interface field to distinguish them.',
  },
  {
    question: 'How do I get collection information for an NFT?',
    answer:
      'Include showCollectionMetadata: true in displayOptions. The collection info will appear in the grouping array with group_key set to "collection".',
  },
];

export default function NftMetadataPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get NFT Metadata on Solana',
    headline: 'Get NFT Metadata',
    description:
      'Get NFT metadata including image, attributes, collection, and creator info using the getAsset DAS API',
    url: `${BASE_URL}/get-assets/nft-metadata`,
    keywords: ['Solana', 'NFT', 'metadata', 'getAsset', 'DAS API', 'collection'],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get NFT Metadata with Helius SDK',
    description:
      'TypeScript code example showing how to fetch NFT metadata including image, attributes, and collection info using the getAsset DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['nft-metadata'].typescript,
    url: `${BASE_URL}/get-assets/nft-metadata`,
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
          title="NFT Metadata"
          description={
            <>
              Get NFT metadata using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAsset</code> DAS API.
              Returns image, attributes, collection info, royalties, and creator details.
            </>
          }
        />

        <PageSection title="Try It" className="mb-8">
          <InteractiveNftMetadata defaultAssetId={EXAMPLE_NFT} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES['nft-metadata']} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Collection metadata:</strong> Include{' '}
              <code className="bg-muted px-1 rounded">showCollectionMetadata: true</code> to get
              collection name, image, and verification status.
            </li>
            <li>
              <strong>Unverified collections:</strong> Use{' '}
              <code className="bg-muted px-1 rounded">showUnverifiedCollections: true</code> if you
              want to see unverified collection groupings.
            </li>
            <li>
              <strong>Token types:</strong> This endpoint handles standard NFTs, programmable NFTs
              (pNFTs), and legacy SPL tokens.
            </li>
          </ul>
        </InfoBox>

        <FAQ items={FAQ_ITEMS} className="mt-8" />

        <LearnMoreBox className="mt-6">
          <li>
            <ExternalLink href="https://www.helius.dev/docs/api-reference/das/getasset">
              Helius getAsset API Reference
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

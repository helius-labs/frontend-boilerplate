// Compressed NFT Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveCompressedNft } from '@/app/(methods)/get-assets/compressed-nft/interactive';
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
import { ExternalLink, Link } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { PageSection } from '@/shared/ui/page-section';
import { SubNav } from '@/shared/ui/sub-nav';

// Example compressed NFT from Bubblegum program
const EXAMPLE_CNFT = 'JAxiVxHommDr7WeHjazRxPp5gqZvQFcqYhCYhhi3X3hE';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Get Assets', url: `${BASE_URL}/get-assets` },
  { name: 'Compressed NFT', url: `${BASE_URL}/get-assets/compressed-nft` },
];

export const metadata: Metadata = {
  title: 'How to Get Compressed NFT Metadata | Solana',
  description:
    'Learn how to fetch compressed NFT (cNFT) metadata including Merkle tree details. Working code examples using the Helius DAS API.',
  openGraph: {
    title: 'How to Get Compressed NFT Metadata | Solana',
    description:
      'Working code to fetch cNFT metadata including Merkle tree details using Helius DAS API.',
    type: 'website',
  },
  alternates: {
    canonical: '/get-assets/compressed-nft',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'What is a compressed NFT (cNFT)?',
    answer:
      'Compressed NFTs use Solana state compression to store NFT data off-chain in a Merkle tree, reducing minting costs by up to 1000x. They have the same metadata as regular NFTs but use asset IDs instead of mint addresses.',
  },
  {
    question: 'How do I find a compressed NFT asset ID?',
    answer:
      'Use getAssetsByOwner to list all cNFTs in a wallet. The asset ID is returned in the response. You can also find asset IDs from platforms like DRiP (drip.haus) or Helium.',
  },
  {
    question: 'Can I use the same API for regular and compressed NFTs?',
    answer:
      'Yes, getAsset works for both. For compressed NFTs, pass the asset ID instead of a mint address. Check compression.compressed in the response to identify cNFTs.',
  },
];

export default function CompressedNftPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Get Compressed NFT Metadata on Solana',
    headline: 'Get Compressed NFT Metadata',
    description:
      'Working code examples showing how to fetch cNFT metadata including Merkle tree details using the Helius DAS API',
    url: `${BASE_URL}/get-assets/compressed-nft`,
    keywords: [
      'how to get compressed NFT metadata',
      'cNFT Solana',
      'getAsset',
      'DAS API',
      'Merkle tree',
      'Helius',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'Get Compressed NFT Metadata with Helius SDK',
    description:
      'TypeScript code example showing how to fetch compressed NFT (cNFT) metadata including Merkle tree details using the getAsset DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES['compressed-nft'].typescript,
    url: `${BASE_URL}/get-assets/compressed-nft`,
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
          title="How to get compressed NFT metadata"
          description={
            <>
              Use <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAsset</code> to fetch
              cNFT images, attributes, and compression details. Same API as standard NFTs, just pass
              the asset ID instead of a mint.
            </>
          }
        />

        {/* Note about cNFT IDs */}
        <div className="mb-8 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
          <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
            How do I find the asset ID?
          </h3>
          <p className="text-sm text-muted-foreground">
            Compressed NFTs use <strong>asset IDs</strong> instead of mint addresses. These are
            derived from the Merkle tree and don&apos;t exist as on-chain accounts. Use{' '}
            <Link
              href="/list-wallet-assets/compressed-nfts"
              className="text-primary hover:underline"
            >
              getAssetsByOwner
            </Link>{' '}
            to list cNFTs in a wallet, or find IDs from DRiP, Helium, or other cNFT platforms.
          </p>
        </div>

        <PageSection title="Try it with any cNFT" className="mb-8">
          <InteractiveCompressedNft defaultAssetId={EXAMPLE_CNFT} />
        </PageSection>

        <PageSection title="Copy the code">
          <CodeTabsClient code={CODE_EXAMPLES['compressed-nft']} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Asset ID vs Mint:</strong> Compressed NFTs don&apos;t have mint accounts. The
              asset ID is a virtual identifier derived from the Merkle tree.
            </li>
            <li>
              <strong>Compression fields:</strong> Look for{' '}
              <code className="bg-muted px-1 rounded">compression.compressed = true</code> to
              confirm it&apos;s a cNFT. The tree address, leaf ID, and data hash are all
              compression-specific.
            </li>
            <li>
              <strong>Popular cNFT sources:</strong> DRiP (drip.haus), Helium Mobile, and various
              gaming projects use cNFTs.
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
            <ExternalLink href="https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana">
              Compression on Solana
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://solana.com/developers/guides/javascript/compressed-nfts">
              Solana Compressed NFTs Guide
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

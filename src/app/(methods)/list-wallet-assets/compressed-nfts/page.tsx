// Compressed NFTs Sub-Page
// Server-side rendered with preset example data
import { Metadata } from 'next';
import { InteractiveCompressedNFTs } from '@/app/(methods)/list-wallet-assets/compressed-nfts/interactive';
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
import { ExternalLink, Link } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { PageSection } from '@/shared/ui/page-section';
import { SubNav } from '@/shared/ui/sub-nav';

// Preset example wallet
const EXAMPLE_WALLET = '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY';

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'List Wallet Assets', url: `${BASE_URL}/list-wallet-assets` },
  { name: 'Compressed NFTs', url: `${BASE_URL}/list-wallet-assets/compressed-nfts` },
];

export const metadata: Metadata = {
  title: 'Compressed NFTs | getAssetsByOwner Demo',
  description:
    'View all compressed NFTs (cNFTs) owned by a Solana wallet using getAssetsByOwner DAS API.',
  openGraph: {
    title: 'Compressed NFTs | getAssetsByOwner Demo',
    description: 'View all compressed NFTs owned by a Solana wallet using getAssetsByOwner DAS API',
    type: 'website',
  },
  alternates: {
    canonical: '/list-wallet-assets/compressed-nfts',
  },
};

// FAQ items for this page
const FAQ_ITEMS = [
  {
    question: 'How do I list only compressed NFTs in a wallet?',
    answer:
      'Use getAssetsByOwner and filter the response for items where compression.compressed === true. This separates cNFTs from standard NFTs.',
  },
  {
    question: 'Where do compressed NFTs come from?',
    answer:
      'Popular cNFT sources include DRiP (drip.haus) for art drops, Helium Mobile for subscriber NFTs, and various gaming projects. They use Solana state compression to reduce minting costs.',
  },
  {
    question: 'How do I get details for a specific compressed NFT?',
    answer:
      'Use the asset ID from getAssetsByOwner with the getAsset method. Unlike regular NFTs, cNFTs use virtual asset IDs derived from the Merkle tree, not mint addresses.',
  },
];

export default function CompressedNftsPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to List Compressed NFTs in a Solana Wallet',
    headline: 'List Compressed NFTs',
    description:
      'View all compressed NFTs (cNFTs) owned by a Solana wallet using the getAssetsByOwner DAS API',
    url: `${BASE_URL}/list-wallet-assets/compressed-nfts`,
    keywords: [
      'Solana',
      'compressed NFT',
      'cNFT',
      'portfolio',
      'getAssetsByOwner',
      'DAS API',
      'state compression',
    ],
  });

  const faqSchema = createFAQSchema(FAQ_ITEMS);

  const codeExampleSchema = createCodeExampleSchema({
    name: 'List Compressed NFTs with Helius SDK',
    description:
      'TypeScript code example showing how to list all compressed NFTs (cNFTs) in a Solana wallet using the getAssetsByOwner DAS API.',
    programmingLanguage: 'TypeScript',
    codeText: CODE_EXAMPLES.compressed.typescript,
    url: `${BASE_URL}/list-wallet-assets/compressed-nfts`,
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
          title="Compressed NFTs"
          description={
            <>
              View all compressed NFTs (cNFTs) owned by a wallet using the{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">getAssetsByOwner</code> DAS
              API. Filter by{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                compression.compressed === true
              </code>
              .
            </>
          }
        />

        {/* Info about cNFTs */}
        <div className="mb-8 p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
          <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
            About Compressed NFTs
          </h3>
          <p className="text-sm text-muted-foreground">
            Compressed NFTs (cNFTs) use Solana&apos;s state compression to store NFT data off-chain
            in a Merkle tree, dramatically reducing minting costs. Popular sources include DRiP
            (drip.haus), Helium Mobile, and various gaming projects.
          </p>
        </div>

        <PageSection title="Try It" className="mb-8">
          <InteractiveCompressedNFTs defaultAddress={EXAMPLE_WALLET} />
        </PageSection>

        <PageSection title="Code Example">
          <CodeTabsClient code={CODE_EXAMPLES.compressed} />
        </PageSection>

        <InfoBox title="API Tips" className="mt-8 mb-0">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Identifying cNFTs:</strong> Check{' '}
              <code className="bg-muted px-1 rounded">compression.compressed === true</code> in the
              response to identify compressed NFTs.
            </li>
            <li>
              <strong>Compression data:</strong> The{' '}
              <code className="bg-muted px-1 rounded">compression</code> object includes{' '}
              <code className="bg-muted px-1 rounded">tree</code> (Merkle tree address) and{' '}
              <code className="bg-muted px-1 rounded">leaf_id</code> (position in tree).
            </li>
            <li>
              <strong>Asset IDs:</strong> Unlike standard NFTs, cNFTs use virtual asset IDs, not
              mint addresses. Use these IDs with{' '}
              <Link href="/get-assets/compressed-nft" className="text-primary hover:underline">
                getAsset
              </Link>{' '}
              to get full details.
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
            <ExternalLink href="https://www.helius.dev/blog/solana-nft-compression">
              Understanding Compressed NFTs
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

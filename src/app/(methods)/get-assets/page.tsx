// Get Asset Overview Page
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
import { GET_ASSET_NAV_ITEMS } from './nav-items';

const FAQ_ITEMS = [
  {
    question: 'What can I look up?',
    answer:
      'The Helius getAsset method returns parsed metadata for any Solana asset. You can fetch NFT metadata (image URL, attributes, collection, royalties, and creators for standard NFTs and pNFTs), fungible token info (supply, decimals, token program, and real-time USD price for tokens like USDC, JUP, or BONK), and compressed NFTs (same metadata as standard NFTs, using the asset ID from the Merkle tree instead of a mint address).',
  },
];

export default function GetAssetPage() {
  const jsonLdData = createWebPageSchema({
    name: 'How to Get NFT and Token Metadata on Solana',
    description:
      'Fetch images, attributes, prices, and metadata for any NFT or token. One API call works for standard NFTs, compressed NFTs, and fungible tokens.',
    url: `${BASE_URL}/get-assets`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Get Assets', url: `${BASE_URL}/get-assets` },
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[jsonLdData, createFAQSchema(FAQ_ITEMS)]} />
      <PageContainer>
        <Breadcrumb />
        <SubNav items={GET_ASSET_NAV_ITEMS} />

        <PageHeader
          title="How to get token and NFT metadata on Solana"
          description="Fetch images, attributes, prices, and metadata for any NFT or token. One API call works for standard NFTs, compressed NFTs, and fungible tokens."
        />

        {/* Overview section */}
        <MethodComparison
          title="What can I look up?"
          description={
            <>
              The Helius <code className="bg-muted px-1 rounded text-sm">getAsset</code> method
              returns parsed metadata for any Solana asset. No need to decode accounts or fetch
              off-chain JSON yourself.
            </>
          }
          items={[
            {
              title: 'NFT metadata',
              description:
                'Get image URL, attributes, collection, royalties, and creators. Works with standard NFTs and pNFTs.',
            },
            {
              title: 'Token info + price',
              description:
                'Get supply, decimals, token program, and real-time USD price for fungible tokens like USDC, JUP, or BONK.',
            },
            {
              title: 'Compressed NFTs',
              description:
                'Same metadata as standard NFTs. Pass the asset ID from the Merkle tree instead of a mint address.',
            },
          ]}
        />

        {/* API tips */}
        <InfoBox title="API Tips">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>Fungible tokens:</strong> Always include{' '}
              <code className="bg-muted px-1 rounded">showFungible: true</code> in displayOptions to
              get token details.
            </li>
            <li>
              <strong>Compressed NFTs:</strong> Use the asset ID (from Merkle tree), not a mint
              address. Find cNFT IDs via{' '}
              <code className="bg-muted px-1 rounded">getAssetsByOwner</code>.
            </li>
            <li>
              <strong>Price data:</strong> Cached with 10-minute TTL. Not available for all tokens.
            </li>
          </ul>
        </InfoBox>

        {/* Documentation links */}
        <LearnMoreBox>
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
          <li>
            <ExternalLink href="https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana">
              Compression on Solana
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

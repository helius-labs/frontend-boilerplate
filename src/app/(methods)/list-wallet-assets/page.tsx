// Get Assets By Owner Overview Page
// Links to sub-pages for each use case
import { BASE_URL, JsonLd, createWebPageSchema } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { InfoBox } from '@/shared/ui/info-box';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { MethodComparison } from '@/shared/ui/method-comparison';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { SubNav } from '@/shared/ui/sub-nav';
import { GET_ASSETS_BY_OWNER_NAV_ITEMS } from './nav-items';

export default function GetAssetsByOwnerPage() {
  const jsonLdData = createWebPageSchema({
    name: 'How to List All NFTs and Tokens in a Wallet',
    description:
      'Fetch every asset owned by a Solana address in one API call. Returns NFTs, fungible tokens, and compressed NFTs with full metadata.',
    url: `${BASE_URL}/list-wallet-assets`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'List Wallet Assets', url: `${BASE_URL}/list-wallet-assets` },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PageContainer>
        <Breadcrumb />
        <SubNav items={GET_ASSETS_BY_OWNER_NAV_ITEMS} />

        <PageHeader
          title="How to list all NFTs and tokens in a wallet"
          description="Fetch every asset owned by a Solana address in one API call. Returns NFTs, fungible tokens, and compressed NFTs with full metadata."
        />

        {/* Overview section */}
        <MethodComparison
          title="How does it work?"
          description={
            <>
              Call <code className="bg-muted px-1 rounded text-sm">getAssetsByOwner</code> with a
              wallet address to get all assets with parsed metadata, images, and prices. Filter by
              type using the <code className="bg-muted px-1 rounded text-sm">interface</code>{' '}
              parameter.
            </>
          }
          items={[
            {
              title: 'List all NFTs',
              description: (
                <>
                  Filter by <code className="bg-muted px-1 rounded">V1_NFT</code> or{' '}
                  <code className="bg-muted px-1 rounded">ProgrammableNFT</code>. Returns images via
                  CDN for fast loading.
                </>
              ),
            },
            {
              title: 'List token holdings',
              description: (
                <>
                  Set <code className="bg-muted px-1 rounded">showFungible: true</code> to include
                  SPL tokens with balances, decimals, and USD prices.
                </>
              ),
            },
            {
              title: 'Include cNFTs',
              description: (
                <>
                  Compressed NFTs from DRiP, Helium, etc. are included automatically. Check{' '}
                  <code className="bg-muted px-1 rounded">compression.compressed</code> to identify
                  them.
                </>
              ),
            },
          ]}
        />

        {/* API notes */}
        <InfoBox title="API Notes">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>displayOptions.showFungible:</strong> Set to{' '}
              <code className="text-xs bg-muted px-1 rounded">true</code> to include SPL tokens in
              response
            </li>
            <li>
              <strong>Interface filtering:</strong> NFTs use{' '}
              <code className="text-xs bg-muted px-1 rounded">V1_NFT</code>,{' '}
              <code className="text-xs bg-muted px-1 rounded">ProgrammableNFT</code>; tokens use{' '}
              <code className="text-xs bg-muted px-1 rounded">FungibleToken</code>
            </li>
            <li>
              <strong>Image CDN:</strong> Prefer{' '}
              <code className="text-xs bg-muted px-1 rounded">cdn_uri</code> over raw{' '}
              <code className="text-xs bg-muted px-1 rounded">uri</code> for faster, more reliable
              image loading
            </li>
            <li>
              <strong>Compression:</strong> Check{' '}
              <code className="text-xs bg-muted px-1 rounded">compression.compressed === true</code>{' '}
              to identify cNFTs
            </li>
          </ul>
        </InfoBox>

        {/* Documentation links */}
        <LearnMoreBox>
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
          <li>
            <ExternalLink href="https://www.helius.dev/blog/solana-nft-compression">
              Understanding Compressed NFTs
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

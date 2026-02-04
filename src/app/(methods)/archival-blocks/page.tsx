import { Metadata } from 'next';
import { ArchivalBlocksDemo } from '@/features/archival-blocks';
import { ARCHIVAL_BLOCKS_CODE_EXAMPLES } from '@/features/archival-blocks/lib/code-examples';
import {
  BASE_URL,
  JsonLdMultiple,
  createBreadcrumbSchema,
  createTechArticleSchema,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { CodeTabsClient } from '@/shared/ui/code-tabs';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { PageSection } from '@/shared/ui/page-section';
import { WarningBanner } from '@/shared/ui/warning-banner';

export const metadata: Metadata = {
  title: 'How to Fetch Historical Blocks on Solana | Solana dApp Example',
  description:
    'Learn how to fetch archival block data on Solana. View the genesis block, explore early network history, and access any historical slot.',
  openGraph: {
    title: 'How to Fetch Historical Blocks on Solana | Solana dApp Example',
    description: 'Working code to fetch the genesis block and any historical Solana data.',
    type: 'website',
  },
  alternates: {
    canonical: '/archival-blocks',
  },
};

const BREADCRUMB = [
  { name: 'Home', url: BASE_URL },
  { name: 'Archival Blocks', url: `${BASE_URL}/archival-blocks` },
];

export default function ArchivalBlocksPage() {
  const techArticleSchema = createTechArticleSchema({
    name: 'How to Fetch Historical Blocks on Solana',
    headline: 'Access Archival Solana Block Data',
    description:
      'Learn how to fetch archival block data on Solana. View the genesis block, explore early network history, and access any historical slot.',
    url: `${BASE_URL}/archival-blocks`,
    keywords: [
      'Solana',
      'archival',
      'genesis block',
      'historical data',
      'getBlock',
      'Helius',
      'slot',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[techArticleSchema, createBreadcrumbSchema(BREADCRUMB)]} />
      <PageContainer>
        <Breadcrumb />

        <PageHeader
          title="How to fetch historical blocks on Solana"
          description="Access archival data to retrieve any block from Solana history. See what the genesis block looked like and explore the earliest moments of the network."
        />

        {/* Why archival matters */}
        <div className="mb-8 p-4 bg-solana-purple/10 border border-solana-purple/20 rounded-lg">
          <h2 className="font-semibold mb-2">Why is archival data rare?</h2>
          <p className="text-sm text-muted-foreground">
            Most Solana RPC nodes only store recent data (last few days). Archival nodes store the
            complete blockchain history since genesis, but they require significant storage and are
            expensive to run. Helius provides archival access so you can query any historical slot.
          </p>
        </div>

        <PageSection title="Interactive Demo" className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">
            Enter any slot number or use the quick select buttons to explore historical blocks. Try
            slot 0 to see the genesis block.
          </p>
          <ArchivalBlocksDemo defaultSlot={0} />
        </PageSection>

        {/* Code examples */}
        <section className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold">Copy the code</h2>
          <p className="text-muted-foreground text-sm">
            These snippets show how to fetch historical blocks. Paste them into your project.
          </p>

          <PageSection title="1. Fetch any block by slot">
            <p className="text-sm text-muted-foreground mb-4">
              Use <code className="bg-muted px-1 rounded">getBlock</code> with a slot number to
              retrieve block data including transactions and rewards.
            </p>
            <CodeTabsClient code={ARCHIVAL_BLOCKS_CODE_EXAMPLES['get-block']} />
          </PageSection>

          <PageSection title="2. Get block with full transaction details">
            <p className="text-sm text-muted-foreground mb-4">
              Set{' '}
              <code className="bg-muted px-1 rounded">transactionDetails: &quot;full&quot;</code> to
              get complete transaction data with parsed instructions.
            </p>
            <CodeTabsClient code={ARCHIVAL_BLOCKS_CODE_EXAMPLES['block-with-txs']} />
          </PageSection>
        </section>

        {/* API notes */}
        <section className="p-4 bg-muted/50 rounded-lg mb-8">
          <h3 className="font-medium mb-2">API Notes</h3>
          <ul className="list-disc list-outside ml-5 text-sm text-muted-foreground space-y-1">
            <li>
              <strong>Archival access required:</strong> Historical blocks older than a few days
              need archival RPC nodes. Helius includes archival access on all plans.
            </li>
            <li>
              <strong>Skipped slots:</strong> Not every slot has a block. Validators may skip slots,
              returning null. Try nearby slots if one is missing.
            </li>
            <li>
              <strong>transactionDetails options:</strong> Use &quot;signatures&quot; for speed,
              &quot;full&quot; for complete data, or &quot;none&quot; for just block metadata.
            </li>
            <li>
              <strong>Block time:</strong> Very early blocks may have null blockTime as this field
              was added later.
            </li>
          </ul>
        </section>

        <WarningBanner title="About the Genesis Block" className="mb-8">
          <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
            <li>Solana mainnet launched on March 16, 2020 with the genesis block at slot 0.</li>
            <li>
              The genesis block contains initial validator configurations and system accounts.
            </li>
            <li>Unlike Bitcoin, Solana does not have a coinbase message in its genesis block.</li>
            <li>
              Early Solana blocks are historically significant for researchers and archivists.
            </li>
          </ul>
        </WarningBanner>

        <LearnMoreBox>
          <li>
            <ExternalLink href="https://solana.com/docs/rpc/http/getblock">
              Solana getBlock RPC Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.helius.dev/blog/solana-slots-blocks-and-epochs">
              Understanding Slots, Blocks, and Epochs
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.helius.dev">Helius Documentation</ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

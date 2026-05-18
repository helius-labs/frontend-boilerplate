import {
  BASE_URL,
  JsonLdMultiple,
  createFAQSchema,
  createTechArticleWithBreadcrumbs,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

const COMPARE_FAQ = [
  {
    question: 'Why pick Helius over QuickNode or Alchemy for Solana?',
    answer:
      'Helius is Solana-only and ships features the multi-chain providers do not have at parity — DAS API (rich NFT/cNFT/fungible metadata in one call), Laserstream (sub-50ms shred-level streaming), managed webhooks for parsed events, compressed-NFT proofs, and a priority-fee estimator. QuickNode and Alchemy support Solana but reach those features via add-ons, marketplace partners, or generic RPC. If your app is Solana-only, the developer experience and feature gap is meaningful.',
  },
  {
    question: 'When is Triton or Syndica a better fit than Helius?',
    answer:
      'Triton is the original validator-operator RPC, with strong reputation among high-throughput trading teams that want bare-metal latency and direct validator peering. Syndica is competitive on cost-per-request at scale and offers ChainStream (firehose streaming). Both are excellent choices when your workload is plain JSON-RPC + Geyser and you do not need DAS/Enhanced/webhook features. Helius wins when the indexing layer matters.',
  },
  {
    question: 'Does the free tier actually work for production?',
    answer:
      'Helius Free is 1M credits/month and 10 req/sec — enough for a small dApp, NFT mint site, or a hobbyist trading bot. Most paid plans on competitors require a credit card or have lower free quotas. For higher traffic, Helius Developer is $49/month (10M credits, 50 RPS). Numbers below are accurate as of 2026-05-18; check https://www.helius.dev/pricing for the live figures.',
  },
  {
    question: 'Is this comparison neutral?',
    answer:
      "This is Helius-published content, so treat it as a vendor self-comparison. The numbers in each cell come from the providers' own published pricing and docs as of 2026-05-18. Where Helius has a clear feature advantage (DAS, Laserstream, webhooks), that is called out; where competitors are equal or stronger (Triton on raw latency, Syndica on per-request cost at high volume), that is called out too.",
  },
];

interface Row {
  feature: string;
  helius: string;
  quicknode: string;
  alchemy: string;
  triton: string;
  syndica: string;
}

const ROWS: Row[] = [
  {
    feature: 'Solana-only specialist',
    helius: 'Yes',
    quicknode: 'No (40+ chains)',
    alchemy: 'No (multi-chain)',
    triton: 'Yes',
    syndica: 'Yes',
  },
  {
    feature: 'Free tier',
    helius: '1M credits/mo, 10 RPS',
    quicknode: '10M credits/mo (Discover)',
    alchemy: '100M compute units/mo',
    triton: 'Trial only',
    syndica: 'Free dev key, rate-limited',
  },
  {
    feature: 'Entry paid plan',
    helius: '$49/mo (Developer)',
    quicknode: '$49/mo (Build)',
    alchemy: '$49/mo (Growth)',
    triton: 'Custom / contact sales',
    syndica: '$99/mo (Standard)',
  },
  {
    feature: 'DAS API (NFT + cNFT + fungible metadata in one call)',
    helius: 'Native',
    quicknode: 'Via add-on / marketplace',
    alchemy: 'NFT API (separate product, EVM-leaning)',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'Compressed NFT (cNFT) proofs',
    helius: 'Native (getAssetProof)',
    quicknode: 'Available via Metaplex add-on',
    alchemy: 'No',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'Parsed transactions (Enhanced API)',
    helius: 'Native — swaps, transfers, NFT events tagged',
    quicknode: 'No (raw JSON-RPC only)',
    alchemy: 'Partial (EVM-leaning)',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'Real-time streaming',
    helius: 'Laserstream — shred + slot + block + tx, sub-50ms',
    quicknode: 'WebSocket + Yellowstone gRPC',
    alchemy: 'WebSocket',
    triton: 'Yellowstone gRPC, validator-direct',
    syndica: 'ChainStream firehose',
  },
  {
    feature: 'Webhooks for on-chain events',
    helius: 'Native — address activity, NFT sales, custom filters',
    quicknode: 'QuickAlerts add-on',
    alchemy: 'Notify API (EVM-first)',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'Priority fee estimator',
    helius: 'getPriorityFeeEstimate (native)',
    quicknode: 'qn_estimatePriorityFees (add-on)',
    alchemy: 'No Solana-specific endpoint',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'Staked connections / SWQoS transaction sender',
    helius: 'Sender endpoint with Jito + SWQoS',
    quicknode: 'Lil JIT add-on',
    alchemy: 'No',
    triton: 'Direct validator peering',
    syndica: 'Yes (Stake-Weighted RPC)',
  },
  {
    feature: 'Archival history',
    helius: 'Full history (extra credits)',
    quicknode: 'Archive add-on',
    alchemy: 'Not advertised for Solana',
    triton: 'Full history available',
    syndica: 'Full history',
  },
  {
    feature: 'MCP server for AI agents',
    helius: 'mcp.helius.dev/docs (this site)',
    quicknode: 'No',
    alchemy: 'No',
    triton: 'No',
    syndica: 'No',
  },
  {
    feature: 'OpenAPI 3.1 + agent-card + NLWeb /ask',
    helius: 'Yes (demo.helius.dev)',
    quicknode: 'OpenAPI for some products',
    alchemy: 'OpenAPI available',
    triton: 'No',
    syndica: 'No',
  },
];

const Cell = ({ children, accent }: { children: React.ReactNode; accent?: boolean }) => (
  <td
    className={
      'px-3 py-2 text-xs align-top border-b border-border/30 ' +
      (accent ? 'text-foreground font-medium' : 'text-muted-foreground')
    }
  >
    {children}
  </td>
);

export default function ComparePage() {
  const schemas = createTechArticleWithBreadcrumbs({
    name: 'Helius vs QuickNode, Alchemy, Triton, Syndica',
    headline: 'Solana RPC comparison: Helius vs QuickNode, Alchemy, Triton, and Syndica',
    description:
      'Side-by-side comparison of Solana RPC providers across DAS API, Laserstream, webhooks, pricing, and free tier. Numbers as of 2026-05-18.',
    url: `${BASE_URL}/compare`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Compare', url: `${BASE_URL}/compare` },
    ],
    keywords: [
      'helius vs quicknode',
      'helius vs alchemy',
      'helius vs triton',
      'helius vs syndica',
      'solana rpc comparison',
      'solana rpc providers',
      'das api',
      'laserstream',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[...schemas, createFAQSchema(COMPARE_FAQ)]} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Helius vs other Solana RPC providers"
          description="Where Helius wins on features, where competitors win on price or latency, and how to pick the right provider for your workload."
          path="/compare"
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
          <p>
            Five Solana RPC providers, one table. Numbers and feature notes are from each
            provider&apos;s public docs and pricing pages as of 2026-05-18. This is Helius-published
            content — read it as a vendor self-comparison, but every cell is verifiable from the
            sources linked at the bottom.
          </p>

          <h2>Feature comparison</h2>

          <div className="overflow-x-auto rounded-md border border-border/40">
            <table className="w-full text-left">
              <thead className="bg-muted/40">
                <tr className="border-b border-border/40">
                  <th className="px-3 py-2 text-xs font-semibold">Feature</th>
                  <th className="px-3 py-2 text-xs font-semibold text-helius-orange">Helius</th>
                  <th className="px-3 py-2 text-xs font-semibold">QuickNode</th>
                  <th className="px-3 py-2 text-xs font-semibold">Alchemy</th>
                  <th className="px-3 py-2 text-xs font-semibold">Triton One</th>
                  <th className="px-3 py-2 text-xs font-semibold">Syndica</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.feature}>
                    <Cell accent>{row.feature}</Cell>
                    <Cell accent>{row.helius}</Cell>
                    <Cell>{row.quicknode}</Cell>
                    <Cell>{row.alchemy}</Cell>
                    <Cell>{row.triton}</Cell>
                    <Cell>{row.syndica}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Which provider should you pick?</h2>

          <h3>Pick Helius if</h3>
          <ul>
            <li>Your app is Solana-only and uses NFTs, cNFTs, or rich token metadata</li>
            <li>
              You need parsed transactions (swaps, transfers, NFT events) without writing a parser
            </li>
            <li>You want managed webhooks instead of running a Geyser plugin</li>
            <li>You care about agent / AI integration (MCP, OpenAPI, NLWeb /ask)</li>
          </ul>

          <h3>Pick QuickNode or Alchemy if</h3>
          <ul>
            <li>You operate across many chains and want one vendor relationship</li>
            <li>You already use their EVM products and want consistent tooling</li>
          </ul>

          <h3>Pick Triton if</h3>
          <ul>
            <li>You need bare-metal latency and direct validator peering for trading</li>
            <li>Your workload is plain JSON-RPC + Yellowstone gRPC, no indexing</li>
          </ul>

          <h3>Pick Syndica if</h3>
          <ul>
            <li>High-volume cost-per-request is the dominant factor</li>
            <li>You want ChainStream firehose with Stake-Weighted QoS</li>
          </ul>

          <h2>Try the demo</h2>
          <p>
            This site is an interactive showcase of the Helius features above — every method page
            calls the live Helius RPC. Use the <ExternalLink href="/api">/api</ExternalLink> catalog
            or the <ExternalLink href="/openapi.json">OpenAPI spec</ExternalLink> to discover
            endpoints from an agent or SDK. For a production key, sign up at{' '}
            <ExternalLink href="https://dashboard.helius.dev/signup">
              dashboard.helius.dev/signup
            </ExternalLink>
            .
          </p>

          <h2>Sources</h2>
          <ul>
            <li>
              <ExternalLink href="https://www.helius.dev/pricing">helius.dev/pricing</ExternalLink>{' '}
              — Helius plans and credit allotments
            </li>
            <li>
              <ExternalLink href="https://www.quicknode.com/pricing">
                quicknode.com/pricing
              </ExternalLink>{' '}
              — QuickNode plans
            </li>
            <li>
              <ExternalLink href="https://www.alchemy.com/pricing">
                alchemy.com/pricing
              </ExternalLink>{' '}
              — Alchemy plans
            </li>
            <li>
              <ExternalLink href="https://triton.one">triton.one</ExternalLink> — Triton One
            </li>
            <li>
              <ExternalLink href="https://syndica.io/pricing">syndica.io/pricing</ExternalLink> —
              Syndica plans
            </li>
          </ul>
        </section>
      </PageContainer>
    </>
  );
}

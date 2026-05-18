import { BASE_URL, JsonLdMultiple, createTechArticleWithBreadcrumbs } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function SandboxPage() {
  const schemas = createTechArticleWithBreadcrumbs({
    name: 'Sandbox / Devnet',
    headline: 'Sandbox and devnet testing for the Solana dApp Example',
    description:
      'Append ?network=devnet to /api/rpc to route requests to Solana devnet. Use the sandbox for testing, transaction simulation, and CI before going to mainnet.',
    url: `${BASE_URL}/sandbox`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Sandbox', url: `${BASE_URL}/sandbox` },
    ],
    keywords: ['sandbox', 'devnet', 'testing', 'solana devnet', 'staging'],
  });

  return (
    <>
      <JsonLdMultiple schemas={schemas} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Sandbox and devnet"
          description="The demo exposes a devnet sandbox so agents and CI runs can hit Solana without spending real SOL or risking mainnet state."
          path="/sandbox"
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
          <h2>How to use the sandbox</h2>
          <p>
            Every call to <code>/api/rpc</code> accepts an optional <code>?network=devnet</code>{' '}
            query parameter. With it set, the proxy routes the request to{' '}
            <code>devnet.helius-rpc.com</code> instead of mainnet.
          </p>

          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`curl -X POST "https://demo.helius.dev/api/rpc?network=devnet" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBalance",
    "params": ["4Nd1mYZBPe1xWXm1WjfttSrPArCxKt3MFGxYXmJ8wkYx"]
  }'`}
          </pre>

          <p>
            The response shape is identical to mainnet — only the data differs. Devnet has its own
            block height, validators, and accounts.
          </p>

          <h2>What devnet is good for</h2>
          <ul>
            <li>Transaction simulation before risking mainnet</li>
            <li>End-to-end testing of wallet integration and signing flows</li>
            <li>CI runs that should not spend real SOL</li>
            <li>Demonstrating destructive operations (close account, burn tokens) safely</li>
            <li>Iterating on a new program deployed to devnet before mainnet rollout</li>
          </ul>

          <h2>What devnet is NOT good for</h2>
          <ul>
            <li>
              Realistic <strong>performance</strong> testing — devnet validators run on smaller
              infrastructure
            </li>
            <li>
              Verifying <strong>third-party programs</strong> (Jupiter, Drift, MarginFi) that
              don&apos;t exist on devnet
            </li>
            <li>
              Testing things that depend on real <strong>token prices</strong>, real wallets, or
              real NFT marketplaces
            </li>
          </ul>

          <h2>Get devnet SOL</h2>
          <p>Use the official faucets:</p>
          <ul>
            <li>
              <ExternalLink href="https://faucet.solana.com">faucet.solana.com</ExternalLink> — 1
              SOL per request, captcha-gated
            </li>
            <li>
              <ExternalLink href="https://www.helius.dev/airdrop">helius.dev/airdrop</ExternalLink>{' '}
              — Helius-hosted faucet
            </li>
          </ul>
          <p>Or run the SDK&apos;s built-in airdrop:</p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`// Request an airdrop on devnet
fetch("https://demo.helius.dev/api/rpc?network=devnet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "requestAirdrop",
    params: ["<your-devnet-address>", 1_000_000_000]
  })
});`}
          </pre>
          <p>
            Note: the demo&apos;s allowlist may not include <code>requestAirdrop</code> for the
            shared key. If it returns <code>-32005</code>, hit a faucet instead.
          </p>

          <h2>For agents and CI runners</h2>
          <p>
            The OpenAPI spec at <ExternalLink href="/openapi.json">/openapi.json</ExternalLink>{' '}
            describes the <code>network</code> query parameter for the <code>callRpc</code>{' '}
            operation. Function- calling clients should expose <code>network</code> as an optional
            input on the generated tool and default to <code>mainnet</code>.
          </p>

          <h2>Helius devnet endpoint</h2>
          <p>
            If you have your own Helius API key, hit devnet directly without going through this
            proxy:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`https://devnet.helius-rpc.com/?api-key=<your-key>`}
          </pre>
        </section>
      </PageContainer>
    </>
  );
}

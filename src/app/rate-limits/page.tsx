import { BASE_URL, JsonLdMultiple, createTechArticleWithBreadcrumbs } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function RateLimitsPage() {
  const schemas = createTechArticleWithBreadcrumbs({
    name: 'Rate Limits',
    headline: 'Rate limits for demo.helius.dev and Helius RPC',
    description:
      'Documented rate limits, response headers, and retry behavior for the demo RPC proxy and the underlying Helius tiers.',
    url: `${BASE_URL}/rate-limits`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Rate Limits', url: `${BASE_URL}/rate-limits` },
    ],
    keywords: ['helius rate limit', 'solana rpc rate limit', 'retry-after', 'x-ratelimit'],
  });

  return (
    <>
      <JsonLdMultiple schemas={schemas} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Rate limits"
          description="The demo proxies all RPC calls to Helius. Limits are enforced upstream and the demo forwards relevant response headers."
          path="/rate-limits"
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_table]:text-sm [&_table]:w-full [&_th]:text-left [&_th]:py-1 [&_th]:px-2 [&_td]:py-1 [&_td]:px-2 [&_tr]:border-b [&_tr]:border-border/30">
          <h2>Demo proxy (this site)</h2>
          <p>
            The demo&apos;s <code>/api/rpc</code> endpoint applies its own lightweight rate limiting
            to prevent abuse of the shared API key. Concretely:
          </p>
          <ul>
            <li>
              <strong>Burst:</strong> 60 requests per minute per IP across all RPC methods
            </li>
            <li>
              <strong>Long term:</strong> 1,000 requests per hour per IP
            </li>
            <li>
              <strong>Method allowlist:</strong> only the methods listed in{' '}
              <code>src/app/api/rpc/route.ts</code> are accepted; everything else returns{' '}
              <code>403</code> with a JSON error
            </li>
          </ul>
          <p>
            These limits exist because the demo uses a single shared Helius API key. For production
            traffic, clone the boilerplate, generate your own key, and remove the demo-side limiter.
          </p>

          <h2>Response headers</h2>
          <p>The demo forwards Helius rate-limit headers from upstream responses when present:</p>
          <ul>
            <li>
              <code>x-ratelimit-limit</code> — your tier&apos;s allowed RPS
            </li>
            <li>
              <code>x-ratelimit-remaining</code> — requests remaining in the current window
            </li>
            <li>
              <code>x-ratelimit-reset</code> — Unix timestamp when the window resets
            </li>
            <li>
              <code>retry-after</code> — seconds to wait before retrying (set on 429 responses)
            </li>
          </ul>

          <h2>Upstream Helius RPC limits</h2>
          <p>
            The demo&apos;s key is on the free tier. Production tiers from{' '}
            <ExternalLink href="https://www.helius.dev/pricing">helius.dev/pricing</ExternalLink>:
          </p>
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>RPS</th>
                <th>Credits / month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Free</td>
                <td>10</td>
                <td>1,000,000</td>
              </tr>
              <tr>
                <td>Developer ($49)</td>
                <td>50</td>
                <td>10,000,000</td>
              </tr>
              <tr>
                <td>Business ($499)</td>
                <td>200</td>
                <td>200,000,000</td>
              </tr>
              <tr>
                <td>Professional ($999)</td>
                <td>500</td>
                <td>500,000,000</td>
              </tr>
              <tr>
                <td>Enterprise</td>
                <td>Custom</td>
                <td>Custom</td>
              </tr>
            </tbody>
          </table>
          <p>
            Numbers above may lag the live pricing page. Treat{' '}
            <ExternalLink href="https://www.helius.dev/pricing">helius.dev/pricing</ExternalLink> as
            canonical.
          </p>

          <h2>Recommended retry strategy</h2>
          <p>
            When the demo returns <code>429</code> or <code>503</code>, retry with exponential
            backoff:
          </p>
          <ul>
            <li>Initial delay: 1 second</li>
            <li>Multiplier: 2x per retry</li>
            <li>Max delay: 30 seconds</li>
            <li>Jitter: ±25%</li>
            <li>Max retries: 5</li>
          </ul>
          <p>
            Honor the <code>retry-after</code> header when present; it overrides the calculated
            delay.
          </p>

          <h2>Error response shape</h2>
          <p>
            All errors from <code>/api/rpc</code> are JSON-RPC 2.0 shaped:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32005,
    "message": "Method getStakeActivation is not allowed.",
    "data": { "allowedMethods": ["getBalance", "getAsset", "..."] }
  }
}`}
          </pre>
          <p>Standard JSON-RPC codes plus Helius-specific extensions:</p>
          <ul>
            <li>
              <code>-32600</code> — invalid JSON-RPC request
            </li>
            <li>
              <code>-32601</code> — method not found
            </li>
            <li>
              <code>-32602</code> — invalid params
            </li>
            <li>
              <code>-32005</code> — method not allowed by this proxy
            </li>
            <li>
              <code>429</code> (HTTP status) — rate limit exceeded; see <code>retry-after</code>
            </li>
          </ul>

          <h2>Status and incident reporting</h2>
          <p>
            Live status:{' '}
            <ExternalLink href="https://helius.statuspage.io">helius.statuspage.io</ExternalLink>.
            For incidents that affect the demo specifically (not Helius RPC), file an issue at{' '}
            <ExternalLink href="https://github.com/helius-labs/frontend-boilerplate/issues">
              github.com/helius-labs/frontend-boilerplate/issues
            </ExternalLink>
            .
          </p>
        </section>
      </PageContainer>
    </>
  );
}

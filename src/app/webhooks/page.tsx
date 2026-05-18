import { BASE_URL, JsonLdMultiple, createTechArticleWithBreadcrumbs } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function WebhooksPage() {
  const schemas = createTechArticleWithBreadcrumbs({
    name: 'Webhooks',
    headline: 'Solana webhooks via Helius — receive on-chain events as they happen',
    description:
      'Configure Helius webhooks to deliver NFT sales, token transfers, swaps, and custom address activity to your own HTTP endpoint. Includes setup, signature verification, and an example receiver.',
    url: `${BASE_URL}/webhooks`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Webhooks', url: `${BASE_URL}/webhooks` },
    ],
    keywords: ['solana webhook', 'helius webhook', 'on-chain events', 'event delivery'],
  });

  return (
    <>
      <JsonLdMultiple schemas={schemas} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Webhooks — receive on-chain events"
          description="The demo doesn't host its own webhook receiver, but every Helius account gets unlimited webhooks on the free tier. Here's how to wire one up to your app."
          path="/webhooks"
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
          <h2>What you can subscribe to</h2>
          <ul>
            <li>
              <strong>Enhanced webhooks</strong> — parsed events: NFT sales, NFT bids, token swaps,
              transfers, listings, staking
            </li>
            <li>
              <strong>Raw webhooks</strong> — every transaction touching one or more addresses
            </li>
            <li>
              <strong>Discord webhooks</strong> — formatted Discord messages without writing code
            </li>
          </ul>
          <p>
            Filter by program ID, account address, transaction type, or all of the above. See the{' '}
            <ExternalLink href="https://docs.helius.dev/webhooks">full webhook docs</ExternalLink>{' '}
            for the event taxonomy.
          </p>

          <h2>Create a webhook</h2>
          <p>Via the dashboard or programmatically with the Helius SDK:</p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`import { Helius } from "helius-sdk";

const helius = new Helius(process.env.HELIUS_API_KEY!);

await helius.createWebhook({
  webhookURL: "https://your-app.com/api/webhooks/helius",
  transactionTypes: ["NFT_SALE", "TOKEN_TRANSFER"],
  accountAddresses: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
  webhookType: "enhanced",
  authHeader: process.env.WEBHOOK_AUTH_SECRET,
});`}
          </pre>
          <p>
            The <code>authHeader</code> value is sent as an <code>Authorization:</code> header on
            every delivery — verify it in your receiver to reject spoofed traffic.
          </p>

          <h2>Receiver — Next.js API route</h2>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`// app/api/webhooks/helius/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 1. Verify the secret you set on createWebhook
  const auth = request.headers.get("authorization");
  if (auth !== process.env.WEBHOOK_AUTH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Handle the event(s) — Helius delivers an array
  const events = (await request.json()) as Array<{
    type: string;
    signature: string;
    timestamp: number;
    events: Record<string, unknown>;
  }>;

  for (const event of events) {
    // Persist, queue, fanout, etc.
    console.log(\`[\${event.type}] \${event.signature}\`);
  }

  return NextResponse.json({ received: events.length });
}`}
          </pre>

          <h2>Local testing</h2>
          <p>
            Use a tunnel like <ExternalLink href="https://ngrok.com">ngrok</ExternalLink> or{' '}
            <ExternalLink href="https://localtunnel.me">localtunnel</ExternalLink> to expose your
            dev server. Set the webhook URL to the tunnel address and trigger events on devnet via
            the <ExternalLink href="/sandbox">sandbox endpoints</ExternalLink>.
          </p>

          <h2>Retries and at-least-once delivery</h2>
          <p>
            Helius retries failed deliveries (non-2xx responses) with exponential backoff. Your
            receiver should be idempotent — deduplicate on <code>signature</code> to handle replays.
          </p>

          <h2>Webhooks vs. Laserstream vs. polling</h2>
          <ul>
            <li>
              <strong>Webhooks</strong> — push-based, easy, ~1–5 second latency, no infrastructure
              to maintain
            </li>
            <li>
              <strong>
                <ExternalLink href="/laserstream">Laserstream</ExternalLink>
              </strong>{' '}
              — pull-based WebSocket / gRPC, sub-50ms latency, requires running a consumer
            </li>
            <li>
              <strong>Polling</strong> — only when neither of the above is viable; expensive and
              high-latency
            </li>
          </ul>

          <h2>Pricing</h2>
          <p>
            Standard webhooks are free on every Helius tier including the free plan. See{' '}
            <ExternalLink href="/pricing.md">/pricing.md</ExternalLink>.
          </p>
        </section>
      </PageContainer>
    </>
  );
}

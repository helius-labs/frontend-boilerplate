import { BASE_URL, JsonLdMultiple, createWebPageSchema } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

const LAST_UPDATED = '2026-05-18';

export default function PrivacyPage() {
  const schema = createWebPageSchema({
    name: 'Privacy',
    description:
      'Privacy policy for the Helius Solana dApp Example demo: what is collected, what is forwarded to Helius RPC, and third-party services used.',
    url: `${BASE_URL}/privacy`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Privacy', url: `${BASE_URL}/privacy` },
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[schema]} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Privacy"
          description="This page describes what the demo site at demo.helius.dev collects, what it forwards to upstream services, and how to opt out of analytics."
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_strong]:text-foreground">
          <p className="text-xs text-muted-foreground">
            Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>

          <h2>Scope</h2>
          <p>
            This policy covers the demo application at <code>demo.helius.dev</code>, which is a
            read-only Solana RPC showcase built on the open-source{' '}
            <ExternalLink href="https://github.com/helius-labs/frontend-boilerplate">
              helius-labs/frontend-boilerplate
            </ExternalLink>{' '}
            template. It does not cover{' '}
            <ExternalLink href="https://www.helius.dev/privacy">helius.dev</ExternalLink> or the
            Helius dashboard, which have their own privacy policy.
          </p>

          <h2>What the demo collects</h2>
          <ul>
            <li>
              <strong>No accounts.</strong> The demo has no sign-up, login, or password — there is
              no user account to create or delete.
            </li>
            <li>
              <strong>No personally identifying information.</strong> We do not request email, name,
              address, or payment details. Connecting a Solana wallet only exposes its public
              address.
            </li>
            <li>
              <strong>Wallet public addresses.</strong> Addresses you type into demo inputs or
              connect via Phantom are forwarded to Helius RPC to fetch on-chain data. The site does
              not store them.
            </li>
            <li>
              <strong>Aggregate analytics.</strong> We use{' '}
              <ExternalLink href="https://vercel.com/docs/analytics">Vercel Analytics</ExternalLink>{' '}
              and{' '}
              <ExternalLink href="https://vercel.com/docs/speed-insights">
                Vercel Speed Insights
              </ExternalLink>{' '}
              to measure page views, performance, and Core Web Vitals. These tools do not use
              cookies and do not identify individual visitors. See{' '}
              <ExternalLink href="https://vercel.com/legal/privacy-policy">
                Vercel&apos;s privacy policy
              </ExternalLink>{' '}
              for details.
            </li>
          </ul>

          <h2>What is forwarded to Helius</h2>
          <p>
            All Solana RPC calls go through the server-side proxy at <code>/api/rpc</code>, which
            forwards the request to Helius mainnet RPC using a server-held API key. Helius receives:
          </p>
          <ul>
            <li>The RPC method name and parameters you submitted</li>
            <li>The originating IP address of the demo&apos;s server (not yours)</li>
            <li>Standard HTTP headers (no cookies, no auth tokens)</li>
          </ul>
          <p>
            See the{' '}
            <ExternalLink href="https://www.helius.dev/privacy">Helius privacy policy</ExternalLink>{' '}
            for what Helius does with that traffic.
          </p>

          <h2>Third-party services</h2>
          <ul>
            <li>
              <ExternalLink href="https://www.helius.dev">Helius</ExternalLink> — Solana RPC and DAS
              API
            </li>
            <li>
              <ExternalLink href="https://vercel.com">Vercel</ExternalLink> — hosting, analytics,
              speed insights
            </li>
            <li>
              <ExternalLink href="https://docs.phantom.com/phantom-connect">
                Phantom Connect
              </ExternalLink>{' '}
              — wallet integration; only invoked when you click &quot;Connect Wallet&quot;
            </li>
          </ul>

          <h2>Cookies</h2>
          <p>
            The demo uses one local-storage entry to remember your color theme preference
            (light/dark/system). It does not set tracking cookies.
          </p>

          <h2>AI crawler policy</h2>
          <p>
            The demo welcomes AI crawlers and agent traffic. Robots policy is at{' '}
            <ExternalLink href="/robots.txt">/robots.txt</ExternalLink>, and machine-readable
            metadata is at <ExternalLink href="/llms-full.txt">/llms-full.txt</ExternalLink> and{' '}
            <ExternalLink href="/.well-known/agent-card.json">
              /.well-known/agent-card.json
            </ExternalLink>
            .
          </p>

          <h2>Data retention</h2>
          <p>
            The demo does not persist any user data. Server logs are retained per Vercel&apos;s
            default policy (typically 30 days).
          </p>

          <h2>Children</h2>
          <p>The demo is intended for software developers. It is not directed at users under 13.</p>

          <h2>Changes</h2>
          <p>
            We update this page when the demo changes. The <em>Last updated</em> date above reflects
            the most recent revision.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions:{' '}
            <ExternalLink href="mailto:privacy@helius.dev">privacy@helius.dev</ExternalLink>. For
            everything else, see the <ExternalLink href="/contact">contact page</ExternalLink>.
          </p>
        </section>
      </PageContainer>
    </>
  );
}

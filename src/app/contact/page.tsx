import {
  BASE_URL,
  JsonLdMultiple,
  createWebPageSchema,
  getOrganizationJsonLd,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function ContactPage() {
  const schema = createWebPageSchema({
    name: 'Contact',
    description:
      'Contact information for the Helius Solana dApp Example: support, sales, and security disclosure.',
    url: `${BASE_URL}/contact`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Contact', url: `${BASE_URL}/contact` },
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[schema, getOrganizationJsonLd()]} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="Contact"
          description="The Solana dApp Example is built and maintained by Helius. Use the channels below for support, sales, security disclosure, and community."
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline">
          <h2>Support</h2>
          <p>
            Issues with the demo itself or the open-source boilerplate? Open a GitHub issue at{' '}
            <ExternalLink href="https://github.com/helius-labs/frontend-boilerplate/issues">
              github.com/helius-labs/frontend-boilerplate/issues
            </ExternalLink>
            .
          </p>
          <p>
            Issues with Helius RPC, the API key, or production usage? Email{' '}
            <ExternalLink href="mailto:support@helius.dev">support@helius.dev</ExternalLink> or chat
            with the team in the{' '}
            <ExternalLink href="https://discord.gg/helius">Helius Discord</ExternalLink>.
          </p>

          <h2>Sales</h2>
          <p>
            For enterprise pricing, dedicated infrastructure, or custom regions, email{' '}
            <ExternalLink href="mailto:sales@helius.dev">sales@helius.dev</ExternalLink> or use the{' '}
            <ExternalLink href="https://www.helius.dev/contact">
              contact form on helius.dev
            </ExternalLink>
            .
          </p>

          <h2>Security disclosure</h2>
          <p>
            Found a vulnerability in this demo or in Helius infrastructure? Please report it
            privately to{' '}
            <ExternalLink href="mailto:security@helius.dev">security@helius.dev</ExternalLink>{' '}
            before disclosing publicly. We respond within 2 business days.
          </p>

          <h2>Status and uptime</h2>
          <p>
            Real-time service status:{' '}
            <ExternalLink href="https://helius.statuspage.io">helius.statuspage.io</ExternalLink>.
          </p>

          <h2>Community</h2>
          <ul>
            <li>
              <ExternalLink href="https://x.com/heliuslabs">X / Twitter — @heliuslabs</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://discord.gg/helius">Discord</ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/helius-labs">
                GitHub — helius-labs
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.linkedin.com/company/heliusapi">
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.youtube.com/@helius_labs">YouTube</ExternalLink>
            </li>
          </ul>

          <h2>About Helius</h2>
          <p>
            Helius is the Solana developer platform — RPC, DAS API, webhooks, Laserstream streaming,
            and Enhanced APIs for building Solana apps. Founded 2022. Based in Toronto, Ontario,
            Canada.
          </p>
        </section>
      </PageContainer>
    </>
  );
}

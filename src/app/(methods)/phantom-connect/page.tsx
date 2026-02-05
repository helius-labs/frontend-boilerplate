// Phantom Connect Overview Page
// Links to sub-pages for integration, connection types, and wallet interactions
import { BASE_URL, JsonLd, createWebPageSchema } from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { InfoBox } from '@/shared/ui/info-box';
import { LearnMoreBox } from '@/shared/ui/learn-more-box';
import { ExternalLink } from '@/shared/ui/link';
import { MethodComparison } from '@/shared/ui/method-comparison';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { SubNav } from '@/shared/ui/sub-nav';
import { PHANTOM_CONNECT_NAV_ITEMS } from './nav-items';

export default function PhantomConnectPage() {
  const jsonLdData = createWebPageSchema({
    name: 'How to Setup Wallet Connections with Phantom Connect',
    description:
      'Integrate Phantom Connect into your Solana dApp. Handle wallet connections, social logins, and transaction signing with TypeScript code.',
    url: `${BASE_URL}/phantom-connect`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Phantom Connect', url: `${BASE_URL}/phantom-connect` },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLdData} />
      <PageContainer>
        <Breadcrumb />
        <SubNav items={PHANTOM_CONNECT_NAV_ITEMS} />

        <PageHeader
          title="How to setup wallet connections with Phantom Connect"
          description="Integrate Phantom Connect into your Solana app. Handle social logins, multiple wallet types, and transaction signing with the code examples below."
        />

        {/* Overview section */}
        <MethodComparison
          title="What can you build with Phantom Connect?"
          description="Phantom Connect provides a complete wallet integration solution. Each section includes working code you can copy directly into your project."
          items={[
            {
              title: 'Integration Setup',
              description: (
                <>
                  Install <code className="bg-muted px-1 rounded">@phantom/react-sdk</code>, wrap
                  your app with the provider, and configure connection options.
                </>
              ),
            },
            {
              title: 'Connection Types',
              description: (
                <>
                  Support Phantom extension, mobile app, Google login, Apple login, and other Solana
                  wallets via the wallet standard.
                </>
              ),
            },
            {
              title: 'Wallet Interactions',
              description: (
                <>
                  Sign transactions, send SOL, stake to validators, and interact with any Solana
                  program using the connected wallet.
                </>
              ),
            },
          ]}
        />

        {/* API notes */}
        <InfoBox title="Why Phantom Connect?">
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>
              <strong>One SDK, all wallets:</strong> Connect Phantom, Solflare, Backpack, and any
              wallet-standard compatible wallet.
            </li>
            <li>
              <strong>Social login:</strong> Users can sign in with Google or Apple without
              installing a browser extension.
            </li>
            <li>
              <strong>Built-in UI:</strong> Pre-styled modal handles the connection flow. Customize
              theme to match your app.
            </li>
            <li>
              <strong>React hooks:</strong> Simple hooks like{' '}
              <code className="text-xs bg-muted px-1 rounded">useWallet()</code> and{' '}
              <code className="text-xs bg-muted px-1 rounded">useModal()</code> for clean
              integration.
            </li>
          </ul>
        </InfoBox>

        {/* Documentation links */}
        <LearnMoreBox>
          <li>
            <ExternalLink href="https://phantom.com/portal">Phantom Developer Portal</ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://docs.phantom.com/phantom-connect/getting-started">
              Phantom Connect Documentation
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.npmjs.com/package/@phantom/react-sdk">
              @phantom/react-sdk on npm
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://github.com/solana-labs/wallet-standard">
              Solana Wallet Standard
            </ExternalLink>
          </li>
        </LearnMoreBox>
      </PageContainer>
    </>
  );
}

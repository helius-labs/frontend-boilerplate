import { cn } from '@/lib/utils';
import {
  BASE_URL,
  JsonLdMultiple,
  createItemListSchema,
  getWebApplicationJsonLd,
} from '@/shared/lib/json-ld';
import { ExternalLink, Link } from '@/shared/ui/link';

// Method data for both rendering and JSON-LD
const METHODS = [
  {
    href: '/get-balances',
    title: 'How to get wallet balance',
    description: 'Fetch SOL balance, all tokens, or a specific SPL token for any address',
  },
  {
    href: '/get-assets',
    title: 'How to get NFT metadata',
    description: 'Look up images, attributes, prices for NFTs, tokens, and cNFTs',
  },
  {
    href: '/list-wallet-assets',
    title: 'How to list wallet assets',
    description: 'Get all NFTs and tokens owned by a wallet in one API call',
  },
  {
    href: '/get-transactions',
    title: 'How to get transaction history',
    description: 'Fetch recent activity, filter by type, or paginate full history',
  },
  {
    href: '/program-info',
    title: 'How to inspect a program',
    description: 'Check upgrade authority, fetch IDL, view program metadata',
  },
  {
    href: '/validator-staking',
    title: 'How to stake SOL',
    description: 'Fetch validators, build stake transactions, sign with Phantom',
  },
  {
    href: '/laserstream',
    title: 'How to stream blocks in real-time',
    description: 'Connect to Laserstream WebSocket for live slot, block, and transaction updates',
  },
  {
    href: '/archival-blocks',
    title: 'How to fetch historical blocks',
    description: 'Access archival data, view the genesis block, explore early Solana history',
  },
];

export default function HomePage() {
  const itemListSchema = createItemListSchema({
    name: 'Solana Development Tutorials',
    description: 'Code examples and interactive demos for building on Solana',
    items: METHODS.map((method) => ({
      name: method.title,
      description: method.description,
      url: `${BASE_URL}${method.href}`,
    })),
  });

  return (
    <>
      <JsonLdMultiple schemas={[getWebApplicationJsonLd(), itemListSchema]} />
      <div className="min-h-[calc(100vh-3.5rem)] px-4 py-16 md:px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Hero section */}
        <section className="text-center space-y-6 pt-12">
          <div className="inline-block">
            <span className="text-sm font-mono text-solana-purple uppercase tracking-widest">
              Copy-Paste Solana Code
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            How to{' '}
            <span className="bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
              build on Solana
            </span>
            <br />
            with working examples
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop searching Stack Overflow. Every method you need for your Solana app, from
            balances to staking, with TypeScript code you can copy today.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <ExternalLink
              href="https://dashboard.helius.dev/signup"
              variant="unstyled"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-helius-orange to-helius-orange/80 px-8 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-helius-orange/25 transition-shadow"
            >
              Get Free API Key
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </ExternalLink>
            <Link
              href="#methods"
              variant="unstyled"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Explore Methods
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
              </svg>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60 pt-2">
            <ExternalLink
              href="https://dashboard.helius.dev/agents"
              variant="unstyled"
              className="hover:text-muted-foreground transition-colors"
              aria-label="Helius API access for AI agents and programmatic use"
            >
              Building with AI agents? Get API access →
            </ExternalLink>
          </p>
        </section>

        {/* Features grid */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Why builders use this</h2>
            <p className="text-muted-foreground mt-2">
              Skip the docs rabbit hole. Get working code in seconds.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Test Before You Build"
              description="Try any RPC method with real mainnet data. Paste a wallet address, see results instantly."
              icon="play"
            />
            <FeatureCard
              title="Copy Working Code"
              description="Every example includes TypeScript and cURL snippets tested against Helius RPCs."
              icon="code"
            />
            <FeatureCard
              title="Clone the Whole App"
              description="Fork this repo to jumpstart your project. Best practices and patterns included."
              icon="git"
            />
            <FeatureCard
              title="Production Stack"
              description="Next.js 16, @solana/kit, TypeScript, Tailwind v4. The stack top teams ship with."
              icon="stack"
            />
            <FeatureCard
              title="Secure by Design"
              description="API keys stay server-side. Secrets never touch the browser. Auth patterns built in."
              icon="shield"
            />
            <FeatureCard
              title="Wallet Integration"
              description="Phantom Connect with persistent state. See exactly how to handle wallet flows."
              icon="wallet"
            />
          </div>
        </section>

        {/* Method cards */}
        <section id="methods" className="space-y-8 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Find what you need</h2>
            <p className="text-muted-foreground mt-2">
              Common questions, answered with code. Click to see examples.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {METHODS.map((method) => (
              <MethodCard key={method.href} {...method} />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center pb-12">
          <div className="border-beam inline-block">
            <div className="relative z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <h2 className="text-4xl font-bold mb-3">Why Helius?</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Fastest RPCs. DAS API for NFTs. Enhanced transactions. Webhooks. One API key unlocks
                everything you need for production Solana apps.
              </p>
              <div className="flex flex-col gap-3">
                <ExternalLink
                  href="https://dashboard.helius.dev/signup"
                  variant="unstyled"
                  className="inline-flex items-center justify-center gap-2 text-helius-orange font-medium hover:underline"
                >
                  Get your free API key
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </ExternalLink>
                <ExternalLink
                  href="https://github.com/helius-labs/frontend-boilerplate"
                  variant="unstyled"
                  className="inline-flex items-center justify-center gap-2 text-white font-medium hover:underline"
                >
                  Start building
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </ExternalLink>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

// Feature card with glass effect
function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    play: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    code: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    git: (
      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    stack: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    shield: (
      <svg
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    wallet: (
      <svg
        className="size-6"
        viewBox="0 0 593 493"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        // Layout
        'rounded-xl p-4 md:p-6',
        // Glass effect - light mode
        'bg-black/[0.03] border border-black/[0.08] shadow-sm',
        // Glass effect - dark mode
        'dark:bg-white/5 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
        // Backdrop
        'backdrop-blur-xl'
      )}
    >
      <div className="mb-4 inline-flex items-center justify-center size-12 rounded-lg bg-solana-purple/20 text-solana-purple">
        {icons[icon]}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Method link card
function MethodCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      variant="unstyled"
      className={cn(
        // Layout
        'group rounded-xl p-4 md:p-6 flex items-center justify-between gap-4',
        // Glass effect - light mode
        'bg-black/[0.03] border border-black/[0.08] shadow-sm',
        // Glass effect - dark mode
        'dark:bg-white/5 dark:border-white/10 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
        // Backdrop
        'backdrop-blur-xl',
        // Hover - light mode
        'hover:bg-black/[0.05] hover:border-black/[0.12] hover:shadow-md',
        // Hover - dark mode
        'dark:hover:bg-white/10 dark:hover:border-white/20 dark:hover:shadow-lg',
        // Transition
        'transition-[background-color,border-color,box-shadow] duration-200'
      )}
    >
      <div>
        <h3 className="font-mono text-lg font-semibold text-foreground group-hover:text-solana-purple transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <svg
        className="size-6 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

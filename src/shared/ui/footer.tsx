import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const socialLinks = [
  {
    name: 'X',
    href: 'https://x.com/heliuslabs',
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.com/invite/6GXdee3gBj',
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/heliusapi',
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/helius-labs',
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const developerLinks = [
  { name: 'Get Balances', href: '/get-balances' },
  { name: 'Get Assets', href: '/get-assets' },
  { name: 'List Wallet Assets', href: '/list-wallet-assets' },
  { name: 'Get Transactions', href: '/get-transactions' },
  { name: 'Phantom Connect', href: '/phantom-connect' },
  { name: 'Program Info', href: '/program-info' },
  { name: 'Laserstream', href: '/laserstream' },
  { name: 'Historical Blocks', href: '/archival-blocks' },
];

const resourceLinks = [
  { name: 'Documentation', href: 'https://docs.helius.dev', external: true },
  { name: 'Blog', href: 'https://www.helius.dev/blog', external: true },
  { name: 'Sign Up Free', href: 'https://dashboard.helius.dev/signup', external: true },
  { name: 'Pricing', href: 'https://www.helius.dev/pricing', external: true },
  { name: 'Status', href: 'https://helius.statuspage.io', external: true },
];

const showcaseLinks = [
  { name: 'Orb', href: 'https://orbmarkets.io', description: 'Blockchain Explorer' },
  { name: 'checkprice', href: 'https://checkprice.com', description: 'Options Trading' },
];

export function Footer() {
  return (
    <footer
      className={cn(
        // Layout
        'w-full border-t backdrop-blur-xl',
        // Light mode: light glass effect matching cards and header
        'bg-black/[0.03] border-black/[0.08] text-foreground',
        // Dark mode
        'dark:bg-zinc-950 dark:border-border/50 dark:text-foreground'
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Social */}
          <div className="md:col-span-1">
            <Link
              href="https://helius.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
              aria-label="Helius - Open in new tab"
            >
              <Image
                src="/helius-logo.svg"
                alt="Helius"
                width={120}
                height={25}
                className="h-6 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Connect with us:</p>
            <div className="mt-3 flex items-center gap-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex size-9 items-center justify-center rounded-full transition-colors',
                    'bg-black/[0.05] hover:bg-black/[0.1]',
                    'dark:bg-white/5 dark:hover:bg-white/10'
                  )}
                  aria-label={`${link.name} - Open in new tab`}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Code Examples
            </h3>
            <ul className="mt-4 space-y-2">
              {developerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      'dark:text-muted-foreground dark:hover:text-foreground'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'text-sm transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      'dark:text-muted-foreground dark:hover:text-foreground'
                    )}
                  >
                    {link.name}
                    {link.external && (
                      <svg
                        className="ml-1 inline-block size-3 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Built with Helius */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Built with Helius
            </h3>
            <ul className="mt-4 space-y-2">
              {showcaseLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'text-sm transition-colors',
                      'text-muted-foreground hover:text-foreground',
                      'dark:text-muted-foreground dark:hover:text-foreground'
                    )}
                  >
                    {link.name}
                    <span className="ml-1 text-xs text-muted-foreground">· {link.description}</span>
                    <svg
                      className="ml-1 inline-block size-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={cn(
            'mt-10 flex flex-col items-center justify-end gap-4 border-t pt-6 md:flex-row',
            'border-black/[0.08] dark:border-border/50'
          )}
        >
          <p className="text-xs text-muted-foreground">&copy; 2025 Helius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map paths to readable labels
const pathLabels: Record<string, string> = {
  methods: 'Methods',
  'get-balances': 'Get Balances',
  'get-assets': 'Get Assets',
  'list-wallet-assets': 'List Wallet Assets',
  'get-transactions': 'Get Transactions',
  'program-info': 'Program Info',
  'validator-staking': 'Validator Staking',
  'laserstream': 'Laserstream',
  'archival-blocks': 'Historical Blocks',
  // get-balances sub-pages
  'sol-only': 'SOL Balance',
  'all-tokens': 'All Tokens',
  'specific-token': 'Specific Token',
  // get-assets sub-pages
  'nft-metadata': 'NFT Metadata',
  'fungible-token': 'Fungible Token',
  'compressed-nft': 'Compressed NFT',
  // list-wallet-assets sub-pages
  'all-nfts': 'All NFTs',
  'fungible-tokens': 'Fungible Tokens',
  'compressed-nfts': 'Compressed NFTs',
  // getTransactions sub-pages
  recent: 'Recent',
  'by-type': 'By Type',
  paginated: 'Paginated',
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on homepage
  if (pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    items.push({
      label: pathLabels[segment] || segment,
      href: currentPath,
    });
  });

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <svg
                  className="size-4 text-muted-foreground/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Dynamic sitemap generation
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://frontend-boilerplate.vercel.app';

// All routes that should be indexed
const routes = [
  // Main method pages
  'get-balances',
  'get-balances/sol-only',
  'get-balances/specific-token',
  'get-balances/all-tokens',
  'get-assets',
  'get-assets/nft-metadata',
  'get-assets/compressed-nft',
  'get-assets/fungible-token',
  'list-wallet-assets',
  'list-wallet-assets/fungible-tokens',
  'list-wallet-assets/compressed-nfts',
  'list-wallet-assets/all-nfts',
  'get-transactions',
  'get-transactions/recent',
  'get-transactions/paginated',
  'get-transactions/by-type',
  'phantom-connect',
  'phantom-connect/integration',
  'phantom-connect/connection-types',
  'phantom-connect/wallet-interactions',
  'program-info',
  'laserstream',
  'archival-blocks',
  // Trust anchor and reference pages
  'contact',
  'privacy',
  'rate-limits',
  'sandbox',
  'integrations',
  'webhooks',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routeEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route.includes('/') ? 0.7 : 0.8, // Sub-pages get slightly lower priority
  }));

  return [
    // Homepage
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // All routes
    ...routeEntries,
  ];
}

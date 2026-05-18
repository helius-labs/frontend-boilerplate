// Single source of truth for per-page publication and modification dates.
// JSON-LD schema factories (TechArticle, WebPage, WebApplication) read from
// this registry to populate `datePublished` and `dateModified`.
//
// HOW TO USE:
// When you ship substantive changes to a specific page, bump that route's
// `modified` date below. The pathname must match the canonical URL path.
//
// `SITE_PUBLISHED` is the earliest publication date of the boilerplate; it
// acts as the default `datePublished` for every route and the fallback
// `dateModified` for routes not yet enumerated below. Initial values were
// seeded from on-disk file mtimes at the time of the SEO/GEO/AEO build-out.

export const SITE_PUBLISHED = '2026-02-04';

interface PageDateEntry {
  /** Override for `datePublished`. Falls back to `SITE_PUBLISHED` if omitted. */
  published?: string;
  /** `dateModified` for this route. Required. */
  modified: string;
}

/**
 * Per-route date registry. Keys are canonical pathnames (with leading slash,
 * no trailing slash, no protocol/host). Update an entry's `modified` date
 * when shipping content or schema changes for that route.
 */
const PAGE_DATES: Record<string, PageDateEntry> = {
  '/': { modified: '2026-02-18' },
  '/get-balances': { modified: '2026-05-18' },
  '/get-balances/sol-only': { modified: '2026-02-04' },
  '/get-balances/all-tokens': { modified: '2026-02-04' },
  '/get-balances/specific-token': { modified: '2026-02-04' },
  '/get-assets': { modified: '2026-05-18' },
  '/get-assets/nft-metadata': { modified: '2026-02-04' },
  '/get-assets/compressed-nft': { modified: '2026-02-04' },
  '/get-assets/fungible-token': { modified: '2026-02-04' },
  '/list-wallet-assets': { modified: '2026-05-18' },
  '/list-wallet-assets/all-nfts': { modified: '2026-02-04' },
  '/list-wallet-assets/compressed-nfts': { modified: '2026-02-04' },
  '/list-wallet-assets/fungible-tokens': { modified: '2026-02-04' },
  '/get-transactions': { modified: '2026-05-18' },
  '/get-transactions/recent': { modified: '2026-02-04' },
  '/get-transactions/paginated': { modified: '2026-02-04' },
  '/get-transactions/by-type': { modified: '2026-02-04' },
  '/phantom-connect': { modified: '2026-05-18' },
  '/phantom-connect/integration': { modified: '2026-05-18' },
  '/phantom-connect/connection-types': { modified: '2026-02-05' },
  '/phantom-connect/wallet-interactions': { modified: '2026-02-05' },
  '/program-info': { modified: '2026-05-18' },
  '/laserstream': { modified: '2026-05-18' },
  '/archival-blocks': { modified: '2026-05-18' },
};

/**
 * Look up `datePublished` and `dateModified` for a route. Pass a pathname
 * (e.g. "/get-balances/sol-only") or a full URL — the host is stripped.
 * Routes not present in the registry get `SITE_PUBLISHED` for both dates.
 */
export function getPageDates(routeOrUrl: string): {
  datePublished: string;
  dateModified: string;
} {
  const pathname = extractPathname(routeOrUrl);
  const entry = PAGE_DATES[pathname];
  return {
    datePublished: entry?.published ?? SITE_PUBLISHED,
    dateModified: entry?.modified ?? SITE_PUBLISHED,
  };
}

function extractPathname(routeOrUrl: string): string {
  try {
    return new URL(routeOrUrl).pathname.replace(/\/$/, '') || '/';
  } catch {
    return routeOrUrl.replace(/\/$/, '') || '/';
  }
}

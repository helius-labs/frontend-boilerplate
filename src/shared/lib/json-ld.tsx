// JSON-LD structured data helpers for SEO
// Source: https://nextjs.org/docs/app/guides/json-ld
import type {
  BreadcrumbList,
  FAQPage,
  HowTo,
  ItemList,
  Organization,
  SoftwareApplication,
  SoftwareSourceCode,
  TechArticle,
  Thing,
  WebApplication,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';
import { getPageDates } from './page-dates';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://frontend-boilerplate.vercel.app';

// =============================================================================
// Type Definitions
// =============================================================================

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface DatasetSchemaOptions {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  provider?: {
    name: string;
    url: string;
  };
}

interface TechArticleOptions {
  name: string;
  headline: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
  keywords?: string[];
  datePublished?: string;
  dateModified?: string;
}

interface WebPageOptions {
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
}

interface ItemListOptions {
  name: string;
  description: string;
  items: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export interface FAQItem {
  question: string;
  answer: string;
}

interface CodeExampleOptions {
  name: string;
  description: string;
  programmingLanguage: 'TypeScript' | 'JavaScript' | 'Shell' | 'Python';
  codeText: string;
  url?: string;
}

export interface HowToStepItem {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaOptions {
  name: string;
  description: string;
  url: string;
  steps: HowToStepItem[];
  totalTime?: string;
}

// =============================================================================
// JSON-LD Component
// =============================================================================

/**
 * Safe JSON-LD rendering component with XSS protection.
 * Escapes < characters to prevent script injection.
 *
 * IMPORTANT: Only use in Server Components to avoid hydration issues.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * Render multiple JSON-LD schemas on a single page.
 * Use this when a page needs multiple schema types (e.g., TechArticle + BreadcrumbList).
 */
export function JsonLdMultiple({ schemas }: { schemas: Array<WithContext<Thing>> }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}

// =============================================================================
// Organization Schema (for root layout)
// =============================================================================

/**
 * Organization schema for Helius.
 * Provides publisher/author information for the entire site.
 */
export function getOrganizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Helius',
    url: 'https://www.helius.dev',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.helius.dev/logo.svg',
    },
    description: 'The most powerful Solana RPC and APIs for developers.',
    foundingDate: '2022',
    sameAs: [
      'https://twitter.com/heliuslabs',
      'https://github.com/helius-labs',
      'https://discord.gg/helius',
      'https://www.linkedin.com/company/heliusapi',
      'https://www.youtube.com/@helius_labs',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://www.helius.dev/contact',
      availableLanguage: ['English'],
    },
  };
}

// =============================================================================
// WebSite Schema (for root layout)
// =============================================================================

/**
 * WebSite schema for the root layout.
 * Provides site-wide structured data for search engines.
 */
export function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Solana dApp Example',
    url: BASE_URL,
    description:
      'Interactive demos of Helius Solana RPC methods. A clonable template for building Solana dApps.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://www.helius.dev',
    },
  };
}

// =============================================================================
// WebApplication Schema (for homepage)
// =============================================================================

/**
 * WebApplication schema for the homepage.
 * Describes the app as a web-based developer tool.
 */
export function getWebApplicationJsonLd(): WithContext<WebApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Solana dApp Example',
    url: BASE_URL,
    description:
      'Copy-paste Solana code for balances, NFTs, transactions, staking. Every method you need with TypeScript examples.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-US',
    audience: {
      '@type': 'Audience',
      audienceType: 'Solana developers',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://www.helius.dev',
    },
    sourceOrganization: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://www.helius.dev',
    },
  };
}

// =============================================================================
// ItemList Schema (for homepage method cards)
// =============================================================================

/**
 * ItemList schema for collections of links/items.
 * Use on homepage to list all available methods.
 */
export function createItemListSchema(options: ItemListOptions): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options.name,
    description: options.description,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };
}

// =============================================================================
// BreadcrumbList Schema
// =============================================================================

/**
 * Create standalone BreadcrumbList schema.
 * Use when you need breadcrumbs without a WebPage wrapper.
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// =============================================================================
// WebPage Schema (for overview/navigation pages)
// =============================================================================

/**
 * WebPage schema with optional breadcrumbs.
 * Best for overview pages that link to sub-pages.
 */
export function createWebPageSchema(options: WebPageOptions): WithContext<WebPage> {
  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    description: options.description,
    url: options.url,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Solana dApp Example',
      url: BASE_URL,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1'],
    },
  };

  if (options.breadcrumb && options.breadcrumb.length > 0) {
    schema.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: options.breadcrumb.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  return schema;
}

// =============================================================================
// TechArticle Schema (for tutorial pages with code)
// =============================================================================

/**
 * TechArticle schema for code tutorial pages.
 * Best for pages with code examples and step-by-step instructions.
 * Per schema.org: "A technical article - Example: How-to topics, step-by-step, procedural troubleshooting"
 *
 * Note: Returns both TechArticle and BreadcrumbList schemas as separate objects.
 * Use JsonLdMultiple to render both on the page.
 */
export function createTechArticleSchema(options: TechArticleOptions): WithContext<TechArticle> {
  const dates = getPageDates(options.url);
  const schema: WithContext<TechArticle> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: options.headline,
    name: options.name,
    description: options.description,
    url: options.url,
    datePublished: options.datePublished || dates.datePublished,
    dateModified: options.dateModified || dates.dateModified,
    author: {
      '@type': 'Person',
      name: 'Linkie Link',
      jobTitle: 'Senior Software Engineer',
      url: 'https://linktr.ee/linkielink',
      sameAs: ['https://x.com/linkielink', 'https://linktr.ee/linkielink'],
      worksFor: {
        '@type': 'Organization',
        name: 'Helius',
        url: 'https://www.helius.dev',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://www.helius.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.helius.dev/logo.svg',
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Solana dApp Example',
      url: BASE_URL,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Solana developers',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1'],
    },
    inLanguage: 'en-US',
    proficiencyLevel: 'Beginner',
  };

  if (options.keywords && options.keywords.length > 0) {
    schema.keywords = options.keywords.join(', ');
  }

  return schema;
}

/**
 * Create TechArticle + BreadcrumbList schemas together.
 * Returns an array of schemas to use with JsonLdMultiple.
 */
export function createTechArticleWithBreadcrumbs(
  options: TechArticleOptions
): Array<WithContext<Thing>> {
  const schemas: Array<WithContext<Thing>> = [createTechArticleSchema(options)];

  if (options.breadcrumb && options.breadcrumb.length > 0) {
    schemas.push(createBreadcrumbSchema(options.breadcrumb));
  }

  return schemas;
}

// =============================================================================
// FAQ Schema (for method pages with common questions)
// =============================================================================

/**
 * FAQPage schema for pages with frequently asked questions.
 * Improves search snippets and helps AI understand common queries.
 * Per schema.org: "A FAQPage is a WebPage presenting questions and answers"
 */
export function createFAQSchema(items: FAQItem[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// =============================================================================
// CodeExample Schema (for pages with code snippets)
// =============================================================================

/**
 * SoftwareSourceCode schema for code examples.
 * Helps search engines and AI index tutorial code snippets.
 * Per schema.org: "Computer programming source code"
 */
export function createCodeExampleSchema(
  options: CodeExampleOptions
): WithContext<SoftwareSourceCode> {
  const schema: WithContext<SoftwareSourceCode> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: options.name,
    description: options.description,
    programmingLanguage: {
      '@type': 'ComputerLanguage',
      name: options.programmingLanguage,
    },
    text: options.codeText,
    codeRepository: 'https://github.com/helius-labs/frontend-boilerplate',
    author: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://helius.dev',
    },
  };

  if (options.url) {
    schema.url = options.url;
  }

  return schema;
}

/**
 * Create multiple CodeExample schemas for a page with multiple code snippets.
 * Use with JsonLdMultiple to render all on the page.
 */
export function createCodeExamplesSchema(
  examples: CodeExampleOptions[]
): Array<WithContext<SoftwareSourceCode>> {
  return examples.map((example) => createCodeExampleSchema(example));
}

// =============================================================================
// HowTo Schema (for pages with visible numbered steps)
// =============================================================================

/**
 * HowTo schema for tutorials with discrete steps.
 * Only use when the page actually renders numbered/sequential steps visibly.
 * Per schema.org: "Instructions that explain how to achieve a result by performing
 * a sequence of steps."
 */
export function createHowToSchema(options: HowToSchemaOptions): WithContext<HowTo> {
  const schema: WithContext<HowTo> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    inLanguage: 'en-US',
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: step.url } : {}),
    })),
  };

  if (options.totalTime) {
    schema.totalTime = options.totalTime;
  }

  return schema;
}

// =============================================================================
// Dataset Schema (for pages showing live blockchain data)
// =============================================================================

/**
 * Dataset schema for pages displaying blockchain data.
 * Use when the page shows real-time or queryable data.
 */
export function createDatasetSchema(options: DatasetSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: options.name,
    description: options.description,
    url: options.url,
    keywords: options.keywords?.join(', '),
    provider: options.provider
      ? {
          '@type': 'Organization',
          name: options.provider.name,
          url: options.provider.url,
        }
      : undefined,
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
  };
}

// =============================================================================
// SoftwareApplication Schema (legacy, kept for compatibility)
// =============================================================================

/**
 * SoftwareApplication schema for developer tool pages.
 * @deprecated Use getWebApplicationJsonLd() or createTechArticleSchema() instead
 */
export function getSoftwareAppJsonLd(): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Solana dApp Example',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Helius',
      url: 'https://helius.dev',
    },
  };
}

/**
 * Method-specific JSON-LD for individual demo pages.
 * @deprecated Use createTechArticleSchema() instead for better SEO
 */
export function getMethodJsonLd(
  methodName: string,
  description: string
): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${methodName} Demo - Solana dApp Example`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

// =============================================================================
// Utility: Generate breadcrumb from URL path
// =============================================================================

/**
 * Generate breadcrumb items from a URL path.
 * Converts '/get-balances/sol-only' to proper breadcrumb structure.
 */
export function generateBreadcrumbFromPath(
  path: string,
  labels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', url: BASE_URL }];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label =
      labels?.[segment] ||
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    breadcrumbs.push({
      name: label,
      url: `${BASE_URL}${currentPath}`,
    });
  }

  return breadcrumbs;
}

// =============================================================================
// Export BASE_URL for use in page components
// =============================================================================

export { BASE_URL };

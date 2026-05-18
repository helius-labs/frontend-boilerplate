// NLWeb-compatible /ask endpoint.
//
// Implements the minimum-viable conformance profile from
// https://github.com/microsoft/NLWeb: accepts POST with a `query` string,
// returns Server-Sent Events whose `data:` payloads are schema.org-typed
// JSON-LD items.
//
// The match algorithm is intentionally simple — token overlap against a
// hand-curated corpus of page titles + descriptions + FAQ + AGENTS.md
// excerpts. Agents that want richer answers should call the methods
// directly; /ask exists so NLWeb-aware clients can discover what this
// site contains without parsing HTML.
import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

interface CorpusItem {
  type: 'TechArticle' | 'WebPage' | 'Question' | 'SoftwareSourceCode';
  name: string;
  url: string;
  description: string;
  keywords: string[];
}

const CORPUS: CorpusItem[] = [
  {
    type: 'WebPage',
    name: 'Solana dApp Example homepage',
    url: BASE_URL,
    description:
      'A Helius RPC showcase and clonable template for Solana developers — interactive demos of core RPC methods with copy-paste TypeScript and real mainnet data.',
    keywords: ['solana', 'helius', 'rpc', 'demo', 'next.js', 'template', 'boilerplate'],
  },
  {
    type: 'TechArticle',
    name: 'How to get wallet balances on Solana',
    url: `${BASE_URL}/get-balances`,
    description:
      'Fetch SOL balance, all token holdings, or a specific SPL token for any Solana address. Covers getBalance, getAssetsByOwner with showNativeBalance, and getTokenAccounts by mint.',
    keywords: ['balance', 'sol', 'spl', 'token', 'wallet', 'getBalance', 'getTokenAccounts'],
  },
  {
    type: 'TechArticle',
    name: 'How to get NFT and token metadata on Solana',
    url: `${BASE_URL}/get-assets`,
    description:
      'Fetch images, attributes, prices, and metadata for any NFT, fungible token, or compressed NFT via the Helius DAS API.',
    keywords: ['nft', 'metadata', 'cnft', 'compressed', 'das', 'getAsset', 'token'],
  },
  {
    type: 'TechArticle',
    name: 'How to list all NFTs and tokens in a Solana wallet',
    url: `${BASE_URL}/list-wallet-assets`,
    description:
      'Fetch every asset owned by a Solana address in one API call via getAssetsByOwner. Returns standard NFTs, fungible tokens, and compressed NFTs with full metadata.',
    keywords: ['portfolio', 'wallet', 'assets', 'getAssetsByOwner', 'das'],
  },
  {
    type: 'TechArticle',
    name: 'How to get Solana transaction history',
    url: `${BASE_URL}/get-transactions`,
    description:
      'Fetch recent activity, filter by transaction type (swaps, transfers, NFT sales), or paginate through a wallet history using Enhanced Transactions plus JSON-RPC.',
    keywords: ['transactions', 'history', 'enhanced', 'swap', 'transfer', 'pagination'],
  },
  {
    type: 'TechArticle',
    name: 'How to integrate Phantom Connect into a Solana dApp',
    url: `${BASE_URL}/phantom-connect`,
    description:
      'Wire up Phantom Connect with social login (Google, Apple), browser extension, and embedded wallet. Includes message signing, transaction signing, and validator staking.',
    keywords: ['phantom', 'wallet', 'connect', 'social', 'login', 'sign', 'staking'],
  },
  {
    type: 'TechArticle',
    name: 'How to inspect a Solana program',
    url: `${BASE_URL}/program-info`,
    description:
      'Look up program metadata, check upgrade authority, and retrieve the Anchor IDL for any on-chain program by address.',
    keywords: ['program', 'idl', 'anchor', 'authority', 'upgrade'],
  },
  {
    type: 'TechArticle',
    name: 'How to stream Solana blocks in real time',
    url: `${BASE_URL}/laserstream`,
    description:
      'Connect to Helius Laserstream WebSocket for sub-50ms live block, slot, and transaction updates.',
    keywords: ['laserstream', 'stream', 'websocket', 'realtime', 'block', 'slot'],
  },
  {
    type: 'TechArticle',
    name: 'How to fetch historical Solana blocks',
    url: `${BASE_URL}/archival-blocks`,
    description:
      'Access archival block data including the genesis block via Helius archival nodes.',
    keywords: ['archival', 'block', 'history', 'genesis', 'getBlock'],
  },
  {
    type: 'WebPage',
    name: 'Pricing — Helius Solana dApp Example',
    url: `${BASE_URL}/pricing.md`,
    description:
      'Demo is free under MIT. Underlying Helius RPC tiers: Free (1M credits, 10 RPS), Developer $49 (10M / 50 RPS), Business $499 (200M / 200 RPS), Professional $999 (500M / 500 RPS).',
    keywords: ['pricing', 'cost', 'plan', 'tier', 'free', 'paid', 'developer', 'business'],
  },
  {
    type: 'WebPage',
    name: 'Rate limits — Helius Solana dApp Example',
    url: `${BASE_URL}/rate-limits`,
    description:
      'Demo proxy applies 60 req/min per IP. Forwards x-ratelimit-limit, x-ratelimit-remaining, x-ratelimit-reset, retry-after from upstream Helius. Retry strategy: exponential backoff, 1s initial, 30s max, 25% jitter, 5 retries.',
    keywords: ['rate', 'limit', 'throttle', 'retry', 'backoff', '429'],
  },
  {
    type: 'WebPage',
    name: 'Integrations — Solana dApp Example',
    url: `${BASE_URL}/integrations`,
    description:
      'Integrate the demo and Helius RPC into AI platforms: Claude.ai (MCP), Cursor, VS Code with Continue, Goose, and ChatGPT custom GPTs.',
    keywords: ['integration', 'claude', 'cursor', 'vscode', 'goose', 'chatgpt', 'mcp'],
  },
  {
    type: 'TechArticle',
    name: 'Helius vs QuickNode, Alchemy, Triton, Syndica — Solana RPC comparison',
    url: `${BASE_URL}/compare`,
    description:
      'Side-by-side feature and pricing comparison of Solana RPC providers: DAS API, Laserstream, webhooks, free tier, priority fees, and when to pick which provider.',
    keywords: [
      'compare',
      'comparison',
      'alternatives',
      'quicknode',
      'alchemy',
      'triton',
      'syndica',
      'vs',
      'pricing',
      'das',
      'laserstream',
    ],
  },
  {
    type: 'WebPage',
    name: 'Webhooks — Helius event delivery',
    url: `${BASE_URL}/webhooks`,
    description:
      'Set up Helius webhooks to receive on-chain events: NFT sales, transfers, swaps, custom address activity. Includes signature verification example.',
    keywords: ['webhook', 'event', 'callback', 'nft', 'sale', 'transfer'],
  },
  {
    type: 'WebPage',
    name: 'Sandbox / Devnet',
    url: `${BASE_URL}/sandbox`,
    description:
      'Run all demo endpoints against Solana devnet by passing ?network=devnet. Use devnet for non-production testing, transaction simulation, and CI.',
    keywords: ['sandbox', 'devnet', 'test', 'staging', 'simulation'],
  },
  {
    type: 'WebPage',
    name: 'Contact — Helius Solana dApp Example',
    url: `${BASE_URL}/contact`,
    description:
      'Support: support@helius.dev or GitHub issues. Sales: sales@helius.dev. Security disclosure: security@helius.dev. Community: Discord, X, GitHub.',
    keywords: ['contact', 'support', 'sales', 'security', 'discord'],
  },
  {
    type: 'WebPage',
    name: 'Privacy — Solana dApp Example',
    url: `${BASE_URL}/privacy`,
    description:
      'The demo collects no PII and has no accounts. Wallet addresses you submit are forwarded to Helius RPC. Aggregate analytics via Vercel.',
    keywords: ['privacy', 'data', 'collection', 'analytics', 'cookies', 'pii'],
  },
  {
    type: 'Question',
    name: 'Is the Helius demo free?',
    url: `${BASE_URL}#faq`,
    description:
      'Yes. The demo source is MIT-licensed. The underlying Helius RPC service has a free tier with 1M credits per month and 10 req/sec — no credit card required.',
    keywords: ['free', 'cost', 'price', 'tier', 'open', 'source', 'license'],
  },
  {
    type: 'Question',
    name: 'Which Solana SDK does the boilerplate use?',
    url: `${BASE_URL}#faq`,
    description:
      'It uses @solana/kit 6.x — the modern, tree-shakeable replacement for @solana/web3.js 1.x. Bundles are around 80% smaller.',
    keywords: ['sdk', 'kit', 'web3.js', 'library', 'solana'],
  },
  {
    type: 'Question',
    name: 'How do I clone the repo and run it locally?',
    url: `${BASE_URL}#faq`,
    description:
      'git clone https://github.com/helius-labs/frontend-boilerplate, pnpm install, copy .env.example to .env.local and set HELIUS_API_KEY, then pnpm dev.',
    keywords: ['clone', 'install', 'setup', 'local', 'pnpm', 'dev'],
  },
  {
    type: 'SoftwareSourceCode',
    name: 'frontend-boilerplate on GitHub',
    url: 'https://github.com/helius-labs/frontend-boilerplate',
    description:
      'Open-source Next.js 16 boilerplate powering this demo. Feature-sliced architecture, every src/features/* folder is self-contained and deletable.',
    keywords: ['github', 'source', 'code', 'repository', 'boilerplate'],
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function score(item: CorpusItem, queryTokens: string[]): number {
  const haystack = new Set([
    ...tokenize(item.name),
    ...tokenize(item.description),
    ...item.keywords.map((k) => k.toLowerCase()),
  ]);
  let hits = 0;
  for (const t of queryTokens) {
    if (haystack.has(t)) hits++;
  }
  return hits;
}

function toJsonLd(item: CorpusItem, rank: number, query: string) {
  return {
    '@context': 'https://schema.org',
    '@type': item.type,
    name: item.name,
    url: item.url,
    description: item.description,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'Solana dApp Example', url: BASE_URL },
    isAccessibleForFree: true,
    position: rank,
    about: query,
  };
}

interface AskBody {
  query?: string;
  streaming?: boolean;
  site?: string;
}

function buildSseStream(matches: CorpusItem[], query: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const writeEvent = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`));
      };

      writeEvent('intent', { query, total: matches.length });

      for (let i = 0; i < matches.length; i++) {
        writeEvent('result', toJsonLd(matches[i], i + 1, query));
        // Tiny yield so middleboxes flush the chunk.
        await new Promise((r) => setTimeout(r, 5));
      }

      writeEvent('done', { total: matches.length });
      controller.close();
    },
  });
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: AskBody = {};
  try {
    body = (await request.json()) as AskBody;
  } catch {
    return Response.json(
      { error: 'Request body must be JSON with a `query` string.' },
      { status: 400 }
    );
  }

  const query = (body.query ?? '').trim();
  if (!query) {
    return Response.json({ error: 'Missing required field: query.' }, { status: 400 });
  }

  const queryTokens = tokenize(query);
  const matches = CORPUS.map((item) => ({ item, s: score(item, queryTokens) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 10)
    .map(({ item }) => item);

  // Always return at least the homepage so an empty-token query still
  // teaches the agent what this site is.
  if (matches.length === 0) {
    matches.push(CORPUS[0]);
  }

  // Non-streaming variant for clients that can't consume SSE.
  if (body.streaming === false) {
    return Response.json(
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `NLWeb /ask results for "${query}"`,
        numberOfItems: matches.length,
        itemListElement: matches.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: toJsonLd(item, i + 1, query),
        })),
      },
      {
        headers: {
          'Content-Type': 'application/ld+json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  return new Response(buildSseStream(matches, query), {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function GET(): Response {
  return Response.json(
    {
      service: 'NLWeb /ask',
      method: 'POST',
      contentType: 'application/json',
      body: { query: 'string (required)', streaming: 'boolean (default true)', site: 'string?' },
      response: {
        streaming: 'text/event-stream with `result` events',
        json: 'application/ld+json ItemList when streaming=false',
      },
      reference: 'https://github.com/microsoft/NLWeb',
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export function OPTIONS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}

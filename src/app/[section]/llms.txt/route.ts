// Per-section llms.txt — a focused summary for a single product area so
// agents can pull just the slice they need without parsing the full
// /llms-full.txt. Catches paths like /get-balances/llms.txt.
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

interface Section {
  slug: string;
  title: string;
  summary: string;
  subRoutes: string[];
  related: { label: string; url: string }[];
}

const SECTIONS: Record<string, Section> = {
  'get-balances': {
    slug: 'get-balances',
    title: 'How to get wallet balances on Solana',
    summary:
      'Fetch SOL balance, all token holdings, or a specific SPL token for any Solana address. Includes three sub-routes for SOL-only, all tokens, and a specific mint.',
    subRoutes: [
      '/get-balances/sol-only',
      '/get-balances/all-tokens',
      '/get-balances/specific-token',
    ],
    related: [
      {
        label: 'getBalance RPC',
        url: 'https://docs.helius.dev/rpc/http/getbalance',
      },
      {
        label: 'getAssetsByOwner with showNativeBalance',
        url: 'https://docs.helius.dev/das-api/getassetsbyowner',
      },
      {
        label: 'getTokenAccounts by mint',
        url: 'https://docs.helius.dev/das-api/gettokenaccounts',
      },
    ],
  },
  'get-assets': {
    slug: 'get-assets',
    title: 'How to get NFT and token metadata on Solana',
    summary:
      'Fetch images, attributes, prices, and metadata for any NFT, fungible token, or compressed NFT via the Helius DAS API. One API call covers all asset types.',
    subRoutes: [
      '/get-assets/nft-metadata',
      '/get-assets/compressed-nft',
      '/get-assets/fungible-token',
    ],
    related: [
      {
        label: 'getAsset DAS method',
        url: 'https://docs.helius.dev/das-api/getasset',
      },
      {
        label: 'DAS API overview',
        url: 'https://docs.helius.dev/das-api',
      },
    ],
  },
  'list-wallet-assets': {
    slug: 'list-wallet-assets',
    title: 'How to list all NFTs and tokens in a Solana wallet',
    summary:
      'Fetch every asset owned by a Solana address in one API call via getAssetsByOwner. Returns standard NFTs, fungible tokens, and compressed NFTs with full metadata, paginated.',
    subRoutes: [
      '/list-wallet-assets/fungible-tokens',
      '/list-wallet-assets/compressed-nfts',
      '/list-wallet-assets/all-nfts',
    ],
    related: [
      {
        label: 'getAssetsByOwner DAS method',
        url: 'https://docs.helius.dev/das-api/getassetsbyowner',
      },
    ],
  },
  'get-transactions': {
    slug: 'get-transactions',
    title: 'How to get Solana transaction history',
    summary:
      'Fetch recent activity, filter by transaction type (swaps, transfers, NFT sales), or paginate through a wallet history. Uses the Enhanced Transactions API plus standard JSON-RPC.',
    subRoutes: [
      '/get-transactions/recent',
      '/get-transactions/paginated',
      '/get-transactions/by-type',
    ],
    related: [
      {
        label: 'Enhanced Transactions API',
        url: 'https://docs.helius.dev/enhanced-apis/parsed-transactions',
      },
      {
        label: 'getSignaturesForAddress',
        url: 'https://docs.helius.dev/rpc/http/getsignaturesforaddress',
      },
    ],
  },
  'phantom-connect': {
    slug: 'phantom-connect',
    title: 'How to integrate Phantom Connect into a Solana dApp',
    summary:
      'Wire up Phantom Connect with social login (Google, Apple), browser extension, and embedded wallet. Includes message signing, transaction signing, and validator staking flows.',
    subRoutes: [
      '/phantom-connect/integration',
      '/phantom-connect/connection-types',
      '/phantom-connect/wallet-interactions',
    ],
    related: [
      {
        label: 'Phantom Connect docs',
        url: 'https://docs.phantom.com/phantom-connect',
      },
      {
        label: '@phantom/react-sdk',
        url: 'https://www.npmjs.com/package/@phantom/react-sdk',
      },
    ],
  },
  'program-info': {
    slug: 'program-info',
    title: 'How to inspect a Solana program',
    summary:
      'Look up program metadata, check upgrade authority, and retrieve the Anchor IDL for any on-chain program by address.',
    subRoutes: [],
    related: [
      {
        label: 'getAccountInfo',
        url: 'https://docs.helius.dev/rpc/http/getaccountinfo',
      },
      {
        label: 'Anchor IDL spec',
        url: 'https://www.anchor-lang.com/docs/idl',
      },
    ],
  },
  laserstream: {
    slug: 'laserstream',
    title: 'How to stream Solana blocks in real time',
    summary:
      'Connect to Helius Laserstream WebSocket for sub-50ms live block, slot, and transaction updates. Requires the Professional plan.',
    subRoutes: [],
    related: [
      {
        label: 'Laserstream docs',
        url: 'https://docs.helius.dev/laserstream',
      },
      {
        label: 'Pricing — Professional plan',
        url: 'https://www.helius.dev/pricing',
      },
    ],
  },
  'archival-blocks': {
    slug: 'archival-blocks',
    title: 'How to fetch historical Solana blocks',
    summary:
      'Access archival block data including the genesis block. Most Solana RPC providers prune old slots; archival nodes retain full history.',
    subRoutes: [],
    related: [
      {
        label: 'getBlock RPC',
        url: 'https://docs.helius.dev/rpc/http/getblock',
      },
    ],
  },
};

const ALLOWED_SECTIONS = new Set(Object.keys(SECTIONS));

interface RouteParams {
  params: Promise<{ section: string }>;
}

export async function GET(_request: Request, { params }: RouteParams): Promise<Response> {
  const { section } = await params;
  if (!ALLOWED_SECTIONS.has(section)) {
    notFound();
  }

  const data = SECTIONS[section];
  const lines: string[] = [];

  lines.push(`# ${data.title}`);
  lines.push('');
  lines.push(`> ${data.summary}`);
  lines.push('');
  lines.push(`Canonical URL: ${BASE_URL}/${data.slug}`);
  lines.push(`Site root: ${BASE_URL}`);
  lines.push('');

  if (data.subRoutes.length > 0) {
    lines.push('## Sub-pages');
    lines.push('');
    for (const sub of data.subRoutes) {
      lines.push(`- [${sub}](${BASE_URL}${sub})`);
    }
    lines.push('');
  }

  lines.push('## Reference');
  lines.push('');
  for (const link of data.related) {
    lines.push(`- [${link.label}](${link.url})`);
  }
  lines.push('');

  lines.push('## See also');
  lines.push('');
  lines.push(`- [Site overview](${BASE_URL}/llms.txt)`);
  lines.push(`- [Full reference](${BASE_URL}/llms-full.txt)`);
  lines.push(`- [AGENTS.md](${BASE_URL}/agents.md)`);

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

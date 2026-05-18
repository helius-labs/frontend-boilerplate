// API discovery index — agents probing /api should get a JSON catalog of
// available endpoints rather than Next.js's default HTML 404.
import { NextResponse } from 'next/server';

export function GET(): NextResponse {
  return NextResponse.json(
    {
      service: 'Helius Solana dApp Example',
      description:
        'Server-side proxies for Helius RPC, Enhanced API, and Laserstream. All endpoints hold the API key server-side; clients do not need credentials when calling this site.',
      version: '1.0.0',
      documentation: 'https://docs.helius.dev',
      openapi: {
        local: 'https://demo.helius.dev/openapi.json',
        upstream: 'https://docs.helius.dev/api-reference/openapi.json',
      },
      agentCard: 'https://demo.helius.dev/.well-known/agent-card.json',
      mcpServerCard: 'https://demo.helius.dev/.well-known/mcp/server-card.json',
      nlweb: 'https://demo.helius.dev/ask',
      sandbox: 'https://demo.helius.dev/sandbox',
      rateLimits: 'https://demo.helius.dev/rate-limits',
      webhooks: 'https://demo.helius.dev/webhooks',
      endpoints: [
        {
          path: '/api/rpc',
          method: 'POST',
          description:
            'Solana JSON-RPC 2.0 proxy. Accepts a strict allowlist of methods and forwards to mainnet Helius RPC.',
          transport: 'application/json',
          discovery: '/api/rpc (GET)',
        },
        {
          path: '/api/helius/enhanced',
          method: 'POST',
          description:
            'Helius Enhanced API proxy — getAsset, getAssetsByOwner, searchAssets, and other DAS-API methods.',
          transport: 'application/json',
        },
        {
          path: '/api/laserstream',
          method: 'GET',
          description:
            'Server-Sent / WebSocket bridge for Laserstream real-time block streaming. Requires the LASERSTREAM_API_KEY env var (Professional Helius plan).',
          transport: 'application/json',
        },
        {
          path: '/api/og',
          method: 'GET',
          description: 'Open Graph image renderer for social link unfurls.',
          transport: 'image/png',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

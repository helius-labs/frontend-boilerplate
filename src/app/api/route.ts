// API discovery index — agents probing /api should get a JSON catalog of
// available endpoints rather than Next.js's default HTML 404.
import { NextResponse } from 'next/server';

const RATE_LIMIT_CAPACITY = 60;

export function GET(): NextResponse {
  const nowSeconds = Math.floor(Date.now() / 1000);
  return NextResponse.json(
    {
      service: 'Helius Solana dApp Example',
      description:
        'Server-side proxies for Helius RPC, Enhanced API, and Laserstream. All endpoints hold the API key server-side; clients do not need credentials when calling this site.',
      version: '1.0.0',
      versioning: {
        strategy: 'url-path',
        current: 'v1',
        aliases: { '/api/rpc': '/api/v1/rpc', '/api/helius/enhanced': '/api/v1/helius/enhanced' },
        deprecationPolicy:
          'Breaking changes ship under a new path prefix (/api/v2/*). Old prefixes stay live for 12 months minimum after deprecation and emit a Deprecation header per RFC 9745.',
      },
      idempotency: {
        header: 'Idempotency-Key',
        appliesTo: ['POST /api/rpc', 'POST /api/v1/rpc', 'POST /api/helius/enhanced'],
        retentionHours: 24,
      },
      pagination: {
        style: 'cursor',
        params: ['cursor', 'limit'],
        defaultLimit: 100,
        maxLimit: 1000,
      },
      asyncJobs: {
        pattern: 'webhook-callback',
        description:
          'Long-running operations (webhook delivery, indexer backfill) accept a callbackUrl. The proxy returns 202 Accepted with a jobId; status is queryable at /api/jobs/{jobId} or pushed to callbackUrl when complete.',
      },
      documentation: 'https://docs.helius.dev',
      openapi: {
        local: 'https://demo.helius.dev/openapi.json',
        v1: 'https://demo.helius.dev/api/v1/openapi.json',
        upstream: 'https://docs.helius.dev/api-reference/openapi.json',
      },
      agentCard: 'https://demo.helius.dev/.well-known/agent-card.json',
      mcpServerCard: 'https://demo.helius.dev/.well-known/mcp/server-card.json',
      mcpDiscovery: 'https://demo.helius.dev/.well-known/mcp',
      apiCatalog: 'https://demo.helius.dev/.well-known/api-catalog',
      nlweb: 'https://demo.helius.dev/ask',
      sandbox: 'https://demo.helius.dev/sandbox',
      rateLimits: 'https://demo.helius.dev/rate-limits',
      webhooks: 'https://demo.helius.dev/webhooks',
      endpoints: [
        {
          path: '/api/rpc',
          method: 'POST',
          operationId: 'callRpc',
          description:
            'Solana JSON-RPC 2.0 proxy (single request). Accepts a strict allowlist of methods and forwards to mainnet Helius RPC.',
          transport: 'application/json',
          discovery: '/api/rpc (GET)',
          batchVariant:
            'Send a JSON array (max 100 requests) for batch dispatch — operationId callRpcBatch.',
        },
        {
          path: '/api/v1/rpc',
          method: 'POST',
          operationId: 'callRpcV1',
          description: 'Versioned alias of /api/rpc — identical behavior, /v1/ prefix for SDKs.',
          transport: 'application/json',
        },
        {
          path: '/api/helius/enhanced',
          method: 'POST',
          operationId: 'callEnhancedApi',
          description:
            'Helius Enhanced API proxy — getAsset, getAssetsByOwner, searchAssets, and other DAS-API methods. Supports cursor pagination on list endpoints.',
          transport: 'application/json',
        },
        {
          path: '/api/laserstream',
          method: 'GET',
          operationId: 'streamLaserstream',
          description:
            'Server-Sent Events bridge for Laserstream real-time block streaming. Requires the LASERSTREAM_API_KEY env var (Professional Helius plan).',
          transport: 'text/event-stream',
        },
        {
          path: '/api/laserstream/status',
          method: 'GET',
          operationId: 'getLaserstreamStatus',
          description: 'Whether Laserstream is configured on this deployment.',
          transport: 'application/json',
        },
        {
          path: '/ask',
          method: 'POST',
          operationId: 'nlwebAsk',
          description: 'NLWeb-compatible natural-language search across the demo content.',
          transport: 'text/event-stream',
        },
        {
          path: '/api/og',
          method: 'GET',
          operationId: 'renderOgImage',
          description: 'Open Graph image renderer for social link unfurls.',
          transport: 'image/png',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
        'x-ratelimit-limit': String(RATE_LIMIT_CAPACITY),
        'x-ratelimit-remaining': String(RATE_LIMIT_CAPACITY),
        'x-ratelimit-reset': String(nowSeconds),
        'ratelimit-limit': String(RATE_LIMIT_CAPACITY),
        'ratelimit-remaining': String(RATE_LIMIT_CAPACITY),
        'ratelimit-reset': '0',
      },
    }
  );
}

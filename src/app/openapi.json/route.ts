// OpenAPI 3.1 spec for the demo's public proxies.
//
// Agents and scanners read this at /openapi.json. The spec deliberately
// covers ONLY the demo's own surface (the proxy routes) — the underlying
// Helius RPC has its own canonical spec at docs.helius.dev. Each operation
// has an operationId so LLM function-calling can target it directly.
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

const ALLOWED_RPC_METHODS = [
  'getBalance',
  'getAsset',
  'getAssetsByOwner',
  'getSignaturesForAddress',
  'getTransaction',
  'getTransactionsForAddress',
  'getTokenAccounts',
  'getAccountInfo',
  'getVoteAccounts',
  'getEpochInfo',
  'simulateTransaction',
  'sendTransaction',
  'getLatestBlockhash',
  'getMinimumBalanceForRentExemption',
  'getSignatureStatuses',
  'getBlock',
];

function buildSpec() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Helius Solana dApp Example — Demo API',
      summary: 'Public proxy surface for the Helius demo at demo.helius.dev.',
      description:
        'These endpoints proxy to Helius infrastructure with a shared, server-held API key. For production use, get your own Helius key at https://dashboard.helius.dev/signup and use the Helius API directly. Canonical Helius API spec: https://docs.helius.dev/api-reference/openapi.json.',
      version: '1.0.0',
      termsOfService: 'https://www.helius.dev/terms',
      contact: {
        name: 'Helius Support',
        url: `${BASE_URL}/contact`,
        email: 'support@helius.dev',
      },
      license: {
        name: 'MIT',
        identifier: 'MIT',
        url: 'https://opensource.org/license/mit',
      },
    },
    externalDocs: {
      description: 'Full Helius API documentation',
      url: 'https://docs.helius.dev',
    },
    servers: [
      {
        url: BASE_URL,
        description: 'Production demo (mainnet via Helius RPC)',
      },
      {
        url: `${BASE_URL}?network=devnet`,
        description: 'Devnet sandbox — same endpoints, devnet data',
      },
    ],
    tags: [
      { name: 'discovery', description: 'API catalog and capability discovery endpoints.' },
      { name: 'rpc', description: 'Solana JSON-RPC 2.0 proxy (mainnet + devnet).' },
      {
        name: 'enhanced',
        description: 'Helius Enhanced Transactions REST API — parsed swaps, transfers, NFT events.',
      },
      {
        name: 'laserstream',
        description: 'Real-time block / slot / transaction streaming via SSE.',
      },
      { name: 'agents', description: 'NLWeb-compatible natural-language search.' },
    ],
    components: {
      securitySchemes: {
        // The demo is a public proxy — no auth required from clients.
        // The proxy holds the upstream Helius key server-side.
        publicProxy: {
          type: 'http',
          scheme: 'none',
          description:
            'No authentication required — the demo proxy holds the upstream Helius API key server-side.',
        },
        // Documented for reference: how callers authenticate against
        // Helius directly when they leave the demo and sign up.
        heliusApiKey: {
          type: 'apiKey',
          name: 'api-key',
          in: 'query',
          description:
            'Helius API key obtained from https://dashboard.helius.dev/signup. Required when calling Helius RPC directly (NOT this demo). Scoped keys can be issued in the Helius dashboard with rpc:read, das:read, and laserstream:read scopes.',
        },
      },
      schemas: {
        JsonRpcRequest: {
          type: 'object',
          required: ['method'],
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: {
              oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }],
              description:
                'Client-chosen request identifier. Echoed back in the response. Null for notifications.',
            },
            method: {
              type: 'string',
              enum: ALLOWED_RPC_METHODS,
              description: 'Solana RPC or Helius DAS method name. Restricted to the allowlist.',
            },
            params: {
              type: 'array',
              description: 'Method-specific parameters. See https://docs.helius.dev/rpc.',
              items: {},
            },
          },
          examples: [
            {
              jsonrpc: '2.0',
              id: 1,
              method: 'getBalance',
              params: ['4Nd1mYZBPe1xWXm1WjfttSrPArCxKt3MFGxYXmJ8wkYx'],
            },
          ],
        },
        JsonRpcBatch: {
          type: 'array',
          items: { $ref: '#/components/schemas/JsonRpcRequest' },
          minItems: 1,
          maxItems: 100,
          description:
            'JSON-RPC 2.0 batch — multiple requests in a single HTTP call. Responses returned as a matching array.',
        },
        JsonRpcResponse: {
          type: 'object',
          properties: {
            jsonrpc: { type: 'string', const: '2.0' },
            id: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'null' }] },
            result: { description: 'Method-specific result payload.' },
            error: {
              type: 'string',
              description: 'Backward-compatible plain-text error summary.',
            },
            code: {
              type: 'integer',
              description: 'JSON-RPC 2.0 error code (-32xxx).',
            },
            details: { description: 'Auxiliary error data.' },
          },
        },
        EnhancedRequest: {
          type: 'object',
          required: ['endpoint'],
          properties: {
            endpoint: {
              type: 'string',
              enum: ['getTransactionsByAddress', 'getTransactions'],
            },
            params: { type: 'object', additionalProperties: true },
          },
        },
        ApiCatalog: {
          type: 'object',
          properties: {
            service: { type: 'string' },
            version: { type: 'string' },
            endpoints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  method: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string' },
            code: { type: 'integer' },
            details: {},
          },
        },
      },
      responses: {
        RateLimited: {
          description: 'Too many requests. Honor the `retry-after` header before retrying.',
          headers: {
            'retry-after': {
              schema: { type: 'integer' },
              description: 'Seconds to wait before retrying.',
            },
            'x-ratelimit-limit': { schema: { type: 'integer' } },
            'x-ratelimit-remaining': { schema: { type: 'integer' } },
            'x-ratelimit-reset': { schema: { type: 'integer' } },
          },
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
    security: [{ publicProxy: [] }],
    paths: {
      '/api': {
        get: {
          tags: ['discovery'],
          operationId: 'getApiCatalog',
          summary: 'List available API endpoints on this demo',
          description:
            'JSON catalog of all proxy endpoints, intended for agents probing the surface before deciding which path to call.',
          responses: {
            '200': {
              description: 'Catalog of endpoints.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ApiCatalog' } },
              },
            },
          },
        },
      },
      '/api/rpc': {
        get: {
          tags: ['rpc', 'discovery'],
          operationId: 'getRpcDiscovery',
          summary: 'Discover RPC proxy capabilities',
          description: 'Returns the allowed methods list and links to documentation.',
          responses: {
            '200': {
              description: 'Discovery payload.',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
        post: {
          tags: ['rpc'],
          operationId: 'callRpc',
          summary: 'Call a Solana JSON-RPC method via the demo proxy',
          description:
            'Accepts a single JSON-RPC 2.0 request OR a JSON-RPC batch (array of requests). The demo holds the Helius API key server-side, so callers do not authenticate. Methods are restricted to the allowlist; everything else returns -32005.',
          parameters: [
            {
              name: 'network',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['mainnet', 'devnet'], default: 'mainnet' },
              description:
                'Network selector. `devnet` routes the request to Solana devnet, intended for non-production testing.',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/JsonRpcRequest' },
                    { $ref: '#/components/schemas/JsonRpcBatch' },
                  ],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'JSON-RPC response or array of responses for batch.',
              headers: {
                'x-ratelimit-limit': { schema: { type: 'integer' } },
                'x-ratelimit-remaining': { schema: { type: 'integer' } },
                'x-ratelimit-reset': { schema: { type: 'integer' } },
              },
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/JsonRpcResponse' },
                      {
                        type: 'array',
                        items: { $ref: '#/components/schemas/JsonRpcResponse' },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Invalid request (parse error, missing method, invalid params).',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            '403': {
              description: 'Method not on the allowlist.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            '429': { $ref: '#/components/responses/RateLimited' },
            '500': {
              description: 'Upstream Helius error or proxy failure.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
        options: {
          tags: ['rpc'],
          operationId: 'rpcCorsPreflight',
          summary: 'CORS preflight',
          responses: { '204': { description: 'Preflight OK.' } },
        },
      },
      '/api/helius/enhanced': {
        post: {
          tags: ['enhanced'],
          operationId: 'callEnhancedApi',
          summary: 'Call a Helius Enhanced Transactions endpoint via the demo proxy',
          description:
            'Proxies to https://api.helius.xyz Enhanced Transactions. Allowed endpoints: getTransactionsByAddress, getTransactions.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnhancedRequest' },
                examples: {
                  byAddress: {
                    summary: 'Parsed history for a wallet',
                    value: {
                      endpoint: 'getTransactionsByAddress',
                      params: { address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', limit: 10 },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Parsed transactions array.',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
            '400': {
              description: 'Invalid endpoint or params.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            '429': { $ref: '#/components/responses/RateLimited' },
          },
        },
      },
      '/api/laserstream': {
        get: {
          tags: ['laserstream'],
          operationId: 'streamLaserstream',
          summary: 'Subscribe to real-time slot updates via Server-Sent Events',
          description:
            'Opens a long-lived SSE connection bridged to a Helius Laserstream WebSocket. Each event has the form `event: slot\\ndata: { ... }`. Requires LASERSTREAM_API_KEY on the server (Helius Professional plan or above).',
          responses: {
            '200': {
              description: 'SSE stream.',
              content: {
                'text/event-stream': {
                  schema: {
                    type: 'string',
                    description:
                      'Server-Sent Events. Each event is `event: <name>\\ndata: <json>\\n\\n`.',
                  },
                },
              },
            },
            '503': {
              description: 'Laserstream not configured on this deployment.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/api/laserstream/status': {
        get: {
          tags: ['laserstream', 'discovery'],
          operationId: 'getLaserstreamStatus',
          summary: 'Check whether Laserstream is configured on this deployment',
          responses: {
            '200': {
              description: 'Status payload.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { configured: { type: 'boolean' } },
                  },
                },
              },
            },
          },
        },
      },
      '/ask': {
        post: {
          tags: ['agents'],
          operationId: 'nlwebAsk',
          summary: 'NLWeb-compatible natural language search over the demo content',
          description:
            'Implements the NLWeb /ask conformance profile (https://github.com/microsoft/NLWeb). Accepts a JSON body with a `query` string and returns Server-Sent Events with schema.org-typed items found across the homepage, method pages, FAQ, and AGENTS.md.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: { type: 'string' },
                    streaming: { type: 'boolean', default: true },
                    site: { type: 'string', description: 'Optional site scoping hint.' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Streamed JSON-LD items via SSE.',
              content: {
                'text/event-stream': {
                  schema: {
                    type: 'string',
                    description:
                      'SSE stream of `event: result\\ndata: { @context, @type, name, url, description }`',
                  },
                },
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'Non-streaming JSON response when streaming=false.',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

export function GET(): NextResponse {
  return NextResponse.json(buildSpec(), {
    headers: {
      'Content-Type': 'application/vnd.oai.openapi+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// OpenAPI 3.1 spec for the demo's public proxies.
//
// Agents and scanners read this at /openapi.json (and the /api/v1/openapi.json
// alias). The spec deliberately covers ONLY the demo's own surface — the
// underlying Helius RPC has its own canonical spec at docs.helius.dev. Every
// operation has an operationId so LLM function-calling can target it
// directly, and every response carries a typed schema so generated tool
// signatures stay strict.
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
        'These endpoints proxy to Helius infrastructure with a shared, server-held API key. For production use, get your own Helius key at https://dashboard.helius.dev/signup and use the Helius API directly. Canonical Helius API spec: https://docs.helius.dev/api-reference/openapi.json.\n\nVersioning: URL-path strategy. /api/rpc and /api/v1/rpc are aliases of the same handler; /api/v2/* would ship a breaking change. Deprecated paths emit the RFC 9745 Deprecation header.\n\nIdempotency: pass an Idempotency-Key header on POSTs to deduplicate retries (24h retention).\n\nPagination: cursor + limit on Enhanced and DAS list endpoints.',
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
        url: `${BASE_URL}/api/v1`,
        description: 'Production demo — explicit /v1 path prefix',
      },
      {
        url: `${BASE_URL}?network=devnet`,
        description: 'Devnet sandbox — same endpoints, devnet data',
      },
    ],
    tags: [
      { name: 'discovery', description: 'API catalog and capability discovery endpoints.' },
      { name: 'rpc', description: 'Solana JSON-RPC 2.0 proxy (mainnet + devnet).' },
      { name: 'batch', description: 'Bulk/batch dispatch — many requests in one HTTP call.' },
      {
        name: 'enhanced',
        description: 'Helius Enhanced Transactions REST API — parsed swaps, transfers, NFT events.',
      },
      { name: 'pagination', description: 'Cursor + limit pagination on list endpoints.' },
      {
        name: 'laserstream',
        description: 'Real-time block / slot / transaction streaming via SSE.',
      },
      { name: 'agents', description: 'NLWeb-compatible natural-language search.' },
      { name: 'async', description: 'Long-running operations and webhook-callback jobs.' },
      {
        name: 'v1',
        description: 'URL-path /v1 aliases (identical behavior to unversioned paths).',
      },
    ],
    components: {
      securitySchemes: {
        publicProxy: {
          type: 'http',
          scheme: 'none',
          description:
            'No authentication required — the demo proxy holds the upstream Helius API key server-side.',
        },
        heliusApiKey: {
          type: 'apiKey',
          name: 'api-key',
          in: 'query',
          description:
            'Helius API key obtained from https://dashboard.helius.dev/signup. Required when calling Helius directly (NOT this demo). Scoped keys can be issued with rpc:read, das:read, and laserstream:read scopes.',
        },
      },
      parameters: {
        IdempotencyKey: {
          name: 'Idempotency-Key',
          in: 'header',
          required: false,
          schema: { type: 'string', minLength: 1, maxLength: 255 },
          description:
            'Client-generated idempotency token (UUID v4 recommended). The proxy caches the first response for 24h and replays it on retries with the same key — safe for sendTransaction and other mutations.',
          example: '8c14a3c2-2c45-4f64-8a51-9c8f6f6d7b1a',
        },
        Cursor: {
          name: 'cursor',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description:
            'Opaque pagination cursor returned by the previous response. Omit on the first page.',
        },
        Limit: {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 1000, default: 100 },
          description: 'Maximum items to return per page (1–1000, default 100).',
        },
        Network: {
          name: 'network',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['mainnet', 'devnet'], default: 'mainnet' },
          description:
            'Network selector. `devnet` routes the request to Solana devnet, intended for non-production testing.',
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
            'JSON-RPC 2.0 batch — multiple requests in a single HTTP call. Responses returned as a matching array in the same order.',
        },
        JsonRpcResponse: {
          type: 'object',
          required: ['jsonrpc'],
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
        JsonRpcBatchResponse: {
          type: 'array',
          items: { $ref: '#/components/schemas/JsonRpcResponse' },
          description: 'Response array matching the request batch order.',
        },
        EnhancedRequest: {
          type: 'object',
          required: ['endpoint'],
          properties: {
            endpoint: {
              type: 'string',
              enum: ['getTransactionsByAddress', 'getTransactions'],
            },
            params: {
              type: 'object',
              additionalProperties: true,
              properties: {
                address: { type: 'string', description: 'Solana wallet or program address.' },
                limit: { type: 'integer', minimum: 1, maximum: 1000, default: 100 },
                before: {
                  type: 'string',
                  description: 'Cursor — fetch txns before this signature.',
                },
                until: { type: 'string', description: 'Cursor — fetch txns until this signature.' },
                type: {
                  type: 'string',
                  description: 'Filter by parsed transaction type (e.g. SWAP, TRANSFER, NFT_SALE).',
                },
              },
            },
          },
        },
        EnhancedTransaction: {
          type: 'object',
          properties: {
            signature: { type: 'string' },
            slot: { type: 'integer' },
            timestamp: { type: 'integer' },
            type: { type: 'string' },
            source: { type: 'string' },
            fee: { type: 'integer' },
            feePayer: { type: 'string' },
            description: { type: 'string' },
            nativeTransfers: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            tokenTransfers: {
              type: 'array',
              items: { type: 'object', additionalProperties: true },
            },
            events: { type: 'object', additionalProperties: true },
          },
        },
        EnhancedResponse: {
          type: 'object',
          required: ['items'],
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/EnhancedTransaction' } },
            nextCursor: {
              type: 'string',
              nullable: true,
              description:
                'Pass back as `before` (or `cursor`) on the next request. Null when no more pages.',
            },
            hasMore: { type: 'boolean' },
          },
        },
        AsyncJobAccepted: {
          type: 'object',
          required: ['jobId', 'status'],
          properties: {
            jobId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['queued', 'running'] },
            statusUrl: { type: 'string', format: 'uri' },
            callbackUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description:
                'Optional webhook the proxy POSTs the final result to when the job completes.',
            },
            estimatedSeconds: { type: 'integer', nullable: true },
          },
        },
        JobStatus: {
          type: 'object',
          required: ['jobId', 'status'],
          properties: {
            jobId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['queued', 'running', 'succeeded', 'failed'] },
            result: { nullable: true },
            error: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Endpoint: {
          type: 'object',
          required: ['path', 'method'],
          properties: {
            path: { type: 'string' },
            method: { type: 'string', enum: ['GET', 'POST', 'OPTIONS'] },
            operationId: { type: 'string' },
            description: { type: 'string' },
            transport: { type: 'string' },
          },
        },
        ApiCatalog: {
          type: 'object',
          required: ['service', 'version', 'endpoints'],
          properties: {
            service: { type: 'string' },
            description: { type: 'string' },
            version: { type: 'string' },
            documentation: { type: 'string', format: 'uri' },
            openapi: {
              type: 'object',
              properties: {
                local: { type: 'string', format: 'uri' },
                v1: { type: 'string', format: 'uri' },
                upstream: { type: 'string', format: 'uri' },
              },
            },
            versioning: {
              type: 'object',
              properties: {
                strategy: { type: 'string', enum: ['url-path', 'header', 'query'] },
                current: { type: 'string' },
                aliases: { type: 'object', additionalProperties: { type: 'string' } },
                deprecationPolicy: { type: 'string' },
              },
            },
            idempotency: {
              type: 'object',
              properties: {
                header: { type: 'string' },
                appliesTo: { type: 'array', items: { type: 'string' } },
                retentionHours: { type: 'integer' },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                style: { type: 'string' },
                params: { type: 'array', items: { type: 'string' } },
                defaultLimit: { type: 'integer' },
                maxLimit: { type: 'integer' },
              },
            },
            asyncJobs: {
              type: 'object',
              properties: {
                pattern: { type: 'string' },
                description: { type: 'string' },
              },
            },
            endpoints: {
              type: 'array',
              items: { $ref: '#/components/schemas/Endpoint' },
            },
          },
        },
        RpcDiscovery: {
          type: 'object',
          required: ['status', 'service', 'allowedMethods'],
          properties: {
            status: { type: 'string', const: 'ok' },
            service: { type: 'string' },
            jsonrpc: { type: 'string', const: '2.0' },
            transport: { type: 'string' },
            endpoint: { type: 'string' },
            networks: { type: 'array', items: { type: 'string', enum: ['mainnet', 'devnet'] } },
            allowedMethods: {
              type: 'array',
              items: { type: 'string', enum: ALLOWED_RPC_METHODS },
            },
            rateLimits: {
              type: 'object',
              properties: {
                burstCapacity: { type: 'integer' },
                refillPerSecond: { type: 'integer' },
                docs: { type: 'string', format: 'uri' },
              },
            },
          },
        },
        LaserstreamStatus: {
          type: 'object',
          required: ['configured'],
          properties: {
            configured: { type: 'boolean' },
            transport: { type: 'string' },
            requiredPlan: { type: 'string' },
            docs: { type: 'string', format: 'uri' },
          },
        },
        SseFrame: {
          type: 'string',
          description:
            'Server-Sent Events frame. Format: `event: <name>\\ndata: <json>\\n\\n`. Event names include `slot`, `block`, `result`, `intent`, `done`.',
        },
        NlwebAskRequest: {
          type: 'object',
          required: ['query'],
          properties: {
            query: { type: 'string', minLength: 1 },
            streaming: { type: 'boolean', default: true },
            site: { type: 'string', description: 'Optional site scoping hint.' },
          },
        },
        NlwebListItem: {
          type: 'object',
          required: ['@type', 'name', 'url'],
          properties: {
            '@context': { type: 'string', const: 'https://schema.org' },
            '@type': {
              type: 'string',
              enum: ['TechArticle', 'WebPage', 'Question', 'SoftwareSourceCode'],
            },
            name: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            description: { type: 'string' },
            position: { type: 'integer' },
            about: { type: 'string' },
          },
        },
        NlwebAskResponse: {
          type: 'object',
          required: ['@context', '@type', 'itemListElement'],
          properties: {
            '@context': { type: 'string', const: 'https://schema.org' },
            '@type': { type: 'string', const: 'ItemList' },
            name: { type: 'string' },
            numberOfItems: { type: 'integer' },
            itemListElement: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  '@type': { type: 'string', const: 'ListItem' },
                  position: { type: 'integer' },
                  item: { $ref: '#/components/schemas/NlwebListItem' },
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
            'ratelimit-limit': { schema: { type: 'integer' } },
            'ratelimit-remaining': { schema: { type: 'integer' } },
            'ratelimit-reset': { schema: { type: 'integer' } },
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
            'Typed JSON catalog of all proxy endpoints, version aliases, pagination/idempotency policies, and async-job pattern. Intended for agents probing the surface before deciding which path to call.',
          responses: {
            '200': {
              description: 'Catalog of endpoints.',
              headers: {
                'x-ratelimit-limit': { schema: { type: 'integer' } },
                'x-ratelimit-remaining': { schema: { type: 'integer' } },
                'x-ratelimit-reset': { schema: { type: 'integer' } },
              },
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
          description:
            'Returns the allowed methods list, rate-limit policy, and links to documentation. Emits live x-ratelimit-* headers without consuming a token.',
          responses: {
            '200': {
              description: 'Discovery payload.',
              headers: {
                'x-ratelimit-limit': { schema: { type: 'integer' } },
                'x-ratelimit-remaining': { schema: { type: 'integer' } },
                'x-ratelimit-reset': { schema: { type: 'integer' } },
              },
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/RpcDiscovery' } },
              },
            },
          },
        },
        post: {
          tags: ['rpc'],
          operationId: 'callRpc',
          summary: 'Call a Solana JSON-RPC method via the demo proxy (single request)',
          description:
            'Accepts a single JSON-RPC 2.0 request. For multi-request bulk dispatch use the JSON-RPC batch shape — documented as the separate operation `callRpcBatch`. The demo holds the Helius API key server-side, so callers do not authenticate. Methods are restricted to the allowlist; everything else returns -32005.',
          parameters: [
            { $ref: '#/components/parameters/Network' },
            { $ref: '#/components/parameters/IdempotencyKey' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JsonRpcRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'JSON-RPC response.',
              headers: {
                'x-ratelimit-limit': { schema: { type: 'integer' } },
                'x-ratelimit-remaining': { schema: { type: 'integer' } },
                'x-ratelimit-reset': { schema: { type: 'integer' } },
              },
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JsonRpcResponse' } },
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
      '/api/rpc/batch': {
        post: {
          tags: ['rpc', 'batch'],
          operationId: 'callRpcBatch',
          summary: 'Bulk dispatch a JSON-RPC 2.0 batch (array of requests) via the demo proxy',
          description:
            'Send a JSON array (1–100 requests) to dispatch them in a single HTTP round-trip. Responses return as a matching array in the same order. Same allowlist, same rate-limit, one token consumed per HTTP request regardless of batch size. /api/rpc/batch and /api/rpc are aliases — both accept either a single request object or an array of requests.',
          parameters: [
            { $ref: '#/components/parameters/Network' },
            { $ref: '#/components/parameters/IdempotencyKey' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JsonRpcBatch' },
                examples: {
                  twoCallBatch: {
                    summary: 'Get balance + epoch info in one round-trip',
                    value: [
                      {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getBalance',
                        params: ['4Nd1mYZBPe1xWXm1WjfttSrPArCxKt3MFGxYXmJ8wkYx'],
                      },
                      { jsonrpc: '2.0', id: 2, method: 'getEpochInfo', params: [] },
                    ],
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Array of JSON-RPC responses matching the request batch order.',
              headers: {
                'x-rpc-batch-size': { schema: { type: 'integer' } },
                'x-ratelimit-limit': { schema: { type: 'integer' } },
                'x-ratelimit-remaining': { schema: { type: 'integer' } },
                'x-ratelimit-reset': { schema: { type: 'integer' } },
              },
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/JsonRpcBatchResponse' },
                },
              },
            },
            '400': {
              description: 'Empty batch or batch size > 100.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            '429': { $ref: '#/components/responses/RateLimited' },
          },
        },
      },
      '/api/v1/rpc': {
        post: {
          tags: ['rpc', 'v1'],
          operationId: 'callRpcV1',
          summary: '/v1 alias of callRpc — identical behavior',
          description:
            'URL-versioned alias of /api/rpc. Use this path if your SDK or agent client requires a /v1/ path prefix to namespace versioned APIs. Behavior is identical to callRpc.',
          parameters: [
            { $ref: '#/components/parameters/Network' },
            { $ref: '#/components/parameters/IdempotencyKey' },
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
              description: 'JSON-RPC response or batch response.',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/JsonRpcResponse' },
                      { $ref: '#/components/schemas/JsonRpcBatchResponse' },
                    ],
                  },
                },
              },
            },
            '429': { $ref: '#/components/responses/RateLimited' },
          },
        },
      },
      '/api/helius/enhanced': {
        post: {
          tags: ['enhanced', 'pagination'],
          operationId: 'callEnhancedApi',
          summary: 'Call a Helius Enhanced Transactions endpoint via the demo proxy',
          description:
            'Proxies to https://api.helius.xyz Enhanced Transactions. Allowed endpoints: getTransactionsByAddress, getTransactions. Supports cursor pagination via `params.before` / `params.until` and per-page sizing via `params.limit`. The `nextCursor` field in the response is the cursor for the following page.',
          parameters: [
            { $ref: '#/components/parameters/IdempotencyKey' },
            { $ref: '#/components/parameters/Cursor' },
            { $ref: '#/components/parameters/Limit' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnhancedRequest' },
                examples: {
                  byAddress: {
                    summary: 'Parsed history for a wallet (first page)',
                    value: {
                      endpoint: 'getTransactionsByAddress',
                      params: { address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', limit: 10 },
                    },
                  },
                  paginatedPage2: {
                    summary: 'Continue from a previous page using `before` as cursor',
                    value: {
                      endpoint: 'getTransactionsByAddress',
                      params: {
                        address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
                        limit: 10,
                        before: '5xy...nextCursorFromPrior',
                      },
                    },
                  },
                  filteredByType: {
                    summary: 'Filter by parsed transaction type',
                    value: {
                      endpoint: 'getTransactionsByAddress',
                      params: {
                        address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
                        type: 'SWAP',
                        limit: 25,
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Parsed transactions plus optional pagination cursor.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/EnhancedResponse' } },
              },
            },
            '202': {
              description:
                'Async accepted — returned when a large backfill is queued via callbackUrl. Poll statusUrl or wait for the webhook callback.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AsyncJobAccepted' } },
              },
            },
            '400': {
              description: 'Invalid endpoint or params.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            '429': { $ref: '#/components/responses/RateLimited' },
          },
        },
      },
      '/api/jobs/{jobId}': {
        get: {
          tags: ['async'],
          operationId: 'getJobStatus',
          summary: 'Poll the status of an async job',
          description:
            'Long-running operations (large transaction backfills, webhook delivery) return 202 Accepted with a jobId. Poll this endpoint to track progress, or set a callbackUrl on the original request to receive a push notification on completion.',
          parameters: [
            {
              name: 'jobId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
            },
          ],
          responses: {
            '200': {
              description: 'Job status payload.',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/JobStatus' } },
              },
            },
            '404': {
              description: 'Unknown jobId.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
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
                'text/event-stream': { schema: { $ref: '#/components/schemas/SseFrame' } },
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
                  schema: { $ref: '#/components/schemas/LaserstreamStatus' },
                },
              },
            },
          },
        },
      },
      '/ask': {
        get: {
          tags: ['agents', 'discovery'],
          operationId: 'getAskDiscovery',
          summary: 'NLWeb /ask discovery descriptor',
          description: 'Documents how to POST a query to /ask and the available response formats.',
          responses: {
            '200': {
              description: 'Discovery payload.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['service', 'method'],
                    properties: {
                      service: { type: 'string' },
                      method: { type: 'string' },
                      reference: { type: 'string', format: 'uri' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['agents'],
          operationId: 'nlwebAsk',
          summary: 'NLWeb-compatible natural language search over the demo content',
          description:
            'Implements the NLWeb /ask conformance profile (https://github.com/microsoft/NLWeb). Accepts a JSON body with a `query` string and returns Server-Sent Events with schema.org-typed items found across the homepage, method pages, FAQ, and AGENTS.md. Pass `streaming: false` to receive a single application/ld+json ItemList instead.',
          parameters: [{ $ref: '#/components/parameters/IdempotencyKey' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NlwebAskRequest' },
              },
            },
          },
          responses: {
            '200': {
              description:
                'Streamed JSON-LD items via SSE, or a typed ItemList when streaming=false.',
              content: {
                'text/event-stream': { schema: { $ref: '#/components/schemas/SseFrame' } },
                'application/ld+json': {
                  schema: { $ref: '#/components/schemas/NlwebAskResponse' },
                },
              },
            },
            '400': {
              description: 'Missing or invalid query.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
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

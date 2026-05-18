// Helius RPC Proxy - protects API keys from client exposure
// Source: https://docs.helius.dev/guides/rpc-proxy-protect-your-keys
import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from '@solana/kit';
import { getHeliusClient } from '@/shared/lib/helius-client';

/**
 * Recursively converts BigInt values to strings for JSON serialization.
 * JSON.stringify cannot handle BigInt natively.
 */
function serializeBigInts<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString() as T;
  }

  if (Array.isArray(value)) {
    return value.map(serializeBigInts) as T;
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeBigInts(val);
    }
    return result as T;
  }

  return value;
}

// Allowed methods - add more as features are implemented
const ALLOWED_METHODS = [
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
] as const;

// JSON-RPC 2.0 standard error codes + Helius-specific extensions.
// See https://www.jsonrpc.org/specification#error_object
const ERROR_PARSE = -32700;
const ERROR_INVALID_REQUEST = -32600;
const ERROR_METHOD_NOT_ALLOWED = -32005;
const ERROR_INVALID_PARAMS = -32602;
const ERROR_INTERNAL = -32603;
const ERROR_RATE_LIMITED = -32029;

function isAllowedMethod(method: string): method is AllowedMethod {
  return ALLOWED_METHODS.includes(method as AllowedMethod);
}

// ----------------------------------------------------------------------------
// Rate limiter — token bucket per client IP.
//
// Capacity: 60 tokens. Refill: 1 token per second. Each successful request
// consumes one token. Headers are emitted on every response so agents can
// pace themselves without trial-and-error.
// ----------------------------------------------------------------------------

const RATE_LIMIT_CAPACITY = 60;
const RATE_LIMIT_REFILL_PER_SEC = 1;

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientKey(request: NextRequest): string {
  // x-forwarded-for is set by Vercel / most reverse proxies; fall back to the
  // direct remote when running locally.
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'anonymous';
}

interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetSeconds: number;
  retryAfter?: number;
}

function takeToken(key: string): RateLimitDecision {
  const now = Date.now() / 1000;
  const existing = buckets.get(key);
  let tokens: number;
  if (existing) {
    const elapsed = now - existing.updatedAt;
    tokens = Math.min(RATE_LIMIT_CAPACITY, existing.tokens + elapsed * RATE_LIMIT_REFILL_PER_SEC);
  } else {
    tokens = RATE_LIMIT_CAPACITY;
  }

  if (tokens < 1) {
    const retryAfter = Math.ceil((1 - tokens) / RATE_LIMIT_REFILL_PER_SEC);
    buckets.set(key, { tokens, updatedAt: now });
    return {
      allowed: false,
      remaining: 0,
      limit: RATE_LIMIT_CAPACITY,
      resetSeconds: retryAfter,
      retryAfter,
    };
  }

  tokens -= 1;
  buckets.set(key, { tokens, updatedAt: now });
  const resetSeconds = Math.ceil((RATE_LIMIT_CAPACITY - tokens) / RATE_LIMIT_REFILL_PER_SEC);
  return {
    allowed: true,
    remaining: Math.floor(tokens),
    limit: RATE_LIMIT_CAPACITY,
    resetSeconds,
  };
}

function applyRateLimitHeaders(target: Headers, decision: RateLimitDecision): void {
  target.set('x-ratelimit-limit', String(decision.limit));
  target.set('x-ratelimit-remaining', String(decision.remaining));
  target.set('x-ratelimit-reset', String(Math.floor(Date.now() / 1000) + decision.resetSeconds));
  target.set('ratelimit-limit', String(decision.limit));
  target.set('ratelimit-remaining', String(decision.remaining));
  target.set('ratelimit-reset', String(decision.resetSeconds));
  if (decision.retryAfter !== undefined) {
    target.set('retry-after', String(decision.retryAfter));
  }
}

// ----------------------------------------------------------------------------
// Error builders
// ----------------------------------------------------------------------------

interface ErrorPayload {
  id?: string | number | null;
  code: number;
  message: string;
  details?: unknown;
}

function rpcErrorBody(payload: ErrorPayload): RpcProxyResponse {
  return {
    jsonrpc: '2.0',
    id: payload.id ?? null,
    error: payload.message,
    code: payload.code,
    ...(payload.details === undefined ? {} : { details: payload.details }),
  };
}

function rpcError(
  payload: ErrorPayload,
  status: number,
  decision?: RateLimitDecision,
  upstreamHeaders?: Headers
): NextResponse<RpcProxyResponse> {
  const response = NextResponse.json(rpcErrorBody(payload), { status });
  forwardRateLimitHeaders(response.headers, upstreamHeaders);
  if (decision) applyRateLimitHeaders(response.headers, decision);
  return response;
}

const UPSTREAM_RATE_LIMIT_HEADERS = [
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'retry-after',
];

function forwardRateLimitHeaders(target: Headers, source?: Headers): void {
  if (!source) return;
  for (const name of UPSTREAM_RATE_LIMIT_HEADERS) {
    const value = source.get(name);
    if (value && !target.has(name)) target.set(name, value);
  }
}

// ----------------------------------------------------------------------------
// Param validation
// ----------------------------------------------------------------------------

function validateMethodParams(method: string, params: unknown[]): void {
  switch (method) {
    case 'getBalance': {
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error('getBalance requires a valid Solana address as first parameter');
      }
      break;
    }
    case 'getAssetsByOwner': {
      const options = params[0] as { ownerAddress?: string } | undefined;
      if (!options?.ownerAddress || !isAddress(options.ownerAddress)) {
        throw new Error('getAssetsByOwner requires a valid ownerAddress in options');
      }
      break;
    }
    case 'getTokenAccounts': {
      const options = params[0] as { owner?: string; mint?: string } | undefined;
      if (!options?.owner || !isAddress(options.owner)) {
        throw new Error('getTokenAccounts requires a valid owner address in options');
      }
      if (options.mint && !isAddress(options.mint)) {
        throw new Error('getTokenAccounts mint must be a valid address if provided');
      }
      break;
    }
    case 'getSignaturesForAddress': {
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error(
          'getSignaturesForAddress requires a valid Solana address as first parameter'
        );
      }
      break;
    }
    case 'getAsset': {
      const options = params[0] as { id?: string } | undefined;
      if (!options?.id || !isAddress(options.id)) {
        throw new Error('getAsset requires a valid id (address) in options');
      }
      break;
    }
    case 'getTransactionsForAddress': {
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error(
          'getTransactionsForAddress requires a valid Solana address as first parameter'
        );
      }
      break;
    }
    case 'getAccountInfo': {
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error('getAccountInfo requires a valid Solana address as first parameter');
      }
      break;
    }
    case 'getVoteAccounts':
    case 'getLatestBlockhash':
    case 'simulateTransaction':
    case 'sendTransaction':
    case 'getEpochInfo':
    case 'getMinimumBalanceForRentExemption':
    case 'getSignatureStatuses':
    case 'getBlock':
      break;
  }
}

// ----------------------------------------------------------------------------
// Single-request dispatch — used by both single and batch flows.
// ----------------------------------------------------------------------------

type Network = 'mainnet' | 'devnet';

function rpcUrl(network: Network): string {
  const host =
    network === 'devnet' ? 'https://devnet.helius-rpc.com' : 'https://mainnet.helius-rpc.com';
  return `${host}/?api-key=${process.env.HELIUS_API_KEY}`;
}

async function dispatchOne(
  body: RpcProxyRequest,
  network: Network
): Promise<{ response: RpcProxyResponse; upstream?: Headers; httpStatus?: number }> {
  const id = body.id ?? null;
  const { method, params = [] } = body;

  if (typeof method !== 'string' || method.length === 0) {
    return {
      response: rpcErrorBody({
        id,
        code: ERROR_INVALID_REQUEST,
        message: 'Missing required field: method',
      }),
      httpStatus: 400,
    };
  }

  if (!isAllowedMethod(method)) {
    return {
      response: rpcErrorBody({
        id,
        code: ERROR_METHOD_NOT_ALLOWED,
        message: `Method "${method}" is not allowed`,
        details: { allowedMethods: ALLOWED_METHODS },
      }),
      httpStatus: 403,
    };
  }

  try {
    validateMethodParams(method, params);
  } catch (validationError) {
    return {
      response: rpcErrorBody({
        id,
        code: ERROR_INVALID_PARAMS,
        message:
          validationError instanceof Error
            ? validationError.message
            : 'Invalid parameters for method',
      }),
      httpStatus: 400,
    };
  }

  let upstreamHeaders: Headers | undefined;

  try {
    // Devnet always goes through raw JSON-RPC against devnet.helius-rpc.com.
    // The Helius SDK singleton is configured for mainnet, so devnet bypasses it.
    if (network === 'devnet') {
      const rpcResponse = await fetch(rpcUrl('devnet'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: id ?? 1, method, params }),
      });
      upstreamHeaders = rpcResponse.headers;
      const rpcData = await rpcResponse.json();
      if (rpcData.error) {
        throw new Error(rpcData.error.message || `${method} failed on devnet`);
      }
      return {
        response: {
          jsonrpc: '2.0',
          id,
          result: serializeBigInts(rpcData.result),
        },
        upstream: upstreamHeaders,
      };
    }

    const helius = getHeliusClient();
    let result: unknown;

    switch (method) {
      case 'getAsset':
        result = await helius.getAsset(params?.[0] as Parameters<typeof helius.getAsset>[0]);
        break;
      case 'getAssetsByOwner':
        result = await helius.getAssetsByOwner(
          params?.[0] as Parameters<typeof helius.getAssetsByOwner>[0]
        );
        break;
      case 'getTokenAccounts':
        result = await helius.getTokenAccounts(
          params?.[0] as Parameters<typeof helius.getTokenAccounts>[0]
        );
        break;
      case 'getTransactionsForAddress':
        result = await helius.getTransactionsForAddress(
          params as Parameters<typeof helius.getTransactionsForAddress>[0]
        );
        break;
      case 'getBlock': {
        const rpcResponse = await fetch(rpcUrl('mainnet'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 'getBlock', method: 'getBlock', params }),
        });
        upstreamHeaders = rpcResponse.headers;
        const rpcData = await rpcResponse.json();
        if (rpcData.error) {
          throw new Error(rpcData.error.message || 'getBlock failed');
        }
        result = rpcData.result;
        break;
      }
      case 'getBalance':
      case 'getSignaturesForAddress':
      case 'getTransaction':
      case 'getAccountInfo':
      case 'getVoteAccounts':
      case 'getLatestBlockhash':
      case 'simulateTransaction':
      case 'sendTransaction':
      case 'getEpochInfo':
      case 'getMinimumBalanceForRentExemption':
      case 'getSignatureStatuses':
        result = await (helius.raw as Record<string, (...args: unknown[]) => Promise<unknown>>)[
          method
        ](...(params || []));
        break;
      default:
        return {
          response: rpcErrorBody({
            id,
            code: ERROR_METHOD_NOT_ALLOWED,
            message: `Method "${method}" is not implemented`,
          }),
          httpStatus: 501,
        };
    }

    return {
      response: { jsonrpc: '2.0', id, result: serializeBigInts(result) },
      upstream: upstreamHeaders,
    };
  } catch (error) {
    console.error('RPC Proxy Error:', error);
    let message = 'RPC request failed';
    let details: unknown;
    if (error instanceof Error) {
      message = error.message;
      if ('response' in error) {
        const upstream = (error as { response?: { data?: unknown; headers?: Headers } }).response;
        if (upstream?.data) details = upstream.data;
        if (upstream?.headers) upstreamHeaders = upstream.headers;
      }
    }
    return {
      response: rpcErrorBody({ id, code: ERROR_INTERNAL, message, details }),
      upstream: upstreamHeaders,
      httpStatus: 500,
    };
  }
}

// ----------------------------------------------------------------------------
// HTTP entry point
// ----------------------------------------------------------------------------

function isBatch(value: unknown): value is RpcProxyRequest[] {
  return Array.isArray(value);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RpcProxyResponse | RpcProxyResponse[]>> {
  // 1. Rate limit before parsing the body so abusive traffic is cheap to reject.
  const clientKey = getClientKey(request);
  const decision = takeToken(clientKey);
  if (!decision.allowed) {
    return rpcError(
      {
        code: ERROR_RATE_LIMITED,
        message: 'Rate limit exceeded — retry after the duration in the `retry-after` header',
      },
      429,
      decision
    );
  }

  // 2. Parse the body.
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return rpcError(
      { code: ERROR_PARSE, message: 'Request body is not valid JSON' },
      400,
      decision
    );
  }

  // 3. Network selector: ?network=devnet routes to Solana devnet.
  const networkParam = request.nextUrl.searchParams.get('network');
  const network: Network = networkParam === 'devnet' ? 'devnet' : 'mainnet';

  // 4. Batch?
  if (isBatch(parsed)) {
    if (parsed.length === 0) {
      return rpcError(
        { code: ERROR_INVALID_REQUEST, message: 'Empty batch is not allowed' },
        400,
        decision
      );
    }
    if (parsed.length > 100) {
      return rpcError(
        {
          code: ERROR_INVALID_REQUEST,
          message: 'Batch size must not exceed 100 requests',
        },
        400,
        decision
      );
    }
    const results = await Promise.all(parsed.map((req) => dispatchOne(req, network)));
    const response = NextResponse.json(results.map((r) => r.response));
    applyRateLimitHeaders(response.headers, decision);
    response.headers.set('x-rpc-network', network);
    response.headers.set('x-rpc-batch-size', String(parsed.length));
    return response;
  }

  // 5. Single request.
  const body = parsed as RpcProxyRequest;
  const { response, upstream, httpStatus } = await dispatchOne(body, network);

  const next = NextResponse.json(response, { status: httpStatus ?? 200 });
  forwardRateLimitHeaders(next.headers, upstream);
  applyRateLimitHeaders(next.headers, decision);
  next.headers.set('x-rpc-network', network);
  return next;
}

// Health check / discovery endpoint
export function GET(): NextResponse {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'Helius Solana dApp Example — RPC proxy',
      jsonrpc: '2.0',
      transport: 'HTTP POST',
      endpoint: '/api/rpc',
      networks: ['mainnet', 'devnet'],
      networkSelector: 'Append ?network=devnet to route requests to Solana devnet.',
      batch: 'Send a JSON array of requests for batch dispatch (max 100).',
      allowedMethods: ALLOWED_METHODS,
      openapi: '/openapi.json',
      documentation: 'https://docs.helius.dev/rpc',
      rateLimits: {
        burstCapacity: RATE_LIMIT_CAPACITY,
        refillPerSecond: RATE_LIMIT_REFILL_PER_SEC,
        docs: 'https://demo.helius.dev/rate-limits',
      },
      authorization:
        'Server-side only. The demo holds a shared Helius API key; clients call /api/rpc without auth.',
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export function OPTIONS(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '3600',
    },
  });
}

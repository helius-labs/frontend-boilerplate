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
  // Phase 9: Validators and Staking
  'getVoteAccounts',
  'getEpochInfo',
  'simulateTransaction',
  'sendTransaction',
  'getLatestBlockhash',
  'getMinimumBalanceForRentExemption',
  'getSignatureStatuses',
  // Archival blocks
  'getBlock',
] as const;

// JSON-RPC 2.0 standard error codes + Helius-specific extensions.
// See https://www.jsonrpc.org/specification#error_object
const ERROR_PARSE = -32700;
const ERROR_INVALID_REQUEST = -32600;
const ERROR_METHOD_NOT_ALLOWED = -32005;
const ERROR_INVALID_PARAMS = -32602;
const ERROR_INTERNAL = -32603;

function isAllowedMethod(method: string): method is AllowedMethod {
  return ALLOWED_METHODS.includes(method as AllowedMethod);
}

interface ErrorPayload {
  id?: string | number | null;
  code: number;
  message: string;
  details?: unknown;
}

/**
 * Build a JSON-RPC shaped error response that also keeps the legacy
 * top-level `error: string` field for backward compatibility with existing
 * client fetchers.
 */
function rpcError(
  payload: ErrorPayload,
  status: number,
  upstreamHeaders?: Headers
): NextResponse<RpcProxyResponse> {
  const body: RpcProxyResponse = {
    jsonrpc: '2.0',
    id: payload.id ?? null,
    error: payload.message,
    code: payload.code,
    ...(payload.details === undefined ? {} : { details: payload.details }),
  };
  const response = NextResponse.json(body, { status });
  forwardRateLimitHeaders(response.headers, upstreamHeaders);
  return response;
}

const RATE_LIMIT_HEADERS = [
  'x-ratelimit-limit',
  'x-ratelimit-remaining',
  'x-ratelimit-reset',
  'retry-after',
  'ratelimit-limit',
  'ratelimit-remaining',
  'ratelimit-reset',
];

function forwardRateLimitHeaders(target: Headers, source?: Headers): void {
  if (!source) return;
  for (const name of RATE_LIMIT_HEADERS) {
    const value = source.get(name);
    if (value) target.set(name, value);
  }
}

/**
 * Validate parameters for specific methods.
 * Throws descriptive errors for invalid inputs.
 */
function validateMethodParams(method: string, params: unknown[]): void {
  switch (method) {
    case 'getBalance': {
      // getBalance(address, config?)
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error('getBalance requires a valid Solana address as first parameter');
      }
      break;
    }

    case 'getAssetsByOwner': {
      // getAssetsByOwner({ ownerAddress, ... })
      const options = params[0] as { ownerAddress?: string } | undefined;
      if (!options?.ownerAddress || !isAddress(options.ownerAddress)) {
        throw new Error('getAssetsByOwner requires a valid ownerAddress in options');
      }
      break;
    }

    case 'getTokenAccounts': {
      // getTokenAccounts({ owner, mint?, ... })
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
      // getSignaturesForAddress(address, config?)
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error(
          'getSignaturesForAddress requires a valid Solana address as first parameter'
        );
      }
      break;
    }

    case 'getAsset': {
      // getAsset({ id: string, ... })
      const options = params[0] as { id?: string } | undefined;
      if (!options?.id || !isAddress(options.id)) {
        throw new Error('getAsset requires a valid id (address) in options');
      }
      break;
    }

    case 'getTransactionsForAddress': {
      // getTransactionsForAddress(address, options?)
      const address = params[0];
      if (typeof address !== 'string' || !isAddress(address)) {
        throw new Error(
          'getTransactionsForAddress requires a valid Solana address as first parameter'
        );
      }
      break;
    }

    case 'getAccountInfo': {
      // getAccountInfo(address, config?)
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
      // These methods have optional/complex params - allow through
      break;

    // Add more validations as methods are added
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<RpcProxyResponse>> {
  let id: string | number | null = null;
  let body: RpcProxyRequest;
  try {
    body = (await request.json()) as RpcProxyRequest;
  } catch {
    return rpcError(
      {
        code: ERROR_PARSE,
        message: 'Request body is not valid JSON',
      },
      400
    );
  }

  id = body.id ?? null;
  const { method, params = [] } = body;

  if (typeof method !== 'string' || method.length === 0) {
    return rpcError(
      {
        id,
        code: ERROR_INVALID_REQUEST,
        message: 'Missing required field: method',
      },
      400
    );
  }

  if (!isAllowedMethod(method)) {
    return rpcError(
      {
        id,
        code: ERROR_METHOD_NOT_ALLOWED,
        message: `Method "${method}" is not allowed`,
        details: { allowedMethods: ALLOWED_METHODS },
      },
      403
    );
  }

  try {
    validateMethodParams(method, params);
  } catch (validationError) {
    return rpcError(
      {
        id,
        code: ERROR_INVALID_PARAMS,
        message:
          validationError instanceof Error
            ? validationError.message
            : 'Invalid parameters for method',
      },
      400
    );
  }

  let upstreamHeaders: Headers | undefined;

  try {
    const helius = getHeliusClient();

    // Route to appropriate Helius method
    // DAS methods (getAsset, getAssetsByOwner, etc.) are on the client directly
    // Standard RPC methods (getBalance, getTransaction) need to go through raw.rpc
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
        const rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;
        const rpcResponse = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'getBlock',
            method: 'getBlock',
            params: params,
          }),
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
        return rpcError(
          {
            id,
            code: ERROR_METHOD_NOT_ALLOWED,
            message: `Method "${method}" is not implemented`,
          },
          501
        );
    }

    const response = NextResponse.json({
      jsonrpc: '2.0' as const,
      id,
      result: serializeBigInts(result),
    });
    forwardRateLimitHeaders(response.headers, upstreamHeaders);
    return response;
  } catch (error) {
    console.error('RPC Proxy Error:', error);

    let message = 'RPC request failed';
    let details: unknown;

    if (error instanceof Error) {
      message = error.message;
      if ('response' in error) {
        const upstream = (error as { response?: { data?: unknown; headers?: Headers } }).response;
        if (upstream?.data) {
          details = upstream.data;
          console.error('Helius API Response:', upstream.data);
        }
        if (upstream?.headers) {
          upstreamHeaders = upstream.headers;
        }
      }
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
    }

    return rpcError(
      {
        id,
        code: ERROR_INTERNAL,
        message,
        details,
      },
      500,
      upstreamHeaders
    );
  }
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
      allowedMethods: ALLOWED_METHODS,
      documentation: 'https://docs.helius.dev/rpc',
      rateLimits: 'https://demo.helius.dev/rate-limits',
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

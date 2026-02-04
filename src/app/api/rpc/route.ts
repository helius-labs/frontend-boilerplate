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
  // Archival blocks
  'getBlock',
] as const;

function isAllowedMethod(method: string): method is AllowedMethod {
  return ALLOWED_METHODS.includes(method as AllowedMethod);
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
    case 'getBlock':
      // These methods have optional/complex params - allow through
      break;

    // Add more validations as methods are added
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<RpcProxyResponse>> {
  try {
    const body = (await request.json()) as RpcProxyRequest;
    const { method, params = [] } = body;

    // Validate method is allowed
    if (!method || !isAllowedMethod(method)) {
      return NextResponse.json(
        { error: `Method "${method}" is not allowed. Allowed: ${ALLOWED_METHODS.join(', ')}` },
        { status: 403 }
      );
    }

    // Validate method-specific parameters
    try {
      validateMethodParams(method, params);
    } catch (validationError) {
      return NextResponse.json(
        {
          error: validationError instanceof Error ? validationError.message : 'Invalid parameters',
        },
        { status: 400 }
      );
    }

    const helius = getHeliusClient();

    // Route to appropriate Helius method
    // DAS methods (getAsset, getAssetsByOwner, etc.) are on the client directly
    // Standard RPC methods (getBalance, getTransaction) need to go through raw.rpc
    let result: unknown;

    switch (method) {
      case 'getAsset':
        // getAsset expects { id: string, options?: {...} }
        result = await helius.getAsset(params?.[0] as Parameters<typeof helius.getAsset>[0]);
        break;
      case 'getAssetsByOwner':
        // getAssetsByOwner expects { ownerAddress: string, ... }
        result = await helius.getAssetsByOwner(
          params?.[0] as Parameters<typeof helius.getAssetsByOwner>[0]
        );
        break;
      case 'getTokenAccounts':
        // getTokenAccounts expects { owner: string, mint?: string, ... }
        result = await helius.getTokenAccounts(
          params?.[0] as Parameters<typeof helius.getTokenAccounts>[0]
        );
        break;
      case 'getTransactionsForAddress':
        // getTransactionsForAddress expects [address, config?]
        result = await helius.getTransactionsForAddress(
          params as Parameters<typeof helius.getTransactionsForAddress>[0]
        );
        break;
      case 'getBlock': {
        // getBlock needs direct JSON-RPC call (not available on helius.raw)
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
        // Standard RPC methods go through raw.rpc
        result = await (helius.raw as Record<string, (...args: unknown[]) => Promise<unknown>>)[
          method
        ](...(params || []));
        break;
      default:
        return NextResponse.json(
          { error: `Method "${method}" is not implemented` },
          { status: 501 }
        );
    }

    // Serialize BigInt values to strings for JSON compatibility
    return NextResponse.json({ result: serializeBigInts(result) });
  } catch (error) {
    console.error('RPC Proxy Error:', error);

    // Extract detailed error information
    let message = 'RPC request failed';
    let details: string | undefined;

    if (error instanceof Error) {
      message = error.message;
      // Check for Helius SDK error response
      if ('response' in error) {
        const response = (error as { response?: { data?: unknown } }).response;
        if (response?.data) {
          details = JSON.stringify(response.data);
          console.error('Helius API Response:', response.data);
        }
      }
      // Check for cause
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
    }

    return NextResponse.json({ error: message, details }, { status: 500 });
  }
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    allowedMethods: ALLOWED_METHODS,
  });
}

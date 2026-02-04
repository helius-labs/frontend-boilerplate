// Proxy for Helius Enhanced Transactions REST API
// Different from RPC proxy - this uses REST endpoints
// Source: https://www.helius.dev/docs/api-reference/enhanced-transactions/gettransactionsbyaddress
import { NextRequest, NextResponse } from 'next/server';
import { isAddress } from '@solana/kit';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const BASE_URL = 'https://api.helius.xyz';

// Allowed endpoints
const ALLOWED_ENDPOINTS = ['getTransactionsByAddress', 'getTransactions'] as const;

function isAllowedEndpoint(endpoint: string): endpoint is AllowedEndpoint {
  return ALLOWED_ENDPOINTS.includes(endpoint as AllowedEndpoint);
}

export async function POST(request: NextRequest): Promise<NextResponse<EnhancedProxyResponse>> {
  if (!HELIUS_API_KEY) {
    return NextResponse.json({ error: 'Helius API key not configured' }, { status: 500 });
  }

  try {
    const body = (await request.json()) as EnhancedProxyRequest;
    const { endpoint, params } = body;

    // Validate endpoint
    if (!endpoint || !isAllowedEndpoint(endpoint)) {
      return NextResponse.json(
        {
          error: `Endpoint "${endpoint}" is not allowed. Allowed: ${ALLOWED_ENDPOINTS.join(', ')}`,
        },
        { status: 403 }
      );
    }

    // Route based on endpoint
    if (endpoint === 'getTransactionsByAddress') {
      return handleGetTransactionsByAddress(params);
    } else if (endpoint === 'getTransactions') {
      return handleGetTransactions(params);
    }

    return NextResponse.json({ error: 'Unknown endpoint' }, { status: 400 });
  } catch (error) {
    console.error('Enhanced API proxy error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch transactions',
      },
      { status: 500 }
    );
  }
}

async function handleGetTransactionsByAddress(
  params: EnhancedProxyRequest['params']
): Promise<NextResponse<EnhancedProxyResponse>> {
  const { address } = params;

  // Validate address
  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'Valid Solana address required' }, { status: 400 });
  }

  // Build URL with query parameters
  const url = new URL(`${BASE_URL}/v0/addresses/${address}/transactions`);
  url.searchParams.set('api-key', HELIUS_API_KEY!);

  // Add optional parameters
  if (params.type) url.searchParams.set('type', params.type);
  if (params.limit) url.searchParams.set('limit', params.limit.toString());
  if (params['sort-order']) url.searchParams.set('sort-order', params['sort-order']);
  if (params['before-signature'])
    url.searchParams.set('before-signature', params['before-signature']);
  if (params['after-signature']) url.searchParams.set('after-signature', params['after-signature']);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `Helius API error: ${response.status} ${errorText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ result: data });
}

async function handleGetTransactions(
  params: EnhancedProxyRequest['params']
): Promise<NextResponse<EnhancedProxyResponse>> {
  const { signatures } = params;

  if (!signatures || !Array.isArray(signatures) || signatures.length === 0) {
    return NextResponse.json({ error: 'signatures array required' }, { status: 400 });
  }

  // POST to /v0/transactions
  const url = new URL(`${BASE_URL}/v0/transactions`);
  url.searchParams.set('api-key', HELIUS_API_KEY!);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactions: signatures }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `Helius API error: ${response.status} ${errorText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({ result: data });
}

// Health check endpoint
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    allowedEndpoints: ALLOWED_ENDPOINTS,
  });
}

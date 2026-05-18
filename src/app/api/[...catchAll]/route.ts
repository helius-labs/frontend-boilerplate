// Catch-all for unknown /api/* paths. Returns a JSON 404 instead of the
// default HTML 404 so agents probing the API surface always parse JSON.
import { NextRequest, NextResponse } from 'next/server';

function json404(request: NextRequest): NextResponse {
  return NextResponse.json(
    {
      error: 'Not Found',
      message: `No API endpoint at ${request.nextUrl.pathname}`,
      catalog: '/api',
      documentation: 'https://docs.helius.dev',
    },
    {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export function GET(request: NextRequest): NextResponse {
  return json404(request);
}

export function POST(request: NextRequest): NextResponse {
  return json404(request);
}

export function PUT(request: NextRequest): NextResponse {
  return json404(request);
}

export function PATCH(request: NextRequest): NextResponse {
  return json404(request);
}

export function DELETE(request: NextRequest): NextResponse {
  return json404(request);
}

export function OPTIONS(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}

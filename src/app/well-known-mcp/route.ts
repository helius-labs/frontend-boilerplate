// Served at /.well-known/mcp via next.config.ts rewrite. A standalone path
// segment is impossible because /.well-known/mcp/ already exists as a
// directory hosting the server-card.json. This route handler returns the
// MCP discovery descriptor that points clients at the server card.
import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

export function GET(): NextResponse {
  return NextResponse.json(
    {
      $schema: 'https://modelcontextprotocol.io/schemas/discovery/2025-03/mcp-discovery.json',
      version: '2025-03-26',
      servers: [
        {
          name: 'helius-docs',
          displayName: 'Helius Documentation MCP',
          description:
            'Search and retrieve content from the Helius developer documentation: RPC methods, DAS API reference, Laserstream guides, and Phantom Connect integration patterns.',
          url: 'https://mcp.helius.dev/docs',
          transport: 'streamable-http',
          card: `${BASE_URL}/.well-known/mcp/server-card.json`,
          category: 'documentation',
          tags: ['solana', 'helius', 'rpc', 'das', 'documentation'],
        },
      ],
      discoveredFrom: `${BASE_URL}/.well-known/mcp`,
      documentation: 'https://docs.helius.dev',
      provider: { name: 'Helius', url: 'https://www.helius.dev' },
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

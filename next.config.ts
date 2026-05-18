import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  async rewrites() {
    return [
      // MCP discovery: /.well-known/mcp/ exists as a directory holding
      // server-card.json, so the bare /.well-known/mcp path needs a route
      // handler aliased through a rewrite.
      { source: '/.well-known/mcp', destination: '/well-known-mcp' },
      // URL versioning: /api/v1/* aliases /api/* and /api/v1/openapi.json
      // aliases /openapi.json. Lets agents and scanners discover a /v1/
      // path prefix without changing the underlying handlers.
      { source: '/api/v1/rpc', destination: '/api/rpc' },
      { source: '/api/v1/rpc/batch', destination: '/api/rpc' },
      { source: '/api/v1/helius/enhanced', destination: '/api/helius/enhanced' },
      { source: '/api/v1/laserstream', destination: '/api/laserstream' },
      { source: '/api/v1/laserstream/status', destination: '/api/laserstream/status' },
      { source: '/api/v1/openapi.json', destination: '/openapi.json' },
      { source: '/api/v1', destination: '/api' },
      // Bulk dispatch alias: /api/rpc/batch hits the same handler as /api/rpc,
      // which already accepts a JSON-RPC array body. Exposing it as a separate
      // path lets OpenAPI list `callRpcBatch` as a first-class operation
      // instead of relying on a oneOf body shape.
      { source: '/api/rpc/batch', destination: '/api/rpc' },
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/api-catalog',
        headers: [
          { key: 'Content-Type', value: 'application/linkset+json; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/openapi.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.oai.openapi+json; charset=utf-8',
          },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/oauth-protected-resource',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/agent-card.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/http-message-signatures-directory',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/http-message-signatures-directory+json; charset=utf-8',
          },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/.well-known/mcp/server-card.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/.well-known/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/.well-known/pricing.md',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/agents.md',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/pricing.md',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      {
        source: '/index.md',
        headers: [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;

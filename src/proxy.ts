// Proxy for agent-readability:
//
//   1. Adds RFC 8288 HTTP `Link` headers pointing to sitemap, llms.txt,
//      llms-full.txt, the api-catalog, and the OpenAPI service description.
//      Discovery tools (acceptmarkdown.com, ora, A2A scanners) read these
//      headers instead of parsing HTML.
//
//   2. Implements markdown content negotiation. When a client requests `/`
//      with `Accept: text/markdown`, returns `/index.md`. Also sets
//      `Vary: Accept` so caches do not collapse the two representations.
//
//   3. Exposes `?mode=agent` on `/` as a shortcut that returns the markdown
//      mirror without needing an Accept header — useful for crawlers that
//      cannot set custom headers.
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

const LINK_HEADER = [
  `<${BASE_URL}/sitemap.xml>; rel="sitemap"`,
  `<${BASE_URL}/llms.txt>; rel="describedby"; type="text/plain"`,
  `<${BASE_URL}/llms-full.txt>; rel="alternate"; type="text/plain"; title="Full reference"`,
  `<${BASE_URL}/index.md>; rel="alternate"; type="text/markdown"; title="Markdown mirror"`,
  `<${BASE_URL}/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"; title="Demo proxy OpenAPI 3.1"`,
  `<https://docs.helius.dev/api-reference/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"; title="Helius canonical OpenAPI"`,
  `<https://docs.helius.dev>; rel="service-doc"; type="text/html"`,
  `<${BASE_URL}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  `<${BASE_URL}/.well-known/agent-card.json>; rel="agent-card"; type="application/json"`,
  `<${BASE_URL}/.well-known/mcp/server-card.json>; rel="mcp-server-card"; type="application/json"`,
  `<${BASE_URL}/.well-known/oauth-protected-resource>; rel="oauth-protected-resource"; type="application/json"`,
  `<${BASE_URL}/.well-known/http-message-signatures-directory>; rel="http-message-signatures-directory"`,
  `<${BASE_URL}/agents.md>; rel="describedby"; type="text/markdown"`,
  `<${BASE_URL}/pricing.md>; rel="payment"; type="text/markdown"`,
  `<${BASE_URL}/ask>; rel="search"; type="application/ld+json"; title="NLWeb /ask"`,
].join(', ');

function acceptsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Treat as markdown only if text/markdown beats text/html — i.e. it has a
  // higher q-value, OR it appears before text/html with no q-values set.
  const types = accept.split(',').map((entry) => {
    const [type, ...params] = entry
      .trim()
      .split(';')
      .map((s) => s.trim());
    const qParam = params.find((p) => p.startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    return { type, q: Number.isFinite(q) ? q : 1 };
  });
  const md = types.find((t) => t.type === 'text/markdown');
  if (!md) return false;
  const html = types.find((t) => t.type === 'text/html' || t.type === '*/*');
  if (!html) return true;
  return md.q > html.q;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname, searchParams } = request.nextUrl;
  const accept = request.headers.get('accept');

  // ?mode=agent on / serves the markdown mirror without needing Accept.
  if (pathname === '/' && searchParams.get('mode') === 'agent') {
    const url = request.nextUrl.clone();
    url.pathname = '/index.md';
    url.searchParams.delete('mode');
    const response = NextResponse.rewrite(url);
    response.headers.set('Vary', 'Accept');
    response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
    return response;
  }

  // Accept: text/markdown — return the markdown mirror.
  if (pathname === '/' && acceptsMarkdown(accept)) {
    const url = request.nextUrl.clone();
    url.pathname = '/index.md';
    const response = NextResponse.rewrite(url);
    response.headers.set('Vary', 'Accept');
    response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
    return response;
  }

  // Default: pass through and attach Link headers + Vary: Accept on HTML.
  const response = NextResponse.next();
  response.headers.set('Link', LINK_HEADER);
  response.headers.set('Vary', 'Accept');
  return response;
}

export const config = {
  // Skip Next.js internals and obvious static assets. Match HTML and
  // markdown-relevant routes only.
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico|icon.svg|icon-|apple-icon|.*\\.svg|.*\\.png|.*\\.ico|.*\\.txt|.*\\.xml|.*\\.json|.*\\.md|\\.well-known/).*)',
  ],
};

// Custom robots.txt with explicit AI crawler tiers, NLWeb schemamap directive,
// and links to agent-readable surfaces (llms.txt, llms-full.txt, agents.md).
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://demo.helius.dev';

const AI_CRAWLERS_ALLOW = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Claude-User',
  'Claude-SearchBot',
  'Google-Extended',
  'GoogleOther',
  'PerplexityBot',
  'Perplexity-User',
  'DeepSeekBot',
  'ora-agent',
  'Applebot-Extended',
  'cohere-ai',
  'Bytespider',
  'YouBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'Diffbot',
  'FacebookBot',
  'Bingbot',
];

export function GET(): Response {
  const lines: string[] = [];

  lines.push('# robots.txt for demo.helius.dev');
  lines.push('# A Helius RPC showcase and clonable template for Solana developers.');
  lines.push('#');
  lines.push('# Agent-readable surfaces:');
  lines.push(`#   ${BASE_URL}/llms.txt`);
  lines.push(`#   ${BASE_URL}/llms-full.txt`);
  lines.push(`#   ${BASE_URL}/agents.md`);
  lines.push(`#   ${BASE_URL}/pricing.md`);
  lines.push(`#   ${BASE_URL}/index.md`);
  lines.push(`#   ${BASE_URL}/.well-known/agent-card.json`);
  lines.push(`#   ${BASE_URL}/.well-known/mcp/server-card.json`);
  lines.push(`#   ${BASE_URL}/.well-known/api-catalog`);
  lines.push(`#   ${BASE_URL}/.well-known/oauth-protected-resource`);
  lines.push('');

  for (const agent of AI_CRAWLERS_ALLOW) {
    lines.push(`User-agent: ${agent}`);
    lines.push('Allow: /');
    lines.push('Disallow: /api/');
    lines.push('');
  }

  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('Disallow: /api/');
  lines.push('');

  lines.push(`Sitemap: ${BASE_URL}/sitemap.xml`);
  lines.push(`Schemamap: ${BASE_URL}/sitemap.xml`);
  lines.push(`Host: ${new URL(BASE_URL).host}`);

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

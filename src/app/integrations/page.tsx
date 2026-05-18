import {
  BASE_URL,
  JsonLdMultiple,
  createFAQSchema,
  createTechArticleWithBreadcrumbs,
} from '@/shared/lib/json-ld';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { ExternalLink } from '@/shared/ui/link';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

const INTEGRATION_FAQ = [
  {
    question: 'Which AI platforms can use this demo?',
    answer:
      'Claude.ai (via MCP), Cursor, VS Code with the Continue extension, Goose, ChatGPT custom GPTs, and any agent that consumes OpenAPI 3.1 specs. The /openapi.json endpoint plus the /.well-known/agent-card.json file describe the demo so function-calling and tool-use systems can target it directly.',
  },
  {
    question: 'Does Claude.ai have native MCP support?',
    answer:
      'Yes — Claude Desktop (macOS and Windows) supports MCP servers configured in claude_desktop_config.json. Add the Helius docs MCP at mcp.helius.dev/docs to give Claude access to the full Helius developer documentation. The demo also publishes an MCP server card at /.well-known/mcp/server-card.json.',
  },
  {
    question: 'Can ChatGPT use the demo as a custom GPT action?',
    answer:
      'Yes. Import https://demo.helius.dev/openapi.json into the GPT Builder as an Action. Methods like getBalance, getAssetsByOwner, and getTransactionsForAddress will appear as callable functions. Authentication is set to None because the demo holds the Helius API key server-side.',
  },
];

export default function IntegrationsPage() {
  const schemas = createTechArticleWithBreadcrumbs({
    name: 'AI Platform Integrations',
    headline:
      'How to integrate the Helius Solana demo with Claude.ai, Cursor, VS Code, Goose, and ChatGPT',
    description:
      'Copy-paste configurations for the major AI platforms that can call the demo as a tool or MCP server.',
    url: `${BASE_URL}/integrations`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Integrations', url: `${BASE_URL}/integrations` },
    ],
    keywords: [
      'claude.ai',
      'cursor',
      'vs code',
      'continue',
      'goose',
      'chatgpt',
      'mcp',
      'integration',
    ],
  });

  return (
    <>
      <JsonLdMultiple schemas={[...schemas, createFAQSchema(INTEGRATION_FAQ)]} />
      <PageContainer>
        <Breadcrumb />
        <PageHeader
          title="AI platform integrations"
          description="Plug the Helius demo into the major AI clients. Each block is copy-paste ready."
          path="/integrations"
        />

        <section className="max-w-none space-y-6 [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-helius-orange [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
          <h2>Claude.ai (Desktop with MCP)</h2>
          <p>
            Claude Desktop reads{' '}
            <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> on macOS or{' '}
            <code>%APPDATA%/Claude/claude_desktop_config.json</code> on Windows. Add the Helius docs
            MCP:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`{
  "mcpServers": {
    "helius-docs": {
      "url": "https://mcp.helius.dev/docs",
      "transport": "streamable-http"
    }
  }
}`}
          </pre>
          <p>
            Restart Claude Desktop. The Helius docs tools appear in the tool picker. Ask things like
            &quot;how does getAssetsByOwner pagination work?&quot; — Claude will call the docs MCP
            and quote the canonical docs.
          </p>

          <h2>Cursor</h2>
          <p>
            Cursor reads <code>~/.cursor/mcp.json</code> (or the equivalent on Windows). Use the
            same MCP server card:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`{
  "mcpServers": {
    "helius-docs": {
      "url": "https://mcp.helius.dev/docs"
    }
  }
}`}
          </pre>
          <p>
            Cursor will pick up the tools when you next reload. The agent panel exposes them under
            the MCP tab.
          </p>

          <h2>VS Code with Continue</h2>
          <p>
            The <ExternalLink href="https://www.continue.dev">Continue</ExternalLink> extension
            supports OpenAPI tool registration. Open <code>~/.continue/config.json</code> and add:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`{
  "tools": [
    {
      "type": "openapi",
      "url": "https://demo.helius.dev/openapi.json"
    }
  ]
}`}
          </pre>
          <p>
            The demo&apos;s RPC methods will appear as callable tools in any Continue chat. No
            credentials are required because the demo holds the Helius API key server-side.
          </p>

          <h2>Goose (Block&apos;s open-source agent)</h2>
          <p>
            <ExternalLink href="https://block.github.io/goose/">Goose</ExternalLink> reads{' '}
            <code>~/.config/goose/config.yaml</code>. Register the Helius docs MCP:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`extensions:
  helius-docs:
    type: streamable_http
    url: https://mcp.helius.dev/docs
    enabled: true`}
          </pre>
          <p>
            Run <code>goose session</code> and Goose will load the tools at startup.
          </p>

          <h2>ChatGPT — Custom GPT with Actions</h2>
          <p>
            Open the GPT Builder, go to the <strong>Actions</strong> tab, and click{' '}
            <strong>Import from URL</strong>. Paste:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`https://demo.helius.dev/openapi.json`}
          </pre>
          <p>
            Set <strong>Authentication</strong> to <strong>None</strong>. ChatGPT will discover{' '}
            <code>callRpc</code>, <code>callEnhancedApi</code>, <code>nlwebAsk</code>, and the other
            operations as callable functions.
          </p>

          <h2>Perplexity / generic OpenAPI consumers</h2>
          <p>
            Any agent that supports OpenAPI 3.1 tool registration can use the demo. Point it at{' '}
            <ExternalLink href="/openapi.json">demo.helius.dev/openapi.json</ExternalLink>. The spec
            includes <code>operationId</code> for every endpoint so function-calling systems can
            target them by name.
          </p>

          <h2>NLWeb-compatible clients</h2>
          <p>
            Clients that speak NLWeb (Microsoft&apos;s natural-language web protocol) can POST
            queries to <code>/ask</code>:
          </p>
          <pre className="bg-muted/50 border border-border/30 rounded-md p-4 overflow-x-auto text-xs">
            {`curl -X POST https://demo.helius.dev/ask \\
  -H "Content-Type: application/json" \\
  -d '{"query":"how do I get all NFTs owned by a wallet","streaming":false}'`}
          </pre>
          <p>
            The response is a JSON-LD <code>ItemList</code> of relevant pages (or a streamed
            <code>text/event-stream</code> when <code>streaming</code> is true).
          </p>

          <h2>Helius dashboard (production)</h2>
          <p>
            The integrations above use the demo&apos;s shared API key. For production traffic, sign
            up at{' '}
            <ExternalLink href="https://dashboard.helius.dev/signup">
              dashboard.helius.dev/signup
            </ExternalLink>{' '}
            and call Helius RPC directly. The free tier covers most development needs.
          </p>
        </section>
      </PageContainer>
    </>
  );
}

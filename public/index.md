# Solana dApp Example

> A Helius RPC showcase and clonable template for Solana developers — interactive demos of core RPC methods with copy-paste TypeScript and real mainnet data.

**Site:** [https://demo.helius.dev](https://demo.helius.dev)
**Source:** [github.com/helius-labs/frontend-boilerplate](https://github.com/helius-labs/frontend-boilerplate)
**License:** MIT
**Maintained by:** [Helius](https://www.helius.dev)

## What this site is

A production-ready Next.js 16 application demonstrating how to build Solana dApps with Helius RPC. Every demo runs against real mainnet data and includes copy-paste TypeScript plus cURL snippets. The entire codebase is a feature-sliced template you can clone, delete what you don't need, and ship.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19, React Compiler)
- [@solana/kit](https://www.npmjs.com/package/@solana/kit) 6.x (modern, tree-shakeable — not @solana/web3.js)
- [Helius SDK](https://www.npmjs.com/package/helius-sdk) 2.x for RPC and DAS API
- [@phantom/react-sdk](https://www.npmjs.com/package/@phantom/react-sdk) for wallet integration
- [SWR](https://swr.vercel.app) 2.x for client-side data fetching
- [Tailwind CSS 4](https://tailwindcss.com) with shadcn/ui
- TypeScript 5.x in strict mode

## Demos

- [/phantom-connect](https://demo.helius.dev/phantom-connect) — Phantom wallet integration, social login, transactions, staking
- [/get-balances](https://demo.helius.dev/get-balances) — SOL, SPL tokens, and full portfolio balances
- [/list-wallet-assets](https://demo.helius.dev/list-wallet-assets) — NFTs, fungible tokens, compressed NFTs via the DAS API
- [/get-transactions](https://demo.helius.dev/get-transactions) — Transaction history with pagination and type filters
- [/get-assets](https://demo.helius.dev/get-assets) — NFT and token metadata, attributes, prices
- [/program-info](https://demo.helius.dev/program-info) — Program inspection, upgrade authority, IDL
- [/laserstream](https://demo.helius.dev/laserstream) — Real-time block streaming via WebSocket
- [/archival-blocks](https://demo.helius.dev/archival-blocks) — Historical block data, including genesis

## Quick start

```bash
git clone https://github.com/helius-labs/frontend-boilerplate.git
cd frontend-boilerplate
pnpm install
cp .env.example .env.local
# Set HELIUS_API_KEY from https://dashboard.helius.dev/signup
pnpm dev
```

## Agent-readable resources

- [/llms.txt](https://demo.helius.dev/llms.txt) — short summary for LLM context
- [/llms-full.txt](https://demo.helius.dev/llms-full.txt) — complete reference documentation
- [/agents.md](https://demo.helius.dev/agents.md) — AGENTS.md with build, code style, and architecture rules
- [/pricing.md](https://demo.helius.dev/pricing.md) — machine-readable pricing for the underlying Helius RPC service
- [/.well-known/agent-card.json](https://demo.helius.dev/.well-known/agent-card.json) — A2A agent card
- [/.well-known/mcp/server-card.json](https://demo.helius.dev/.well-known/mcp/server-card.json) — MCP server card
- [/.well-known/api-catalog](https://demo.helius.dev/.well-known/api-catalog) — RFC 9727 link set
- [/.well-known/oauth-protected-resource](https://demo.helius.dev/.well-known/oauth-protected-resource) — RFC 9728 metadata
- [/sitemap.xml](https://demo.helius.dev/sitemap.xml)

## Pricing

The demo is free. Underlying Helius RPC has a generous free tier and paid plans starting at $49/month. See [/pricing.md](https://demo.helius.dev/pricing.md) or the canonical page at [helius.dev/pricing](https://www.helius.dev/pricing).

## Contact

- Get an API key: [dashboard.helius.dev/signup](https://dashboard.helius.dev/signup)
- Support: [support@helius.dev](mailto:support@helius.dev)
- Status: [helius.statuspage.io](https://helius.statuspage.io)
- Docs: [docs.helius.dev](https://docs.helius.dev)

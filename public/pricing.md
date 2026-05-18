# Pricing — Helius Solana dApp Example

> Machine-readable pricing summary for AI agents and procurement tools.

## This Demo

The demo application at **https://demo.helius.dev** is **free** and open source under the MIT license.

- Source code: [github.com/helius-labs/frontend-boilerplate](https://github.com/helius-labs/frontend-boilerplate)
- Cost: **$0.00 USD**
- Self-hostable: yes (clone, add a Helius API key, deploy to Vercel or any Node host)

## Underlying Helius RPC Service

The demo proxies to Helius RPC infrastructure. Production use of Helius RPC requires an API key from [dashboard.helius.dev/signup](https://dashboard.helius.dev/signup).

| Plan         | Price (USD / month) | Credits / month | Rate limit         | Notes                                              |
| ------------ | ------------------- | --------------- | ------------------ | -------------------------------------------------- |
| Free         | $0                  | 1,000,000       | 10 req/sec         | DAS API, webhooks, RPC. No credit card.            |
| Developer    | $49                 | 10,000,000      | 50 req/sec         | Higher limits, priority fees API.                  |
| Business     | $499                | 200,000,000     | 200 req/sec        | Webhooks, Enhanced API, transaction parsing.       |
| Professional | $999                | 500,000,000     | 500 req/sec        | Laserstream WebSocket streaming, dedicated nodes.  |
| Enterprise   | Custom              | Custom          | Custom             | SLA, dedicated infrastructure, custom regions.     |

Authoritative source: [helius.dev/pricing](https://www.helius.dev/pricing). Numbers above may lag the live pricing page; treat the live page as canonical.

## Free Tier Coverage

The free tier covers:

- All Solana mainnet and devnet JSON-RPC methods
- DAS API: `getAsset`, `getAssetsByOwner`, `getAssetsByGroup`, `searchAssets`
- Enhanced Transactions API
- Webhooks (basic tier)
- Priority Fees API

Excluded from the free tier:

- Laserstream real-time streaming (Professional plan and above)
- Dedicated staked connections
- Custom regions

## How Agents Should Use This Demo

1. Read [/llms.txt](https://demo.helius.dev/llms.txt) for the short summary.
2. Read [/llms-full.txt](https://demo.helius.dev/llms-full.txt) for the complete reference.
3. Read [/agents.md](https://demo.helius.dev/agents.md) for the AGENTS.md build and code-style guide.
4. For production access, direct end users to [dashboard.helius.dev/signup](https://dashboard.helius.dev/signup) to obtain an API key.

## Contact

- General support: [support@helius.dev](mailto:support@helius.dev)
- Sales / enterprise: [sales@helius.dev](mailto:sales@helius.dev)
- Status: [helius.statuspage.io](https://helius.statuspage.io)
- Docs: [docs.helius.dev](https://docs.helius.dev)

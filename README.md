# Solana dApp Example

A production-ready Helius RPC showcase and clonable template for Solana developers. Live demos of core RPC methods with interactive inputs, copy-paste code blocks, and real mainnet data.

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)](https://nextjs.org)
[![Helius SDK](https://img.shields.io/badge/Helius-SDK_2.x-E84326?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNTAuMTQzIDgzLjY2MTlDMjM0LjYwMSA3Ny4wMjI1IDIxNy40OSA3My4zNjUzIDE5OS41NTIgNzMuMzY1M0MxODEuNjE0IDczLjM2NTMgMTY0LjUxNSA3Ny4wMjI1IDE0OC45NDkgODMuNjYxOUwxOTUuNDQxIDIuMzkzMTVDMTk3LjI1MyAtMC43OTc3MTYgMjAxLjgxNCAtMC43OTc3MTYgMjAzLjYzOCAyLjM5MzE1TDI1MC4xNDMgODMuNjYxOVoiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTEzNi41ODEgODkuNzM2OEMxMDUuOTcxIDEwNi44NTcgODIuOTI0OCAxMzYuMDc4IDczLjc3OTUgMTcxLjAwNkwzOS4yMjkzIDgyLjE2NDdDMzcuODkxNSA3OC43NTI5IDQwLjczNzMgNzUuMTU3MSA0NC4zMzcgNzUuNzA5M0wxMzYuNTgxIDg5LjczNjhaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik05Ny4xOTAxIDI4NS42MTlMMy4zNDEyMyAyNTYuNDFDLTAuMTM2OTA1IDI1NS4zMyAtMS4xNTg0NSAyNTAuODUxIDEuNTE3MDMgMjQ4LjM0N0w3MS4yMjU3IDE4My4wODJDNzAuMDgyNSAxOTAuMDg5IDY5LjQ2MjMgMTk3LjI4MSA2OS40NjIzIDIwNC42MkM2OS40NzQ0IDIzNS4xNzkgNzkuODIzNyAyNjMuMzIgOTcuMTkwMSAyODUuNjE5WiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMTk3LjYwNiAzMzUuODYzTDExNS4zNDcgMzkyLjQ1MUMxMTIuMzQzIDM5NC41MjUgMTA4LjI0NSAzOTIuNTM3IDEwNy45NjUgMzg4Ljg2OEwxMDAuNjA3IDI4OS44MjhDMTI0LjA3OSAzMTcuNTUyIDE1OC43NzUgMzM1LjI3NCAxOTcuNjA2IDMzNS44NjNaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0yOTguMTY4IDI5MC4yMDlMMjkwLjg1OSAzODguNzU3QzI5MC41NzkgMzkyLjQxNCAyODYuNDkzIDM5NC40MTUgMjgzLjQ3NyAzOTIuMzQxTDIwMS4zNzYgMzM1Ljg2M0MyNDAuMDczIDMzNS4zMSAyNzQuNjk3IDMxNy43MzYgMjk4LjE2OCAyOTAuMjA5WiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMzk1LjY2NSAyNTYuMDY3TDMwMi4yNTQgMjg1LjE1M0MzMTkuNDAyIDI2Mi45MjcgMzI5LjYxNyAyMzQuOTcgMzI5LjYxNyAyMDQuNjJDMzI5LjYxNyAxOTcuMTcxIDMyOC45OTcgMTg5Ljg4MSAzMjcuODE3IDE4Mi43ODdMMzk3LjQ4OSAyNDguMDA0QzQwMC4xNTMgMjUwLjUyIDM5OS4xNDMgMjU0Ljk5OSAzOTUuNjY1IDI1Ni4wNjdaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0zNTkuODYyIDgyLjMzNjVMMzI1LjMzNiAxNzEuMTI4QzMxNi4yMzkgMTM2LjIzOCAyOTMuMjY3IDEwNy4wMjkgMjYyLjczIDg5Ljg4NDJMMzU0Ljc1NCA3NS44Njg5QzM1OC4zNTQgNzUuMzE2NiAzNjEuMTg4IDc4LjkwMDIgMzU5Ljg2MiA4Mi4zMzY1WiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNMTk5LjU1MiAzNjQuMTg4QzE4MC4zNDkgMzY0LjE4OCAxNjQuNzk1IDM3OS44OTcgMTY0Ljc5NSAzOTkuMjYzSDIzNC4zMDlDMjM0LjMwOSAzNzkuODk3IDIxOC43NDIgMzY0LjE4OCAxOTkuNTUyIDM2NC4xODhaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0zMjYuNjM4IDMwNi43NEMzMTQuNjcxIDMyMS44ODQgMzE3LjEyNyAzNDMuOTUgMzMyLjE0NyAzNTYuMDM5TDM3NS40OSAzMDEuMTkzQzM2MC40NyAyODkuMTA0IDMzOC42MDQgMjkxLjU5NSAzMjYuNjM4IDMwNi43NFoiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTM1NS4xMDcgMTcxLjExNkMzNTkuMzc2IDE5MC4wMDQgMzc4LjAxOSAyMDEuODIyIDM5Ni43MjMgMTk3LjUwMkwzODEuMjU0IDEyOS4xMDdDMzYyLjU1IDEzMy40MjcgMzUwLjgzOSAxNTIuMjQxIDM1NS4xMDcgMTcxLjExNloiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTI2OS44MiA2My44MTczQzI4Ny4xMTMgNzIuMjI0IDMwNy44ODUgNjQuODg1IDMxNi4yMTUgNDcuNDMzNUwyNTMuNTg0IDE2Ljk5NzZDMjQ1LjI1NCAzNC40NDkxIDI1Mi41MjYgNTUuNDEwNiAyNjkuODIgNjMuODE3M1oiIGZpbGw9IiNGRkYiLz4KPHBhdGggZD0iTTEyNy43MDMgNjMuODE3M0MxNDQuOTk2IDU1LjQxMDYgMTUyLjI2OSAzNC40NDkxIDE0My45MzggMTYuOTk3Nkw4MS4zMDc0IDQ3LjQzMzVDODkuNjM3OSA2NC44ODUgMTEwLjQwOSA3Mi4yMjQgMTI3LjcwMyA2My44MTczWiIgZmlsbD0iI0ZGRiIvPgo8cGF0aCBkPSJNNDQuOTA4NyAxNzEuMTE2QzQ5LjE3NzQgMTUyLjIyOSAzNy40NjYgMTMzLjQyNyAxOC43NDk4IDEyOS4xMTlMMy4yOTI3MiAxOTcuNTE0QzIyLjAwOSAyMDEuODIyIDQwLjY0MDEgMTkwLjAwMyA0NC45MDg3IDE3MS4xMTZaIiBmaWxsPSIjRkZGIi8+CjxwYXRoIGQ9Ik0yOC40OTA3IDMwMS4xOTNMNzEuODQ1OCAzNTYuMDM5Qzg2Ljg1MjkgMzQzLjk2MyA4OS4zMDk0IDMyMS44ODQgNzcuMzQyNyAzMDYuNzRDNjUuMzc2IDI5MS41OTYgNDMuNDk3OCAyODkuMTE3IDI4LjQ5MDcgMzAxLjE5M1oiIGZpbGw9IiNGRkYiLz4KPC9zdmc+)](https://helius.dev)
[![Solana](https://img.shields.io/badge/Solana-Kit_6.x-9945FF?logo=solana)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- **Interactive RPC Demos** - Test Helius RPC methods with your own inputs and see real mainnet results
- **Copy-Paste Code** - Every demo includes TypeScript and cURL code examples ready for your project
- **Production Architecture** - Modular, deletable features with proper API key protection
- **Wallet Integration** - [Phantom Connect](https://phantom.com/portal) with social login (Google, Apple) and extension support
- **Modern Stack** - Next.js 16, React 19, @solana/kit 6.x, Tailwind CSS 4
- **Dark Mode** - Full light/dark theme support
- **SEO Ready** - JSON-LD structured data, OG images, and sitemap generation

## RPC Methods Demonstrated

| Method | Description | Route |
|--------|-------------|-------|
| **Get Balances** | Fetch SOL, all tokens, or specific SPL token balances | `/get-balances/*` |
| **Get Asset** | Single asset metadata (NFT, fungible, compressed NFT) | `/get-assets/*` |
| **List Wallet Assets** | Enumerate all assets owned by a wallet | `/list-wallet-assets/*` |
| **Get Transactions** | Transaction history with filtering and pagination | `/get-transactions/*` |
| **Program Info** | Inspect programs, IDLs, and upgrade authority | `/program-info` |
| **Validator Staking** | View validators and simulate stake transactions | `/validator-staking` |
| **Archival Blocks** | Access historical block data by slot | `/archival-blocks` |
| **Laserstream** | Real-time block streaming (requires paid plan) | `/laserstream` |

## Quick Start

### Prerequisites

- Node.js 18+ (20+ recommended)
- pnpm 9+
- [Helius API key](https://dashboard.helius.dev/signup) (free tier available)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/frontend-boilerplate.git
cd frontend-boilerplate

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local
```

Add your Helius API key to `.env.local`:

```bash
HELIUS_API_KEY=your_api_key_here
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HELIUS_API_KEY` | Yes | Your Helius API key for RPC access |
| `LASERSTREAM_API_KEY` | No | Laserstream key for real-time streaming (Professional plan) |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL for OG image generation |

> **Security:** API keys are server-side only. They're accessed through the `/api/rpc` proxy - never exposed to the client.

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (methods)/          # Grouped routes for RPC demos
│   │   ├── get-balances/   # Balance fetching demos
│   │   ├── get-assets/     # Asset metadata demos
│   │   ├── get-transactions/
│   │   └── ...
│   └── api/                # Server-side API routes
│       └── rpc/            # RPC proxy (protects API keys)
├── features/               # Self-contained feature modules
│   ├── get-balance/        # Balance queries
│   ├── get-asset/          # Single asset lookup
│   ├── get-assets-by-owner/# Wallet asset enumeration
│   ├── get-transactions/   # Transaction history
│   ├── validator-staking/  # Validator & staking
│   ├── program-info/       # Program inspection
│   ├── archival-blocks/    # Historical blocks
│   ├── laserstream/        # Real-time streaming
│   └── demo-framework/     # Shared demo UI components
├── shared/                 # Shared utilities
│   ├── ui/                 # ~26 reusable UI components
│   ├── lib/                # Core libraries (helius-client)
│   └── hooks/              # Shared React hooks
├── providers/              # React context providers
└── types/                  # Global TypeScript declarations
```

### Atomic Features

Each feature in `src/features/` is **self-contained and deletable**. Delete any feature folder and the app still builds. Features only import from `shared/`, never from each other.

Feature structure:

```
feature-name/
├── components/      # Feature UI components
├── hooks/           # Feature-specific hooks
├── lib/             # Feature utilities & fetch functions
├── types.d.ts       # Feature types
└── index.ts         # Barrel export (public API)
```

### Client vs Server

Features export both client and server fetch functions:

```typescript
// Client-side (uses /api/rpc proxy)
import { fetchAsset } from '@/features/get-asset';

// Server-side (direct Helius SDK)
import { serverFetchAsset } from '@/features/get-asset';
```

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack, RSC) |
| **React** | [React 19](https://react.dev) |
| **Solana SDK** | [@solana/kit 6.x](https://github.com/anza-xyz/solana-web3.js) |
| **RPC Provider** | [Helius SDK 2.x](https://docs.helius.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Data Fetching** | [SWR 2.x](https://swr.vercel.app) |
| **Wallet** | [@phantom/react-sdk](https://www.npmjs.com/package/@phantom/react-sdk) (Phantom Connect) |
| **Code Highlighting** | [Shiki](https://shiki.style) |
| **Language** | [TypeScript 5.x](https://typescriptlang.org) |

## Code Examples

### Fetching an Asset

```typescript
import { useAsset } from '@/features/get-asset';

function AssetDisplay({ mint }: { mint: string }) {
  const { data: asset, isLoading, error } = useAsset(mint);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{asset.content.metadata.name}</h2>
      <img src={asset.content.files[0]?.uri} alt={asset.content.metadata.name} />
    </div>
  );
}
```

### Getting Wallet Balances

```typescript
import { useAllBalances } from '@/features/get-balance';

function WalletBalances({ address }: { address: string }) {
  const { data, isLoading } = useAllBalances(address);

  return (
    <ul>
      <li>SOL: {data?.nativeBalance.lamports}</li>
      {data?.tokens.map(token => (
        <li key={token.mint}>{token.symbol}: {token.amount}</li>
      ))}
    </ul>
  );
}
```

### Server-Side Data Fetching

```typescript
// app/asset/[id]/page.tsx
import { serverFetchAsset } from '@/features/get-asset';

export default async function AssetPage({ params }: { params: { id: string } }) {
  const asset = await serverFetchAsset(params.id);

  return <AssetDetails asset={asset} />;
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint errors |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `ANALYZE=true pnpm build` | Build with bundle analyzer |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/frontend-boilerplate&env=HELIUS_API_KEY&envDescription=Your%20Helius%20API%20key%20for%20RPC%20access&envLink=https://dashboard.helius.dev/signup)

1. Click the button above or import the repo in Vercel
2. Add `HELIUS_API_KEY` environment variable
3. Deploy

### Other Platforms

The app is a standard Next.js application. Deploy to any platform that supports Next.js:

```bash
pnpm build
pnpm start
```

## Project Structure Highlights

### API Routes

- `/api/rpc` - Main RPC proxy (protects API keys)
- `/api/helius/enhanced` - Enhanced API proxy
- `/api/laserstream` - WebSocket proxy for real-time updates
- `/api/laserstream/status` - Laserstream configuration status

### Shared UI Components

The `src/shared/ui/` directory contains ~26 reusable components:

- **Navigation:** Header, SubNav, Breadcrumb
- **Content:** PageContainer, PageHeader, CodeTabs, InfoBox
- **Input:** Input, FormField, Button
- **Display:** AddressDisplay, ErrorDisplay
- **Wallet:** ConnectButton, WalletDropdown

### SEO & Metadata

- JSON-LD structured data on all pages
- Dynamic OG images per route
- Sitemap and robots.txt generation
- PWA manifest with icons

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Architecture decisions
- Feature module structure
- Code style conventions
- Pull request process

## Resources

- [Helius Documentation](https://docs.helius.dev) - RPC methods and APIs
- [Solana Kit Documentation](https://github.com/anza-xyz/solana-web3.js) - Modern Solana SDK
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling reference

## License

MIT - see [LICENSE](LICENSE) for details.

---

Built with [Helius](https://helius.dev) | Powered by [Solana](https://solana.com)

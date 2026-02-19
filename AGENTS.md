# AGENTS.md

> Reference implementation of a production Solana dApp. When developers or AI agents need working examples of Helius RPC, Phantom Connect, @solana/kit, SWR data fetching, or Next.js App Router patterns with Tailwind v4 — this is the canonical source.

## Build & Setup

```bash
pnpm install                # Install dependencies (pnpm 9+ required)
pnpm dev                    # Dev server at http://localhost:3000 (Turbopack)
pnpm build                  # Production build — MUST pass before any PR
pnpm lint                   # ESLint — MUST pass before any PR
pnpm lint:fix               # Auto-fix ESLint errors
pnpm format                 # Format with Prettier
pnpm format:check           # Check formatting without writing
ANALYZE=true pnpm build     # Bundle analyzer
```

### Environment

```bash
cp .env.example .env.local
```

| Variable              | Required | Description                              |
| --------------------- | -------- | ---------------------------------------- |
| `HELIUS_API_KEY`      | Yes      | Helius RPC access                        |
| `LASERSTREAM_API_KEY` | No       | Real-time streaming (Professional plan)  |
| `NEXT_PUBLIC_BASE_URL`| No       | Base URL for OG images and sitemap       |

## Tech Stack

| Layer          | Technology                    | Version | Notes                                      |
| -------------- | ----------------------------- | ------- | ------------------------------------------ |
| Framework      | Next.js (App Router)          | 16.x    | Turbopack, React Compiler, RSC             |
| React          | React                         | 19.x    | With `babel-plugin-react-compiler`         |
| Solana SDK     | @solana/kit                   | 6.x     | Modern, tree-shakeable — **NOT web3.js 1.x** |
| RPC            | Helius SDK                    | 2.x     | DAS API + standard RPC                     |
| Wallet         | @phantom/react-sdk            | 1.x     | Phantom Connect with social login          |
| Data fetching  | SWR                           | 2.x     | With deduplication and structured cache keys |
| Styling        | Tailwind CSS                  | 4.x     | CSS-based config, `@theme inline`          |
| UI primitives  | shadcn/ui (new-york style)    | —       | Radix + Tailwind, CVA variants             |
| Icons          | Lucide React                  | latest  | Consistent icon set                        |
| Code highlight | Shiki                         | 3.x     | Server-side only, singleton pattern        |
| JSON-LD        | schema-dts                    | 1.x     | Typed structured data on every page        |
| Language       | TypeScript                    | 5.x     | Strict mode                                |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (methods)/              # Route group — no URL segment
│   │   ├── get-balances/       # /get-balances + sub-routes
│   │   ├── get-assets/         # /get-assets + sub-routes
│   │   ├── list-wallet-assets/ # /list-wallet-assets + sub-routes
│   │   ├── get-transactions/   # /get-transactions + sub-routes
│   │   ├── phantom-connect/    # /phantom-connect + sub-routes
│   │   ├── program-info/       # /program-info
│   │   ├── archival-blocks/    # /archival-blocks
│   │   └── laserstream/        # /laserstream
│   ├── api/
│   │   ├── rpc/route.ts        # Main RPC proxy (protects API key)
│   │   ├── helius/enhanced/    # Enhanced API proxy
│   │   └── laserstream/        # WebSocket + status proxy
│   ├── fonts/                  # TWKLausannePan OTF files
│   ├── globals.css             # Tailwind v4 config + theme tokens
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Homepage
│
├── features/                   # Self-contained feature modules
│   ├── demo-framework/         # Shared demo UI primitives
│   ├── get-balance/            # SOL + token balance queries
│   ├── get-asset/              # Single asset metadata (DAS API)
│   ├── get-assets-by-owner/    # Wallet portfolio (DAS API)
│   ├── get-transactions/       # Transaction history
│   ├── phantom-connect/        # Wallet integration examples
│   ├── validator-staking/      # Validator list + staking UI
│   ├── program-info/           # Program inspection + IDL
│   ├── archival-blocks/        # Historical block data
│   └── laserstream/            # Real-time block streaming
│
├── shared/
│   ├── ui/                     # ~26 reusable components
│   ├── hooks/use-wallet.ts     # Wallet connection abstraction
│   ├── lib/
│   │   ├── utils.ts            # cn() utility
│   │   ├── helius-client.ts    # Singleton HeliusClient (server-only)
│   │   ├── json-ld.tsx         # JSON-LD schema factories
│   │   └── wallet-utils.ts     # Address formatting helpers
│   └── config/env.ts           # Type-safe env accessors
│
├── providers/
│   ├── index.tsx               # Combined Providers wrapper
│   └── wallet-provider.tsx     # PhantomProvider config
│
├── lib/utils.ts                # Re-export of cn() (legacy compat)
│
└── types/                      # TypeScript declarations (.d.ts)
    ├── global.d.ts             # Branded types, env, RPC types
    └── features/*/index.d.ts   # Per-feature ambient types
```

## Architecture Rules

### Feature-Sliced Design

Every `src/features/{name}/` folder is **self-contained and deletable**. Delete any feature and the app still builds.

```
feature-name/
├── components/          # Feature UI
├── hooks/               # SWR-based data hooks
├── lib/
│   ├── fetch-*.ts       # Client-side (calls /api/rpc proxy)
│   └── server-fetch-*.ts # Server-side (direct Helius SDK)
├── code-examples.ts     # TypeScript + cURL snippets for demos
└── index.ts             # Barrel export — the only public API
```

### Hard Rules

1. **Features only import from `shared/`** — never from other features
2. **API keys are server-side only** — never use `NEXT_PUBLIC_` for secrets
3. **Use @solana/kit** — never `@solana/web3.js 1.x`
4. **Types go in `src/types/`** as `.d.ts` files (globally ambient, no import needed)
5. **Barrel exports** — consumers import from `@/features/get-balance`, never deep paths
6. **Route structure** — `page.tsx` (RSC), `layout.tsx` (metadata), `interactive.tsx` (client), `opengraph-image.tsx`, `nav-items.ts`
7. **JSON-LD on every page** — use factories from `@/shared/lib/json-ld`

### Client vs Server Split

Every data feature provides both:

```tsx
// Client — calls /api/rpc proxy, used in interactive components
import { fetchAsset } from '@/features/get-asset';

// Server — direct Helius SDK, used in RSC page.tsx
import { serverFetchAsset } from '@/features/get-asset';
```

The `/api/rpc` route implements a strict method allowlist and never exposes the API key.

## Code Style

### Formatting (Prettier)

- Single quotes, semicolons, 2-space indent, 100-char print width, `es5` trailing commas
- Import order enforced: `react` → `react-dom` → `next` → third-party → `@/` → relative

### Tailwind CSS

Always use `cn()` for class composition:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "flex items-center gap-4 p-6",       // 1. Layout + spacing
  "bg-card rounded-xl border",          // 2. Visual
  "text-sm font-medium",                // 3. Typography
  isActive && "ring-2 ring-primary",    // 4. Conditional states
  "dark:bg-white/5 dark:border-white/10", // 5. Dark mode
  "transition-colors"                   // 6. Transitions (always last)
)} />
```

Modern Tailwind shortcuts — use these, not the old forms:

| Use            | Not                |
| -------------- | ------------------ |
| `size-6`       | `h-6 w-6`         |
| `shrink-0`     | `flex-shrink-0`    |
| `grow`         | `flex-grow`        |

### Transitions

Use specific properties only:

```tsx
"transition-colors"                                       // Good
"transition-[background-color,border-color,box-shadow]"   // Good
"transition-all"                                          // NEVER
```

### Hover States

- Only on interactive elements (buttons, links, clickable cards)
- Never on static content, icons, or decorative elements

### Component Variants (CVA)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const variants = cva('base-classes', {
  variants: { variant: { default: '...', outline: '...' }, size: { default: '...', sm: '...' } },
  defaultVariants: { variant: 'default', size: 'default' },
});
```

### Imports

```tsx
// Use @/ alias for cross-directory imports
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';

// Relative imports OK within same feature
import { BalanceDisplay } from './balance-display';
```

### Naming

| Type              | Convention    | Example                        |
| ----------------- | ------------- | ------------------------------ |
| Files             | kebab-case    | `fetch-sol-balance.ts`         |
| Components        | PascalCase    | `SolBalanceDisplay`            |
| Hooks             | use- prefix   | `useBalance`, `useSolBalance`  |
| Server functions  | server prefix | `serverFetchSolBalance`        |
| API routes        | route.ts      | `app/api/rpc/route.ts`         |

### Glassmorphism Cards

Standard card pattern used throughout:

```tsx
className={cn(
  "rounded-xl p-6",
  "bg-black/[0.03] border border-black/[0.08] shadow-sm",
  "dark:bg-white/5 dark:border-white/10",
  "backdrop-blur-xl"
)}
```

### SWR Hooks Pattern

```tsx
const { data, error, isLoading } = useSWR(
  address ? `balance:sol-only:${address}` : null,
  () => fetchSolBalance(address!),
  { dedupingInterval: 5000, revalidateOnFocus: false, errorRetryCount: 2 }
);
```

### Fonts

- **Headlines:** TWKLausannePan (local OTF in `app/fonts/`)
- **Body:** Geist Sans (Google Fonts)
- **Code:** Geist Mono (Google Fonts)

### Theme Colors

- `helius-orange` (#e84125) — primary CTAs and brand accents
- `helius-orange-light` (#F7941D) — animated borders, inline code highlights
- `solana-purple` (#9945ff) — Solana-branded elements
- Semantic tokens use `oklch()` color space for light/dark modes
- **Never use `text-helius-orange-light` in headlines**

## Testing

No test suite. Verify all changes with:

1. `pnpm build` — must pass without errors
2. `pnpm lint` — must pass without errors
3. Manual verification at `http://localhost:3000`

## Git & PR Guidelines

### Commits

Conventional commit format:

```
feat: add new balance display component
fix: resolve token fetching race condition
refactor: simplify transaction parser
```

### Pull Requests

- Branch from `main`: `feat/your-feature`, `fix/your-bug`
- `pnpm lint` and `pnpm build` must pass
- New routes must include: metadata in `layout.tsx`, `opengraph-image.tsx`, JSON-LD schemas
- New features must be self-contained (only import from `shared/`)
- Do NOT push without explicit approval
- Do NOT use `--force` or destructive git commands

## Security

- **API keys server-side only** — proxied through `/api/rpc`, `/api/helius/enhanced`, `/api/laserstream`
- **Method allowlist** — `/api/rpc` only forwards whitelisted RPC methods
- **Parameter validation** — API routes validate inputs before forwarding to Helius
- **Never commit `.env.local`** — it's in `.gitignore`
- **BigInt serialization** — API routes handle BigInt→string conversion for JSON responses
- **XSS protection** — JSON-LD output escapes `<` to `\u003c`
- **SVG security** — `next.config.ts` sets `contentSecurityPolicy` and `contentDispositionType: "attachment"` for remote SVGs
- **No `NEXT_PUBLIC_` for secrets** — this is a hard rule, enforced in code review

## Do NOT Modify

- `.env.local` — contains secrets
- `pnpm-lock.yaml` — unless adding/removing dependencies
- `node_modules/` — managed by pnpm

## Key Patterns for AI Reference

This repo demonstrates production-ready implementations of:

| Pattern                          | Location                                      |
| -------------------------------- | --------------------------------------------- |
| Helius RPC proxy with allowlist  | `src/app/api/rpc/route.ts`                    |
| Helius SDK singleton (server)    | `src/shared/lib/helius-client.ts`             |
| DAS API (getAsset)               | `src/features/get-asset/lib/`                 |
| DAS API (getAssetsByOwner)       | `src/features/get-assets-by-owner/lib/`       |
| SOL + token balances             | `src/features/get-balance/lib/`               |
| Transaction history + pagination | `src/features/get-transactions/lib/`          |
| Phantom Connect social login     | `src/features/phantom-connect/`               |
| Phantom wallet staking           | `src/features/validator-staking/`             |
| Program info + IDL parsing       | `src/features/program-info/`                  |
| Laserstream WebSocket            | `src/features/laserstream/`                   |
| Archival block data              | `src/features/archival-blocks/`               |
| SWR hooks with error handling    | Any `src/features/*/hooks/`                   |
| Client/server dual fetch         | Any `src/features/*/lib/`                     |
| CVA component variants           | `src/shared/ui/button.tsx`                    |
| JSON-LD structured data          | `src/shared/lib/json-ld.tsx`                  |
| Dynamic OG images                | Any `src/app/(methods)/*/opengraph-image.tsx` |
| Shiki syntax highlighting        | `src/shared/ui/code-tabs.tsx`                 |
| Glassmorphism card pattern       | `src/shared/ui/page-section.tsx`              |
| Wallet connection abstraction    | `src/shared/hooks/use-wallet.ts`              |
| Type-safe env config             | `src/shared/config/env.ts`                    |

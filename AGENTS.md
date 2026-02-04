# AGENTS.md

Instructions for AI coding agents working on this Solana dApp project.

## Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Run ESLint
pnpm lint

# Fix ESLint errors
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (methods)/          # Route group for RPC method pages
│   ├── api/                # API routes (RPC proxy, Helius proxy)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── features/               # Self-contained feature modules
│   ├── demo-framework/     # Shared demo components
│   ├── get-balance/        # Balance lookup feature
│   ├── get-asset/          # Asset metadata feature
│   └── ...                 # Other features
├── shared/
│   ├── ui/                 # Reusable UI components
│   ├── hooks/              # Shared React hooks
│   └── lib/                # Utilities (cn, helius-client)
├── providers/              # React context providers
└── types/                  # TypeScript declarations (.d.ts)
```

## Code Style

### Tailwind CSS

Always use the `cn()` utility for class composition:

```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  // Layout
  "flex items-center gap-4",
  // Visual
  "bg-card rounded-xl",
  // Conditional
  isActive && "ring-2 ring-primary"
)} />
```

### Imports

Use `@/` path aliases for imports outside the current directory:

```tsx
// Good
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

// Bad
import { Button } from "../../shared/ui/button";
```

### Component Variants

Use CVA (class-variance-authority) for components with multiple variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
```

### Modern Tailwind

- Use `size-6` not `h-6 w-6`
- Use `shrink-0` not `flex-shrink-0`
- Use specific transitions: `transition-colors` not `transition-all`

## Testing

No test suite configured. Verify changes by:

1. Running `pnpm build` - must pass without errors
2. Running `pnpm lint` - fix any ESLint errors
3. Manual testing in browser at `http://localhost:3000`

## Git Workflow

- Work on `dev` branch
- Write clear, human-readable commit messages
- Do NOT push without explicit approval
- Do NOT use `--force` or destructive git commands

## Environment Variables

```bash
HELIUS_API_KEY=xxx      # Required - Helius RPC access
LASERSTREAM_API_KEY=xxx # Optional - Real-time streaming (paid)
```

**Important:** API keys are server-side only. Never use `NEXT_PUBLIC_` prefix.

## Boundaries

### Do NOT modify

- `.env.local` - Contains secrets
- `pnpm-lock.yaml` - Unless adding/removing dependencies
- Files in `node_modules/`

### Do NOT

- Add hover effects to non-interactive elements
- Use `transition-all` (use specific properties)
- Import between feature folders (features only import from `shared/`)
- Expose API keys to client bundle
- Use @solana/web3.js 1.x (use @solana/kit instead)

### Architecture Rules

- Features in `src/features/` must be self-contained and deletable
- All shared code goes in `src/shared/`
- Types go in `src/types/` as `.d.ts` files
- API routes protect secrets server-side

## Key Technologies

| Purpose | Library | Notes |
|---------|---------|-------|
| Solana SDK | @solana/kit | Modern, tree-shakeable (NOT web3.js 1.x) |
| RPC | Helius SDK | Use HeliusClient directly |
| Wallet | @solana-program/connectorkit | Phantom Connect integration |
| Data fetching | SWR | With 5-10s dedupingInterval |
| UI components | shadcn/ui | Radix primitives + Tailwind |
| Class composition | clsx + tailwind-merge | Via cn() utility |

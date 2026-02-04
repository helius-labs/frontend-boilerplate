# Contributing to Solana dApp Example

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- pnpm 9+
- Helius API key ([free tier available](https://dashboard.helius.dev/signup))

### Local Setup

```bash
# Clone the repository
git clone https://github.com/helius-labs/frontend-boilerplate.git
cd frontend-boilerplate

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Add your HELIUS_API_KEY to .env.local

# Start development server
pnpm dev
```

## Project Architecture

This project follows **Feature-Sliced Design (FSD)** principles with atomic, self-contained features.

```
src/
├── app/              # Next.js App Router (pages + API routes)
├── features/         # Self-contained feature modules
├── shared/           # Shared utilities (features import from here)
│   ├── lib/          # Core libraries
│   ├── ui/           # Reusable UI components
│   └── hooks/        # Shared React hooks
├── providers/        # React context providers
└── types/            # Global TypeScript declarations
```

### Key Principle: Feature Independence

Each folder in `src/features/` is **self-contained and deletable**. Features:

- Only import from `shared/`, never from each other
- Have their own types, hooks, components, and lib folders
- Export a public API via `index.ts` barrel exports

This means you can delete any feature folder and the app will still build.

## Adding a New Feature

1. **Create the feature folder:**
   ```
   src/features/your-feature/
   ├── components/    # Feature-specific components
   ├── hooks/         # Feature-specific hooks
   ├── lib/           # Feature-specific utilities
   ├── types.d.ts     # Feature-specific types
   └── index.ts       # Barrel exports (public API)
   ```

2. **Create the route:**
   ```
   src/app/(methods)/your-feature/
   ├── page.tsx       # Main page
   ├── layout.tsx     # Metadata (title, description, OG)
   └── opengraph-image.tsx  # Dynamic OG image
   ```

3. **Add JSON-LD structured data** to `page.tsx`:
   ```tsx
   import { JsonLdMultiple, createTechArticleSchema, createBreadcrumbSchema } from '@/shared/lib/json-ld';
   ```

4. **Export from feature index:**
   ```tsx
   // src/features/your-feature/index.ts
   export { YourComponent } from './components/your-component';
   export { useYourHook } from './hooks/use-your-hook';
   ```

## Code Style

### Tailwind CSS

Always use the `cn()` utility for composing classes:

```tsx
import { cn } from '@/lib/utils';

<div
  className={cn(
    // Layout
    "flex items-center gap-4 p-6",
    // Visual
    "bg-card rounded-xl border",
    // Conditional
    isActive && "ring-2 ring-primary"
  )}
/>
```

### Imports

Use `@/` path aliases for imports outside the current directory:

```tsx
// Good
import { Button } from '@/shared/ui/button';

// Bad
import { Button } from '../../shared/ui/button';
```

### TypeScript

- Use strict mode (enabled by default)
- Define feature-specific types in `.d.ts` files
- Use `schema-dts` types for JSON-LD

## Commit Guidelines

We use conventional commits:

```
feat: add new balance display component
fix: resolve token fetching race condition
docs: update API documentation
refactor: simplify transaction parser
```

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature
   ```
3. **Make your changes** following the code style guidelines
4. **Run checks:**
   ```bash
   pnpm lint        # Check for linting errors
   pnpm build       # Ensure production build passes
   ```
5. **Commit** with a descriptive message
6. **Push** and open a Pull Request

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] `pnpm lint` passes without errors
- [ ] `pnpm build` succeeds
- [ ] New features include appropriate JSON-LD schemas
- [ ] New routes have metadata and OG images
- [ ] Feature is self-contained (only imports from `shared/`)

## Testing Locally

```bash
# Development mode with hot reload
pnpm dev

# Production build test
pnpm build && pnpm start

# Lint check
pnpm lint

# Fix auto-fixable lint issues
pnpm lint:fix

# Format code
pnpm format
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HELIUS_API_KEY` | Yes | Helius API key for RPC access |
| `LASERSTREAM_API_KEY` | No | Laserstream key for real-time streaming |

**Important:** Never use `NEXT_PUBLIC_` prefix for API keys. They're accessed server-side only.

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Reference related issues in your PR

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

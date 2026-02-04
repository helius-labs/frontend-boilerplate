// Barrel export for get-balance feature
// All public APIs should be exported here

// Components
export { BalanceDemo } from './components/balance-demo';
export { SolBalanceDisplay } from './components/sol-balance-display';
export { TokenBalanceList } from './components/token-balance-list';
export { SpecificTokenDisplay } from './components/specific-token-display';

// Hooks
export { useBalance, useSolBalance, useAllBalances, useTokenBalance } from './hooks/use-balance';

// Client fetch functions (for direct use or custom hooks)
export { fetchSolBalance } from './lib/fetch-sol-balance';
export { fetchAllBalances } from './lib/fetch-all-balances';
export { fetchTokenBalance } from './lib/fetch-token-balance';

// Server fetch functions (for server components - do not import in client components)
export { serverFetchSolBalance } from './lib/server-fetch-sol-balance';
export { serverFetchAllBalances } from './lib/server-fetch-all-balances';
export { serverFetchTokenBalance } from './lib/server-fetch-token-balance';

// Code examples
export { CODE_EXAMPLES } from './lib/code-examples';

// Global type declarations - available everywhere without imports
// Source: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html

// Branded types for type safety
type SolanaAddress = string & { readonly __brand: 'SolanaAddress' };
type Lamports = bigint & { readonly __brand: 'Lamports' };
type TransactionSignature = string & { readonly __brand: 'TransactionSignature' };

// Environment variable types
declare namespace NodeJS {
  interface ProcessEnv {
    HELIUS_API_KEY: string;
    LASERSTREAM_API_KEY?: string;
    ANALYZE?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// Helius RPC proxy request/response types
interface RpcProxyRequest {
  method: string;
  params?: unknown[];
}

interface RpcProxyResponse<T = unknown> {
  result?: T;
  error?: string;
}

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
  jsonrpc?: '2.0';
  id?: string | number | null;
  method: string;
  params?: unknown[];
}

interface RpcProxyError {
  code: number;
  message: string;
  data?: unknown;
}

interface RpcProxyResponse<T = unknown> {
  jsonrpc?: '2.0';
  id?: string | number | null;
  result?: T;
  /**
   * Plain-string `error` is kept for backward compatibility with existing
   * client-side fetchers (e.g. `data.error.includes('not found')`). New
   * code should branch on `error` truthy and read the structured `code`
   * + `details` when needed.
   */
  error?: string;
  /** JSON-RPC standard error code when available (e.g. -32601, -32005). */
  code?: number;
  /** Auxiliary diagnostic data (allowed methods, upstream details). */
  details?: unknown;
}

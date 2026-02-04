// Types for Helius Enhanced API proxy

type AllowedEndpoint = 'getTransactionsByAddress' | 'getTransactions';

interface EnhancedProxyRequest {
  endpoint: string;
  params: {
    address?: string;
    type?: string;
    limit?: number;
    'sort-order'?: 'asc' | 'desc';
    'before-signature'?: string;
    'after-signature'?: string;
    signatures?: string[];
  };
}

interface EnhancedProxyResponse {
  result?: unknown;
  error?: string;
}

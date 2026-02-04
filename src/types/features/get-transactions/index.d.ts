// Type definitions for get-transactions feature

type TransactionType =
  | 'UNKNOWN'
  | 'TRANSFER'
  | 'SWAP'
  | 'NFT_SALE'
  | 'NFT_LISTING'
  | 'NFT_BID'
  | 'NFT_BID_CANCELLED'
  | 'NFT_CANCEL_LISTING'
  | 'NFT_MINT'
  | 'STAKE_SOL'
  | 'UNSTAKE_SOL'
  | 'BURN'
  | 'TOKEN_MINT'
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'ADD_LIQUIDITY'
  | 'WITHDRAW_LIQUIDITY';

type FilterableTransactionType =
  | 'TRANSFER'
  | 'SWAP'
  | 'NFT_SALE'
  | 'NFT_LISTING'
  | 'NFT_BID'
  | 'STAKE_SOL'
  | 'UNSTAKE_SOL'
  | 'BURN'
  | 'TOKEN_MINT';

interface EnhancedTransaction {
  signature: string;
  slot: number;
  timestamp: number;
  type: TransactionType;
  source: string;
  description: string;
  fee: number;
  feePayer: string;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  transactionError: Record<string, unknown> | null;
}

interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  fromTokenAccount: string;
  toTokenAccount: string;
  tokenAmount: number;
  mint: string;
  tokenName?: string;
  tokenSymbol?: string;
}

interface SignatureResult {
  signature: string;
  slot: number;
  transactionIndex: number;
  blockTime: number | null;
  err: Record<string, unknown> | null;
  memo: string | null;
  confirmationStatus: 'processed' | 'confirmed' | 'finalized';
}

interface PaginatedTransactionsResponse {
  data: SignatureResult[];
  paginationToken: string | null;
}

interface PaginatedResult {
  data: SignatureResult[];
  paginationToken: string | null;
  hasMore: boolean;
}

interface TransactionError {
  code: 'INVALID_ADDRESS' | 'RATE_LIMITED' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'EMPTY_RESULTS';
  message: string;
  retryable: boolean;
}

type TransactionUseCase = 'recent' | 'filtered' | 'paginated';

// Component Props

interface TransactionFiltersProps {
  selectedType: FilterableTransactionType;
  onChange: (type: FilterableTransactionType) => void;
}

interface TransactionItemProps {
  transaction: EnhancedTransaction;
}

interface SignatureItemProps {
  signature: SignatureResult;
}

interface TransactionListProps {
  transactions: EnhancedTransaction[];
  isLoading?: boolean;
  emptyMessage?: string;
}

interface SignatureListProps {
  signatures: SignatureResult[];
  isLoading?: boolean;
  emptyMessage?: string;
}

interface TransactionErrorProps {
  error: TransactionError;
  onRetry?: () => void;
}

interface TransactionsDemoProps {
  connectedWallet?: string;
}

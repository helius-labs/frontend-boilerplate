'use client';

// Transaction list components with loading and error states
import {
  SignatureItem,
  TransactionItem,
} from '@/features/get-transactions/components/transaction-item';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

/**
 * TransactionList - Display a list of Enhanced API transactions.
 */
export function TransactionList({
  transactions,
  isLoading,
  emptyMessage = 'No transactions found',
}: TransactionListProps) {
  if (isLoading) {
    return <TransactionSkeleton count={5} />;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="divide-y divide-border/50">
      {transactions.map((tx) => (
        <TransactionItem key={tx.signature} transaction={tx} />
      ))}
    </div>
  );
}

/**
 * SignatureList - Display a list of RPC signature results.
 */
export function SignatureList({
  signatures,
  isLoading,
  emptyMessage = 'No signatures found',
}: SignatureListProps) {
  if (isLoading) {
    return <SignatureSkeleton count={10} />;
  }

  if (signatures.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="divide-y divide-border/50">
      {signatures.map((sig) => (
        <SignatureItem key={sig.signature} signature={sig} />
      ))}
    </div>
  );
}

/**
 * Transaction skeleton for loading state.
 */
function TransactionSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-0 divide-y divide-border/50">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted rounded-full" />
          </div>
          <div className="h-3 w-3/4 bg-muted rounded mb-2" />
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Signature skeleton for loading state.
 */
function SignatureSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-0 divide-y divide-border/50">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 animate-pulse">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="flex items-center gap-3">
            <div className="h-5 w-14 bg-muted rounded-full" />
            <div className="h-3 w-12 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Error display component.
 */
export function TransactionErrorDisplay({ error, onRetry }: TransactionErrorProps) {
  return (
    <div className={cn('p-4 rounded-lg', 'bg-destructive/10 border border-destructive/20')}>
      <p className="font-medium text-destructive">Error</p>
      <p className="text-sm text-destructive/80">{error.message}</p>
      {error.retryable && onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="mt-2 text-primary hover:underline p-0 h-auto"
        >
          Try again
        </Button>
      )}
    </div>
  );
}

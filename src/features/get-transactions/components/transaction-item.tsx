'use client';

// Transaction item components for displaying transaction data
import {
  formatFee,
  formatRelativeTime,
  getSolscanUrl,
  shortenSignature,
} from '@/features/get-transactions/lib/format-utils';
import {
  getTransactionTypeColor,
  getTransactionTypeLabel,
} from '@/features/get-transactions/lib/transaction-types';
import { cn } from '@/lib/utils';
import { ExternalLink } from '@/shared/ui/link';

/**
 * TransactionItem - Display a single Enhanced API transaction.
 * Shows signature, type badge, description and timestamp.
 */
export function TransactionItem({ transaction }: TransactionItemProps) {
  const typeColors = getTransactionTypeColor(transaction.type);
  const typeLabel = getTransactionTypeLabel(transaction.type);

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-4',
        'border-b border-border/50 last:border-b-0',
        'hover:bg-muted/30 transition-colors'
      )}
    >
      {/* Top row: signature + type badge */}
      <div className="flex items-center justify-between gap-4">
        <ExternalLink href={getSolscanUrl(transaction.signature)} className="font-mono text-sm">
          {shortenSignature(transaction.signature)}
        </ExternalLink>
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full',
            typeColors.bg,
            typeColors.text
          )}
        >
          {typeLabel}
        </span>
      </div>

      {/* Description */}
      {transaction.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">{transaction.description}</p>
      )}

      {/* Bottom row: fee + timestamp */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Fee: {formatFee(transaction.fee)}</span>
        <span>{formatRelativeTime(transaction.timestamp)}</span>
      </div>

      {/* Error indicator */}
      {transaction.transactionError && (
        <div className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded">
          Transaction failed
        </div>
      )}
    </div>
  );
}

/**
 * SignatureItem - Display a single RPC signature result.
 * Simpler display for paginated results (signature + timestamp only).
 */
export function SignatureItem({ signature }: SignatureItemProps) {
  const isSuccess = !signature.err;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-3',
        'border-b border-border/50 last:border-b-0',
        'hover:bg-muted/30 transition-colors'
      )}
    >
      {/* Signature link */}
      <ExternalLink href={getSolscanUrl(signature.signature)} className="font-mono text-sm">
        {shortenSignature(signature.signature)}
      </ExternalLink>

      {/* Right side: status + timestamp */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full',
            isSuccess
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          )}
        >
          {isSuccess ? 'Success' : 'Failed'}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(signature.blockTime)}
        </span>
      </div>
    </div>
  );
}

'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function TransactionPreview({
  preview,
  validator,
  onConfirm,
  onCancel,
  isLoading,
}: TransactionPreviewProps) {
  return (
    <div className="p-4 md:p-6 bg-card border rounded-lg space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Transaction Preview</h3>
          <p className="text-sm text-muted-foreground">Review before signing</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          Back
        </Button>
      </div>

      {/* Action summary */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Action</p>
        <p className="font-semibold">Delegate Stake to Validator</p>
        <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
          {validator.votePubkey}
        </p>
      </div>

      {/* Cost breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Stake Amount</span>
          <span className="font-semibold">{preview.stakeAmount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Rent (one-time)</span>
          <span>{preview.rentExemption}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Est. Transaction Fee</span>
          <span>{preview.estimatedFee}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-medium">Total Cost</span>
          <span className="font-bold text-lg">{preview.totalCost}</span>
        </div>
      </div>

      {/* Warnings */}
      <div className="space-y-2">
        {preview.warnings.map((warning, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2 p-3 rounded-lg',
              'bg-amber-500/10 border border-amber-500/20'
            )}
          >
            <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-600 dark:text-amber-400">{warning}</p>
          </div>
        ))}
      </div>

      {/* Important notice */}
      <div className={cn('p-4 rounded-lg', 'bg-destructive/10 border border-destructive/20')}>
        <p className="font-medium text-destructive">Real Transaction</p>
        <p className="text-sm text-destructive/80 mt-1">
          This will submit a real transaction to Solana mainnet. Your SOL will be staked to this
          validator.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          variant="outline"
          className="flex-1 py-3 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          variant="solana"
          className="flex-1 py-3 rounded-lg"
        >
          {isLoading ? 'Signing...' : 'Sign & Submit'}
        </Button>
      </div>
    </div>
  );
}

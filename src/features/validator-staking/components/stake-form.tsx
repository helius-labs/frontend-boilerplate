'use client';

import { useWallet } from '@/shared/hooks/use-wallet';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { SUGGESTED_MIN_STAKE } from '../lib/build-stake-transaction';

export function StakeForm({
  validator,
  stakeAmount,
  setStakeAmount,
  validation,
  walletBalance,
  onSubmit,
  onCancel,
  isSimulating,
}: StakeFormProps) {
  const { isConnected } = useWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.valid && isConnected) {
      onSubmit();
    }
  };

  const walletBalanceSol = Number(walletBalance) / 1_000_000_000;
  const minStakeSol = Number(SUGGESTED_MIN_STAKE) / 1_000_000_000;

  // Quick amount buttons
  const quickAmounts = [0.1, 0.5, 1, 5];

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-6 bg-card border rounded-lg space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Stake SOL</h3>
          <p className="text-sm text-muted-foreground">to {validator.votePubkey.slice(0, 8)}...</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>

      {/* Wallet balance */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Your Balance</p>
        <p className="text-xl font-semibold">{walletBalanceSol.toFixed(4)} SOL</p>
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <label htmlFor="stakeAmount" className="text-sm font-medium">
          Stake Amount (SOL)
        </label>
        <input
          id="stakeAmount"
          type="number"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder={`Min ${minStakeSol} SOL`}
          step="0.001"
          min="0"
          className={cn(
            'w-full px-3 py-2 text-lg',
            'border rounded-lg bg-background',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            validation.error && 'border-destructive'
          )}
        />
        {validation.error && <p className="text-sm text-destructive">{validation.error}</p>}
      </div>

      {/* Quick amount buttons */}
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStakeAmount(amount.toString())}
            className="px-3 py-1"
          >
            {amount} SOL
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            // Max = balance - rent - estimated fees
            const maxStake = walletBalance - BigInt(2282880) - BigInt(10000);
            if (maxStake > BigInt(0)) {
              setStakeAmount((Number(maxStake) / 1_000_000_000).toFixed(6));
            }
          }}
          className="px-3 py-1"
        >
          Max
        </Button>
      </div>

      {/* Validator info reminder */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Commission: {validator.commission}%</p>
        <p>Est. APY: {(0.07 * (1 - validator.commission / 100) * 100).toFixed(2)}%</p>
      </div>

      {/* Warning */}
      <div className={cn('p-3 rounded-lg', 'bg-amber-500/10 border border-amber-500/20')}>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Staked SOL will be locked during warmup (1-2 epochs, ~2-4 days). You can unstake at any
          time, but there&apos;s also a cooldown period.
        </p>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        variant="solana"
        disabled={!validation.valid || !isConnected || isSimulating}
        className="w-full py-3 rounded-lg"
      >
        {isSimulating ? 'Simulating...' : 'Preview Transaction'}
      </Button>

      {!isConnected && (
        <p className="text-sm text-center text-muted-foreground">Connect your wallet to stake</p>
      )}
    </form>
  );
}

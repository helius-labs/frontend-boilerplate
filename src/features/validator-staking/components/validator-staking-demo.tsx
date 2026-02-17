'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/shared/hooks/use-wallet';
import { Button } from '@/shared/ui/button';
import { ConnectButton } from '@/shared/ui/connect-button';
import { useStakeTransaction } from '../hooks/use-stake-transaction';
import { StakeForm } from './stake-form';
import { TransactionPreview } from './transaction-preview';
import { ValidatorDetails } from './validator-details';
import { ValidatorList } from './validator-list';

export function ValidatorStakingDemo() {
  const { address, isConnected } = useWallet();

  const [step, setStep] = useState<DemoStep>('list');
  const [selectedValidator, setSelectedValidator] = useState<ValidatorInfo | null>(null);
  const [walletBalance, setWalletBalance] = useState(BigInt(0));

  // Fetch wallet balance
  useEffect(() => {
    if (!address) return;

    async function fetchBalance() {
      try {
        const response = await fetch('/api/rpc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'getBalance',
            params: [address, { commitment: 'confirmed' }],
          }),
        });
        const data = await response.json();
        if (data.result?.value !== undefined) {
          setWalletBalance(BigInt(data.result.value));
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    }

    fetchBalance();
  }, [address]);

  const stakeTransaction = useStakeTransaction({
    walletAddress: address,
    walletBalance,
    onSuccess: () => {
      setStep('success');
    },
    onError: () => {
      setStep('error');
    },
  });

  const handleSelectValidator = (validator: ValidatorInfo) => {
    setSelectedValidator(validator);
    stakeTransaction.setSelectedValidator(validator);
    setStep('details');
  };

  const handleStartStake = () => {
    setStep('stake-form');
  };

  const handlePreview = async () => {
    const success = await stakeTransaction.startStake();
    if (success) {
      setStep('preview');
    }
  };

  const handleConfirmStake = async () => {
    // Submit the real transaction via Phantom wallet
    // This will prompt the user to sign the transaction
    const result = await stakeTransaction.submitTransaction();

    if (result?.signature) {
      setStep('success');
    }
    // Error handling is done inside submitTransaction
  };

  const handleBack = () => {
    if (step === 'stake-form' || step === 'details') {
      setStep('list');
      setSelectedValidator(null);
    } else if (step === 'preview') {
      setStep('stake-form');
    }
  };

  const handleReset = () => {
    setStep('list');
    setSelectedValidator(null);
    stakeTransaction.reset();
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className={cn('p-8 text-center rounded-lg', 'border bg-muted/50')}>
        <p className="text-lg font-medium">Connect Wallet to Stake</p>
        <p className="text-muted-foreground mt-2">
          Connect your wallet to view validators and stake SOL.
        </p>
        <ConnectButton className="mt-4" />
      </div>
    );
  }

  // Render based on current step
  switch (step) {
    case 'list':
      return (
        <ValidatorList
          onSelectValidator={handleSelectValidator}
          selectedVotePubkey={selectedValidator?.votePubkey}
        />
      );

    case 'details':
      if (!selectedValidator) {
        setStep('list');
        return null;
      }
      return (
        <ValidatorDetails
          votePubkey={selectedValidator.votePubkey}
          onClose={handleBack}
          onStake={handleStartStake}
        />
      );

    case 'stake-form':
      if (!selectedValidator) {
        setStep('list');
        return null;
      }
      return (
        <StakeForm
          validator={selectedValidator}
          stakeAmount={stakeTransaction.stakeAmount}
          setStakeAmount={stakeTransaction.setStakeAmount}
          validation={stakeTransaction.validation}
          walletBalance={walletBalance}
          onSubmit={handlePreview}
          onCancel={handleBack}
          isSimulating={stakeTransaction.isSimulating}
        />
      );

    case 'preview':
      if (!selectedValidator || !stakeTransaction.preview) {
        setStep('stake-form');
        return null;
      }
      return (
        <TransactionPreview
          preview={stakeTransaction.preview}
          validator={selectedValidator}
          onConfirm={handleConfirmStake}
          onCancel={handleBack}
          isLoading={stakeTransaction.step === 'signing'}
        />
      );

    case 'success':
      return (
        <div className={cn('p-8 text-center rounded-lg', 'border bg-green-500/10')}>
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-xl text-green-600 dark:text-green-400">
            Stake Submitted!
          </h3>
          <p className="text-muted-foreground mt-2">
            Your stake has been delegated. It will become active after the warmup period (1-2
            epochs).
          </p>
          {stakeTransaction.transactionSignature && (
            <a
              href={`https://orbmarkets.io/tx/${stakeTransaction.transactionSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-mono text-primary hover:underline"
            >
              View transaction →
            </a>
          )}
          <div>
            <Button onClick={handleReset} variant="solana" className="mt-6 px-6 py-2 rounded-lg">
              Stake More
            </Button>
          </div>
        </div>
      );

    case 'error':
      return (
        <div className={cn('p-8 text-center rounded-lg', 'border bg-destructive/10')}>
          <h3 className="text-xl text-destructive">Transaction Failed</h3>
          <p className="text-muted-foreground mt-2">
            {stakeTransaction.error?.message || 'Something went wrong'}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button onClick={handleBack} variant="outline" className="px-6 py-2 rounded-lg">
              Try Again
            </Button>
            <Button onClick={handleReset} variant="solana" className="px-6 py-2 rounded-lg">
              Start Over
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
}

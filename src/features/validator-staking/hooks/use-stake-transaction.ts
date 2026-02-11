'use client';

import { useCallback, useRef, useState } from 'react';
import { useSolana } from '@phantom/react-sdk';
import { VersionedTransaction } from '@solana/web3.js';
import {
  STAKE_ACCOUNT_RENT_EXEMPTION,
  SUGGESTED_MIN_STAKE,
  buildStakeTransaction,
  validateStakeAmount,
} from '../lib/build-stake-transaction';
import { formatTransactionPreview, simulateStakeTransaction } from '../lib/simulate-stake';

type StakeStep = 'input' | 'preview' | 'signing' | 'confirming' | 'success' | 'error';

interface UseStakeTransactionOptions {
  walletAddress: string | null;
  walletBalance: bigint;
  onSuccess?: (signature: string) => void;
  onError?: (error: StakingError) => void;
}

export function useStakeTransaction(options: UseStakeTransactionOptions) {
  const { walletAddress, walletBalance, onSuccess, onError } = options;

  // Phantom SDK Solana provider
  const { solana, isAvailable } = useSolana();

  const [step, setStep] = useState<StakeStep>('input');
  const [selectedValidator, setSelectedValidator] = useState<ValidatorInfo | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [preview, setPreview] = useState<TransactionPreviewDisplay | null>(null);
  const [error, setError] = useState<StakingError | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  // Store the built transaction for later submission
  const builtTransactionRef = useRef<Uint8Array | null>(null);

  // Parse stake amount to lamports
  const stakeAmountLamports = useCallback((): bigint => {
    const sol = parseFloat(stakeAmount);
    if (isNaN(sol) || sol <= 0) return BigInt(0);
    return BigInt(Math.floor(sol * 1_000_000_000));
  }, [stakeAmount]);

  // Validate current input
  const validation = useCallback((): StakeAmountValidation => {
    const lamports = stakeAmountLamports();
    if (lamports === BigInt(0)) {
      return { valid: false, error: 'Enter an amount', suggestedMinimum: SUGGESTED_MIN_STAKE };
    }
    return validateStakeAmount(lamports, walletBalance);
  }, [stakeAmountLamports, walletBalance]);

  // Start stake flow - build and simulate transaction
  // Returns true if preview is ready, false otherwise
  const startStake = useCallback(async (): Promise<boolean> => {
    if (!walletAddress || !selectedValidator) {
      setError({ code: 'NETWORK_ERROR', message: 'Wallet not connected', retryable: false });
      return false;
    }

    const lamports = stakeAmountLamports();
    const valid = validation();

    if (!valid.valid) {
      setError({
        code: 'INSUFFICIENT_BALANCE',
        message: valid.error || 'Invalid amount',
        retryable: false,
      });
      return false;
    }

    setIsSimulating(true);
    setError(null);

    try {
      // Build transaction
      const txResult = await buildStakeTransaction({
        walletAddress,
        validatorVoteAccount: selectedValidator.votePubkey,
        amountLamports: lamports,
      });

      // Store the built transaction for later submission
      builtTransactionRef.current = txResult.transaction;

      // Simulate transaction
      const simResult = await simulateStakeTransaction(txResult.transaction, walletAddress);

      if (!simResult.success) {
        setError({
          code: 'SIMULATION_FAILED',
          message: simResult.error || 'Transaction simulation failed',
          retryable: true,
        });
        setStep('error');
        return false;
      }

      // Format preview for display
      const previewDisplay = formatTransactionPreview(lamports, simResult);
      setPreview(previewDisplay);
      setStep('preview');
      return true;
    } catch (err) {
      setError({
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Failed to build transaction',
        retryable: true,
      });
      setStep('error');
      return false;
    } finally {
      setIsSimulating(false);
    }
  }, [walletAddress, selectedValidator, stakeAmountLamports, validation]);

  // Confirm and sign transaction
  const confirmStake = useCallback(() => {
    setStep('signing');
  }, []);

  // Submit transaction via Phantom wallet
  const submitTransaction = useCallback(async (): Promise<{ signature: string } | null> => {
    if (!builtTransactionRef.current) {
      setError({
        code: 'NETWORK_ERROR',
        message: 'No transaction to submit. Please build transaction first.',
        retryable: true,
      });
      setStep('error');
      return null;
    }

    // Check Phantom SDK availability
    if (!isAvailable || !solana) {
      setError({
        code: 'NETWORK_ERROR',
        message: 'Phantom wallet not found. Please install Phantom.',
        retryable: false,
      });
      setStep('error');
      return null;
    }

    setStep('signing');

    try {
      // Deserialize the versioned transaction (single-signer: wallet only)
      const transaction = VersionedTransaction.deserialize(builtTransactionRef.current);

      // Sign and send via Phantom SDK
      const { signature } = await solana.signAndSendTransaction(transaction);

      // Success!
      setTransactionSignature(signature);
      setStep('success');
      onSuccess?.(signature);

      return { signature };
    } catch (err) {
      // User rejected or transaction failed
      const message = err instanceof Error ? err.message : 'Transaction failed';
      const isRejection =
        message.toLowerCase().includes('reject') ||
        message.toLowerCase().includes('cancel') ||
        message.toLowerCase().includes('denied');

      setError({
        code: isRejection ? 'SIGNING_REJECTED' : 'TRANSACTION_FAILED',
        message: isRejection ? 'Transaction was rejected by user' : message,
        retryable: !isRejection,
      });
      setStep('error');
      onError?.({
        code: isRejection ? 'SIGNING_REJECTED' : 'TRANSACTION_FAILED',
        message,
        retryable: !isRejection,
      });

      return null;
    }
  }, [isAvailable, solana, onSuccess, onError]);

  // Handle successful transaction
  const handleSuccess = useCallback(
    (signature: string) => {
      setTransactionSignature(signature);
      setStep('success');
      onSuccess?.(signature);
    },
    [onSuccess]
  );

  // Handle transaction error
  const handleError = useCallback(
    (err: StakingError) => {
      setError(err);
      setStep('error');
      onError?.(err);
    },
    [onError]
  );

  // Reset to initial state
  const reset = useCallback(() => {
    setStep('input');
    setSelectedValidator(null);
    setStakeAmount('');
    setPreview(null);
    setError(null);
    setTransactionSignature(null);
    builtTransactionRef.current = null;
  }, []);

  // Go back from preview to input
  const goBack = useCallback(() => {
    if (step === 'preview') {
      setStep('input');
      setPreview(null);
    }
  }, [step]);

  return {
    // State
    step,
    selectedValidator,
    stakeAmount,
    preview,
    error,
    isSimulating,
    transactionSignature,

    // Computed
    stakeAmountLamports: stakeAmountLamports(),
    validation: validation(),
    canStake: !!walletAddress && !!selectedValidator && validation().valid,

    // Actions
    setSelectedValidator,
    setStakeAmount,
    startStake,
    confirmStake,
    submitTransaction,
    handleSuccess,
    handleError,
    reset,
    goBack,

    // Constants
    minStake: SUGGESTED_MIN_STAKE,
    rentExemption: STAKE_ACCOUNT_RENT_EXEMPTION,
  };
}

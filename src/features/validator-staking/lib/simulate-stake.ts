// Simulate stake transaction for preview (VALD-04)
// Shows estimated fees and account changes before signing

export async function simulateStakeTransaction(
  serializedTransaction: Uint8Array,
  walletAddress: string
): Promise<TransactionPreview> {
  try {
    const response = await fetch('/api/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'simulateTransaction',
        params: [
          Buffer.from(serializedTransaction).toString('base64'),
          {
            encoding: 'base64',
            commitment: 'confirmed',
            replaceRecentBlockhash: true,
            accounts: {
              encoding: 'base64',
              addresses: [walletAddress],
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        estimatedFee: BigInt(0),
        totalCost: BigInt(0),
        accountChanges: [],
        error: data.error.message || data.error,
      };
    }

    const result = data.result?.value;

    if (result?.err) {
      return {
        success: false,
        estimatedFee: (BigInt(result.unitsConsumed || 0) * BigInt(5000)) / BigInt(1_000_000),
        totalCost: BigInt(0),
        accountChanges: [],
        error: formatSimulationError(result.err),
        logs: result.logs,
      };
    }

    // Calculate estimated fee from compute units
    // Default: 5000 lamports per 1M compute units
    const estimatedFee = (BigInt(result?.unitsConsumed || 5000) * BigInt(5000)) / BigInt(1_000_000);

    return {
      success: true,
      estimatedFee,
      totalCost: estimatedFee, // Will be updated by caller with stake amount
      accountChanges: [], // Parse from simulation if needed
      logs: result?.logs,
    };
  } catch (error) {
    return {
      success: false,
      estimatedFee: BigInt(0),
      totalCost: BigInt(0),
      accountChanges: [],
      error: error instanceof Error ? error.message : 'Simulation failed',
    };
  }
}

// Format simulation error for user display
function formatSimulationError(err: unknown): string {
  if (typeof err === 'string') {
    return err;
  }

  if (typeof err === 'object' && err !== null) {
    // Handle InstructionError format
    if ('InstructionError' in err) {
      const [index, detail] = (err as { InstructionError: [number, unknown] }).InstructionError;
      return `Instruction ${index} failed: ${JSON.stringify(detail)}`;
    }

    // Handle custom program errors
    if ('Custom' in err) {
      return `Custom error: ${(err as { Custom: number }).Custom}`;
    }

    return JSON.stringify(err);
  }

  return 'Unknown error';
}

// Calculate total cost for transaction preview
export function calculateTotalCost(
  stakeAmount: bigint,
  rentExemption: bigint,
  estimatedFee: bigint
): bigint {
  return stakeAmount + rentExemption + estimatedFee;
}

// Format preview for display
export function formatTransactionPreview(
  stakeAmountLamports: bigint,
  preview: TransactionPreview
): TransactionPreviewDisplay {
  const rentExemption = BigInt(2282880);

  const totalCost = stakeAmountLamports + rentExemption + preview.estimatedFee;

  const warnings: string[] = [];

  // Add warmup warning
  warnings.push('Staked SOL will be locked for 1-2 epochs (~2-4 days) during warmup.');

  // Add cooldown warning
  warnings.push('When you unstake, funds will be locked for another 1-2 epochs during cooldown.');

  return {
    stakeAmount: formatSol(stakeAmountLamports),
    rentExemption: formatSol(rentExemption),
    estimatedFee: formatSol(preview.estimatedFee),
    totalCost: formatSol(totalCost),
    warnings,
  };
}

function formatSol(lamports: bigint): string {
  const sol = Number(lamports) / 1_000_000_000;
  if (sol < 0.0001) {
    return `~${lamports.toString()} lamports`;
  }
  return `${sol.toFixed(6)} SOL`;
}

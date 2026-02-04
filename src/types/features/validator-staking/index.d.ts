// Type definitions for validator-staking feature

interface ValidatorInfo {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: bigint;
  commission: number;
  epochVoteAccount: boolean;
  lastVote: number;
  rootSlot: number;
  status: 'current' | 'delinquent';
  name?: string;
  image?: string;
  version?: string;
  delinquent?: boolean;
  skipRate?: number;
  apyEstimate?: number;
}

interface ValidatorListResult {
  validators: ValidatorInfo[];
  totalStake: bigint;
  currentEpoch: number;
  delinquentCount: number;
}

interface ValidatorDetails extends ValidatorInfo {
  estimatedApy: number;
  stakePercentage: number;
  epochCredits: [number, number, number][];
}

interface StakeTransactionParams {
  walletAddress: string;
  validatorVoteAccount: string;
  amountLamports: bigint;
}

interface StakeTransactionResult {
  transaction: Uint8Array;
  stakeAccountKeypair: import('@solana/web3.js').Keypair;
  stakeAccountAddress: string;
  estimatedRentExemption: bigint;
}

interface TransactionPreview {
  success: boolean;
  estimatedFee: bigint;
  totalCost: bigint;
  accountChanges: AccountChange[];
  error?: string;
  logs?: string[];
}

// Formatted version for UI display (strings formatted as "X.XX SOL")
interface TransactionPreviewDisplay {
  stakeAmount: string;
  rentExemption: string;
  estimatedFee: string;
  totalCost: string;
  warnings: string[];
}

interface AccountChange {
  address: string;
  label: string;
  balanceBefore: bigint;
  balanceAfter: bigint;
  change: bigint;
}

interface StakingError {
  code:
    | 'INSUFFICIENT_BALANCE'
    | 'SIMULATION_FAILED'
    | 'SIGNING_REJECTED'
    | 'TRANSACTION_FAILED'
    | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

type StakeAmountValidation = {
  valid: boolean;
  error?: string;
  suggestedMinimum: bigint;
};

// Component Props

type DemoStep = 'list' | 'details' | 'stake-form' | 'preview' | 'success' | 'error';

interface StakeFormProps {
  validator: ValidatorInfo;
  stakeAmount: string;
  setStakeAmount: (amount: string) => void;
  validation: StakeAmountValidation;
  walletBalance: bigint;
  onSubmit: () => void;
  onCancel: () => void;
  isSimulating: boolean;
}

interface TransactionPreviewProps {
  preview: TransactionPreviewDisplay;
  validator: ValidatorInfo;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface ValidatorListProps {
  onSelectValidator: (validator: ValidatorInfo) => void;
  selectedVotePubkey?: string;
}

interface ValidatorDetailsProps {
  votePubkey: string;
  onClose: () => void;
  onStake: () => void;
}

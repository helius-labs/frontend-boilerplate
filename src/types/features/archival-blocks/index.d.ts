// Types for archival blocks feature

interface BlockTransaction {
  signature: string;
  slot?: number;
  err: unknown | null;
  memo?: string | null;
}

interface BlockReward {
  pubkey: string;
  lamports: number;
  postBalance: number;
  rewardType: string;
  commission?: number;
}

interface SolanaBlock {
  blockhash: string;
  previousBlockhash: string;
  parentSlot: number;
  blockTime: number | null;
  blockHeight: number | null;
  transactions: BlockTransaction[];
  rewards?: BlockReward[];
}

interface ArchivalBlockError {
  code: 'NOT_FOUND' | 'NETWORK_ERROR' | 'ARCHIVAL_REQUIRED' | 'INVALID_SLOT';
  message: string;
  suggestion?: string;
}

interface ArchivalBlockResult {
  slot: number;
  block: SolanaBlock | null;
  fetchedAt: number;
}

interface NotableSlot {
  slot: number;
  label: string;
  description: string;
}

// Component Props

interface ArchivalBlocksDemoProps {
  defaultSlot?: number;
}

interface BlockDisplayProps {
  block: SolanaBlock | null;
  slot: number;
  isLoading: boolean;
  error: ArchivalBlockError | null;
}

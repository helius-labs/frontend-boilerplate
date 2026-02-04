// Fetch single validator details (VALD-02)
// Enhanced with APY calculation and epoch credits

// Estimated network APY for Solana staking (varies, ~6-8%)
const ESTIMATED_NETWORK_APY = 0.07;

export function calculateValidatorDetails(
  validator: ValidatorInfo,
  totalNetworkStake: bigint,
  epochCredits?: [number, number, number][]
): ValidatorDetails {
  // Calculate estimated APY based on commission
  // Validator APY = Network APY * (1 - commission/100)
  const estimatedApy = ESTIMATED_NETWORK_APY * (1 - validator.commission / 100);

  // Calculate stake percentage
  const stakePercentage =
    totalNetworkStake > BigInt(0)
      ? Number((validator.activatedStake * BigInt(10000)) / totalNetworkStake) / 100
      : 0;

  return {
    ...validator,
    estimatedApy,
    stakePercentage,
    epochCredits: epochCredits || [],
  };
}

// Raw response type from RPC
interface RawVoteAccount {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
  commission: number;
  epochVoteAccount: boolean;
  epochCredits: [number, number, number][];
  lastVote: number;
  rootSlot: number;
}

// Fetch full validator details including epoch credits
export async function fetchValidatorDetails(votePubkey: string): Promise<ValidatorDetails | null> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getVoteAccounts',
      params: [{ commitment: 'confirmed', votePubkey }],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const result = data.result;
  const validator: RawVoteAccount | undefined = result.current[0] || result.delinquent[0];

  if (!validator) {
    return null;
  }

  // Need total stake for percentage calculation
  const allValidators: RawVoteAccount[] = [...result.current, ...result.delinquent];
  const totalStake = allValidators.reduce(
    (sum: bigint, v: RawVoteAccount) => sum + BigInt(v.activatedStake),
    BigInt(0)
  );

  const validatorInfo: ValidatorInfo = {
    votePubkey: validator.votePubkey,
    nodePubkey: validator.nodePubkey,
    activatedStake: BigInt(validator.activatedStake),
    commission: validator.commission,
    epochVoteAccount: validator.epochVoteAccount,
    lastVote: validator.lastVote,
    rootSlot: validator.rootSlot,
    status: result.current.includes(validator) ? 'current' : 'delinquent',
  };

  return calculateValidatorDetails(validatorInfo, totalStake, validator.epochCredits);
}

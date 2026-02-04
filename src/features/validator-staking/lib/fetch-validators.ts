// Fetch all validators with stake amounts and metadata
// Uses Stakewiz API for enriched validator data (names, images, APY, etc.)

// Stakewiz API response type
interface StakewizValidator {
  identity: string;
  vote_identity: string;
  activated_stake: number;
  commission: number;
  version: string | null;
  delinquent: boolean;
  skip_rate: number;
  name: string | null;
  image?: string;
  apy_estimate?: number;
  last_vote?: number;
  root_slot?: number;
}

export async function fetchValidators(): Promise<ValidatorListResult> {
  const response = await fetch('https://api.stakewiz.com/validators', {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Stakewiz API error: ${response.status} ${response.statusText}`);
  }

  const validators: StakewizValidator[] = await response.json();

  // Filter out validators with no stake or unknown version
  const activeValidators = validators.filter(
    (v) =>
      v.activated_stake > 0 && v.version !== null && v.version !== 'unknown' && v.version !== ''
  );

  // Map to our ValidatorInfo type
  const mappedValidators: ValidatorInfo[] = activeValidators.map((v) => ({
    votePubkey: v.vote_identity,
    nodePubkey: v.identity,
    activatedStake: BigInt(Math.floor(v.activated_stake)),
    commission: v.commission,
    epochVoteAccount: !v.delinquent,
    lastVote: v.last_vote ?? 0,
    rootSlot: v.root_slot ?? 0,
    status: v.delinquent ? ('delinquent' as const) : ('current' as const),
    // Enriched data
    name: v.name ?? undefined,
    image: v.image,
    version: v.version ?? undefined,
    delinquent: v.delinquent,
    skipRate: v.skip_rate,
    apyEstimate: v.apy_estimate,
  }));

  // Sort by stake (descending)
  mappedValidators.sort((a, b) => {
    if (b.activatedStake > a.activatedStake) return 1;
    if (b.activatedStake < a.activatedStake) return -1;
    return 0;
  });

  // Calculate total stake
  const totalStake = mappedValidators.reduce((sum, v) => sum + v.activatedStake, BigInt(0));

  // Count delinquent
  const delinquentCount = mappedValidators.filter((v) => v.status === 'delinquent').length;

  return {
    validators: mappedValidators,
    totalStake,
    currentEpoch: 0, // Could fetch from getEpochInfo if needed
    delinquentCount,
  };
}

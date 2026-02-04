// Use Case 2: Upgrade Authority
// Fetches ProgramData account to get upgrade authority and deploy slot

export async function fetchUpgradeAuthority(
  programDataAddress: string
): Promise<UpgradeAuthorityResult> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getAccountInfo',
      params: [programDataAddress, { encoding: 'jsonParsed' }],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  const account = data.result?.value;

  if (!account) {
    throw new Error('ProgramData account not found');
  }

  const parsed = account.data?.parsed;

  if (parsed?.type !== 'programData') {
    throw new Error('Invalid ProgramData account format');
  }

  return {
    programDataAddress,
    upgradeAuthority: parsed.info?.authority ?? null, // null = immutable
    lastDeploySlot: parsed.info?.slot ?? 0,
    programDataSpace: account.space ?? 0,
  };
}

// Combined function: fetch program info + upgrade authority in one call
export async function fetchProgramWithAuthority(
  programId: string
): Promise<ProgramInfo & { upgradeAuthority: string | null; lastDeploySlot: number }> {
  // First, get program info
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getAccountInfo',
      params: [programId, { encoding: 'jsonParsed' }],
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);

  const account = data.result?.value;
  if (!account) {
    const error: ProgramInfoError = { code: 'NOT_FOUND', message: 'Program not found' };
    throw error;
  }
  if (!account.executable) {
    const error: ProgramInfoError = {
      code: 'NOT_EXECUTABLE',
      message: 'Not an executable account',
    };
    throw error;
  }

  const parsed = account.data?.parsed;
  const programDataAddress = parsed?.info?.programData;

  // If it's a BPF Upgradeable Loader program, fetch ProgramData account
  if (programDataAddress) {
    const authorityResult = await fetchUpgradeAuthority(programDataAddress);

    return {
      executable: account.executable,
      owner: account.owner,
      lamports: BigInt(account.lamports),
      rentEpoch: account.rentEpoch ?? 0,
      space: account.space ?? 0,
      programDataAddress,
      upgradeAuthority: authorityResult.upgradeAuthority,
      lastDeploySlot: authorityResult.lastDeploySlot,
    };
  }

  // Non-upgradeable program (native or legacy BPF)
  return {
    executable: account.executable,
    owner: account.owner,
    lamports: BigInt(account.lamports),
    rentEpoch: account.rentEpoch ?? 0,
    space: account.space ?? 0,
    upgradeAuthority: null, // Not applicable
    lastDeploySlot: 0,
  };
}

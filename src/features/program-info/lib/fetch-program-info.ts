// Use Case 1: Program Metadata
// Uses getAccountInfo with jsonParsed encoding

export async function fetchProgramInfo(programId: string): Promise<ProgramInfo> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getAccountInfo',
      params: [programId, { encoding: 'jsonParsed' }],
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
    const error: ProgramInfoError = {
      code: 'NOT_FOUND',
      message: 'Account not found on-chain',
      suggestion: 'Check that the program ID is correct and exists on mainnet',
    };
    throw error;
  }

  if (!account.executable) {
    const error: ProgramInfoError = {
      code: 'NOT_EXECUTABLE',
      message: 'This address is a data account, not a program',
      suggestion: 'Enter a program ID (executable account) instead',
    };
    throw error;
  }

  // Extract program data address from BPF Upgradeable Loader programs
  const parsed = account.data?.parsed;
  let programDataAddress: string | undefined;

  if (
    account.owner === 'BPFLoaderUpgradeab1e11111111111111111111111' &&
    parsed?.type === 'program'
  ) {
    programDataAddress = parsed.info?.programData;
  }

  return {
    executable: account.executable,
    owner: account.owner,
    lamports: BigInt(account.lamports),
    rentEpoch: account.rentEpoch ?? 0,
    space: account.space ?? account.data?.length ?? 0,
    programDataAddress,
  };
}

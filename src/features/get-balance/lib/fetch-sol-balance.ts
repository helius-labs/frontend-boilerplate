// Use Case 1: SOL Balance Only
// Uses standard RPC getBalance method

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);

export async function fetchSolBalance(address: string): Promise<SolBalanceResult> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getBalance',
      params: [address],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: RpcProxyResponse = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  // getBalance returns { context: { slot }, value: lamports }
  const lamports = BigInt((data.result as { value: number }).value);

  return {
    lamports,
    sol: Number(lamports) / Number(LAMPORTS_PER_SOL),
  };
}

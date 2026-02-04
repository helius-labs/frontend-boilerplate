// Use Case 3: IDL Lookup
// Uses @coral-xyz/anchor to fetch on-chain IDL

// NOTE: This function runs client-side and uses Anchor's built-in IDL fetching
// It creates a temporary Connection to the RPC endpoint

export async function fetchProgramIdl(programId: string, rpcUrl: string): Promise<IdlResult> {
  try {
    // Dynamic import to avoid bundling Anchor in the main bundle
    // This is a large dependency, so we only load it when needed
    const { Program } = await import('@coral-xyz/anchor');
    const { Connection, PublicKey } = await import('@solana/web3.js');

    const connection = new Connection(rpcUrl);
    const pubkey = new PublicKey(programId);

    // Program.fetchIdl uses the IDL account at the deterministic PDA
    // See: https://www.anchor-lang.com/docs/cli#idl-commands
    const idl = await Program.fetchIdl(pubkey, { connection });

    if (!idl) {
      return {
        found: false,
        error:
          'No IDL found. This program may not be built with Anchor, or the IDL was not published on-chain using `anchor idl init`.',
      };
    }

    return {
      found: true,
      idl,
    };
  } catch (error) {
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Account does not exist')) {
        return {
          found: false,
          error: 'IDL account not found. The program may not have published its IDL on-chain.',
        };
      }
    }

    return {
      found: false,
      error: error instanceof Error ? error.message : 'Failed to fetch IDL',
    };
  }
}

// Helper to get RPC URL for IDL fetching
// Uses the proxy endpoint to hide the actual Helius URL
export function getRpcUrlForIdl(): string {
  // In production, we'd use the Helius RPC directly since IDL fetch is read-only
  // For now, we'll use a public RPC endpoint
  return process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';
}

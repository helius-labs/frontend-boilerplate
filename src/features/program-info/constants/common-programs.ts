// Common program IDs for pre-population (PROG-03)
// These are well-known programs that users frequently look up

export const COMMON_PROGRAMS: CommonProgram[] = [
  {
    id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    name: 'SPL Token Program',
    description: 'Original token program for fungible and non-fungible tokens',
    hasIdl: false,
  },
  {
    id: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    name: 'Token-2022 (Token Extensions)',
    description: 'Extended token program with additional features',
    hasIdl: false,
  },
  {
    id: '11111111111111111111111111111111',
    name: 'System Program',
    description: 'Creates accounts, transfers SOL, allocates data',
    hasIdl: false,
  },
  {
    id: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
    name: 'Metaplex Token Metadata',
    description: 'NFT metadata standard',
    hasIdl: true,
  },
  {
    id: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    name: 'Associated Token Account',
    description: 'Derives token account addresses',
    hasIdl: false,
  },
  {
    id: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
    name: 'Jupiter Aggregator v6',
    description: 'DEX aggregator for token swaps',
    hasIdl: true,
  },
  {
    id: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
    name: 'Orca Whirlpools',
    description: 'Concentrated liquidity AMM',
    hasIdl: true,
  },
  {
    id: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
    name: 'Memo Program',
    description: 'Attaches memo text to transactions',
    hasIdl: false,
  },
];

// Helper to find program by ID
export function findCommonProgram(id: string): CommonProgram | undefined {
  return COMMON_PROGRAMS.find((p) => p.id === id);
}

// Fetch a block by slot number using getBlock RPC method
// Requires archival access for historical slots

export async function fetchBlock(slot: number): Promise<SolanaBlock | null> {
  const response = await fetch('/api/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method: 'getBlock',
      params: [
        slot,
        {
          encoding: 'jsonParsed',
          transactionDetails: 'signatures',
          maxSupportedTransactionVersion: 0,
          rewards: true,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.error) {
    // Check for common archival-related errors
    if (
      data.error.includes('was skipped') ||
      data.error.includes('not available') ||
      data.error.includes('Block not found')
    ) {
      const error: ArchivalBlockError = {
        code: 'NOT_FOUND',
        message: `Block at slot ${slot} not found or was skipped`,
        suggestion: 'Try a different slot number. Some slots are skipped by validators.',
      };
      throw error;
    }
    throw new Error(data.error);
  }

  // Block can be null for skipped slots
  if (!data.result) {
    return null;
  }

  // When transactionDetails: 'signatures' is used, the RPC returns a `signatures`
  // array (strings) instead of `transactions` array (objects). Transform to match
  // our expected interface.
  const block = data.result;
  if (block.signatures && !block.transactions) {
    block.transactions = block.signatures.map((sig: string) => ({ signature: sig }));
  }

  return block;
}

// Genesis slot constant
export const GENESIS_SLOT = 0;

// Notable historical slots for quick selection
export const NOTABLE_SLOTS: NotableSlot[] = [
  {
    slot: 0,
    label: 'Genesis Block',
    description: 'The very first block of Solana mainnet',
  },
  {
    slot: 100,
    label: 'Slot 100',
    description: 'From the first minutes of Solana',
  },
  {
    slot: 1000000,
    label: 'Slot 1,000,000',
    description: 'A milestone in early Solana history',
  },
  {
    slot: 390000000,
    label: 'Slot 390,000,000',
    description: 'A slot close to the present day',
  },
];

// Code examples for program info demo (DEMO-06)
// TypeScript and cURL examples for each use case

export const PROGRAM_INFO_CODE_EXAMPLES: Record<string, CodeExample> = {
  metadata: {
    typescript: `// Get program account info (metadata, owner, executable status)
import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

// Fetch program account info
const programId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

const accountInfo = await rpc.getAccountInfo(programId, {
  encoding: 'jsonParsed'
}).send();

console.log('Executable:', accountInfo.value?.executable);
console.log('Owner:', accountInfo.value?.owner);
console.log('Lamports:', accountInfo.value?.lamports);
console.log('Space:', accountInfo.value?.space);`,

    curl: `# Get program account info
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      { "encoding": "jsonParsed" }
    ]
  }'

# Response includes executable, owner, lamports, data fields`,
  },

  'upgrade-authority': {
    typescript: `// Get upgrade authority for upgradeable programs
import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

// Step 1: Get program account to find ProgramData address
const programId = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';

const programInfo = await rpc.getAccountInfo(programId, {
  encoding: 'jsonParsed'
}).send();

const programDataAddress = programInfo.value?.data?.parsed?.info?.programData;

// Step 2: Get ProgramData account for upgrade authority
const programDataInfo = await rpc.getAccountInfo(programDataAddress, {
  encoding: 'jsonParsed'
}).send();

const upgradeAuthority = programDataInfo.value?.data?.parsed?.info?.authority;
const lastDeploySlot = programDataInfo.value?.data?.parsed?.info?.slot;

console.log('Upgrade Authority:', upgradeAuthority || 'Immutable (frozen)');
console.log('Last Deploy Slot:', lastDeploySlot);`,

    curl: `# Step 1: Get program account
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0", "id": 1,
    "method": "getAccountInfo",
    "params": ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", {"encoding": "jsonParsed"}]
  }'

# Step 2: Get ProgramData account (use programData address from step 1)
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0", "id": 1,
    "method": "getAccountInfo",
    "params": ["<PROGRAM_DATA_ADDRESS>", {"encoding": "jsonParsed"}]
  }'

# authority field is null if program is frozen/immutable`,
  },

  idl: {
    typescript: `// Fetch on-chain Anchor IDL
import { Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection(
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY'
);

// Fetch on-chain IDL (requires program to have published IDL)
const programId = new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc');

const idl = await Program.fetchIdl(programId, { connection });

if (idl) {
  console.log('Program Name:', idl.name);
  console.log('Instructions:', idl.instructions.map(i => i.name));
  console.log('Accounts:', idl.accounts?.map(a => a.name));
} else {
  console.log('No IDL found on-chain');
}`,

    curl: `# IDL fetching requires the Anchor library to derive the IDL account address.
# The IDL is stored at a PDA derived from the program ID.
#
# IDL Account PDA: seeds = ["anchor:idl", program_id]
#
# You can use the Anchor CLI to fetch IDLs:
anchor idl fetch <PROGRAM_ID> --provider.cluster mainnet

# Or calculate the IDL account address manually:
# 1. Derive PDA with seeds ["anchor:idl", program_id_bytes]
# 2. Fetch account data with getAccountInfo
# 3. Decompress and parse the IDL JSON`,
  },
};

export function getCodeExample(useCase: string): CodeExample {
  return PROGRAM_INFO_CODE_EXAMPLES[useCase] || PROGRAM_INFO_CODE_EXAMPLES.metadata;
}

// Code examples for archival blocks demo
// TypeScript and cURL examples

export const ARCHIVAL_BLOCKS_CODE_EXAMPLES: Record<string, CodeExample> = {
  'get-block': {
    typescript: `// Fetch a historical block by slot number
// Requires Helius archival access for old blocks
import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

// Fetch the genesis block (slot 0)
const genesisBlock = await rpc.getBlock(0, {
  encoding: 'jsonParsed',
  transactionDetails: 'signatures',
  maxSupportedTransactionVersion: 0,
  rewards: true,
}).send();

if (genesisBlock) {
  console.log('Blockhash:', genesisBlock.blockhash);
  console.log('Block Time:', genesisBlock.blockTime);
  console.log('Block Height:', genesisBlock.blockHeight);
  console.log('Transactions:', genesisBlock.transactions.length);
  console.log('Parent Slot:', genesisBlock.parentSlot);
} else {
  console.log('Block not found (slot may have been skipped)');
}`,

    curl: `# Fetch a historical block by slot number
# Helius provides archival access for all historical Solana data

curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBlock",
    "params": [
      0,
      {
        "encoding": "jsonParsed",
        "transactionDetails": "signatures",
        "maxSupportedTransactionVersion": 0,
        "rewards": true
      }
    ]
  }'

# Response includes blockhash, blockTime, transactions, rewards`,
  },

  'recent-block': {
    typescript: `// Fetch a recent block using getLatestBlockhash first
import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

// Get current slot info
const epochInfo = await rpc.getEpochInfo().send();
const currentSlot = epochInfo.absoluteSlot;

// Fetch a recent confirmed block (a few slots back to ensure finality)
const recentBlock = await rpc.getBlock(currentSlot - 10, {
  encoding: 'jsonParsed',
  transactionDetails: 'full',
  maxSupportedTransactionVersion: 0,
}).send();

console.log('Recent block at slot:', currentSlot - 10);
console.log('Transactions:', recentBlock?.transactions.length);`,

    curl: `# Get current slot first, then fetch a recent block
# Step 1: Get epoch info for current slot
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"getEpochInfo"}'

# Step 2: Fetch block at (currentSlot - 10)
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBlock",
    "params": [<SLOT_NUMBER>, {"encoding": "jsonParsed"}]
  }'`,
  },

  'block-with-txs': {
    typescript: `// Fetch block with full transaction details
import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

const block = await rpc.getBlock(slot, {
  encoding: 'jsonParsed',
  transactionDetails: 'full',  // Get full transaction data
  maxSupportedTransactionVersion: 0,
  rewards: true,
}).send();

if (block) {
  // Access full transaction details
  for (const tx of block.transactions) {
    console.log('Signature:', tx.transaction.signatures[0]);
    console.log('Success:', tx.meta?.err === null);
    console.log('Fee:', tx.meta?.fee);

    // Parsed instructions (when available)
    const instructions = tx.transaction.message.instructions;
    console.log('Instructions:', instructions.length);
  }
}`,

    curl: `# Fetch block with full transaction details
curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBlock",
    "params": [
      <SLOT_NUMBER>,
      {
        "encoding": "jsonParsed",
        "transactionDetails": "full",
        "maxSupportedTransactionVersion": 0,
        "rewards": true
      }
    ]
  }'

# transactionDetails options:
# - "full": Complete transaction data with parsed instructions
# - "signatures": Only transaction signatures (faster)
# - "none": No transaction data (just block metadata)`,
  },
};

export function getCodeExample(useCase: string): CodeExample {
  return ARCHIVAL_BLOCKS_CODE_EXAMPLES[useCase] || ARCHIVAL_BLOCKS_CODE_EXAMPLES['get-block'];
}

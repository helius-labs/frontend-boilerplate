// Code examples for each use case
// Used in demo page to show copy-pasteable code

export const CODE_EXAMPLES: Record<BalanceUseCase, CodeExample> = {
  'sol-only': {
    typescript: `// Get SOL balance for a wallet
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getSolBalance(address: string) {
  const response = await helius.rpc.getBalance(address);

  const lamports = BigInt(response.value);
  const sol = Number(lamports) / 1_000_000_000;

  return {
    lamports,
    sol
  };
}

// Usage
const balance = await getSolBalance('86xCnPeV69n...');
console.log(\`Balance: \${balance.sol} SOL\`);`,

    curl: `# Get SOL balance using Helius RPC
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getBalance",
    "params": ["86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY"]
  }'

# Response: { "result": { "context": { "slot": 123 }, "value": 5000000000 } }
# value is in lamports (divide by 1e9 for SOL)`,
  },

  'all-tokens': {
    typescript: `// Get all token balances + SOL for a wallet
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getAllBalances(address: string) {
  const response = await helius.getAssetsByOwner({
    ownerAddress: address,
    page: 1,
    limit: 1000,
    displayOptions: {
      showFungible: true,
      showNativeBalance: true
    }
  });

  return {
    nativeBalance: response.nativeBalance,
    tokens: response.items.filter(
      item => item.interface === 'FungibleToken'
    )
  };
}

// Usage
const balances = await getAllBalances('86xCnPeV69n...');
console.log(\`SOL: \${balances.nativeBalance.lamports / 1e9}\`);
console.log(\`Tokens: \${balances.tokens.length}\`);`,

    curl: `# Get all token balances using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getAssetsByOwner",
    "params": [{
      "ownerAddress": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      "page": 1,
      "limit": 1000,
      "displayOptions": {
        "showFungible": true,
        "showNativeBalance": true
      }
    }]
  }'

# Returns nativeBalance + items array with token info`,
  },

  'specific-token': {
    typescript: `// Get specific token balance for a wallet
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getTokenBalance(owner: string, mint: string) {
  const response = await helius.getTokenAccounts({
    owner,
    mint,
    limit: 1
  });

  if (!response.token_accounts?.length) {
    return { found: false };
  }

  const account = response.token_accounts[0];
  return {
    found: true,
    amount: account.amount,
    mint: account.mint
  };
}

// Usage - Check USDC balance
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const balance = await getTokenBalance('86xCnPeV69n...', USDC_MINT);`,

    curl: `# Get specific token balance using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getTokenAccounts",
    "params": [{
      "owner": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "limit": 1
    }]
  }'

# Returns token_accounts array with balance info`,
  },
};

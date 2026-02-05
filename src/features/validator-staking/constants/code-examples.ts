// Code examples for validator staking demo

export const VALIDATOR_STAKING_CODE_EXAMPLES: Record<string, CodeExample> = {
  'validator-list': {
    typescript: `// Stakewiz API provides enriched validator data (names, images, APY, etc.)
const response = await fetch('https://api.stakewiz.com/validators');
const validators = await response.json();

// Filter active validators
const activeValidators = validators.filter(v =>
  v.activated_stake > 0 &&
  v.version &&
  v.version !== 'unknown'
);

// Sort by stake (descending)
activeValidators.sort((a, b) => b.activated_stake - a.activated_stake);

console.log(\`Total validators: \${activeValidators.length}\`);
console.log(\`Top validator: \${activeValidators[0].name}\`);
console.log(\`Stake: \${activeValidators[0].activated_stake / 1e9} SOL\`);
console.log(\`APY: \${activeValidators[0].apy_estimate}%\`);`,

    curl: `# Stakewiz API - returns validator names, images, APY, and more
curl https://api.stakewiz.com/validators

# For a single validator:
curl https://api.stakewiz.com/validator/<VOTE_PUBKEY>`,
  },

  'stake-sol': {
    typescript: `import { useSolana } from '@phantom/react-sdk';
import { Keypair, PublicKey, StakeProgram, Transaction } from '@solana/web3.js';

function StakeButton({ validator, amount }: { validator: string; amount: number }) {
  const { solana, isAvailable } = useSolana();

  const stake = async () => {
    if (!isAvailable || !solana?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const walletPubkey = solana.publicKey;
    const stakeAccount = Keypair.generate();
    const validatorVotePubkey = new PublicKey(validator);
    const amountLamports = amount * 1_000_000_000;

    // Get rent exemption (stake accounts need ~0.00228 SOL)
    const rentExemption = 2282880; // Or fetch via RPC

    // Build stake transaction
    const transaction = new Transaction().add(
      // Create stake account
      StakeProgram.createAccount({
        fromPubkey: walletPubkey,
        stakePubkey: stakeAccount.publicKey,
        authorized: {
          staker: walletPubkey,
          withdrawer: walletPubkey,
        },
        lamports: amountLamports + rentExemption,
      }),
      // Delegate to validator
      StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: walletPubkey,
        votePubkey: validatorVotePubkey,
      })
    );

    // Sign with stake account keypair first
    transaction.partialSign(stakeAccount);

    // Sign and send via Phantom SDK
    const { signature } = await solana.signAndSendTransaction(transaction);
    console.log('Staked! Signature:', signature);
    return signature;
  };

  return <button onClick={stake}>Stake {amount} SOL</button>;
}`,

    curl: `# Staking requires transaction signing via a wallet.
# Use the Solana CLI for command-line staking:

solana create-stake-account ./stake-keypair.json 1 \\
  --from ~/.config/solana/id.json \\
  --stake-authority ~/.config/solana/id.json \\
  --withdraw-authority ~/.config/solana/id.json

solana delegate-stake ./stake-keypair.json <VALIDATOR_VOTE_PUBKEY> \\
  --stake-authority ~/.config/solana/id.json`,
  },

  'simulate-transaction': {
    typescript: `import { createSolanaRpc } from '@solana/kit';

const rpc = createSolanaRpc('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY');

// After building the transaction...
const serializedTx = transaction.serialize();

// Simulate before signing
const simulation = await rpc.simulateTransaction(
  serializedTx,
  {
    commitment: 'confirmed',
    replaceRecentBlockhash: true
  }
).send();

if (simulation.value.err) {
  console.error('Simulation failed:', simulation.value.err);
} else {
  console.log('Estimated compute units:', simulation.value.unitsConsumed);
  console.log('Would succeed!');
}`,

    curl: `curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "simulateTransaction",
    "params": [
      "<BASE64_ENCODED_TRANSACTION>",
      {
        "encoding": "base64",
        "commitment": "confirmed",
        "replaceRecentBlockhash": true
      }
    ]
  }'`,
  },
};

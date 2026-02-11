// Code examples for Phantom Connect pages

export const PHANTOM_CONNECT_CODE_EXAMPLES: Record<string, CodeExample> = {
  // Integration page examples
  'provider-setup': {
    typescript: `// app/layout.tsx or _app.tsx
import { AddressType, PhantomProvider, darkTheme } from '@phantom/react-sdk';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PhantomProvider
          config={{
            providers: ['google', 'apple', 'injected'], // Social login + wallet-standard
            appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',
            addressTypes: [AddressType.solana],
          }}
          theme={darkTheme}
          appName="My Solana App"
          appIcon="https://example.com/icon.png" // Optional: your app icon
        >
          {children}
        </PhantomProvider>
      </body>
    </html>
  );
}`,

    curl: `# Install the Phantom SDK
npm install @phantom/react-sdk

# Or with yarn
yarn add @phantom/react-sdk

# Or with pnpm
pnpm add @phantom/react-sdk`,
  },

  'use-wallet-hook': {
    typescript: `import { useWallet } from '@/shared/hooks/use-wallet';

function WalletStatus() {
  const {
    isConnected,
    isConnecting,
    address,
    connectors,
    connect,
    disconnect
  } = useWallet();

  if (isConnecting) return <div>Connecting...</div>;

  if (!isConnected) {
    return (
      <div>
        {/* Open modal with all options */}
        <button onClick={() => connect()}>Connect Wallet</button>

        {/* Or connect to a specific wallet */}
        {connectors.map((wallet) => (
          <button key={wallet.id} onClick={() => connect(wallet.id)}>
            Connect {wallet.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}`,

    curl: `# The Phantom SDK is client-side only
# For server-side wallet verification, use signature verification:

# 1. Generate a nonce on your server
# 2. Have the user sign the nonce with their wallet
# 3. Verify the signature server-side with @solana/web3.js`,
  },

  // Connection types page examples
  'open-modal': {
    typescript: `import { useModal } from '@phantom/react-sdk';

function ConnectButton() {
  const { open, isOpened } = useModal();

  const handleConnect = () => {
    open();
  };

  return (
    <button onClick={handleConnect} disabled={isOpened}>
      Connect Wallet
    </button>
  );
}

// The modal shows all connection options:
// - Phantom extension/mobile
// - Google login (creates embedded wallet)
// - Apple login (creates embedded wallet)
// - Solflare, Backpack, Exodus, and other wallet-standard wallets`,

    curl: `# Modal connection is client-side only
# For testing connections programmatically, use the wallet provider APIs:

# Check if wallets are installed:
window.phantom?.solana?.isPhantom
window.solflare?.isSolflare
window.backpack?.isBackpack
window.exodus?.solana?.isExodus

# Connect directly to a wallet:
await window.phantom?.solana?.connect()`,
  },

  'social-login': {
    typescript: `import { useConnect } from '@phantom/react-sdk';

function SocialLoginButtons() {
  const { connect } = useConnect();

  const handleGoogleLogin = async () => {
    try {
      // Opens OAuth flow for Google - creates embedded wallet
      await connect({ provider: 'google' });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      // Opens OAuth flow for Apple - creates embedded wallet
      await connect({ provider: 'apple' });
    } catch (error) {
      console.error('Apple login failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <button onClick={handleAppleLogin}>
        Sign in with Apple
      </button>
    </div>
  );
}`,

    curl: `# Social login requires the Phantom SDK on client
# Users authenticate via OAuth, then Phantom creates
# a non-custodial wallet linked to their social account

# Benefits:
# - No browser extension required
# - Works on any device
# - Familiar login flow for Web2 users
# - Full Solana wallet capabilities`,
  },

  'wallet-standard': {
    typescript: `import { useModal, useDiscoveredWallets } from '@phantom/react-sdk';

// Phantom Connect automatically detects wallet-standard wallets
// Users can connect with Solflare, Backpack, Exodus, or any compatible wallet

function MultiWalletConnect() {
  const { open } = useModal();
  const { wallets } = useDiscoveredWallets();

  // wallets contains all detected wallet-standard wallets
  console.log('Detected wallets:', wallets?.map(w => w.name));

  // The modal automatically lists all available wallets
  return (
    <button onClick={open}>
      Connect Any Wallet
    </button>
  );
}

// Enable wallet-standard detection via the 'injected' provider:
import { AddressType, PhantomProvider, darkTheme } from '@phantom/react-sdk';

<PhantomProvider
  config={{
    providers: ['google', 'apple', 'injected'], // Social + wallet-standard
    appId: process.env.NEXT_PUBLIC_PHANTOM_APP_ID || '',
    addressTypes: [AddressType.solana],
  }}
  theme={darkTheme}
>
  {children}
</PhantomProvider>

// The 'injected' provider enables wallet-standard detection
// for Phantom, Solflare, Backpack, Exodus, Glow, and others`,

    curl: `# Wallet Standard is a Solana ecosystem standard
# allowing wallets to be discovered automatically

# Supported wallets include:
# - Phantom
# - Solflare
# - Backpack
# - Exodus
# - Glow
# - And many more...

# See: https://github.com/solana-labs/wallet-standard`,
  },

  'direct-connect': {
    typescript: `import { useWallet } from '@/shared/hooks/use-wallet';

function DirectConnectButtons() {
  const { connectors, connect, isConnecting } = useWallet();

  // Connect to a specific wallet by name
  const connectToWallet = async (walletName: string) => {
    const wallet = connectors.find(c =>
      c.name.toLowerCase().includes(walletName.toLowerCase())
    );
    if (wallet?.ready) {
      await connect(wallet.id);
    }
  };

  return (
    <div>
      {connectors.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => connect(wallet.id)}
          disabled={isConnecting}
        >
          {wallet.icon && <img src={wallet.icon} alt="" />}
          Connect {wallet.name}
        </button>
      ))}
    </div>
  );
}

// Or connect to a specific wallet programmatically:
const phantom = connectors.find(c => c.name.includes('Phantom'));
if (phantom?.ready) {
  await connect(phantom.id);
}`,

    curl: `# Direct wallet connection is client-side only
# Each wallet injects its provider into the window object:

# Phantom: window.phantom.solana
# Solflare: window.solflare
# Backpack: window.backpack
# Exodus:   window.exodus.solana

# Detection:
# - window.phantom?.solana?.isPhantom
# - window.solflare?.isSolflare
# - window.backpack?.isBackpack
# - window.exodus?.solana?.isExodus`,
  },

  // Wallet interactions page examples
  'sign-message': {
    typescript: `import { useSolana } from '@phantom/react-sdk';

function SignMessageButton() {
  const { solana, isAvailable } = useSolana();

  const signMessage = async () => {
    if (!isAvailable || !solana) {
      throw new Error('Phantom not available');
    }

    const message = 'Sign this message to verify your wallet';
    const encodedMessage = new TextEncoder().encode(message);

    const { signature, publicKey } = await solana.signMessage(
      encodedMessage,
      'utf8'
    );

    console.log('Signature:', signature);
    console.log('Signed by:', publicKey.toString());

    // Verify on server with tweetnacl or @solana/web3.js
    return { signature, publicKey: publicKey.toString() };
  };

  return <button onClick={signMessage}>Sign Message</button>;
}`,

    curl: `# Message signing is client-side only
# Verify signatures server-side:

import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

const isValid = nacl.sign.detached.verify(
  new TextEncoder().encode(message),
  signature,
  new PublicKey(publicKey).toBytes()
);`,
  },

  'sign-transaction': {
    typescript: `import { useSolana } from '@phantom/react-sdk';
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

function SendSolButton({ recipient, amount }: { recipient: string; amount: number }) {
  const { solana, isAvailable } = useSolana();

  const sendSol = async () => {
    if (!isAvailable || !solana?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const connection = new Connection(
      'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY'
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Build VersionedTransaction (required by Phantom Connect SDK)
    const messageV0 = new TransactionMessage({
      payerKey: solana.publicKey,
      recentBlockhash: blockhash,
      instructions: [
        SystemProgram.transfer({
          fromPubkey: solana.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * 1e9, // Convert SOL to lamports
        }),
      ],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    // Sign and send via Phantom SDK
    const { signature } = await solana.signAndSendTransaction(transaction);

    console.log('Transaction sent:', signature);
    return signature;
  };

  return <button onClick={sendSol}>Send {amount} SOL</button>;
}`,

    curl: `# Build transaction on server, sign on client:

curl https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getLatestBlockhash",
    "params": [{"commitment": "finalized"}]
  }'

# Then serialize the transaction and have the user sign it`,
  },
};

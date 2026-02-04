// Code examples for each use case
// Used in demo page to show copy-pasteable code

export const CODE_EXAMPLES: Record<AssetsByOwnerUseCase, CodeExample> = {
  nfts: {
    typescript: `// Get all NFTs for a wallet address
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getNFTs(ownerAddress: string) {
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress,
    page: 1,
    limit: 1000,
    displayOptions: {
      showFungible: false,
      showCollectionMetadata: true,
    },
  });

  // Filter for NFT interfaces only
  const nftInterfaces = ['V1_NFT', 'V1_PRINT', 'V2_NFT', 'ProgrammableNFT'];

  return response.items
    .filter(asset => nftInterfaces.includes(asset.interface))
    .map(asset => ({
      id: asset.id,
      name: asset.content?.metadata?.name || 'Unnamed NFT',
      image: asset.content?.files?.[0]?.cdn_uri || asset.content?.files?.[0]?.uri,
      compressed: asset.compression?.compressed || false,
    }));
}

// Usage
const nfts = await getNFTs('86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY');
console.log(\`Found \${nfts.length} NFTs\`);`,

    curl: `# Get all NFTs for a wallet using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      "page": 1,
      "limit": 1000,
      "displayOptions": {
        "showFungible": false,
        "showCollectionMetadata": true
      }
    }
  }'

# Response includes items array with NFT metadata
# Filter client-side for interface: V1_NFT, V1_PRINT, V2_NFT, ProgrammableNFT`,
  },

  tokens: {
    typescript: `// Get all fungible tokens for a wallet address
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getFungibleTokens(ownerAddress: string) {
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress,
    page: 1,
    limit: 1000,
    displayOptions: {
      showFungible: true,
      showNativeBalance: false,
      showZeroBalance: false,
    },
  });

  // Filter for fungible interfaces only
  const fungibleInterfaces = ['FungibleToken', 'FungibleAsset'];

  return response.items
    .filter(asset => fungibleInterfaces.includes(asset.interface))
    .map(asset => {
      const balance = asset.token_info?.balance ?? 0;
      const decimals = asset.token_info?.decimals ?? 0;

      return {
        mint: asset.id,
        name: asset.content?.metadata?.name || 'Unknown Token',
        symbol: asset.content?.metadata?.symbol || '???',
        balance,
        uiAmount: (balance / Math.pow(10, decimals)).toFixed(decimals),
        priceInfo: asset.token_info?.price_info,
      };
    });
}

// Usage
const tokens = await getFungibleTokens('86xCnPeV69n...');
tokens.forEach(t => console.log(\`\${t.uiAmount} \${t.symbol}\`));`,

    curl: `# Get all fungible tokens for a wallet using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      "page": 1,
      "limit": 1000,
      "displayOptions": {
        "showFungible": true,
        "showNativeBalance": false,
        "showZeroBalance": false
      }
    }
  }'

# Response includes items array with token_info
# Filter client-side for interface: FungibleToken, FungibleAsset
# token_info contains balance, decimals and optional price_info`,
  },

  compressed: {
    typescript: `// Get only compressed NFTs for a wallet address
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getCompressedNFTs(ownerAddress: string) {
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress,
    page: 1,
    limit: 1000,
    displayOptions: {
      showFungible: false,
      showCollectionMetadata: true,
    },
  });

  // Filter for NFTs that are compressed
  const nftInterfaces = ['V1_NFT', 'V1_PRINT', 'V2_NFT', 'ProgrammableNFT'];

  return response.items
    .filter(asset =>
      nftInterfaces.includes(asset.interface) &&
      asset.compression?.compressed === true
    )
    .map(asset => ({
      id: asset.id,
      name: asset.content?.metadata?.name || 'Unnamed NFT',
      image: asset.content?.files?.[0]?.cdn_uri || asset.content?.files?.[0]?.uri,
      tree: asset.compression?.tree,
      leafId: asset.compression?.leaf_id,
    }));
}

// Usage
const cNFTs = await getCompressedNFTs('86xCnPeV69n...');
console.log(\`Found \${cNFTs.length} compressed NFTs\`);`,

    curl: `# Get compressed NFTs for a wallet using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
      "page": 1,
      "limit": 1000,
      "displayOptions": {
        "showFungible": false,
        "showCollectionMetadata": true
      }
    }
  }'

# Filter response for:
# 1. interface in [V1_NFT, V1_PRINT, V2_NFT, ProgrammableNFT]
# 2. compression.compressed === true
#
# Compressed NFTs have:
# - compression.tree (Merkle tree address)
# - compression.leaf_id (position in tree)`,
  },
};

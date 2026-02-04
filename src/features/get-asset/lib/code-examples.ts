// Code examples for each use case
// Used in demo page to show copy-pasteable code

export const CODE_EXAMPLES: Record<AssetUseCase, CodeExample> = {
  'nft-metadata': {
    typescript: `// Get NFT metadata by mint address
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getNftMetadata(mintAddress: string) {
  const asset = await helius.getAsset({
    id: mintAddress,
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  return {
    name: asset.content?.metadata?.name,
    image: asset.content?.links?.image,
    collection: asset.grouping?.find(g => g.group_key === 'collection'),
    owner: asset.ownership?.owner,
    royalty: asset.royalty?.percent
  };
}

// Usage - Mad Lads #8420
const nft = await getNftMetadata('F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk');
console.log(\`NFT: \${nft.name}\`);
console.log(\`Owner: \${nft.owner}\`);`,

    curl: `# Get NFT metadata using Helius DAS API
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "get-asset",
    "method": "getAsset",
    "params": {
      "id": "F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk",
      "displayOptions": {
        "showCollectionMetadata": true
      }
    }
  }'

# Returns: interface, content (metadata, links), ownership, royalty, grouping`,
  },

  'fungible-token': {
    typescript: `// Get fungible token info by mint address
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getTokenInfo(mintAddress: string) {
  const asset = await helius.getAsset({
    id: mintAddress,
    displayOptions: {
      showFungible: true  // Important! Include token details
    }
  });

  return {
    name: asset.content?.metadata?.name,
    symbol: asset.content?.metadata?.symbol,
    decimals: asset.token_info?.decimals,
    supply: asset.token_info?.supply,
    price: asset.token_info?.price_info?.price_per_token
  };
}

// Usage - USDC
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const token = await getTokenInfo(USDC_MINT);
console.log(\`\${token.name} (\${token.symbol})\`);
console.log(\`Price: $\${token.price}\`);`,

    curl: `# Get fungible token info using Helius DAS API
# IMPORTANT: Include showFungible: true for token details
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "get-asset",
    "method": "getAsset",
    "params": {
      "id": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "displayOptions": {
        "showFungible": true
      }
    }
  }'

# Returns: interface "FungibleToken", token_info (supply, decimals, price_info)`,
  },

  'compressed-nft': {
    typescript: `// Get compressed NFT metadata by asset ID
// NOTE: Compressed NFTs use asset IDs, not mint addresses
import { Helius } from 'helius-sdk';

const helius = new Helius('YOUR_API_KEY');

async function getCompressedNft(assetId: string) {
  const asset = await helius.getAsset({
    id: assetId,
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  // Check if it's actually compressed
  if (!asset.compression?.compressed) {
    console.log('Note: This asset is not compressed');
  }

  return {
    name: asset.content?.metadata?.name,
    image: asset.content?.links?.image,
    owner: asset.ownership?.owner,
    // Compression-specific fields
    tree: asset.compression?.tree,
    leafId: asset.compression?.leaf_id,
    dataHash: asset.compression?.data_hash
  };
}

// Usage - Get a cNFT asset ID from your wallet
// You can find cNFT asset IDs via getAssetsByOwner
const cNft = await getCompressedNft('YOUR_CNFT_ASSET_ID');
console.log(\`cNFT: \${cNft.name}\`);
console.log(\`Merkle Tree: \${cNft.tree}\`);`,

    curl: `# Get compressed NFT metadata using Helius DAS API
# NOTE: Replace with your compressed NFT asset ID
# (Get asset IDs from getAssetsByOwner or DRiP, Helium, etc.)
curl -X POST https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": "get-asset",
    "method": "getAsset",
    "params": {
      "id": "YOUR_CNFT_ASSET_ID",
      "displayOptions": {
        "showCollectionMetadata": true
      }
    }
  }'

# Returns: compression (tree, leaf_id, data_hash, seq), ownership, content
# Key difference: compression.compressed = true for cNFTs`,
  },
};

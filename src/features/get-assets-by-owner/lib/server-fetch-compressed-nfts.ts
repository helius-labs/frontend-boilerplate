// Server-side compressed NFTs fetch
// Uses Helius SDK directly - ONLY import in server components
import { serverFetchNFTs } from './server-fetch-nfts';

/**
 * Fetch only compressed NFTs for a wallet address.
 * Server-side only - do not import in client components.
 */
export async function serverFetchCompressedNFTs(address: string): Promise<NFTAsset[]> {
  const allNFTs = await serverFetchNFTs(address);
  return allNFTs.filter((nft) => nft.compressed);
}

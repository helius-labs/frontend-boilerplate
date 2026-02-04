// Use Case 3: Compressed NFTs Only
// Reuses NFT fetch with additional compression filter
import { fetchNFTs } from './fetch-nfts';

/**
 * Fetch only compressed NFTs for a wallet address.
 * Uses same API as fetchNFTs but filters for compression.compressed === true
 */
export async function fetchCompressedNFTs(address: string): Promise<NFTAsset[]> {
  const allNFTs = await fetchNFTs(address);
  return allNFTs.filter((nft) => nft.compressed);
}

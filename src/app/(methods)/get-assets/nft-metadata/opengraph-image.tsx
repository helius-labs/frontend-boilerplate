// NFT Metadata Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'NFT Metadata - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'NFT Metadata',
    description: 'Retrieve NFT metadata and attributes',
    icon: 'file-image',
  });
}

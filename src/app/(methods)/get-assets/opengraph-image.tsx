// Get Assets Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Get Assets - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Get Assets',
    description: 'Retrieve NFT metadata and token information',
    icon: 'image',
  });
}

// Compressed NFT Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Compressed NFT - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Compressed NFT',
    description: 'Query compressed NFT data via DAS API',
    icon: 'archive',
  });
}

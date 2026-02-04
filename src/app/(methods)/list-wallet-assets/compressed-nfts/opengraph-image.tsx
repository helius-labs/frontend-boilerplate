// Compressed NFTs Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Compressed NFTs - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Compressed NFTs',
    description: 'List compressed NFTs in a wallet',
    icon: 'package',
  });
}

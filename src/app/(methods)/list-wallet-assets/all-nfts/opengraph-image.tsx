// All NFTs Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'All NFTs - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'All NFTs',
    description: 'List all NFTs owned by a wallet',
    icon: 'gallery-horizontal',
  });
}

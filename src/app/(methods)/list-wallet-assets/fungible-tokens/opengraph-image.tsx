// Fungible Tokens Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Fungible Tokens - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Fungible Tokens',
    description: 'Get all fungible token holdings',
    icon: 'banknote',
  });
}

// Specific Token Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Specific Token - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Specific Token',
    description: 'Check balance of a specific SPL token',
    icon: 'circle-dot',
  });
}

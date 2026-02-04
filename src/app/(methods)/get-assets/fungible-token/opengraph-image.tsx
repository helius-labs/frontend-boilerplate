// Fungible Token Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Fungible Token - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Fungible Token',
    description: 'Get fungible token details and supply',
    icon: 'badge-dollar-sign',
  });
}

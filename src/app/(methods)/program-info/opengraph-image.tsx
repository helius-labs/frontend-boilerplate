// Program Info Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Program Info - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Program Info',
    description: 'Get Solana program account information',
    icon: 'code',
  });
}

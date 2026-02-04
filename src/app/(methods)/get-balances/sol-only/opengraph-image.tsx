// SOL Balance Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'SOL Balance - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'SOL Balance',
    description: 'Get native SOL balance in lamports',
    icon: 'solana',
  });
}

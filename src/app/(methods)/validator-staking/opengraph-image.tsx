// Validator Staking Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Validator Staking - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Validator Staking',
    description: 'Staking operations and validator info',
    icon: 'landmark',
  });
}

// Integration Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Phantom Connect Integration - Add Wallet Support to Your dApp';

export default async function Image() {
  return createOgImage({
    title: 'Wallet Integration',
    description: 'Add Phantom wallet support to your Solana dApp',
    icon: 'wallet',
  });
}

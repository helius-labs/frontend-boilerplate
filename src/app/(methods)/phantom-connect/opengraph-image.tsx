// Phantom Connect Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Phantom Connect - Wallet Integration for Solana dApps';

export default async function Image() {
  return createOgImage({
    title: 'Phantom Connect',
    description: 'Wallet integration with social login support',
    icon: 'phantom',
  });
}

// Wallet Interactions Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Wallet Interactions - Sign Messages and Send Transactions';

export default async function Image() {
  return createOgImage({
    title: 'Wallet Interactions',
    description: 'Sign messages and send transactions with Phantom',
    icon: 'hand-coins',
  });
}

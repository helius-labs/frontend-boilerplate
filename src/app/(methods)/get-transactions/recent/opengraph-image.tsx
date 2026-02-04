// Recent Transactions Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Recent Transactions - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Recent Transactions',
    description: 'Fetch recent transactions for a wallet',
    icon: 'clock',
  });
}

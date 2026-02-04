// Get Balances Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Get Balances - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Get Balances',
    description: 'Fetch SOL and token balances with Helius RPC',
    icon: 'wallet',
  });
}

// Get Transactions Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Get Transactions - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Get Transactions',
    description: 'Query transaction history and details',
    icon: 'arrow-left-right',
  });
}

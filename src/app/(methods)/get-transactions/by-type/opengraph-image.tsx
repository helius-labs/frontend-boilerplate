// Transactions By Type Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Transactions By Type - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Transactions By Type',
    description: 'Filter transactions by type',
    icon: 'filter',
  });
}

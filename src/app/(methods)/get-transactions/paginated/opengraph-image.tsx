// Paginated Transactions Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Paginated Transactions - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Paginated Transactions',
    description: 'Paginate through transaction history',
    icon: 'book-open',
  });
}

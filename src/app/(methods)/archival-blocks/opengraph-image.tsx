// Archival Blocks Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Historical Blocks - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'Historical Blocks',
    description: 'Query historical block data',
    icon: 'database',
  });
}

// All Tokens Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'All Tokens - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'All Tokens',
    description: 'Fetch all SPL token holdings at once',
    icon: 'layers',
  });
}

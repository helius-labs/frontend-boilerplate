// Homepage Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'How to build on Solana';

export default async function Image() {
  return createOgImage({
    title: 'How to build on Solana',
    description: 'Best practices for fast and reliable Solana apps.',
    icon: 'settings',
  });
}

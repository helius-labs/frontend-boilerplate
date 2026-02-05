// Connection Types Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Connection Types - Direct Connect vs Standard Wallet Adapter';

export default async function Image() {
  return createOgImage({
    title: 'Connection Types',
    description: 'Direct connect vs standard wallet adapter patterns',
    icon: 'link',
  });
}

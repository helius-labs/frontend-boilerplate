// Laserstream Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'Laserstream - Real-time Solana Streaming';

export default async function Image() {
  return createOgImage({
    title: 'Laserstream',
    description: 'Real-time streaming with Laserstream',
    icon: 'radio',
  });
}

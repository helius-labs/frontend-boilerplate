// List Wallet Assets Open Graph image
import { createOgImage, ogContentType, ogImageSize } from '@/shared/lib/og-image-template';

export const size = ogImageSize;
export const contentType = ogContentType;
export const alt = 'List Wallet Assets - Solana RPC Demo';

export default async function Image() {
  return createOgImage({
    title: 'List Wallet Assets',
    description: 'List all assets owned by a wallet',
    icon: 'list',
  });
}

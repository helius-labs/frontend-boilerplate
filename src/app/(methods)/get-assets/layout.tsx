import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Get NFT Metadata on Solana | Code Examples',
  description:
    'Fetch images, attributes, prices for NFTs, tokens, and compressed NFTs. One API call works for all asset types. Copy the TypeScript code.',
  keywords: [
    'how to get nft metadata solana',
    'solana nft api',
    'getAsset helius',
    'compressed nft metadata',
    'das api',
  ],
  openGraph: {
    title: 'How to Get NFT Metadata on Solana',
    description: 'Working code to fetch NFT images, attributes, and prices with Helius DAS API.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Get NFT Metadata on Solana',
    description: 'Working code to fetch NFT images, attributes, and prices',
  },
  alternates: {
    canonical: '/get-assets',
  },
};

export default function GetAssetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

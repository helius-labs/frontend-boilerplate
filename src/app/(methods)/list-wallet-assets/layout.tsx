import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to List All NFTs in a Wallet on Solana | Code Examples',
  description:
    'Get all NFTs, tokens, and cNFTs owned by a wallet in one API call. Returns metadata, images, and prices. Copy the TypeScript code.',
  keywords: [
    'how to list nfts solana',
    'solana wallet portfolio',
    'getAssetsByOwner',
    'nft gallery api',
    'helius das api',
  ],
  openGraph: {
    title: 'How to List All NFTs in a Wallet on Solana',
    description: 'Working code to fetch all assets owned by a wallet with full metadata.',
    type: 'website',
    siteName: 'Solana dApp Example',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to List All NFTs in a Wallet on Solana',
    description: 'Working code to fetch all assets owned by a wallet',
  },
  alternates: {
    canonical: '/list-wallet-assets',
  },
};

export default function GetAssetsByOwnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

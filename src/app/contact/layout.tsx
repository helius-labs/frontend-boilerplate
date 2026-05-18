import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Solana dApp Example',
  description:
    'Get in touch with the Helius team about the Solana dApp Example: support, sales, and security disclosure.',
  alternates: {
    canonical: '/contact',
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

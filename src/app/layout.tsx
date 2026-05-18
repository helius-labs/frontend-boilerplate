import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from '@/providers';
import {
  CANONICAL_DESCRIPTION,
  JsonLdMultiple,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from '@/shared/lib/json-ld';
import { LayoutShell } from '@/shared/ui/layout-shell';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import './globals.css';

const fontLausanne = localFont({
  src: [
    {
      path: './fonts/TWKLausannePan-450.otf',
      weight: '450',
      style: 'normal',
    },
    {
      path: './fonts/TWKLausannePan-500.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-lausanne',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://frontend-boilerplate.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'How to Build on Solana | Working Code Examples',
  description: CANONICAL_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'How to Build on Solana | Working Code Examples',
    description: CANONICAL_DESCRIPTION,
    type: 'website',
    siteName: 'Solana dApp Example',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Build on Solana | Working Code Examples',
    description: CANONICAL_DESCRIPTION,
    site: '@heliuslabs',
    creator: '@heliuslabs',
  },
  alternates: {
    canonical: '/',
    types: {
      'text/markdown': '/index.md',
      'text/plain': '/llms.txt',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontLausanne.variable} antialiased`}>
        <JsonLdMultiple schemas={[getWebSiteJsonLd(), getOrganizationJsonLd()]} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <LayoutShell>{children}</LayoutShell>
          </Providers>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

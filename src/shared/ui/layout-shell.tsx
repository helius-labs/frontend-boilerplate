'use client';

import { Footer } from '@/shared/ui/footer';
import { Header } from '@/shared/ui/header';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Fixed space background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Gradient glow at bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(232,67,38,0.2)_0%,rgba(247,148,29,0.1)_30%,transparent_70%)] dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(232,67,38,0.12)_0%,transparent_70%)]" />
        {/* Stars layer 1 */}
        <div className="stars-layer-1" />
        {/* Stars layer 2 - twinkling */}
        <div className="stars-layer-2" />
      </div>

      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

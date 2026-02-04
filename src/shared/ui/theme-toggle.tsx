'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Prevent hydration mismatch - only render after client mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: single mount-time render for SSR hydration
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn(
          'size-9 border border-black/[0.08] bg-black/[0.03]',
          'dark:border-white/20 dark:bg-background/50',
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <span className="size-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative size-9 border border-black/[0.08] bg-black/[0.03] hover:bg-black/[0.06]',
        'dark:border-white/20 dark:bg-background/50 dark:hover:bg-accent',
        className
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon - shown in dark mode (click to switch to light) */}
      <svg
        className={cn(
          'size-5 transition-transform',
          isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0 absolute'
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon icon - shown in light mode (click to switch to dark) */}
      <svg
        className={cn(
          'size-5 transition-transform',
          isDark ? 'rotate-90 scale-0 absolute' : 'rotate-0 scale-100'
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </Button>
  );
}

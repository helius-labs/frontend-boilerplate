'use client';

import { Link, type LinkProps } from '@/shared/ui/link';

export function SmoothScrollLink({ href, children, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        const hash = typeof href === 'string' ? href : href.hash;
        if (hash?.startsWith('#')) {
          e.preventDefault();
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

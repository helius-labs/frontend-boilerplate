import { forwardRef } from 'react';
import NextLink from 'next/link';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva(
  // Base styles
  'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'text-primary hover:underline',
        muted: 'text-muted-foreground hover:text-foreground',
        nav: cn('text-muted-foreground hover:text-foreground', 'font-medium'),
        unstyled: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type LinkProps = React.ComponentPropsWithoutRef<typeof NextLink> &
  VariantProps<typeof linkVariants>;

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, scroll = true, ...props }, ref) => {
    return (
      <NextLink
        className={cn(linkVariants({ variant }), className)}
        ref={ref}
        scroll={scroll}
        {...props}
      />
    );
  }
);
Link.displayName = 'Link';

/**
 * ExternalLink - Link to external URLs.
 * Automatically adds target="_blank" and rel="noopener noreferrer".
 * Shows external link icon for default variant (not unstyled).
 */
type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkVariants>;

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ className, variant, children, ...props }, ref) => {
    const showIcon = variant !== 'unstyled';

    return (
      <a
        className={cn(
          linkVariants({ variant }),
          showIcon && 'inline-flex items-center gap-1',
          className
        )}
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
        {showIcon && (
          <svg
            className="size-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </a>
    );
  }
);
ExternalLink.displayName = 'ExternalLink';

export { Link, ExternalLink, linkVariants };
export type { LinkProps, ExternalLinkProps };

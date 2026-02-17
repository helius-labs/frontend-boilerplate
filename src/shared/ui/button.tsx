import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  cn(
    'inline-flex items-center justify-center font-medium transition-colors cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary text-primary-foreground', 'hover:bg-primary/90'),
        // Helius orange button for CTAs (Sign & Submit, Connect, etc.)
        solana: cn(
          'bg-helius-orange text-white',
          'hover:bg-helius-orange/90 hover:shadow-lg hover:shadow-helius-orange/25',
          'transition-shadow'
        ),
        outline: cn(
          'border border-input bg-background',
          'hover:bg-accent hover:text-accent-foreground'
        ),
        ghost: cn('hover:bg-accent hover:text-accent-foreground'),
        // Link-style button (transparent, looks like a text link)
        link: cn('text-primary hover:underline'),
        // Header-style button (works on both light and dark backgrounds)
        header: cn(
          'border border-white/20 bg-white/10 text-white',
          'hover:bg-white/20',
          'dark:border-white/20 dark:bg-background/50 dark:hover:bg-accent dark:text-foreground'
        ),
        destructive: cn('bg-destructive text-destructive-foreground', 'hover:bg-destructive/90'),
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-md text-sm',
        sm: 'h-9 px-3 py-2 rounded-md text-sm',
        lg: 'h-11 px-6 py-3 rounded-md text-base',
        icon: 'size-10 rounded-md',
        'icon-sm': 'size-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

import { cn } from '@/lib/utils';

/**
 * Consistent section card used on method pages.
 * Provides bordered container with title header.
 */
export function PageSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('border rounded-lg p-4 md:p-6 bg-card', className)}>
      <h2 className="text-xl font-semibold mb-6 text-helius-orange-light">{title}</h2>
      {children}
    </section>
  );
}

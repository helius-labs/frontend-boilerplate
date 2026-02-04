import { cn } from '@/lib/utils';

/**
 * Consistent page header with title and description.
 * Used at the top of method pages after breadcrumb/subnav.
 */
export function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

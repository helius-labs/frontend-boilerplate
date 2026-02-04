import { cn } from '@/lib/utils';

export function InfoBox({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Layout
        'rounded-xl p-4 md:p-6 mb-8',
        // Background
        'bg-card/80 backdrop-blur-sm',
        // Border
        'border border-border shadow-sm',
        className
      )}
    >
      <h3 className="font-medium mb-2 text-foreground">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

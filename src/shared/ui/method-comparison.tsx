import { cn } from '@/lib/utils';

export function MethodComparison({ title, description, items, className }: MethodComparisonProps) {
  return (
    <section
      className={cn(
        // Layout
        'rounded-xl p-4 md:p-6 mb-8',
        // Background
        'bg-card/80 backdrop-blur-sm',
        // Border
        'border shadow-sm dark:border-white/10 border-black/10',
        className
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>
      {(description || items.length > 0) && (
        <div className="space-y-4 text-muted-foreground">
          {description && <p>{description}</p>}
          {items.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    // Layout
                    'p-5 rounded-lg',
                    // Visual - light mode
                    'border border-black/[0.12]',
                    // Visual - dark mode
                    'dark:border-white/15',
                    // Backdrop
                    'backdrop-blur-sm'
                  )}
                >
                  <h3 className="font-medium text-foreground mb-2">{item.title}</h3>
                  <div className="text-sm">{item.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

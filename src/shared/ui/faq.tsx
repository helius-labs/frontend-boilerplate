import { cn } from '@/lib/utils';
import type { FAQItem } from '@/shared/lib/json-ld';

/**
 * FAQ section using native details/summary for accessible, no-JS collapsible Q&A.
 * Uses the same FAQItem type as JSON-LD schema for consistency.
 */
export function FAQ({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <details
            key={index}
            className={cn(
              'group rounded-lg border bg-card',
              'hover:bg-muted/50 transition-colors',
              'open:ring-1 open:ring-primary/20'
            )}
          >
            <summary
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 p-4',
                'font-medium select-none',
                'list-none [&::-webkit-details-marker]:hidden'
              )}
            >
              <span>{item.question}</span>
              <ChevronIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

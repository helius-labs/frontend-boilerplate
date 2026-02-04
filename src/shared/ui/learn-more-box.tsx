import { cn } from '@/lib/utils';

/**
 * Learn More box with animated border effect.
 * Used at the bottom of method pages for documentation links.
 */
export function LearnMoreBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-beam', className)}>
      <div className="relative z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6">
        <h3 className="font-medium mb-2">Learn More</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">{children}</ul>
      </div>
    </div>
  );
}

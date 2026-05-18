import { cn } from '@/lib/utils';
import { getPageDates } from '@/shared/lib/page-dates';
import { ExternalLink } from '@/shared/ui/link';

/**
 * Consistent page header with title and description.
 * Used at the top of method pages after breadcrumb/subnav.
 *
 * Pass `path` (e.g. "/get-balances") to surface a "Maintained by Helius ·
 * Updated YYYY-MM-DD" byline pulled from the page-dates registry. This is
 * the visible E-E-A-T signal that mirrors the JSON-LD `author` / `dateModified`
 * fields on the same page.
 */
export function PageHeader({
  title,
  description,
  path,
  className,
}: {
  title: string;
  description: React.ReactNode;
  path?: string;
  className?: string;
}) {
  const dates = path ? getPageDates(path) : null;

  return (
    <div className={cn('mb-8', className)}>
      <h1 className="speakable text-3xl mb-2" data-speakable="true" itemProp="speakable">
        {title}
      </h1>
      <p className="speakable text-muted-foreground" data-speakable="true" itemProp="speakable">
        {description}
      </p>
      {dates ? (
        <p className="my-3 text-xs text-muted-foreground">
          Maintained by{' '}
          <ExternalLink
            href="https://www.helius.dev"
            variant="unstyled"
            className="underline-offset-2 hover:underline"
          >
            Helius
          </ExternalLink>{' '}
          · Last updated <time dateTime={dates.dateModified}>{dates.dateModified}</time> ·{' '}
          <ExternalLink
            href="https://github.com/helius-labs/frontend-boilerplate"
            variant="unstyled"
            className="underline-offset-2 hover:underline"
          >
            View source
          </ExternalLink>
        </p>
      ) : null}
    </div>
  );
}

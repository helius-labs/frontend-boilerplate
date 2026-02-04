'use client';

// JSON display with key fields highlighted
// Satisfies GETA-04: Response displays formatted JSON with key fields highlighted
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

// Key fields to highlight in JSON response
const KEY_FIELDS = [
  // Content metadata
  'name',
  'symbol',
  'description',
  'image',
  // Ownership
  'owner',
  'frozen',
  'delegated',
  // Compression
  'compressed',
  'tree',
  'leaf_id',
  // Royalty
  'royalty',
  'basis_points',
  'percent',
  // Type identification
  'interface',
  'token_standard',
  // Token info
  'supply',
  'decimals',
  'price_per_token',
];

export function JsonHighlight({ data, className }: JsonHighlightProps) {
  const highlighted = useMemo(() => {
    const json = JSON.stringify(data, null, 2);

    // Highlight key fields with a CSS class
    let result = json;
    KEY_FIELDS.forEach((field) => {
      const regex = new RegExp(`"${field}"`, 'g');
      result = result.replace(regex, `<span class="json-key-highlight">"${field}"</span>`);
    });

    return result;
  }, [data]);

  return (
    <div className={cn('relative', className)}>
      <pre className="overflow-x-auto p-4 bg-muted rounded-lg text-sm">
        <code
          className="[&_.json-key-highlight]:bg-primary/20 [&_.json-key-highlight]:px-1 [&_.json-key-highlight]:rounded"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}

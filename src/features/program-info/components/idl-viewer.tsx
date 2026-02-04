'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function IdlViewer({ data, isLoading, error }: IdlViewerProps) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('p-4 rounded-lg', 'bg-destructive/10 border border-destructive/20')}>
        <p className="font-medium text-destructive">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Enter a program ID to look up its IDL
      </div>
    );
  }

  if (!data.found) {
    return (
      <div className={cn('p-4 rounded-lg', 'bg-amber-500/10 border border-amber-500/20')}>
        <p className="font-medium text-amber-600 dark:text-amber-400">IDL Not Available</p>
        <p className="text-sm text-muted-foreground mt-1">{data.error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Not all programs publish their IDL on-chain. Check the program&apos;s GitHub repository or
          documentation for the IDL.
        </p>
      </div>
    );
  }

  const idlJson = JSON.stringify(data.idl, null, 2);
  const lines = idlJson.split('\n');
  const displayLines = expanded ? lines : lines.slice(0, 30);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Anchor IDL</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(idlJson)}
            className="text-xs px-2 py-1 h-auto"
          >
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const blob = new Blob([idlJson], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'idl.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-xs px-2 py-1 h-auto"
          >
            Download
          </Button>
        </div>
      </div>

      <div className="relative">
        <pre
          className={cn(
            'p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto',
            'bg-muted'
          )}
        >
          <code>{displayLines.join('\n')}</code>
        </pre>

        {lines.length > 30 && !expanded && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-16',
              'bg-gradient-to-t from-muted to-transparent',
              'flex items-end justify-center pb-2'
            )}
          >
            <Button variant="outline" size="sm" onClick={() => setExpanded(true)}>
              Show all ({lines.length} lines)
            </Button>
          </div>
        )}

        {expanded && lines.length > 30 && (
          <Button variant="ghost" size="sm" onClick={() => setExpanded(false)} className="mt-2">
            Collapse
          </Button>
        )}
      </div>
    </div>
  );
}

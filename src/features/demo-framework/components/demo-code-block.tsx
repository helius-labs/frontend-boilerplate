// Server Component - syntax highlighting at build/request time
// NO 'use client' directive - this is a Server Component
import { CopyButton } from '@/features/demo-framework/components/copy-button';
import { highlightCode } from '@/features/demo-framework/lib/highlight';
import { cn } from '@/lib/utils';

/**
 * Syntax-highlighted code block (DEMO-07).
 * Server-rendered with Shiki for zero client JS.
 * Includes copy button with hover reveal.
 */
export async function DemoCodeBlock({ code, language, filename, className }: DemoCodeBlockProps) {
  // Server-side syntax highlighting
  const html = await highlightCode(code, language);

  return (
    <div className={cn('relative group rounded-lg border bg-muted', className)}>
      {filename && (
        <div className="text-xs text-muted-foreground px-4 py-2 border-b bg-muted/50">
          {filename}
        </div>
      )}
      <div
        className="overflow-x-auto p-4 [&_pre]:m-0 [&_pre]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton
        code={code}
        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
      />
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

/**
 * Language toggle tabs for TypeScript and cURL (DEMO-06).
 * Receives pre-rendered code blocks as children to preserve Server Component benefits.
 */
export function DemoCodeTabs({ typescriptBlock, curlBlock, className }: DemoCodeTabsProps) {
  return (
    <Tabs defaultValue="typescript" className={cn('w-full', className)}>
      <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
        <TabsTrigger value="typescript">TypeScript</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="typescript" className="mt-2">
        <Suspense fallback={<CodeBlockSkeleton />}>{typescriptBlock}</Suspense>
      </TabsContent>
      <TabsContent value="curl" className="mt-2">
        <Suspense fallback={<CodeBlockSkeleton />}>{curlBlock}</Suspense>
      </TabsContent>
    </Tabs>
  );
}

function CodeBlockSkeleton() {
  return (
    <div className="rounded-lg border bg-muted p-4 animate-pulse">
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
      <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
    </div>
  );
}

/**
 * Alternative: Simple code tabs that accept raw code strings.
 * Use when you can't pass Server Components as children.
 */
export function SimpleDemoCodeTabs({ examples, className }: SimpleDemoCodeTabsProps) {
  return (
    <Tabs defaultValue="typescript" className={cn('w-full', className)}>
      <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
        <TabsTrigger value="typescript">TypeScript</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="typescript" className="mt-2">
        <div className="relative group rounded-lg border bg-muted p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{examples.typescript}</code>
          </pre>
        </div>
      </TabsContent>
      <TabsContent value="curl" className="mt-2">
        <div className="relative group rounded-lg border bg-muted p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{examples.curl}</code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}

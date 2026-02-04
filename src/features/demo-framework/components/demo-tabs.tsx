'use client';

import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

/**
 * Use case tabs for 3 demos per method (DEMO-04).
 * Each method page must provide exactly 3 use cases.
 */
export function DemoTabs({ useCases, className }: DemoTabsProps) {
  return (
    <Tabs defaultValue={useCases[0].id} className={cn('w-full', className)}>
      <TabsList className="grid w-full grid-cols-3">
        {useCases.map((useCase) => (
          <TabsTrigger key={useCase.id} value={useCase.id}>
            {useCase.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {useCases.map((useCase) => (
        <TabsContent key={useCase.id} value={useCase.id} className="mt-4">
          {useCase.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

/**
 * Flexible demo tabs that accept 2-5 use cases.
 * Use when you need more or fewer than exactly 3 tabs.
 */
export function FlexDemoTabs({ useCases, className }: FlexDemoTabsProps) {
  if (useCases.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={useCases[0].id} className={cn('w-full', className)}>
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${useCases.length}, 1fr)` }}
      >
        {useCases.map((useCase) => (
          <TabsTrigger key={useCase.id} value={useCase.id}>
            {useCase.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {useCases.map((useCase) => (
        <TabsContent key={useCase.id} value={useCase.id} className="mt-4">
          {useCase.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

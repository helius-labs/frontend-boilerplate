'use client';

import { DemoProvider } from '@/features/demo-framework/context/demo-context';
import { cn } from '@/lib/utils';

/**
 * Container component that provides demo context.
 * Wrap demo sections to share input/response state between components.
 *
 * @example
 * ```tsx
 * <DemoContainer>
 *   <DemoInput />
 *   <RunDemoButton />
 *   <DemoResponse />
 *   <DemoCodeTabs examples={...} />
 * </DemoContainer>
 * ```
 */
export function DemoContainer({ children, defaultValue = '', className }: DemoContainerProps) {
  return (
    <DemoProvider defaultValue={defaultValue}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </DemoProvider>
  );
}

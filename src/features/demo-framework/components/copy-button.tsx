'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

/**
 * One-click copy button with visual feedback (DEMO-05).
 * Shows checkmark icon for 2 seconds after successful copy.
 */
export function CopyButton({ code, className }: CopyButtonProps) {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copy(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code, copy]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      className={cn(className)}
      aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
    >
      {copied ? (
        <Check className="size-4 text-green-500" aria-hidden="true" />
      ) : (
        <Copy className="size-4 text-muted-foreground" aria-hidden="true" />
      )}
    </Button>
  );
}

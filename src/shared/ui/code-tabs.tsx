'use client';

// Client-side code tabs component with copy functionality and syntax highlighting
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

// Syntax highlighting for TypeScript
function highlightTypeScript(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let key = 0;

  // Regex patterns for different token types
  const patterns = [
    { type: 'comment', regex: /\/\/[^\n]*/g, color: 'text-zinc-500' },
    { type: 'string', regex: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, color: 'text-emerald-400' },
    {
      type: 'keyword',
      regex:
        /\b(const|let|var|function|async|await|return|import|from|export|if|else|try|catch|throw|new|class|interface|type|extends|implements)\b/g,
      color: 'text-purple-400',
    },
    {
      type: 'builtin',
      regex: /\b(console|fetch|JSON|Response|Error|Promise|Array|Object|String|Number|Boolean)\b/g,
      color: 'text-cyan-400',
    },
    {
      type: 'method',
      regex: /\.(log|stringify|parse|then|catch|finally|map|filter|reduce|forEach)\b/g,
      color: 'text-yellow-400',
    },
    { type: 'number', regex: /\b\d+\.?\d*\b/g, color: 'text-orange-400' },
    {
      type: 'property',
      regex: /\b(method|headers|body|params|id|jsonrpc|result)\b(?=\s*:)/g,
      color: 'text-sky-400',
    },
  ];

  // Simple tokenizer - process line by line for comments
  const lines = code.split('\n');

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      tokens.push(<br key={`br-${key++}`} />);
    }

    // Check for line comment
    const commentMatch = line.match(/^(.*?)(\/\/.*)$/);
    if (commentMatch) {
      const beforeComment = commentMatch[1];
      const comment = commentMatch[2];
      tokens.push(...tokenizeLine(beforeComment, patterns, key));
      key += 100;
      tokens.push(
        <span key={`comment-${key++}`} className="text-zinc-500">
          {comment}
        </span>
      );
    } else {
      tokens.push(...tokenizeLine(line, patterns, key));
      key += 100;
    }
  });

  return tokens;
}

function tokenizeLine(
  line: string,
  patterns: { type: string; regex: RegExp; color: string }[],
  startKey: number
): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let key = startKey;

  while (remaining.length > 0) {
    let earliestMatch: { index: number; length: number; color: string; text: string } | null = null;

    for (const { regex, color } of patterns) {
      regex.lastIndex = 0;
      const match = regex.exec(remaining);
      if (match && (!earliestMatch || match.index < earliestMatch.index)) {
        earliestMatch = {
          index: match.index,
          length: match[0].length,
          color,
          text: match[0],
        };
      }
    }

    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        tokens.push(
          <span key={key++} className="text-zinc-100">
            {remaining.slice(0, earliestMatch.index)}
          </span>
        );
      }
      tokens.push(
        <span key={key++} className={earliestMatch.color}>
          {earliestMatch.text}
        </span>
      );
      remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
    } else {
      tokens.push(
        <span key={key++} className="text-zinc-100">
          {remaining}
        </span>
      );
      break;
    }
  }

  return tokens;
}

// Syntax highlighting for cURL
function highlightCurl(code: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let key = 0;

  const lines = code.split('\n');

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) {
      tokens.push(<br key={`br-${key++}`} />);
    }

    let remaining = line;

    // cURL specific patterns
    const patterns = [
      { regex: /^curl\b/g, color: 'text-yellow-400' },
      { regex: /\s(-[A-Za-z]|--[a-z-]+)\b/g, color: 'text-purple-400' },
      { regex: /(["'])(?:(?!\1)[^\\]|\\.)*\1/g, color: 'text-emerald-400' },
      { regex: /https?:\/\/[^\s'"]+/g, color: 'text-cyan-400' },
      { regex: /\\\s*$/g, color: 'text-zinc-500' },
    ];

    while (remaining.length > 0) {
      let earliestMatch: { index: number; length: number; color: string; text: string } | null =
        null;

      for (const { regex, color } of patterns) {
        regex.lastIndex = 0;
        const match = regex.exec(remaining);
        if (match && (!earliestMatch || match.index < earliestMatch.index)) {
          earliestMatch = {
            index: match.index,
            length: match[0].length,
            color,
            text: match[0],
          };
        }
      }

      if (earliestMatch) {
        if (earliestMatch.index > 0) {
          tokens.push(
            <span key={key++} className="text-zinc-100">
              {remaining.slice(0, earliestMatch.index)}
            </span>
          );
        }
        tokens.push(
          <span key={key++} className={earliestMatch.color}>
            {earliestMatch.text}
          </span>
        );
        remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
      } else {
        tokens.push(
          <span key={key++} className="text-zinc-100">
            {remaining}
          </span>
        );
        break;
      }
    }
  });

  return tokens;
}

export function CodeTabs({ code }: { code: { typescript: string; curl: string } }) {
  const [lang, setLang] = useState<'typescript' | 'curl'>('typescript');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = useMemo(() => {
    return lang === 'typescript' ? highlightTypeScript(code.typescript) : highlightCurl(code.curl);
  }, [code, lang]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <Button
            onClick={() => setLang('typescript')}
            size="sm"
            className={cn(
              lang === 'typescript'
                ? 'bg-[#3178c6] text-white hover:bg-[#3178c6]/90'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
          >
            TypeScript
          </Button>
          <Button
            onClick={() => setLang('curl')}
            size="sm"
            className={cn(
              lang === 'curl'
                ? 'bg-[#073551] text-white hover:bg-[#073551]/90'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
          >
            cURL
          </Button>
        </div>
        <Button
          onClick={handleCopy}
          size="sm"
          className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre
        className={cn(
          'p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed',
          'bg-zinc-900',
          'dark:bg-zinc-950'
        )}
      >
        <code>{highlightedCode}</code>
      </pre>
    </div>
  );
}

// Re-export as CodeTabsClient for backwards compatibility
export { CodeTabs as CodeTabsClient };

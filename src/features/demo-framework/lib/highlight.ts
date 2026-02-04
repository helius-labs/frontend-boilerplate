// Server-side syntax highlighting with Shiki
// Source: https://shiki.style/packages/next
import { type Highlighter, createHighlighter } from 'shiki';

// Singleton highlighter instance
let highlighter: Highlighter | null = null;

/**
 * Get or create the Shiki highlighter.
 * Lazily initializes with required themes and languages.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'bash', 'json', 'shell'],
    });
  }
  return highlighter;
}

export type HighlightLanguage = 'typescript' | 'bash' | 'json' | 'shell';
export type HighlightTheme = 'github-dark' | 'github-light';

/**
 * Highlight code with Shiki.
 * Returns HTML string with syntax highlighting.
 */
export async function highlightCode(
  code: string,
  lang: HighlightLanguage,
  theme: HighlightTheme = 'github-dark'
): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme,
  });
}

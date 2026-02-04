// Demo Framework - Barrel Export
// All components exported from single import path
//
// Usage:
// import {
//   DemoContainer,
//   DemoInput,
//   DemoResponse,
//   DemoTabs,
//   DemoCodeTabs,
//   DemoCodeBlock,
//   CopyButton,
// } from '@/features/demo-framework';

// Context
export { DemoProvider, useDemoContext } from './context/demo-context';

// Components
export { DemoContainer } from './components/demo-container';
export { DemoInput } from './components/demo-input';
export { DemoResponse } from './components/demo-response';
export { CopyButton } from './components/copy-button';
export { DemoCodeBlock } from './components/demo-code-block';
export { DemoCodeTabs, SimpleDemoCodeTabs } from './components/demo-code-tabs';
export { DemoTabs, FlexDemoTabs } from './components/demo-tabs';

// Utilities
export { validateSolanaAddress } from './lib/validate-address';
export { highlightCode, getHighlighter } from './lib/highlight';

export type { HighlightLanguage, HighlightTheme } from './lib/highlight';

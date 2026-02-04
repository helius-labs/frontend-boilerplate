// Demo Framework Type Definitions

type DemoStatus = 'idle' | 'loading' | 'success' | 'error';

type HighlightLanguage = 'typescript' | 'bash' | 'json';

interface DemoState {
  inputValue: string;
  status: DemoStatus;
  response: unknown;
  error: string | null;
}

interface CodeExample {
  typescript: string;
  curl: string;
}

interface UseCase {
  id: string;
  label: string;
  description?: string;
  content?: React.ReactNode;
}

interface DemoContextValue {
  inputValue: string;
  setInputValue: (value: string) => void;
  status: DemoStatus;
  setStatus: (status: DemoStatus) => void;
  response: unknown;
  setResponse: (response: unknown) => void;
  error: string | null;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Component Props

interface DemoProviderProps {
  children: React.ReactNode;
  defaultValue?: string;
}

interface CopyButtonProps {
  code: string;
  className?: string;
}

interface DemoCodeBlockProps {
  code: string;
  language: HighlightLanguage;
  filename?: string;
  className?: string;
}

interface DemoCodeTabsProps {
  examples: CodeExample;
  typescriptBlock: React.ReactNode;
  curlBlock: React.ReactNode;
  className?: string;
}

interface SimpleDemoCodeTabsProps {
  examples: CodeExample;
  className?: string;
}

interface DemoContainerProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface DemoInputProps {
  placeholder?: string;
  label?: string;
  className?: string;
}

interface DemoResponseProps {
  className?: string;
  idleMessage?: string;
}

interface DemoTabsProps {
  useCases: [UseCase, UseCase, UseCase];
  className?: string;
}

interface FlexDemoTabsProps {
  useCases: UseCase[];
  className?: string;
}

// Address validation

interface AddressValidationResult {
  isValid: boolean;
  address: import('@solana/kit').Address | null;
  error: string | null;
}

'use client';

import { createContext, useCallback, useContext, useState } from 'react';

const DemoContext = createContext<DemoContextValue | null>(null);

/**
 * Hook to access demo context.
 * Must be used within a DemoProvider.
 */
export function useDemoContext(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}

/**
 * Provider for shared demo state.
 * Wrap demo sections with this to share input/response state.
 */
export function DemoProvider({ children, defaultValue = '' }: DemoProviderProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [status, setStatus] = useState<DemoStatus>('idle');
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setResponse(null);
    setError(null);
  }, []);

  const value: DemoContextValue = {
    inputValue,
    setInputValue,
    status,
    setStatus,
    response,
    setResponse,
    error,
    setError,
    reset,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

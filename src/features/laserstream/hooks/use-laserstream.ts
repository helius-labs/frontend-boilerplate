'use client';

/**
 * Hook for Laserstream connection via SSE proxy.
 * Connects to /api/laserstream which proxies to Helius, keeping API key server-side.
 *
 * Source: Research from https://www.helius.dev/blog/introducing-laserstream
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useLaserstream(): UseLaserstreamReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [blocks, setBlocks] = useState<BlockUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Check if API key is configured on mount
  useEffect(() => {
    fetch('/api/laserstream/status')
      .then((res) => res.json())
      .then((data: { configured: boolean }) => setIsConfigured(data.configured))
      .catch(() => setIsConfigured(false));
  }, []);

  const connect = useCallback(() => {
    // Guard: Don't connect if not configured
    if (!isConfigured) {
      setError('Laserstream API key not configured');
      setStatus('error');
      return;
    }

    // Guard: Don't reconnect if already connected
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      const eventSource = new EventSource('/api/laserstream');

      eventSource.addEventListener('connected', () => {
        setStatus('connected');
        setError(null);
      });

      eventSource.addEventListener('block', (event) => {
        try {
          const data = JSON.parse(event.data) as BlockUpdate;
          setBlocks((prev) => [data, ...prev.slice(0, 49)]); // Keep last 50 blocks
        } catch (e) {
          console.error('[Laserstream] Failed to parse block:', e);
        }
      });

      eventSource.addEventListener('error', (event) => {
        // EventSource fires error on any issue
        if (eventSource.readyState === EventSource.CLOSED) {
          setStatus('disconnected');
          setError('Connection closed');
        } else {
          // Try to get error message from event data
          try {
            const messageEvent = event as MessageEvent;
            if (messageEvent.data) {
              const data = JSON.parse(messageEvent.data) as { message?: string };
              setError(data.message || 'Connection error');
            }
          } catch {
            setError('Connection error');
          }
          setStatus('error');
        }
      });

      eventSource.addEventListener('disconnected', () => {
        setStatus('disconnected');
      });

      eventSourceRef.current = eventSource;
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Failed to connect');
    }
  }, [isConfigured]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus('disconnected');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return {
    status,
    blocks,
    error,
    connect,
    disconnect,
    isConfigured: isConfigured ?? false,
  };
}

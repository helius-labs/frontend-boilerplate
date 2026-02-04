// Laserstream SSE Proxy - keeps API key server-side
// Establishes WebSocket to Helius and streams slot updates via SSE
import WebSocket from 'ws';
import { env } from '@/shared/config/env';

const LASERSTREAM_WSS = 'wss://atlas-mainnet.helius-rpc.com';

export async function GET(): Promise<Response> {
  const apiKey = env.laserstreamApiKey();

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Laserstream API key not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  // Track WebSocket instance for cleanup
  let ws: WebSocket | null = null;
  let subscriptionId: number | null = null;
  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (event: string, data: unknown) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller already closed
          isClosed = true;
        }
      };

      try {
        ws = new WebSocket(`${LASERSTREAM_WSS}/?api-key=${apiKey}`);

        ws.on('open', () => {
          sendEvent('connected', { status: 'connected' });

          // Subscribe to slot notifications
          ws?.send(
            JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'slotSubscribe',
              params: [],
            })
          );
        });

        ws.on('message', (rawData) => {
          if (isClosed) return;

          try {
            const data = JSON.parse(rawData.toString());

            // Handle subscription confirmation
            if (data.result !== undefined && data.id === 1) {
              subscriptionId = data.result;
              return;
            }

            // Handle slot notifications
            if (data.method === 'slotNotification' && data.params?.result) {
              const { slot, parent } = data.params.result;
              sendEvent('block', {
                slot,
                timestamp: Date.now(),
                parentSlot: parent,
              });
            }
          } catch (e) {
            console.error('[Laserstream Proxy] Failed to parse message:', e);
          }
        });

        ws.on('error', (err) => {
          console.error('[Laserstream Proxy] WebSocket error:', err);
          sendEvent('error', { message: 'WebSocket connection failed' });
        });

        ws.on('close', (code, reason) => {
          if (isClosed) return;
          if (code !== 1000) {
            sendEvent('error', { message: reason.toString() || 'Connection closed unexpectedly' });
          }
          sendEvent('disconnected', { code });
          isClosed = true;
          try {
            controller.close();
          } catch {
            // Already closed
          }
        });
      } catch (e) {
        sendEvent('error', { message: e instanceof Error ? e.message : 'Failed to connect' });
        isClosed = true;
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
    cancel() {
      // Called when the client disconnects
      isClosed = true;
      if (ws) {
        if (subscriptionId !== null && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              jsonrpc: '2.0',
              id: 2,
              method: 'slotUnsubscribe',
              params: [subscriptionId],
            })
          );
        }
        ws.close(1000, 'Client disconnected');
        ws = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

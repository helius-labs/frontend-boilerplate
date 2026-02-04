// Server-side Helius client wrapper
// NEVER import this file from client components
// Source: https://github.com/helius-labs/helius-sdk
import { type HeliusClient, createHelius } from 'helius-sdk';
import { env } from '@/shared/config/env';

// Singleton pattern - create once, reuse
let heliusInstance: HeliusClient | null = null;

/**
 * Get the Helius client instance.
 * Server-side only - do not import in client components.
 */
export function getHeliusClient(): HeliusClient {
  if (!heliusInstance) {
    const apiKey = env.heliusApiKey();
    heliusInstance = createHelius({ apiKey });
  }
  return heliusInstance;
}

/**
 * Get Helius RPC URL for direct RPC calls.
 * Server-side only.
 */
export function getHeliusRpcUrl(): string {
  return `https://mainnet.helius-rpc.com/?api-key=${env.heliusApiKey()}`;
}

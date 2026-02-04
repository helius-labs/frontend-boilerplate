// Formatting utilities for transaction display
// Source: Research patterns for timestamp and signature handling

/**
 * Format Unix timestamp to readable date string.
 * blockTime from Solana is in seconds, not milliseconds.
 */
export function formatTimestamp(blockTime: number | null): string {
  if (!blockTime) return 'Unknown time';

  const date = new Date(blockTime * 1000); // Convert seconds to ms

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format timestamp as relative time (e.g., "5m ago").
 * Falls back to absolute time for older transactions.
 */
export function formatRelativeTime(blockTime: number | null): string {
  if (!blockTime) return 'Unknown';

  const now = Date.now();
  const txTime = blockTime * 1000; // Convert seconds to ms
  const diff = now - txTime;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  // Fallback to absolute time for older transactions
  return formatTimestamp(blockTime);
}

/**
 * Shorten transaction signature for display.
 * Shows first and last N characters with ellipsis.
 */
export function shortenSignature(signature: string, length: number = 8): string {
  if (signature.length <= length * 2) return signature;
  return `${signature.slice(0, length)}...${signature.slice(-length)}`;
}

/**
 * Get Solscan URL for transaction.
 */
export function getSolscanUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}`;
}

/**
 * Format SOL amount from lamports.
 */
export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  }).format(sol);
}

/**
 * Format fee amount (typically small, show more decimals).
 */
export function formatFee(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return `${sol.toFixed(6)} SOL`;
}

// Wallet utility functions
// Address formatting, validation, and display helpers

/**
 * Truncate a Solana address for display.
 * @param address - Full Solana address (base58, 32-44 chars)
 * @param prefixLength - Characters to show at start (default: 4)
 * @param suffixLength - Characters to show at end (default: 4)
 * @returns Truncated address like "HN7c...WrH"
 *
 * @example
 * truncateAddress("HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH")
 * // Returns: "HN7c...WrH"
 */
export function truncateAddress(address: string, prefixLength = 4, suffixLength = 4): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength + 3) {
    return address; // Don't truncate if already short
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Validate a Solana address format.
 * Checks base58 characters and length (32-44 chars).
 * Does NOT verify the address exists on-chain.
 *
 * @param address - String to validate
 * @returns true if valid Solana address format
 */
export function isValidSolanaAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;

  // Solana addresses are base58 encoded, 32-44 characters
  // Base58 alphabet: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Format address for copy button (full address with feedback).
 * @param address - Full Solana address
 * @returns Object with full address and truncated display version
 */
export function formatAddressForCopy(address: string): {
  full: string;
  display: string;
} {
  return {
    full: address,
    display: truncateAddress(address),
  };
}

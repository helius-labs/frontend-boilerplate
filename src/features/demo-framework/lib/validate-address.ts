// Solana address validation utility
// Uses @solana/kit which re-exports @solana/addresses
import { type Address, isAddress } from '@solana/kit';

/**
 * Validates a string as a Solana address.
 * Uses @solana/addresses for type-safe validation.
 */
export function validateSolanaAddress(input: string): AddressValidationResult {
  const trimmed = input.trim();

  // Empty input is not an error, just not valid yet
  if (!trimmed) {
    return { isValid: false, address: null, error: null };
  }

  // Check if it's a valid Solana address
  if (isAddress(trimmed)) {
    return { isValid: true, address: trimmed as Address, error: null };
  }

  return {
    isValid: false,
    address: null,
    error: 'Invalid Solana address format',
  };
}

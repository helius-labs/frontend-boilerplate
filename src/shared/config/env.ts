// Validated environment variable access
// Throws helpful errors if required vars are missing

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` + `See .env.example for required variables.`
    );
  }
  return value;
}

export function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

// Type-safe accessors for known env vars
export const env = {
  heliusApiKey: () => getRequiredEnv('HELIUS_API_KEY'),
  laserstreamApiKey: () => getOptionalEnv('LASERSTREAM_API_KEY'),
  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
} as const;

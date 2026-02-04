// Check if Laserstream API key is configured
import { env } from '@/shared/config/env';

export async function GET(): Promise<Response> {
  const isConfigured = Boolean(env.laserstreamApiKey());

  return Response.json({ configured: isConfigured });
}

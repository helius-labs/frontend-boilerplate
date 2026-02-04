// Dynamic robots.txt generation
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://frontend-boilerplate.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', // Block API routes
        '/address/', // Block dynamic address routes
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

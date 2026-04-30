import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
  ];
}

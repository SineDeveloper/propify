import { createClient } from '@/lib/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data } = await supabase
  .from('properties').select('id, updated_at')

  const propertyUrls = data?.map((p) => ({
    url: `https://yourdomain.com/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? []

  return [
    { url: 'https://yourdomain.com/', priority: 1.0 },
    { url: 'https://yourdomain.com/properties', priority: 0.9 },
    ...propertyUrls,
  ]
}
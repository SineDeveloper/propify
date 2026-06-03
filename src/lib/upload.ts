import { createClient } from '@/lib/supabase/client'

export async function uploadPropertyImages(
  files: File[],
  propertyId: string
): Promise<string[]> {
  const supabase = createClient()
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()
    const path = `properties/${propertyId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('property-images')
      .upload(path, file, { upsert: true })

    if (error) throw error

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(path)

    urls.push(data.publicUrl)
  }
  return urls
}
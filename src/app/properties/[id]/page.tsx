import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ImageGallery } from '@/components/ImageGallery'
import { PropertyMap } from '@/components/PropertyMap'
import { InquiryForm } from '@/components/InquiryForm'
import type { Metadata } from 'next'
import { createClient as createSimpleClient } from '@supabase/supabase-js'

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: p } = await supabase
    .from('properties')
    .select('title, description, province, district, images')
    .eq('id', id)
    .single()

    if (!p) return { title: 'Property Not Found' }

  return {
    title: `${p.title} - ${p.district}, ${p.province}`,
    description: p.description?.slice(0, 160),
    openGraph: {
      title: p.title,
      description: p.description,
      images: p.images?.[0] ? [{ url: p.images[0] }] : [],
    },
  }
}

export default async function PropertyDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*, profiles(full_name, phone, avatar_url)')
    .eq('id', id)
    .single()

  if (!property) notFound()

  // นับ views (fire-and-forget)
  supabase.from('properties')
    .update({ views: property.views + 1 })
    .eq('id', id)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <ImageGallery images={property.images} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">
            {property.district}, {property.province}
          </p>
          <p className="text-3xl font-bold text-primary mt-4">
            ฿{new Intl.NumberFormat('th-TH').format(property.price)}
          </p>
          <p className="mt-4 text-muted-foreground">{property.description}</p>
          <PropertyMap lat={property.lat} lng={property.lng} />
        </div>
        <div>
          <InquiryForm propertyId={property.id} />
        </div>
      </div>
    </main>
  )
}

export const revalidate = 60 // ISR: revalidate every 60 seconds

export async function generateStaticParams() {
  // สร้าง Client เปล่าๆ ไม่ต้องผ่านฟังก์ชันคุกกี้ของ Next.js
  const supabase = createSimpleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('properties')
    .select('id')
    .order('views', { ascending: false })
    .limit(20)

  return data?.map(({ id }) => ({ id })) ?? []
}
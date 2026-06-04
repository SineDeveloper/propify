import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PropertyForm } from '@/components/dashboard/PropertyForm'

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .eq('agent_id', user!.id) // ดูได้เฉพาะของตัวเอง
    .single()

  if (!property) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขทรัพย์สิน</h1>
        <p className="text-sm text-gray-500 mt-1 truncate">{property.title}</p>
      </div>
      <PropertyForm
        propertyId={property.id}
        defaultValues={{
          title: property.title,
          description: property.description,
          type: property.type,
          status: property.status,
          price: property.price,
          area: property.area,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          province: property.province,
          district: property.district,
          address: property.address ?? '',
          lat: property.lat,
          lng: property.lng,
          images: property.images ?? [],
        }}
      />
    </div>
  )
}
import { createClient } from '@/lib/supabase/server'
import { PropertyCard } from '@/components/PropertyCard'

export default async function PropertiesPage({
    searchParams,
}: { searchParams: { type?: string; status?: string } }) {
    const supabase = await createClient()

    let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

    if (searchParams.type) query = query.eq('type', searchParams.type)
    if (searchParams.status) query = query.eq('status', searchParams.status)

    const { data: properties } = await query

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties?.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>
        </main>
    )
}
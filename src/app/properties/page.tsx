import { mockProperties } from '@/lib/mock-data'
import { PropertyCard } from '@/components/PropertyCard'

interface SearchParams {
    type?: string
    status?: string
    minPrice?: number
    maxPrice?: number
    province?: string
}

export default function PropertiesPage({
    searchParams,
}: {
    searchParams: SearchParams }) {
        const filtered = mockProperties.filter((p) => {
            if (searchParams.type && p.type !== searchParams.type) return false
            if (searchParams.status && p.status !== searchParams.status) return false
            if (searchParams.minPrice && p.price < searchParams.minPrice) return false
            if (searchParams.maxPrice && p.price > searchParams.maxPrice) return false
            if (searchParams.province && p.province !== searchParams.province) return false
            return true
        })

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Properties</h1>
            {/* <FilterBar /> - will be implemented later */}
            <p className="text-muted-foreground mb-4">
                {filtered.length} properties found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                ))}
            </div>
        </main>
    )
}
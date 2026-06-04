import { mockProperties } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'
import type { ListingStatus, Property, PropertyType } from '@/types/property'

const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

type PropertyRow = Omit<Property, 'agentId' | 'createdAt'> & {
    agentId?: string
    agent_id?: string
    createdAt?: Date
    created_at?: string
    profiles?: {
        full_name?: string
        phone?: string
        avatar_url?: string
    } | null
}

function normalizeProperty(row: PropertyRow): Property {
    return {
        ...row,
        agentId: row.agentId ?? row.agent_id ?? 'demo-agent',
        createdAt: row.createdAt ?? new Date(row.created_at ?? Date.now()),
    }
}

function filterMockProperties(filters?: {
    type?: string
    status?: string
    district?: string
}) {
    return mockProperties.filter((property) => {
        const typeMatch = !filters?.type || property.type === filters.type
        const statusMatch = !filters?.status || property.status === filters.status
        const districtMatch =
            !filters?.district ||
            property.district.toLowerCase().includes(filters.district.toLowerCase()) ||
            property.province.toLowerCase().includes(filters.district.toLowerCase())

        return typeMatch && statusMatch && districtMatch
    })
}

export async function getProperties(filters?: {
    type?: PropertyType | string
    status?: ListingStatus | string
    district?: string
}) {
    if (!hasSupabaseConfig) {
        return filterMockProperties(filters)
    }

    try {
        const supabase = await createClient()
        let query = supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false })

        if (filters?.type) query = query.eq('type', filters.type)
        if (filters?.status) query = query.eq('status', filters.status)
        if (filters?.district) query = query.ilike('district', `%${filters.district}%`)

        const { data, error } = await query

        if (error || !data?.length) {
            return filterMockProperties(filters)
        }

        return data.map((row) => normalizeProperty(row as PropertyRow))
    } catch {
        return filterMockProperties(filters)
    }
}

export async function getPropertyById(id: string) {
    if (!hasSupabaseConfig) {
        return mockProperties.find((property) => property.id === id) ?? null
    }

    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('properties')
            .select('*, profiles(full_name, phone, avatar_url)')
            .eq('id', id)
            .single()

        if (error || !data) {
            return mockProperties.find((property) => property.id === id) ?? null
        }

        return normalizeProperty(data as PropertyRow)
    } catch {
        return mockProperties.find((property) => property.id === id) ?? null
    }
}

export async function recordPropertyView(id: string, currentViews: number) {
    if (!hasSupabaseConfig) return

    try {
        const supabase = await createClient()
        await supabase
            .from('properties')
            .update({ views: currentViews + 1 })
            .eq('id', id)
    } catch {
        // Analytics should never block a property detail page.
    }
}

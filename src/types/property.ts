export type PropertyType = 'condo' | 'house' | 'townhouse' | 'land'
export type ListingStatus = 'for_sale' | 'for_rent' | 'sold'

export interface Property {
    id: string
    title: string
    description: string
    type: PropertyType
    status: ListingStatus
    price: number
    area: number
    bedrooms: number
    bathrooms: number
    province: string
    district: string
    lat: number
    lng: number
    images: string[]
    agentId: string
    createdAt: Date
    views: number
}
import { Property } from '@/types/property'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

const formatPrice = (price: number) =>
    new Intl.NumberFormat('th-TH').format(price)

const STATUS_LABEL = {
    for_sale: 'For Sale',
    for_rent: 'For Rent',
    sold: 'Sold',
}

export function PropertyCard({ property }: { property: Property }) {
    return (
        <Link href={`/properties/${property.id}`}>
            <Card className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative h-48">
                    <Image
                        src={property.images[0] || 'https://placehold.co/600x400.jpg'}
                        alt={property.title} fill className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2">
                        {STATUS_LABEL[property.status]}
                    </Badge>
                </div>
                <CardContent className="p-4">
                    <p className="font-semibold text-lg truncate">{property.title}</p>
                    <p className="text-muted-foreground text-sm mt-1">
                        {property.province}, {property.district}
                    </p>
                    <div className="flex gap-4 text-sm mt-2 text-muted-foreground">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{property.area} sq.m.</span>
                    </div>
                    <p className="text-primary font-bold mt-3">
                        ฿{formatPrice(property.price)}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}
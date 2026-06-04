import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Property } from '@/types/property'
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const formatPrice = (price: number) =>
    new Intl.NumberFormat('th-TH').format(price)

const STATUS_LABEL = {
    for_sale: 'ขาย',
    for_rent: 'เช่า',
    sold: 'ขายแล้ว',
}

const TYPE_LABEL = {
    condo: 'คอนโด',
    house: 'บ้านเดี่ยว',
    townhouse: 'ทาวน์โฮม',
    land: 'ที่ดิน',
}

export function PropertyCard({ property }: { property: Property }) {
    const isRent = property.status === 'for_rent'

    return (
        <Link href={`/properties/${property.id}`} className="block h-full">
            <Card className="h-full overflow-hidden rounded-lg border border-zinc-200 bg-white py-0 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative h-52">
                    <Image
                        src={property.images[0] || 'https://placehold.co/600x400.jpg'}
                        alt={property.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                    <Badge className="absolute left-3 top-3 bg-white text-zinc-950 shadow-sm">
                        {STATUS_LABEL[property.status]}
                    </Badge>
                    <Badge className="absolute right-3 top-3 bg-zinc-950/80 text-white">
                        {TYPE_LABEL[property.type]}
                    </Badge>
                </div>
                <CardContent className="flex flex-1 flex-col p-4">
                    <p className="line-clamp-1 text-lg font-semibold text-zinc-950">
                        {property.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500">
                        <MapPin className="size-4" />
                        {property.province}, {property.district}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-zinc-600">
                        <span className="flex items-center gap-1">
                            <BedDouble className="size-4" />
                            {property.bedrooms || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath className="size-4" />
                            {property.bathrooms || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Ruler className="size-4" />
                            {property.area} ตร.ม.
                        </span>
                    </div>
                    <p className="mt-4 text-xl font-bold text-zinc-950">
                        ฿{formatPrice(property.price)}
                        {isRent && (
                            <span className="text-sm font-medium text-zinc-500">/เดือน</span>
                        )}
                    </p>
                </CardContent>
            </Card>
        </Link>
    )
}

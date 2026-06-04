import { ImageGallery } from '@/components/ImageGallery'
import { InquiryForm } from '@/components/InquiryForm'
import { PropertyMap } from '@/components/PropertyMap'
import { getProperties, getPropertyById, recordPropertyView } from '@/lib/properties'
import { Bath, BedDouble, Eye, MapPin, Ruler } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params
    const property = await getPropertyById(id)

    if (!property) return { title: 'Property Not Found - Propify' }

    return {
        title: `${property.title} - ${property.district}, ${property.province}`,
        description: property.description.slice(0, 160),
        openGraph: {
            title: property.title,
            description: property.description,
            images: property.images[0] ? [{ url: property.images[0] }] : [],
        },
    }
}

export default async function PropertyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const property = await getPropertyById(id)

    if (!property) notFound()

    await recordPropertyView(id, property.views)

    const isRent = property.status === 'for_rent'

    return (
        <main className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-6xl px-4 py-6">
                <Link href="/properties" className="text-sm font-medium text-zinc-500">
                    กลับไปหน้ารายการ
                </Link>
                <div className="mt-5">
                    <ImageGallery images={property.images} />
                </div>

                <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1fr_360px]">
                    <section>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-md bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white">
                                {STATUS_LABEL[property.status]}
                            </span>
                            <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700">
                                {TYPE_LABEL[property.type]}
                            </span>
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold text-zinc-950">
                            {property.title}
                        </h1>
                        <p className="mt-2 flex items-center gap-2 text-zinc-500">
                            <MapPin className="size-4" />
                            {property.district}, {property.province}
                        </p>
                        <p className="mt-5 text-4xl font-bold text-zinc-950">
                            ฿{formatPrice(property.price)}
                            {isRent && (
                                <span className="text-base font-medium text-zinc-500">/เดือน</span>
                            )}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-lg border border-zinc-200 bg-white p-4">
                                <BedDouble className="size-5 text-zinc-500" />
                                <p className="mt-2 text-xl font-semibold">
                                    {property.bedrooms || '-'}
                                </p>
                                <p className="text-sm text-zinc-500">ห้องนอน</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4">
                                <Bath className="size-5 text-zinc-500" />
                                <p className="mt-2 text-xl font-semibold">
                                    {property.bathrooms || '-'}
                                </p>
                                <p className="text-sm text-zinc-500">ห้องน้ำ</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4">
                                <Ruler className="size-5 text-zinc-500" />
                                <p className="mt-2 text-xl font-semibold">{property.area}</p>
                                <p className="text-sm text-zinc-500">ตร.ม.</p>
                            </div>
                            <div className="rounded-lg border border-zinc-200 bg-white p-4">
                                <Eye className="size-5 text-zinc-500" />
                                <p className="mt-2 text-xl font-semibold">{property.views}</p>
                                <p className="text-sm text-zinc-500">ยอดเข้าชม</p>
                            </div>
                        </div>

                        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
                            <h2 className="text-xl font-semibold">รายละเอียดประกาศ</h2>
                            <p className="mt-3 leading-7 text-zinc-600">
                                {property.description}
                            </p>
                        </div>

                        <PropertyMap lat={property.lat} lng={property.lng} />
                    </section>

                    <aside>
                        <div className="sticky top-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium uppercase text-zinc-500">
                                Contact owner
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                                สนใจรายการนี้?
                            </h2>
                            <p className="mt-2 text-sm text-zinc-500">
                                ส่งข้อมูลติดต่อไว้ แล้วทีมขายจะติดต่อกลับเพื่อยืนยันวันนัดชม
                            </p>
                            <div className="mt-5">
                                <InquiryForm propertyId={property.id} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export const revalidate = 60

export async function generateStaticParams() {
    const properties = await getProperties()

    return properties.slice(0, 20).map(({ id }) => ({ id }))
}

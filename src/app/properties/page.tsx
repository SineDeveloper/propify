import { PropertyCard } from '@/components/PropertyCard'
import { getProperties } from '@/lib/properties'
import { Search } from 'lucide-react'

export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; status?: string; district?: string }>
}) {
    const filters = await searchParams
    const properties = await getProperties(filters)

    return (
        <main className="min-h-screen bg-zinc-50">
            <section className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase text-zinc-500">
                                Browse properties
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
                                ค้นหาอสังหาที่พร้อมนัดชม
                            </h1>
                        </div>
                        <form className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 sm:grid-cols-[1fr_150px_150px_auto]">
                            <input
                                name="district"
                                defaultValue={filters.district}
                                placeholder="ทำเล เช่น Ari"
                                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                            />
                            <select
                                name="type"
                                defaultValue={filters.type ?? ''}
                                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                            >
                                <option value="">ทุกประเภท</option>
                                <option value="condo">คอนโด</option>
                                <option value="house">บ้านเดี่ยว</option>
                                <option value="townhouse">ทาวน์โฮม</option>
                                <option value="land">ที่ดิน</option>
                            </select>
                            <select
                                name="status"
                                defaultValue={filters.status ?? ''}
                                className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                            >
                                <option value="">ขาย/เช่า</option>
                                <option value="for_sale">ขาย</option>
                                <option value="for_rent">เช่า</option>
                            </select>
                            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white">
                                <Search className="size-4" />
                                ค้นหา
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-zinc-600">พบ {properties.length} รายการ</p>
                    <p className="text-sm text-zinc-500">เรียงตามรายการล่าสุด</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {properties.map((p) => (
                        <PropertyCard key={p.id} property={p} />
                    ))}
                </div>
                {!properties.length && (
                    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
                        <p className="font-medium text-zinc-950">
                            ยังไม่พบรายการที่ตรงเงื่อนไข
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                            ลองเปลี่ยนทำเล ประเภท หรือสถานะประกาศ
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

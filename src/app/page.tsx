import { PropertyCard } from '@/components/PropertyCard'
import { getProperties } from '@/lib/properties'
import { ArrowRight, Building2, HomeIcon, KeyRound, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const stats = [
    { label: 'พร้อมนัดชม', value: '120+' },
    { label: 'ทำเลยอดนิยม', value: '18' },
    { label: 'ตอบกลับเฉลี่ย', value: '24 ชม.' },
]

const categories = [
    { label: 'ซื้อบ้าน', href: '/properties?status=for_sale', icon: HomeIcon },
    { label: 'เช่าคอนโด', href: '/properties?type=condo&status=for_rent', icon: KeyRound },
    { label: 'ลงทุนที่ดิน', href: '/properties?type=land', icon: Building2 },
]

export default async function Home() {
    const featured = (await getProperties()).slice(0, 3)

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950">
            <section className="relative min-h-[620px] overflow-hidden bg-zinc-950 text-white">
                <Image
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=85"
                    alt="Modern house exterior"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-zinc-950/45" />
                <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-between px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-semibold">
                            Propify
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/properties"
                                className="hidden rounded-md px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 sm:inline-flex"
                            >
                                รายการทั้งหมด
                            </Link>
                            <Link
                                href="/login"
                                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-100"
                            >
                                ลงประกาศ
                            </Link>
                        </div>
                    </nav>

                    <div className="grid gap-10 pb-10 pt-20 lg:grid-cols-[1fr_420px] lg:items-end">
                        <div className="max-w-3xl">
                            <p className="mb-4 inline-flex rounded-md bg-white/12 px-3 py-1 text-sm font-medium text-white">
                                Marketplace MVP สำหรับอสังหาไทย
                            </p>
                            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
                                Propify
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
                                ค้นหา เปรียบเทียบ และส่งคำถามถึงเจ้าของประกาศได้ในที่เดียว
                                เริ่มจากรายการที่พร้อมนัดชมจริงและขยายต่อสู่ Supabase ได้ทันที
                            </p>
                            <form
                                action="/properties"
                                className="mt-8 grid max-w-3xl gap-2 rounded-lg bg-white p-2 shadow-2xl sm:grid-cols-[1fr_160px_auto]"
                            >
                                <input
                                    name="district"
                                    placeholder="ค้นหาทำเล เช่น Ari, Watthana"
                                    className="h-12 rounded-md border border-zinc-200 px-4 text-sm text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-300"
                                />
                                <select
                                    name="status"
                                    className="h-12 rounded-md border border-zinc-200 px-4 text-sm text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-300"
                                    defaultValue=""
                                >
                                    <option value="">ซื้อหรือเช่า</option>
                                    <option value="for_sale">ซื้อ</option>
                                    <option value="for_rent">เช่า</option>
                                </select>
                                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white">
                                    <Search className="size-4" />
                                    ค้นหา
                                </button>
                            </form>
                        </div>

                        <div className="rounded-lg border border-white/20 bg-white/12 p-5 backdrop-blur">
                            <p className="text-sm font-medium text-white/70">MVP focus</p>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {stats.map((stat) => (
                                    <div key={stat.label}>
                                        <p className="text-2xl font-semibold">{stat.value}</p>
                                        <p className="mt-1 text-xs text-white/70">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-zinc-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 md:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon

                        return (
                            <Link
                                key={category.label}
                                href={category.href}
                                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition hover:bg-zinc-50"
                            >
                                <span className="flex items-center gap-3 font-medium">
                                    <Icon className="size-5 text-zinc-500" />
                                    {category.label}
                                </span>
                                <ArrowRight className="size-4 text-zinc-500" />
                            </Link>
                        )
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase text-zinc-500">
                            Featured homes
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold">
                            รายการเด่นพร้อมนัดชม
                        </h2>
                    </div>
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
                    >
                        ดูทั้งหมด
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featured.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </section>
        </main>
    )
}

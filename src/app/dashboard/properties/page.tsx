import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeletePropertyButton } from '@/components/dashboard/DeletePropertyButton'

const STATUS_TH: Record<string, string> = {
  for_sale: 'ขาย', for_rent: 'เช่า', sold: 'ขายแล้ว',
}
const STATUS_COLOR: Record<string, string> = {
  for_sale: 'bg-green-100 text-green-700',
  for_rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-500',
}
const TYPE_TH: Record<string, string> = {
  condo: 'คอนโด', house: 'บ้านเดี่ยว',
  townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน',
}

export default async function DashboardPropertiesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, type, status, price, area, bedrooms, views, images')
    .eq('agent_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ทรัพย์สินของฉัน</h1>
          <p className="text-sm text-gray-500 mt-1">{properties?.length ?? 0} รายการ</p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm
            font-medium hover:bg-green-800 transition-colors"
        >
          + เพิ่มทรัพย์สิน
        </Link>
      </div>

      {!properties?.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-4xl mb-4">🏠</p>
          <p className="text-gray-500 mb-4">ยังไม่มีทรัพย์สิน</p>
          <Link
            href="/dashboard/properties/new"
            className="bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            เพิ่มทรัพย์สินแรก
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['ทรัพย์สิน', 'ประเภท', 'สถานะ', 'ราคา', 'Views', 'จัดการ'].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-xs font-medium text-gray-500 px-5 py-3.5
                        ${h === 'จัดการ' || h === 'Views' || h === 'ราคา'
                          ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🏠</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.area} ตร.ม. · {p.bedrooms} ห้องนอน</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{TYPE_TH[p.type] ?? p.type}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[p.status]}`}>
                      {STATUS_TH[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-gray-800">
                    ฿{Number(p.price).toLocaleString('th-TH')}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-gray-500">{p.views}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/properties/${p.id}`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 rounded-md border border-gray-200
                          text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        ดู
                      </Link>
                      <Link
                        href={`/dashboard/properties/${p.id}/edit`}
                        className="text-xs px-3 py-1.5 rounded-md border border-gray-200
                          text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        แก้ไข
                      </Link>
                      <DeletePropertyButton propertyId={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
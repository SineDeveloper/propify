import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_TH: Record<string, string> = {
  for_sale: 'ขาย', for_rent: 'เช่า', sold: 'ขายแล้ว',
}
const STATUS_COLOR: Record<string, string> = {
  for_sale: 'bg-green-100 text-green-700',
  for_rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: properties }, { data: inquiries }, { data: recentProps }] =
    await Promise.all([
      supabase
        .from('properties')
        .select('id, status, views, price')
        .eq('agent_id', user!.id),
      supabase
        .from('inquiries')
        .select('id, created_at, sender_name, sender_email, property_id')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('properties')
        .select('id, title, status, price, views')
        .eq('agent_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  const totalProperties = properties?.length ?? 0
  const activeListings =
    properties?.filter((p) => p.status !== 'sold').length ?? 0
  const totalViews =
    properties?.reduce((sum, p) => sum + (p.views ?? 0), 0) ?? 0
  const totalInquiries = inquiries?.length ?? 0

  const stats = [
    { label: 'ทรัพย์สินทั้งหมด', value: totalProperties, icon: '🏠', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'ประกาศที่ active', value: activeListings, icon: '✅', bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'ยอดเข้าชมรวม', value: totalViews.toLocaleString(), icon: '👁', bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'ข้อความที่ได้รับ', value: totalInquiries, icon: '💬', bg: 'bg-orange-50', text: 'text-orange-700' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ภาพรวม</h1>
        <p className="text-gray-500 text-sm mt-1">
          สรุปข้อมูลทรัพย์สินและการติดต่อของคุณ
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div
              className={`inline-flex items-center justify-center w-10 h-10
              rounded-lg text-xl ${s.bg} ${s.text} mb-3`}
            >
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">ทรัพย์สินล่าสุด</h2>
            <Link href="/dashboard/properties"
              className="text-sm text-green-600 hover:text-green-700">
              ดูทั้งหมด →
            </Link>
          </div>
          {!recentProps?.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">ยังไม่มีทรัพย์สิน</p>
              <Link href="/dashboard/properties/new"
                className="mt-3 inline-block text-sm text-green-600 hover:underline">
                + เพิ่มทรัพย์สินแรก
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProps.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ฿{Number(p.price).toLocaleString('th-TH')} · 👁 {p.views}
                    </p>
                  </div>
                  <span className={`ml-3 text-xs px-2 py-1 rounded-full font-medium shrink-0
                    ${STATUS_COLOR[p.status]}`}>
                    {STATUS_TH[p.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">ข้อความล่าสุด</h2>
            <Link href="/dashboard/inquiries"
              className="text-sm text-green-600 hover:text-green-700">
              ดูทั้งหมด →
            </Link>
          </div>
          {!inquiries?.length ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-sm">ยังไม่มีข้อความ</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-gray-800">{inq.sender_name}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-3">
                      {new Date(inq.created_at).toLocaleDateString('th-TH', {
                        day: 'numeric', month: 'short',
                      })}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{inq.sender_email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href="/dashboard/properties/new"
          className="bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm
            font-medium hover:bg-green-800 transition-colors"
        >
          + เพิ่มทรัพย์สินใหม่
        </Link>
        <Link
          href="/properties"
          target="_blank"
          className="border border-gray-200 bg-white text-gray-600 px-5 py-2.5
            rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          🌐 ดูหน้าเว็บ
        </Link>
      </div>
    </div>
  )
}
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InquiriesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ดึง inquiry ที่เกี่ยวกับ property ของ agent คนนี้
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select(`
      id, sender_name, sender_email, sender_phone,
      message, created_at,
      properties!inner(id, title, agent_id)
    `)
    .eq('properties.agent_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ข้อความที่ได้รับ</h1>
        <p className="text-sm text-gray-500 mt-1">{inquiries?.length ?? 0} ข้อความ</p>
      </div>

      {!inquiries?.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-gray-500">ยังไม่มีข้อความ</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {inquiries.map((inq: any) => (
            <div key={inq.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-gray-900">{inq.sender_name}</p>
                    <Link
                      href={`/properties/${inq.properties.id}`}
                      target="_blank"
                      className="text-xs text-green-600 hover:underline truncate max-w-xs"
                    >
                      🏠 {inq.properties.title}
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-sm text-gray-500">
                    <a href={`mailto:${inq.sender_email}`}
                      className="hover:text-green-600">
                      ✉️ {inq.sender_email}
                    </a>
                    {inq.sender_phone && (
                      <a href={`tel:${inq.sender_phone}`}
                        className="hover:text-green-600">
                        📞 {inq.sender_phone}
                      </a>
                    )}
                  </div>
                  {inq.message && (
                    <p className="mt-3 text-sm text-gray-700 bg-gray-50
                      rounded-lg px-4 py-3 leading-relaxed">
                      {inq.message}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 shrink-0">
                  {new Date(inq.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
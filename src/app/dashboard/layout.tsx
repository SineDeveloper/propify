import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/dashboard/LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  const navItems = [
    { href: '/dashboard', label: 'ภาพรวม', icon: '📊' },
    { href: '/dashboard/properties', label: 'ทรัพย์สินของฉัน', icon: '🏠' },
    { href: '/dashboard/properties/new', label: 'เพิ่มทรัพย์สิน', icon: '➕' },
    { href: '/dashboard/inquiries', label: 'ข้อความที่ได้รับ', icon: '💬' },
  ]

  const initials = (profile?.full_name ?? user.email ?? '?')
    .charAt(0)
    .toUpperCase()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-xl font-bold text-green-700">
            Propify
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Agent Dashboard</p>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center
              justify-center text-green-700 font-semibold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.full_name ?? 'Agent'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-100 space-y-0.5">
          <LogoutButton />
          <Link
            href="/properties"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm
              text-gray-500 hover:text-gray-800 hover:bg-gray-50
              rounded-lg transition-colors"
          >
            <span>🌐</span>
            <span>ดูหน้าเว็บ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm
        text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg
        transition-colors"
    >
      <span>🚪</span>
      <span>ออกจากระบบ</span>
    </button>
  )
}
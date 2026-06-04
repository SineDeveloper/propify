'use client'

import { deleteProperty } from '@/app/actions/property'
import { useState } from 'react'

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('ยืนยันการลบทรัพย์สินนี้? ไม่สามารถกู้คืนได้')) return
    setLoading(true)
    try {
      await deleteProperty(propertyId)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-md border border-red-200
        text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      {loading ? '...' : 'ลบ'}
    </button>
  )
}
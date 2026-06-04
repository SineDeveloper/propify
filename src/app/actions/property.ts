'use server'

import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/schemas/property'
import { revalidatePath } from 'next/cache'

export async function upsertProperty(data: unknown, propertyId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อน')

  const parsed = propertySchema.parse(data)

  if (propertyId) {
    const { error } = await supabase
      .from('properties')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', propertyId)
      .eq('agent_id', user.id) // RLS เพิ่มเติม: แก้ได้เฉพาะของตัวเอง

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('properties')
      .insert({ ...parsed, agent_id: user.id })

    if (error) throw new Error(error.message)
  }

  revalidatePath('/dashboard/properties')
  revalidatePath('/properties')
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('กรุณาเข้าสู่ระบบก่อน')

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('agent_id', user.id) // ลบได้เฉพาะของตัวเอง

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/properties')
  revalidatePath('/properties')
}
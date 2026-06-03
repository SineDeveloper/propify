'use server'
import { createClient } from '@/lib/supabase/server'
import { propertySchema } from '@/lib/schemas/property'
import { revalidatePath } from 'next/cache'

export async function upsertProperty(
  data: unknown,
  propertyId?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const parsed = propertySchema.parse(data)

  if (propertyId) {
    await supabase.from('properties')
      .update({ ...parsed, updated_at: new Date().toISOString() })
      .eq('id', propertyId)
      .eq('agent_id', user.id)
  } else {
    await supabase.from('properties')
      .insert({ ...parsed, agent_id: user.id })
  }

  revalidatePath('/dashboard')
  revalidatePath('/properties')
}
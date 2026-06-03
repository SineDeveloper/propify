'use server'
import { createClient } from '@/lib/supabase/server'

export async function submitInquiry(formData: FormData) {
    const supabase = await createClient()

    const { error } = await supabase.from('inquiries').insert({
        property_id: formData.get('propertyId'),
        sender_name: formData.get('name'),
        sender_email: formData.get('email'),
        sender_phone: formData.get('phone'),
        message: formData.get('message'),
    })
    if (error) throw new Error(error.message)
}
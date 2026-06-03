'use client'
import { submitInquiry } from '@/app/actions/inquiry'
import { useFormStatus } from 'react-dom'

function SubmitBtn() {
    const { pending } = useFormStatus()

    return (
        <button type="submit" disabled={pending}
            className="w-full btn-primary text-white py-2 rounded text-sm">
            {pending ? 'กำลังส่ง...' : 'ติดต่อเจ้าของ'}
        </button>
    )
}

export function InquiryForm({ propertyId }: { propertyId: string }) {
    return (
        <form action={submitInquiry} className="border rounded-lg p-4 flex flex-col gap-3">
            <input type="hidden" name="propertyId" value={propertyId} />
            <input name="name" placeholder="ชื่อของคุณ"
            className="border rounded px-3 py-2 text-sm" required />
            <input name="email" type="email" placeholder="อีเมลของคุณ"
            className="border rounded px-3 py-2 text-sm" required />
            <input name="phone" placeholder="เบอร์โทรศัพท์ของคุณ"
            className="border rounded px-3 py-2 text-sm" required />
            <textarea name="message" placeholder="ข้อความของคุณ"
            className="border rounded px-3 py-2 text-sm" rows={4} required />
            <SubmitBtn />
        </form>
    )
}
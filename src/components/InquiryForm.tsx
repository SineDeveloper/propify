'use client'

import { submitInquiry } from '@/app/actions/inquiry'
import { Send } from 'lucide-react'
import { useFormStatus } from 'react-dom'

function SubmitBtn() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
        >
            <Send className="size-4" />
            {pending ? 'กำลังส่ง...' : 'ติดต่อเจ้าของ'}
        </button>
    )
}

export function InquiryForm({ propertyId }: { propertyId: string }) {
    return (
        <form action={submitInquiry} className="flex flex-col gap-3">
            <input type="hidden" name="propertyId" value={propertyId} />
            <input
                name="name"
                placeholder="ชื่อของคุณ"
                className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
            />
            <input
                name="email"
                type="email"
                placeholder="อีเมล"
                className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
            />
            <input
                name="phone"
                placeholder="เบอร์โทรศัพท์"
                className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
            />
            <textarea
                name="message"
                placeholder="ข้อความ"
                className="min-h-28 rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
            />
            <SubmitBtn />
        </form>
    )
}

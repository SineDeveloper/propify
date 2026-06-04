'use client'

import { createClient } from '@/lib/supabase/client'
import { Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(
        hasSupabaseConfig ? '' : 'Demo mode: add Supabase env vars to enable real login.'
    )

    async function handleLogin() {
        if (!hasSupabaseConfig) {
            setMessage('Demo mode active. Supabase credentials are not configured yet.')
            return
        }

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) setMessage(error.message)
        else router.push('/dashboard')
    }

    async function handleGoogle() {
        if (!hasSupabaseConfig) {
            setMessage('Demo mode active. Supabase credentials are not configured yet.')
            return
        }

        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` },
        })
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-950 text-white">
                        <Building2 className="size-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-950">Propify</h1>
                        <p className="text-sm text-zinc-500">Agent sign in</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="h-10 w-full rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="h-10 w-full rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
                    >
                        Sign in with Google
                    </button>
                </div>

                {message && (
                    <p className="mt-4 rounded-md bg-zinc-100 p-3 text-sm text-zinc-600">
                        {message}
                    </p>
                )}
            </div>
        </main>
    )
}

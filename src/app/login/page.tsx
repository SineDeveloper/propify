'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({
            email, password,
        })
        if (error) alert(error.message)
        else router.push('/dashboard')
    }

    async function handleGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` },
        })
    }

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 text-sm"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 text-sm"
            />
            <button
                onClick={handleLogin}
                className="w-full bg-primary text-white rounded py-2 mb-3 text-sm"
            >
                Login
            </button>
            <button
                onClick={handleGoogle}
                className="w-full border text-white rounded py-2 text-sm"
            >
                Sign in with Google
            </button>
        </div>
    )
}
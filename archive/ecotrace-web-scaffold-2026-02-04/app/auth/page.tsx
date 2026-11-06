'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignUp = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })
        setLoading(false)

        if (error) alert(error.message)
        else alert('Signup successful. You can now log in.')
    }

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)

        if (error) alert(error.message)
        else alert('Login successful')
    }

    return (
        <div style={{ maxWidth: 400, margin: '80px auto' }}>
            <h2>EcoTrace Login</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', marginBottom: 10 }}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', marginBottom: 10 }}
            />

            <button onClick={handleLogin} disabled={loading}>
                Login
            </button>

            <button onClick={handleSignUp} disabled={loading} style={{ marginLeft: 10 }}>
                Sign Up
            </button>
        </div>
    )
}

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/reservations')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && <div className="text-error bg-error-container p-3 text-sm">{error}</div>}
      
      <div className="flex flex-col gap-1">
        <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Email</label>
        <input 
          type="email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-label-sm font-semibold text-secondary uppercase tracking-widest">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="p-3 border border-outline-variant bg-surface text-primary focus:outline-none focus:border-primary"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-4 bg-primary text-on-primary py-3 px-4 font-semibold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  )
}

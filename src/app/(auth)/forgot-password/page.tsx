'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      })
      if (error) throw error
      setSent(true)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm mb-6">
          We sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link href="/login" className="text-brand-600 text-sm font-medium hover:underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset your password</h1>
        <p className="text-gray-500 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-brand-600 font-medium hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  )
}

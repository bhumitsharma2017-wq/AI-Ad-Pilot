'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2, Zap, Users, Crown, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Subscription, SubscriptionPlan } from '@/types'
import { PLAN_CONFIG } from '@/types'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void }
  }
}

// UI-only metadata (icon, color, "Most Popular" flag) layered on top of
// PLAN_CONFIG, which is the single source of truth for pricing/features
// shared with the rest of the app.
const PLAN_UI_META: Record<SubscriptionPlan, { icon: typeof Zap; color: string; popular?: boolean }> = {
  free: { icon: Zap, color: 'gray' },
  pro: { icon: Crown, color: 'brand', popular: true },
  agency: { icon: Users, color: 'violet' },
}

const PLAN_ORDER: SubscriptionPlan[] = ['free', 'pro', 'agency']

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const loadRazorpayScript = useCallback(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.head.appendChild(script)
    }
  }, [])

  const loadSubscription = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    setSubscription(data)
    setLoadingData(false)
  }, [supabase])

  useEffect(() => {
    void loadSubscription()
    loadRazorpayScript()
  }, [loadRazorpayScript, loadSubscription])

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === subscription?.plan) return
    setLoading(planId)

    try {
      const res = await fetch('/api/webhooks/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing_cycle: billing }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

      // Open Razorpay checkout
      const options = {
        key: data.razorpay_key,
        subscription_id: data.subscription_id,
        name: 'AdPilot AI',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan — ${billing}`,
        image: '/logo.png',
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
        },
        theme: { color: '#6366f1' },
        handler: async () => {
          toast.success('🎉 Subscription activated! Welcome to ' + planId)
          await loadSubscription()
        },
        modal: {
          ondismiss: () => { setLoading(null) },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Subscription failed')
    } finally {
      setLoading(null)
    }
  }

  if (loadingData) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white rounded-2xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-500 mt-1">
          Current plan:{' '}
          <span className="font-medium text-brand-600 capitalize">{subscription?.plan || 'Free'}</span>
          {subscription?.current_period_end && (
            <span className="text-gray-400 ml-2">
              · Renews {new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm ${billing === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            billing === 'yearly' ? 'bg-brand-600' : 'bg-gray-200'
          }`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'
          }`} />
        </button>
        <span className={`text-sm ${billing === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          Yearly
          <span className="ml-1.5 px-1.5 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Save 17%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_ORDER.map((planId) => {
          const plan = PLAN_CONFIG[planId]
          const ui = PLAN_UI_META[planId]
          const isCurrentPlan = subscription?.plan === planId
          const price = billing === 'monthly' ? plan.price_monthly : plan.price_yearly
          const Icon = ui.icon

          return (
            <div
              key={planId}
              className={`relative rounded-2xl border p-6 transition-all ${
                ui.popular
                  ? 'border-brand-500 shadow-lg shadow-brand-100 scale-[1.02]'
                  : isCurrentPlan
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {ui.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl bg-${ui.color}-50 flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 text-${ui.color}-600`} />
              </div>

              <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>

              <div className="mt-3 mb-5">
                {price === 0 ? (
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(planId)}
                disabled={isCurrentPlan || planId === 'free' || loading === planId}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  isCurrentPlan
                    ? 'bg-green-100 text-green-600 cursor-not-allowed'
                    : planId === 'free'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : ui.popular
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {loading === planId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : planId === 'free' ? (
                  'Default Plan'
                ) : (
                  <>Upgrade to {plan.name} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Cancellation info */}
      {subscription?.plan !== 'free' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
          Cancel anytime. You&apos;ll retain access until the end of your billing period.
          <a href="mailto:support@adpilot.ai" className="ml-1 text-brand-600 hover:underline">
            Contact support to cancel.
          </a>
        </div>
      )}
    </div>
  )
}

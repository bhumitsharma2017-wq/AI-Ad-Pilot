'use client'

import Link from 'next/link'
import { Lock, Crown, Zap } from 'lucide-react'

interface UpgradePromptProps {
  feature: string
  requiredPlan?: 'pro' | 'agency'
  description?: string
  compact?: boolean
}

export function UpgradePrompt({
  feature,
  requiredPlan = 'pro',
  description,
  compact = false,
}: UpgradePromptProps) {
  const planLabel = requiredPlan === 'agency' ? 'Agency' : 'Pro'
  const planColor = requiredPlan === 'agency' ? 'violet' : 'brand'

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
        <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span className="text-xs text-amber-800">
          {feature} requires{' '}
          <Link href="/subscription" className="font-semibold hover:underline">
            {planLabel} plan
          </Link>
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className={`w-14 h-14 rounded-2xl bg-${planColor}-50 flex items-center justify-center mb-4`}>
        <Crown className={`w-7 h-7 text-${planColor}-400`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{feature}</h3>
      <p className="text-sm text-gray-400 text-center max-w-xs mb-5">
        {description || `This feature is available on the ${planLabel} plan and above.`}
      </p>
      <Link
        href={`/subscription`}
        className={`flex items-center gap-2 px-5 py-2.5 bg-${planColor}-600 text-white rounded-xl font-medium text-sm hover:bg-${planColor}-700 transition-colors`}
      >
        <Zap className="w-4 h-4" />
        Upgrade to {planLabel}
      </Link>
    </div>
  )
}

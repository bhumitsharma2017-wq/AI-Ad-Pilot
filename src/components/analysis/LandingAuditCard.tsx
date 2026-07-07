'use client'

import { useState } from 'react'
import type { LandingAudit } from '@/types'
import { Loader2, RefreshCw, Zap, Smartphone, TrendingUp, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  audit: LandingAudit | null
  projectId: string
  url: string
}

function ScoreCircle({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36
  const strokeDash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="36" fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="44" cy="44" r="36" fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}

export default function LandingAuditCard({ audit, projectId, url }: Props) {
  const [loading, setLoading] = useState(false)

  const runAudit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, url }),
      })
      if (!res.ok) throw new Error('Audit failed')
      toast.success('Audit complete! Refreshing...')
      setTimeout(() => window.location.reload(), 2000)
    } catch {
      toast.error('Audit failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!audit) {
    return (
      <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
          <Zap className="w-6 h-6 text-brand-400" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">No audit yet</h3>
        <p className="text-sm text-gray-500 mb-4">Run a CRO audit on your landing page.</p>
        <button
          onClick={runAudit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Run Audit
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Landing Page Scores</h3>
          <button
            onClick={runAudit}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Re-audit
          </button>
        </div>
        <div className="flex items-center justify-around">
          <ScoreCircle score={audit.trust_score} label="Trust Score" color="#6366f1" />
          <ScoreCircle score={audit.conversion_score} label="Conversion Score" color="#10b981" />
          <ScoreCircle score={audit.mobile_score} label="Mobile Score" color="#0ea5e9" />
        </div>
      </div>

      {/* Recommendations grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: 'CRO Suggestions', items: audit.cro_suggestions, icon: TrendingUp, color: 'brand' },
          { title: 'CTA Improvements', items: audit.cta_improvements, icon: Zap, color: 'amber' },
          { title: 'Mobile Experience', items: audit.page_speed_suggestions, icon: Smartphone, color: 'sky' },
          { title: 'Trust Signals', items: audit.trust_badge_suggestions, icon: Shield, color: 'green' },
        ].map(({ title, items, icon: Icon, color }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5">
            <h4 className={`font-semibold text-gray-900 mb-3 flex items-center gap-2`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
              {title}
            </h4>
            <div className="space-y-2">
              {items?.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 mt-1.5 flex-shrink-0`} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overall recommendations */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
        <h4 className="font-semibold text-brand-900 mb-3">Top Priority Recommendations</h4>
        <div className="space-y-2">
          {audit.overall_recommendations?.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-brand-800">
              <span className="text-brand-400 font-bold text-xs mt-0.5 flex-shrink-0">#{i + 1}</span>
              {rec}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

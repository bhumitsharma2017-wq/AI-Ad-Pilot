'use client'

import type { Forecasts } from '@/types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { TrendingUp, Target, DollarSign, MousePointer, Percent } from 'lucide-react'

interface Props {
  forecasts: Forecasts
  budget: number
}

export default function ForecastCard({ forecasts, budget }: Props) {
  const metrics = [
    { label: 'Est. CPC', value: `$${forecasts.estimated_cpc?.toFixed(2)}`, icon: DollarSign, color: 'brand' },
    { label: 'Est. CTR', value: `${forecasts.estimated_ctr?.toFixed(1)}%`, icon: Percent, color: 'sky' },
    { label: 'Est. Clicks', value: forecasts.estimated_clicks?.toLocaleString(), icon: MousePointer, color: 'violet' },
    { label: 'Est. Leads', value: forecasts.estimated_leads?.toLocaleString(), icon: Target, color: 'green' },
    { label: 'Est. CPL', value: `$${forecasts.estimated_cpl?.toFixed(2)}`, icon: DollarSign, color: 'amber' },
    { label: 'Est. Revenue', value: `$${forecasts.estimated_revenue?.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
  ]

  const chartData = [
    { name: 'Budget', value: budget, color: '#6366f1' },
    { name: 'Revenue', value: forecasts.estimated_revenue, color: '#10b981' },
    { name: 'CPL', value: forecasts.estimated_cpl * 10, color: '#f59e0b' },
  ]

  const confidenceColor = forecasts.confidence_score >= 70 ? '#10b981' :
    forecasts.confidence_score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-6">
      {/* Confidence score */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="26" fill="none"
              stroke={confidenceColor} strokeWidth="6"
              strokeDasharray={`${(forecasts.confidence_score / 100) * 163} 163`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
            {forecasts.confidence_score}%
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Confidence Score</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Based on available industry data and your business category.
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {forecasts.assumptions?.slice(0, 2).map((a, i) => (
              <span key={i} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ROAS highlight */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-brand-200 text-sm mb-1">Estimated ROAS</div>
            <div className="text-4xl font-bold">{forecasts.estimated_roas?.toFixed(1)}x</div>
            <div className="text-brand-200 text-sm mt-1">
              Return for every $1 spent
            </div>
          </div>
          <div className="text-right">
            <div className="text-brand-200 text-sm mb-1">Monthly Budget</div>
            <div className="text-2xl font-bold">${budget?.toLocaleString()}</div>
            <div className="text-brand-200 text-sm mt-1">→ Est. ${forecasts.estimated_revenue?.toLocaleString()} revenue</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Budget vs Revenue Projection</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * Forecasts are estimates based on industry benchmarks. Actual results may vary.
        </p>
      </div>
    </div>
  )
}

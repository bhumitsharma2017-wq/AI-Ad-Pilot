'use client'

import type { CampaignStrategy } from '@/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Target, Users, MessageSquare, Calendar } from 'lucide-react'

interface Props {
  strategy: CampaignStrategy
  budget: number
}

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function CampaignStrategyCard({ strategy, budget }: Props) {
  const chartData = strategy.recommended_channels.map(ch => ({
    name: ch.platform,
    value: ch.percentage,
    budget: ch.budget,
  }))

  return (
    <div className="space-y-6">
      {/* Budget allocation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Budget Allocation</h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Chart */}
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {strategy.recommended_channels.map((ch, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{ch.platform}</div>
                  <div className="text-xs text-gray-500">{ch.rationale}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">{ch.percentage}%</div>
                  <div className="text-xs text-gray-500">${ch.budget?.toLocaleString()}/mo</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel strategy */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-500" />
          Marketing Funnel Strategy
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { stage: 'AWARENESS', color: 'blue', items: strategy.funnel_strategy.awareness },
            { stage: 'CONSIDERATION', color: 'violet', items: strategy.funnel_strategy.consideration },
            { stage: 'CONVERSION', color: 'green', items: strategy.funnel_strategy.conversion },
          ].map(({ stage, color, items }) => (
            <div key={stage} className={`p-4 bg-${color}-50 rounded-xl`}>
              <div className={`text-xs font-bold text-${color}-500 mb-3 tracking-wider`}>{stage}</div>
              <div className="space-y-2">
                {items?.map((item, i) => (
                  <div key={i} className={`flex items-start gap-2 text-sm text-${color}-900`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 mt-1.5 flex-shrink-0`} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key messages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-violet-500" />
          Key Messages
        </h3>
        <div className="space-y-2">
          {strategy.key_messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-bold text-brand-400 mt-0.5">0{i + 1}</span>
              <p className="text-sm text-gray-700">{msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-500" />
          Recommended Timeline
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{strategy.timeline}</p>
      </div>
    </div>
  )
}

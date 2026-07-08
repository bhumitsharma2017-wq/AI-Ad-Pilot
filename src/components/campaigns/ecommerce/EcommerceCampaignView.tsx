'use client'

import { useState } from 'react'
import type { Campaign, PerformanceMaxAssetGroup } from '@/types'
import { Download, ChevronDown, ChevronUp, ShoppingCart, TrendingUp, Target, RefreshCw } from 'lucide-react'

interface Props {
  campaign: Campaign
  onExport: () => void
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string
  icon?: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-green-500" />}
          {title}
        </h3>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function EcommerceCampaignView({ campaign, onExport }: Props) {
  const structure = campaign.structure
  const adCopy = campaign.ad_copy

  const crossSell = structure?.cross_sell_opportunities || []
  const upsell = structure?.upsell_opportunities || []
  const feedSuggestions = structure?.product_feed_suggestions || []
  const audienceSegments = structure?.audience_segments || []
  const perfMaxStructure = structure?.performance_max_structure
  const formatAssetGroup = (assetGroup: string | PerformanceMaxAssetGroup) =>
    typeof assetGroup === 'string'
      ? assetGroup
      : [assetGroup.name, assetGroup.final_url].filter(Boolean).join(' - ') || 'Asset group'
  const perfMaxColumns = [
    { label: 'Asset Groups', items: (perfMaxStructure?.asset_groups || []).map(formatAssetGroup) },
    { label: 'Audience Signals', items: perfMaxStructure?.audience_signals || [] },
    { label: 'Final URLs', items: perfMaxStructure?.final_urls || [] },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">
              Google Shopping
            </span>
            <span className="text-sm text-gray-500">{campaign.objective}</span>
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Strategy
        </button>
      </div>

      {/* Campaign overview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Bid Strategy', value: String(structure?.bid_strategy || 'Target ROAS') },
          { label: 'Daily Budget', value: `$${structure?.daily_budget || 0}` },
          { label: 'Objective', value: String(structure?.campaign_objective || 'ROAS') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-sm font-semibold text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      {/* Google Shopping Strategy */}
      <Section title="Google Shopping Strategy" icon={ShoppingCart}>
        <p className="text-sm text-gray-700 leading-relaxed">
          {String(structure?.google_shopping_strategy || '')}
        </p>
      </Section>

      {/* Performance Max */}
      <Section title="Performance Max Structure" icon={TrendingUp}>
        <div className="grid md:grid-cols-3 gap-4">
          {perfMaxColumns.map(({ label, items }) => (
            <div key={label}>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{label}</div>
              <div className="space-y-1.5">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-xl">
          <p className="text-sm text-green-800 font-medium mb-1">ROAS Strategy</p>
          <p className="text-sm text-green-700">{String(structure?.roas_strategy || '')}</p>
        </div>
      </Section>

      {/* Audience Segments */}
      <Section title="Audience Segments" icon={Target}>
        <div className="flex flex-wrap gap-2">
          {audienceSegments.map((seg, i) => (
            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">
              {seg}
            </span>
          ))}
        </div>
      </Section>

      {/* Ad Copy */}
      {adCopy?.headlines && (
        <Section title="Ad Headlines & Descriptions" defaultOpen={false}>
          <div className="space-y-2 mb-4">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Headlines</div>
            {adCopy.headlines.map((h, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <span className="text-sm text-gray-800">{h}</span>
              </div>
            ))}
          </div>
          {adCopy?.descriptions && (
            <div>
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Descriptions</div>
              {adCopy.descriptions.map((d, i) => (
                <div key={i} className="p-2.5 bg-gray-50 rounded-lg mb-2 text-sm text-gray-800">{d}</div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Product Feed Suggestions */}
      <Section title="Product Feed Recommendations" defaultOpen={false}>
        <div className="space-y-2">
          {feedSuggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700 p-2.5 bg-amber-50 rounded-lg">
              <span className="text-amber-500 font-bold text-xs mt-0.5">{i + 1}.</span>
              {s}
            </div>
          ))}
        </div>
      </Section>

      {/* Cross-sell & Upsell */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Cross-Sell Opportunities" defaultOpen={false}>
          <div className="space-y-2">
            {crossSell.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Upsell Opportunities" defaultOpen={false}>
          <div className="space-y-2">
            {upsell.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <TrendingUp className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

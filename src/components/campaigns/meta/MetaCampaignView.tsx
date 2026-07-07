'use client'

import { useState } from 'react'
import type { Campaign } from '@/types'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  campaign: Campaign
  onExport: () => void
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function MetaCampaignView({ campaign, onExport }: Props) {
  const adCopy = campaign.ad_copy as Record<string, unknown>
  const audiences = campaign.audiences as Record<string, unknown>
  const creatives = campaign.creatives as Record<string, unknown>
  const structure = campaign.structure as Record<string, unknown>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">Meta Ads</span>
        </div>
        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export Sheet
        </button>
      </div>

      <Section title="Ad Copy — Primary Texts">
        <div className="space-y-3">
          {(adCopy?.primary_texts as string[] || []).map((text, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">VARIATION {i + 1}</div>
              <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Headlines & CTAs">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Headlines</div>
            <div className="space-y-1.5">
              {(adCopy?.headlines as string[] || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg text-sm text-indigo-800">
                  <span className="text-indigo-400 text-xs">{i + 1}.</span>
                  {h}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">CTA Options</div>
            <div className="flex flex-wrap gap-2">
              {(adCopy?.cta_options as string[] || []).map((cta, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm rounded-lg font-medium">{cta}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Audience Targeting">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Interest Targeting', key: 'interest_targeting', color: 'indigo' },
            { label: 'Lookalike Audiences', key: 'lookalike', color: 'violet' },
            { label: 'Remarketing', key: 'remarketing', color: 'sky' },
          ].map(({ label, key, color }) => (
            <div key={key}>
              <div className={`text-xs font-bold text-${color}-500 mb-2 uppercase tracking-wider`}>{label}</div>
              <div className="space-y-1">
                {((audiences?.[key] as string[]) || []).map((item, i) => (
                  <div key={i} className={`text-xs px-2 py-1 bg-${color}-50 text-${color}-700 rounded-lg`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Creative Angles & Concepts">
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Creative Angles</div>
          <div className="flex flex-wrap gap-2">
            {(creatives?.creative_angles as string[] || []).map((angle, i) => (
              <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200">
                {angle}
              </span>
            ))}
          </div>
        </div>

        {(creatives?.image_concepts as Record<string, unknown>[] || []).length > 0 && (
          <div>
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Image Concepts</div>
            <div className="grid md:grid-cols-2 gap-3">
              {(creatives.image_concepts as Record<string, unknown>[]).map((concept, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Format: {String(concept.format)}</span>
                    <span className="text-xs text-gray-400">Concept {i + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{String(concept.headline)}</p>
                  <p className="text-sm text-gray-600 mb-2">{String(concept.concept)}</p>
                  <div className="flex gap-1">
                    {(concept.color_scheme as string[] || []).map((c, j) => (
                      <div key={j} className="w-5 h-5 rounded-full border border-gray-100" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Ad Sets */}
      {structure?.ad_sets && (
        <Section title="Ad Set Structure" defaultOpen={false}>
          <div className="space-y-3">
            {(structure.ad_sets as Record<string, unknown>[]).map((adSet, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <div className="font-medium text-gray-900 mb-1">{String(adSet.name)}</div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div>Age: {String(adSet.age_min)}-{String(adSet.age_max)}</div>
                  <div>Gender: {String(adSet.gender)}</div>
                  <div>{(adSet.placements as string[])?.length} placements</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

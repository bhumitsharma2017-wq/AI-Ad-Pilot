'use client'

import { useState } from 'react'
import type { Campaign } from '@/types'
import { Download, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { CopyButton } from '@/components/ui'

interface Props {
  campaign: Campaign
  onExport: () => void
}

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
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

const FORMAT_DIMS: Record<string, string> = {
  '1:1': '1080×1080',
  '4:5': '1080×1350',
  '1.91:1': '1200×628',
  '16:9': '1920×1080',
}

export default function DemandGenCampaignView({ campaign, onExport }: Props) {
  const adCopy = campaign.ad_copy
  const creatives = campaign.creatives

  const shortHeadlines = adCopy?.headlines || []
  const longHeadlines = adCopy?.long_headlines || shortHeadlines
  const descriptions = adCopy?.descriptions || []
  const imageConcepts = creatives?.image_concepts || []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <span className="px-2 py-0.5 bg-violet-50 text-violet-600 text-xs rounded-full font-medium">
            Demand Gen
          </span>
        </div>
        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Headlines */}
      <Section title="Short Headlines">
        <div className="space-y-2">
          {shortHeadlines.slice(0, 5).map((h, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-5">{i + 1}</span>
                <span className="text-sm text-gray-800">{h}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs ${h.length > 30 ? 'text-red-400' : 'text-gray-400'}`}>{h.length}/30</span>
                <CopyButton text={h} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Long Headlines">
        <div className="space-y-2">
          {longHeadlines.slice(0, 5).map((h, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-violet-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-violet-400 w-5">{i + 1}</span>
                <span className="text-sm text-violet-900">{h}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs ${h.length > 90 ? 'text-red-400' : 'text-violet-400'}`}>{h.length}/90</span>
                <CopyButton text={h} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Descriptions">
        <div className="space-y-2">
          {descriptions.map((d, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 flex items-start justify-between gap-3">
              <div className="flex gap-2">
                <span className="text-xs text-gray-400 w-5 mt-0.5">{i + 1}</span>
                <span>{d}</span>
              </div>
              <CopyButton text={d} />
            </div>
          ))}
        </div>
      </Section>

      {/* Creative Concepts */}
      {imageConcepts.length > 0 && (
        <Section title="Auto-Generated Image Concepts">
          <div className="grid md:grid-cols-3 gap-4">
            {imageConcepts.map((concept, i) => {
              const fmt = String(concept.format || '1:1')
              const colors = concept.color_scheme || ['#6366f1', '#4f46e5']
              return (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Preview */}
                  <div
                    className="h-36 flex flex-col items-center justify-center p-3 text-white text-center"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] || '#4f46e5'})` }}
                  >
                    <div className="text-xs font-bold opacity-70 mb-1">{fmt} · {FORMAT_DIMS[fmt]}</div>
                    <div className="font-bold text-sm">{concept.headline}</div>
                    <div className="text-xs opacity-80 mt-1">{concept.body_text}</div>
                  </div>
                  {/* Details */}
                  <div className="p-3">
                    <p className="text-xs text-gray-500 mb-2">{concept.concept}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {colors.map((c, j) => (
                          <div key={j} className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full font-medium">
                        {concept.cta || 'Learn More'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Use these concepts as briefs for your design team or AI image generators
          </p>
        </Section>
      )}
    </div>
  )
}

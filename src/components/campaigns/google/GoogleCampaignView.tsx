'use client'

import { useState } from 'react'
import type { Campaign } from '@/types'
import { Download, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  campaign: Campaign
  onExport: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default function GoogleCampaignView({ campaign, onExport }: Props) {
  const structure = campaign.structure as Record<string, unknown>
  const adCopy = campaign.ad_copy as Record<string, unknown>
  const keywords = campaign.keywords as Record<string, unknown>
  const settings = campaign.settings as Record<string, unknown>

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">Google Ads</span>
            <span className="text-sm text-gray-500">{campaign.objective}</span>
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Campaign Settings */}
      <Section title="Campaign Settings">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['Bid Strategy', structure?.bid_strategy],
            ['Daily Budget', `$${structure?.daily_budget}`],
            ['Locations', (settings?.location_targeting as string[])?.join(', ')],
            ['Languages', (settings?.language_targeting as string[])?.join(', ')],
            ['Devices', settings?.device_strategy],
          ].map(([label, value]) => (
            <div key={label as string} className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-sm font-medium text-gray-900">{String(value) || '—'}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Ad Copy */}
      <Section title="Ad Copy — 15 Headlines">
        <div className="space-y-2">
          {(adCopy?.headlines as string[] || []).map((h, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono w-5">{i + 1}</span>
                <span className="text-sm text-gray-800">{h}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs ${h.length > 30 ? 'text-red-400' : 'text-gray-400'}`}>
                  {h.length}/30
                </span>
                <CopyButton text={h} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">4 Descriptions</h4>
          <div className="space-y-2">
            {(adCopy?.descriptions as string[] || []).map((d, i) => (
              <div key={i} className="flex items-start justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-400 font-mono w-5 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-gray-800">{d}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`text-xs ${d.length > 90 ? 'text-red-400' : 'text-gray-400'}`}>
                    {d.length}/90
                  </span>
                  <CopyButton text={d} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Keywords */}
      <Section title="Keywords">
        <div className="space-y-4">
          {[
            { type: 'Broad Match', key: 'broad', color: 'blue' },
            { type: 'Phrase Match', key: 'phrase', color: 'violet' },
            { type: 'Exact Match', key: 'exact', color: 'green' },
            { type: 'Negative Keywords', key: 'negative', color: 'red' },
          ].map(({ type, key, color }) => (
            <div key={key}>
              <div className={`text-xs font-bold text-${color}-500 mb-2 uppercase tracking-wider`}>{type}</div>
              <div className="flex flex-wrap gap-1.5">
                {((keywords?.[key] as string[]) || []).map((kw, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 bg-${color}-50 text-${color}-700 text-xs rounded-lg cursor-pointer hover:bg-${color}-100 transition-colors`}
                    onClick={() => { navigator.clipboard.writeText(kw); toast.success('Copied!') }}
                  >
                    {key === 'phrase' ? `"${kw}"` : key === 'exact' ? `[${kw}]` : kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Sitelinks */}
      {adCopy?.sitelinks && (
        <Section title="Sitelinks" defaultOpen={false}>
          <div className="grid md:grid-cols-2 gap-3">
            {(adCopy.sitelinks as Record<string, string>[]).map((sl, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-sm font-medium text-blue-600">{sl.title}</div>
                <div className="text-xs text-gray-500 mt-1">{sl.description1}</div>
                <div className="text-xs text-gray-500">{sl.description2}</div>
                <div className="text-xs text-gray-400 mt-1">{sl.url}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Callouts */}
      {adCopy?.callouts && (
        <Section title="Callout Extensions" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {(adCopy.callouts as string[]).map((c, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-lg">
                {c}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Ad Groups */}
      {structure?.ad_groups && (
        <Section title="Ad Groups" defaultOpen={false}>
          <div className="space-y-3">
            {(structure.ad_groups as Record<string, unknown>[]).map((ag, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <div className="font-medium text-gray-900 mb-2">{String(ag.name)}</div>
                <div className="text-sm text-gray-500">
                  {(ag.keywords as string[])?.length} keywords · {(ag.headlines as string[])?.length} headlines
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

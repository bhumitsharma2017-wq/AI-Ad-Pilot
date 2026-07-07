'use client'

import type { Campaign, LinkedInTargeting } from '@/types'
import { Download } from 'lucide-react'

interface Props {
  campaign: Campaign
  onExport: () => void
}

export default function LinkedInCampaignView({ campaign, onExport }: Props) {
  const adCopy = campaign.ad_copy
  const audiences = campaign.audiences
  const creatives = campaign.creatives
  const linkedinTargetingEntries = audiences?.linkedin_targeting
    ? (Object.entries(audiences.linkedin_targeting) as [keyof LinkedInTargeting, string[]][])
    : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <span className="px-2 py-0.5 bg-sky-50 text-sky-600 text-xs rounded-full font-medium">LinkedIn Ads</span>
        </div>
        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Audience Targeting */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">B2B Audience Targeting</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {linkedinTargetingEntries.map(([key, values]) => (
            <div key={key}>
              <div className="text-xs font-bold text-sky-500 mb-2 uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {values.map((v, i) => (
                  <span key={i} className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-lg border border-sky-100">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Headlines */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Ad Headlines</h3>
        <div className="space-y-2">
          {(adCopy?.headlines || []).map((h, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-400 w-5">{i + 1}</span>
              <span className="text-sm text-gray-800">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Gen Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Lead Gen Form Fields</h3>
        <div className="flex flex-wrap gap-2">
          {(creatives?.lead_gen_form_fields || []).map((field, i) => (
            <span key={i} className="px-3 py-1.5 bg-sky-50 text-sky-700 text-sm rounded-lg font-medium">
              {field}
            </span>
          ))}
        </div>
      </div>

      {/* Creative Angles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Creative Angles</h3>
        <div className="grid grid-cols-2 gap-2">
          {(creatives?.creative_angles || []).map((angle, i) => (
            <div key={i} className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">{angle}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { Campaign } from '@/types'
import { Download } from 'lucide-react'

interface Props {
  campaign: Campaign
  onExport: () => void
}

export default function YouTubeCampaignView({ campaign, onExport }: Props) {
  const creatives = campaign.creatives
  const [activeScript, setActiveScript] = useState(0)
  const scripts = creatives?.video_scripts || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full font-medium">YouTube Ads</span>
        </div>
        <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export Scripts
        </button>
      </div>

      {/* Script tabs */}
      <div className="flex gap-2">
        {scripts.map((script, i) => (
          <button
            key={i}
            onClick={() => setActiveScript(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeScript === i
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {String(script.duration)}s Script
          </button>
        ))}
      </div>

      {scripts[activeScript] && (
        <div className="space-y-4">
          {/* Hook */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">🎬 HOOK (First 3 seconds)</div>
            <p className="text-red-900 font-semibold text-lg">{scripts[activeScript].hook}</p>
          </div>

          {/* Full voiceover */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Voiceover Script</div>
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
              {scripts[activeScript].voiceover}
            </p>
          </div>

          {/* Scenes */}
          {scripts[activeScript].scenes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Scene Breakdown</h3>
              <div className="space-y-3">
                {scripts[activeScript].scenes.map((scene, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">{scene.scene_number}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-1">{scene.duration_seconds}s</div>
                      <div className="text-sm font-medium text-gray-700 mb-0.5">📹 {String(scene.visual)}</div>
                      <div className="text-sm text-gray-600 mb-0.5">🎙 {String(scene.audio)}</div>
                      {scene.text_overlay && (
                        <div className="text-sm text-brand-600">💬 {String(scene.text_overlay)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA & Notes */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">CTA</div>
              <div className="text-lg font-bold text-brand-600">{scripts[activeScript].cta}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Production Notes</div>
              <p className="text-sm text-gray-600">{scripts[activeScript].storyboard_notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

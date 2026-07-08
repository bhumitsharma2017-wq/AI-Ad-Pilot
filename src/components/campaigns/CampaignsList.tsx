'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap, Download, ChevronRight, Loader2, Plus, RefreshCw } from 'lucide-react'
import type { Campaign, Platform } from '@/types'
import toast from 'react-hot-toast'
import { PLATFORM_META } from '@/lib/utils'
import { useGenerationStore } from '@/store'
import GoogleCampaignView from './google/GoogleCampaignView'
import MetaCampaignView from './meta/MetaCampaignView'
import LinkedInCampaignView from './linkedin/LinkedInCampaignView'
import YouTubeCampaignView from './youtube/YouTubeCampaignView'
import EcommerceCampaignView from './ecommerce/EcommerceCampaignView'
import DemandGenCampaignView from './demandgen/DemandGenCampaignView'

const VIEW_MAP: Record<string, React.ComponentType<{ campaign: Campaign; onExport: () => void }>> = {
  google: GoogleCampaignView,
  meta: MetaCampaignView,
  linkedin: LinkedInCampaignView,
  youtube: YouTubeCampaignView,
  shopping: EcommerceCampaignView,
  performance_max: EcommerceCampaignView,
  demand_gen: DemandGenCampaignView,
}

interface Props {
  projectId: string
  platforms: Platform[]
}

export default function CampaignsList({ projectId, platforms }: Props) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const { startGeneration, completeGeneration, failGeneration } = useGenerationStore()

  const loadCampaigns = useCallback(async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setCampaigns(data || [])
    setLoading(false)
  }, [projectId, supabase])

  useEffect(() => { void loadCampaigns() }, [loadCampaigns])

  const generateCampaign = async (platform: Platform) => {
    setGenerating(platform)
    const genKey = `${projectId}:${platform}`
    startGeneration(genKey, projectId, platform)
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, platform }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      completeGeneration(genKey)
      toast.success(`${PLATFORM_META[platform]?.label || platform} campaign generated!`)
      await loadCampaigns()
    } catch (err: unknown) {
      failGeneration(genKey)
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(null)
    }
  }

  const exportCampaign = async (campaign: Campaign) => {
    try {
      const res = await fetch(`/api/export/campaign?id=${campaign.id}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${campaign.name.replace(/\s+/g, '_')}_${campaign.platform}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Exported!')
    } catch {
      toast.error('Export failed')
    }
  }

  if (loading) return <div className="h-32 bg-white rounded-xl border animate-pulse" />

  if (selectedCampaign) {
    const ViewComponent = VIEW_MAP[selectedCampaign.platform] || GoogleCampaignView
    return (
      <div>
        <button
          onClick={() => setSelectedCampaign(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          ← Back to campaigns
        </button>
        <ViewComponent
          campaign={selectedCampaign}
          onExport={() => exportCampaign(selectedCampaign)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
        {platforms.map(platform => {
          const meta = PLATFORM_META[platform]
          const existing = campaigns.find(c => c.platform === platform)
          const isGenerating = generating === platform
          return (
            <button
              key={platform}
              onClick={() => !existing && !isGenerating && generateCampaign(platform)}
              disabled={!!generating || !!existing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                existing
                  ? `${meta?.bg} ${meta?.color} ${meta?.border} cursor-default`
                  : isGenerating
                  ? 'border-brand-200 bg-brand-50 text-brand-600'
                  : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 disabled:opacity-50'
              }`}
            >
              {isGenerating
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : existing ? '✓' : <Plus className="w-3 h-3" />
              }
              {meta?.label || platform}
            </button>
          )
        })}
        {campaigns.length > 0 && (
          <button onClick={loadCampaigns} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-400 hover:text-gray-600 ml-auto">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        )}
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Zap className="w-10 h-10 text-gray-200 mb-3" />
          <h3 className="font-medium text-gray-700 mb-1">No campaigns generated yet</h3>
          <p className="text-sm text-gray-400">Click a platform button above to generate a complete campaign structure.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campaigns.map(campaign => {
            const meta = PLATFORM_META[campaign.platform]
            return (
              <div
                key={campaign.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all cursor-pointer group"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${meta?.bg} ${meta?.color} flex-shrink-0`}>
                  {meta?.label || campaign.platform}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">{campaign.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{campaign.objective} · {campaign.status}</div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => { e.stopPropagation(); exportCampaign(campaign) }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    title="Export CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

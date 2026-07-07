'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Globe, Target, Brain, Users, TrendingUp, BarChart3,
  Zap, FileSearch, Download, RefreshCw, Loader2,
  CheckCircle, AlertCircle, Clock, ChevronRight,
  Building2, Search, Palette, ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project } from '@/types'
import BusinessAnalysisCard from '@/components/analysis/BusinessAnalysisCard'
import CompetitorAnalysisCard from '@/components/analysis/CompetitorAnalysisCard'
import CampaignStrategyCard from '@/components/analysis/CampaignStrategyCard'
import ForecastCard from '@/components/forecasting/ForecastCard'
import LandingAuditCard from '@/components/analysis/LandingAuditCard'
import CampaignsList from '@/components/campaigns/CampaignsList'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Brain },
  { id: 'competitors', label: 'Competitors', icon: Search },
  { id: 'campaigns', label: 'Campaigns', icon: Zap },
  { id: 'strategy', label: 'Strategy', icon: Target },
  { id: 'landing', label: 'Landing Audit', icon: FileSearch },
  { id: 'forecast', label: 'Forecasts', icon: TrendingUp },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [regenerating, setRegenerating] = useState(false)
  const supabase = createClient()

  const loadProject = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    setProject(data)
    setLoading(false)
  }, [projectId, supabase])

  useEffect(() => {
    loadProject()

    // Poll for status updates if analyzing
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('projects')
        .select('status, business_analysis, competitor_analysis, campaign_strategy, forecasts, landing_audit')
        .eq('id', projectId)
        .single()

      if (data) {
        setProject(prev => prev ? { ...prev, ...data } : null)
        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(interval)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [projectId, loadProject, supabase])

  const handleRegenerate = async (type: string) => {
    setRegenerating(true)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, regenerate: type }),
      })
      if (!res.ok) throw new Error('Regeneration failed')
      toast.success('Regenerating...')
      setTimeout(loadProject, 5000)
    } catch {
      toast.error('Failed to regenerate')
    } finally {
      setRegenerating(false)
    }
  }

  const handleGenerateCampaigns = async () => {
    setRegenerating(true)
    try {
      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      })
      if (!res.ok) throw new Error('Generation failed')
      toast.success('Generating campaigns...')
      setActiveTab('campaigns')
      setTimeout(loadProject, 8000)
    } catch {
      toast.error('Failed to generate campaigns')
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-white rounded-2xl border animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-xl border animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900">Project not found</h2>
        <button onClick={() => router.push('/projects')} className="mt-4 text-brand-600 text-sm hover:underline">
          Back to projects
        </button>
      </div>
    )
  }

  const isAnalyzing = project.status === 'analyzing'
  const isCompleted = project.status === 'completed'

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Projects
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-brand-600 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              {project.website_url}
            </a>
            <span className="text-gray-300">·</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isCompleted ? 'bg-green-50 text-green-600' :
              isAnalyzing ? 'bg-amber-50 text-amber-600' :
              project.status === 'error' ? 'bg-red-50 text-red-600' :
              'bg-gray-50 text-gray-500'
            }`}>
              {isAnalyzing ? (
                <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Analyzing...</span>
              ) : project.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <button
              onClick={handleGenerateCampaigns}
              disabled={regenerating}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Generate Campaigns
            </button>
          )}
        </div>
      </div>

      {/* Analyzing state */}
      {isAnalyzing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-amber-600 ai-thinking" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">AI is analyzing your business</h3>
              <p className="text-amber-700 text-sm mt-0.5">
                Crawling website, identifying competitors, building strategy... This takes about 60–90 seconds.
              </p>
            </div>
            <div className="ml-auto">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-400"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project metadata cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Goal', value: project.business_goal?.replace(/_/g, ' '), icon: Target },
          { label: 'Budget', value: `$${Number(project.monthly_budget).toLocaleString()}/mo`, icon: TrendingUp },
          { label: 'Country', value: project.target_country, icon: Globe },
          { label: 'Platforms', value: project.platforms?.join(', '), icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs">{label}</span>
            </div>
            <div className="text-sm font-medium text-gray-900 capitalize">{value || '—'}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      {isCompleted && (
        <>
          <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="animate-fade-in">
            {activeTab === 'overview' && project.business_analysis && (
              <BusinessAnalysisCard analysis={project.business_analysis} />
            )}
            {activeTab === 'competitors' && project.competitor_analysis && (
              <CompetitorAnalysisCard analysis={project.competitor_analysis} />
            )}
            {activeTab === 'campaigns' && (
              <CampaignsList projectId={projectId} platforms={project.platforms || []} />
            )}
            {activeTab === 'strategy' && project.campaign_strategy && (
              <CampaignStrategyCard strategy={project.campaign_strategy} budget={project.monthly_budget} />
            )}
            {activeTab === 'landing' && (
              <LandingAuditCard audit={project.landing_audit} projectId={projectId} url={project.website_url} />
            )}
            {activeTab === 'forecast' && project.forecasts && (
              <ForecastCard forecasts={project.forecasts} budget={project.monthly_budget} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

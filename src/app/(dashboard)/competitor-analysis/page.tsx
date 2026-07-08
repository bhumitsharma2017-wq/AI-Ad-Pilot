'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Loader2, Globe, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project, CompetitorAnalysis } from '@/types'
import CompetitorAnalysisCard from '@/components/analysis/CompetitorAnalysisCard'

export default function CompetitorAnalysisPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const loadProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
      setProjects(data || [])
    }

    void loadProjects()
  }, [supabase])

  const selectProject = async (projectId: string) => {
    setSelectedProject(projectId)
    const project = projects.find(p => p.id === projectId)
    if (project?.competitor_analysis) {
      setAnalysis(project.competitor_analysis)
    } else {
      setAnalysis(null)
    }
  }

  const runAnalysis = async () => {
    if (!selectedProject) { toast.error('Select a project first'); return }
    setAnalyzing(true)
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: selectedProject, regenerate: 'competitors' }),
      })
      if (!res.ok) throw new Error('Analysis failed')

      // Refetch project to get updated analysis
      const { data } = await supabase
        .from('projects')
        .select('competitor_analysis')
        .eq('id', selectedProject)
        .single()

      if (data?.competitor_analysis) {
        setAnalysis(data.competitor_analysis)
      }
      toast.success('Competitor analysis complete!')
    } catch {
      toast.error('Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
        <p className="text-gray-500 mt-0.5">AI-powered competitive intelligence for your business</p>
      </div>

      {/* Project selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex gap-3">
          <select
            value={selectedProject}
            onChange={e => selectProject(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            <option value="">Select a project to analyze...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name} — {p.website_url}</option>)}
          </select>
          <button
            onClick={runAnalysis}
            disabled={analyzing || !selectedProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {analyzing
              ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</>
              : <><Search className="w-4 h-4" />{analysis ? 'Re-analyze' : 'Analyze Competitors'}</>
            }
          </button>
        </div>
      </div>

      {/* Analysis loading state */}
      {analyzing && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-brand-400 ai-thinking" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Finding your competitors...</h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            AI is scanning the market, identifying top competitors, and analyzing their strategies.
          </p>
          <div className="flex gap-1.5 mt-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-brand-400"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Analysis results */}
      {analysis && !analyzing && (
        <CompetitorAnalysisCard analysis={analysis} />
      )}

      {/* Empty state */}
      {!analysis && !analyzing && !selectedProject && (
        <div className="flex flex-col items-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Globe className="w-12 h-12 text-gray-200 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Select a project to start</h3>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Choose one of your completed projects above and run the competitor analysis.
          </p>
        </div>
      )}

      {!analysis && !analyzing && selectedProject && (
        <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Target className="w-10 h-10 text-gray-200 mb-3" />
          <h3 className="font-medium text-gray-700 mb-1">No competitor analysis yet</h3>
          <p className="text-sm text-gray-400 mb-4">Click &quot;Analyze Competitors&quot; to get started.</p>
        </div>
      )}
    </div>
  )
}

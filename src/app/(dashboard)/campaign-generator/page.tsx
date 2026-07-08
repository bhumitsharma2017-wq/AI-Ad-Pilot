'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Zap, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project, Platform } from '@/types'
import { useGenerationStore } from '@/store'

const PLATFORMS: { value: Platform; label: string; desc: string; color: string }[] = [
  { value: 'google', label: 'Google Search Ads', desc: 'Keywords, headlines, descriptions, extensions', color: 'blue' },
  { value: 'meta', label: 'Meta (Facebook/Instagram)', desc: 'Audiences, creatives, primary texts', color: 'indigo' },
  { value: 'linkedin', label: 'LinkedIn Ads', desc: 'B2B targeting, lead gen forms', color: 'sky' },
  { value: 'youtube', label: 'YouTube Ads', desc: '15s/30s/60s scripts, storyboards', color: 'red' },
  { value: 'shopping', label: 'Google Shopping', desc: 'Shopping strategy, Performance Max', color: 'green' },
  { value: 'demand_gen', label: 'Demand Gen', desc: 'Multi-format demand campaigns', color: 'violet' },
]

export default function CampaignGeneratorPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<string[]>([])
  const supabase = useMemo(() => createClient(), [])
  const { startGeneration, completeGeneration, failGeneration } = useGenerationStore()

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
      if (data?.length) setSelectedProject(data[0].id)
    }

    void loadProjects()
  }, [supabase])

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleGenerate = async () => {
    if (!selectedProject) { toast.error('Select a project'); return }
    if (selectedPlatforms.length === 0) { toast.error('Select at least one platform'); return }

    setGenerating(true)
    setGenerated([])

    for (const platform of selectedPlatforms) {
      const genKey = `${selectedProject}:${platform}`
      startGeneration(genKey, selectedProject, platform)
      try {
        const res = await fetch('/api/campaigns/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: selectedProject, platform }),
        })
        if (!res.ok) throw new Error(`${platform} generation failed`)
        setGenerated(prev => [...prev, platform])
        completeGeneration(genKey)
        toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} campaign generated!`)
      } catch {
        failGeneration(genKey)
        toast.error(`Failed to generate ${platform} campaign`)
      }
    }
    setGenerating(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campaign Generator</h1>
        <p className="text-gray-500 mt-0.5">Generate complete campaigns across any platform in seconds</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Project selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            <option value="">Choose a project...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {projects.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              No completed projects yet. Create and analyze a project first.
            </p>
          )}
        </div>

        {/* Platform selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platforms to Generate</label>
          <div className="grid md:grid-cols-2 gap-3">
            {PLATFORMS.map(({ value, label, desc, color }) => {
              const isSelected = selectedPlatforms.includes(value)
              const isDone = generated.includes(value)
              return (
                <button
                  key={value}
                  onClick={() => !isDone && togglePlatform(value)}
                  disabled={isDone}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    isDone
                      ? 'border-green-300 bg-green-50 cursor-not-allowed'
                      : isSelected
                      ? `border-${color}-400 bg-${color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDone
                      ? 'border-green-500 bg-green-500'
                      : isSelected
                      ? `border-${color}-500 bg-${color}-500`
                      : 'border-gray-300'
                  }`}>
                    {(isSelected || isDone) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${isDone ? 'text-green-700' : 'text-gray-900'}`}>
                      {label} {isDone && '✓'}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating || selectedPlatforms.length === 0 || !selectedProject}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
              : <><Zap className="w-4 h-4" />Generate {selectedPlatforms.length} Campaign{selectedPlatforms.length !== 1 ? 's' : ''}</>
            }
          </button>
          {generating && (
            <span className="text-sm text-gray-500">
              {generated.length}/{selectedPlatforms.length} complete
            </span>
          )}
        </div>

        {/* Progress */}
        {generating && selectedPlatforms.length > 0 && (
          <div className="space-y-2">
            {selectedPlatforms.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  generated.includes(p) ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {generated.includes(p) && <CheckCircle className="w-3 h-3 text-white" />}
                  {!generated.includes(p) && generating && (
                    <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                  )}
                </div>
                <span className="text-sm text-gray-600 capitalize">{p} Ads</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {generated.length > 0 && !generating && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-900">
              {generated.length} campaign{generated.length !== 1 ? 's' : ''} generated successfully!
            </div>
            <div className="text-sm text-green-700 mt-0.5">
              View them in your project under the Campaigns tab.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

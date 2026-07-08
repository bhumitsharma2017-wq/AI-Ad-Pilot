'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Palette, Loader2, Image, FileText, Video,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project } from '@/types'
import { useUser } from '@/hooks'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'

const FORMATS = [
  { id: '1:1', label: 'Square (1:1)', desc: 'Instagram, Facebook feed', w: 1080, h: 1080 },
  { id: '4:5', label: 'Portrait (4:5)', desc: 'Instagram portrait', w: 1080, h: 1350 },
  { id: '1.91:1', label: 'Landscape (1.91:1)', desc: 'Facebook link, Google', w: 1200, h: 628 },
  { id: '9:16', label: 'Story (9:16)', desc: 'Stories & Reels', w: 1080, h: 1920 },
]

const CREATIVE_TYPES = [
  { id: 'image_concept', label: 'Image Concepts', icon: Image },
  { id: 'copy_variations', label: 'Copy Variations', icon: FileText },
  { id: 'video_script', label: 'Video Scripts', icon: Video },
]

export default function CreativeStudioPage() {
  const { isPro, loading: userLoading } = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedType, setSelectedType] = useState('image_concept')
  const [selectedFormats, setSelectedFormats] = useState(['1:1', '4:5', '1.91:1'])
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null)
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
      if (data?.length) setSelectedProject(data[0].id)
    }

    void loadProjects()
  }, [supabase])

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    )
  }

  const generateCreatives = async () => {
    if (!selectedProject) { toast.error('Select a project'); return }
    setGenerating(true)
    setResults(null)
    try {
      const res = await fetch('/api/ai/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selectedProject,
          type: selectedType,
          formats: selectedFormats,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.creatives)
      toast.success('Creatives generated!')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  // Plan gate: Creative Studio is a Pro/Agency feature.
  // Checked here (UX) in addition to the API route (security boundary).
  if (!userLoading && !isPro) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Creative Studio</h1>
          <p className="text-gray-500 mt-0.5">Generate ad creatives, copy variations, and video scripts</p>
        </div>
        <UpgradePrompt
          feature="Creative Studio"
          requiredPlan="pro"
          description="Generate AI image concepts, copy variations, and video scripts for your campaigns. Available on the Pro plan and above."
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Creative Studio</h1>
        <p className="text-gray-500 mt-0.5">Generate ad creatives, copy variations, and video scripts</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Creative Type</label>
            <div className="flex gap-2">
              {CREATIVE_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex-1 justify-center ${
                    selectedType === id
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedType === 'image_concept' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Formats</label>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => toggleFormat(id)}
                  className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    selectedFormats.includes(id)
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`font-medium ${selectedFormats.includes(id) ? 'text-brand-700' : 'text-gray-900'}`}>
                    {label}
                  </span>
                  <span className="text-xs text-gray-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={generateCreatives}
          disabled={generating || !selectedProject}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {generating
            ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
            : <><Sparkles className="w-4 h-4" />Generate Creatives</>
          }
        </button>
      </div>

      {/* Results */}
      {generating && (
        <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
            <Palette className="w-6 h-6 text-brand-400 ai-thinking" />
          </div>
          <div className="text-gray-700 font-medium">AI is crafting your creatives...</div>
          <div className="text-gray-400 text-sm mt-1">This usually takes 20–30 seconds</div>
        </div>
      )}

      {results && (
        <div className="animate-fade-in">
          {selectedType === 'image_concept' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Image Concepts ({results.length})</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((concept, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Visual mockup */}
                    <div
                      className="h-40 flex items-center justify-center text-sm font-medium text-white relative"
                      style={{
                        background: `linear-gradient(135deg, ${
                          (concept.color_scheme as string[] || ['#6366f1', '#4f46e5'])[0]
                        }, ${
                          (concept.color_scheme as string[] || ['#6366f1', '#4f46e5'])[1] || '#4f46e5'
                        })`,
                      }}
                    >
                      <div className="text-center px-4">
                        <div className="font-bold text-lg mb-1">{concept.headline as string}</div>
                        <div className="text-xs opacity-80">{concept.body_text as string}</div>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                        {concept.format as string}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1.5">CONCEPT</div>
                      <p className="text-sm text-gray-700 mb-3">{concept.concept as string}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {(concept.color_scheme as string[] || []).map((c, j) => (
                            <div key={j} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs rounded-full font-medium">
                          {concept.cta as string}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'copy_variations' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Copy Variations ({results.length})</h2>
              <div className="space-y-3">
                {results.map((copy, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                        Variation {i + 1} — {copy.angle as string}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `Headline: ${copy.headline}\n\nBody: ${copy.body}\n\nCTA: ${copy.cta}`
                          )
                          toast.success('Copied!')
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Copy All
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-400">HEADLINE</span>
                        <p className="text-sm font-medium text-gray-900">{copy.headline as string}</p>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-400">BODY</span>
                        <p className="text-sm text-gray-700">{copy.body as string}</p>
                      </div>
                      <div className="inline-block px-3 py-1.5 bg-brand-50 text-brand-700 text-sm rounded-lg font-medium">
                        {copy.cta as string} →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'video_script' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-4">Video Scripts</h2>
              <div className="space-y-4">
                {results.map((script, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                        {script.duration as number}s Script
                      </span>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 mb-3">
                      <div className="text-xs font-bold text-red-400 mb-1">HOOK</div>
                      <p className="text-sm text-red-900 font-medium">{script.hook as string}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg mb-3">
                      <div className="text-xs font-bold text-gray-400 mb-1">VOICEOVER SCRIPT</div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {script.voiceover as string}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-600">{script.cta as string} →</span>
                      <span className="text-xs text-gray-400">{script.storyboard_notes as string}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

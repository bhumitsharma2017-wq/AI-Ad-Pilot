'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, FolderOpen, Globe, Loader2, ArrowRight,
  Zap, Target, TrendingUp, Users, ChevronRight,
  Trash2, ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project, Platform, BusinessGoal } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const GOALS: { value: BusinessGoal; label: string; icon: React.ElementType }[] = [
  { value: 'lead_generation', label: 'Lead Generation', icon: Target },
  { value: 'ecommerce_sales', label: 'Ecommerce Sales', icon: TrendingUp },
  { value: 'app_installs', label: 'App Installs', icon: Zap },
  { value: 'brand_awareness', label: 'Brand Awareness', icon: Globe },
  { value: 'website_traffic', label: 'Website Traffic', icon: Users },
]

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: 'google', label: 'Google Ads', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'meta', label: 'Meta Ads', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { value: 'linkedin', label: 'LinkedIn Ads', color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { value: 'youtube', label: 'YouTube Ads', color: 'bg-red-50 border-red-200 text-red-700' },
]

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
  'Singapore', 'UAE', 'Germany', 'France', 'Brazil',
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [subscription, setSubscription] = useState<{ plan: string } | null>(null)

  // Form state
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [goal, setGoal] = useState<BusinessGoal>('lead_generation')
  const [budget, setBudget] = useState('')
  const [country, setCountry] = useState('India')
  const [platforms, setPlatforms] = useState<Platform[]>(['google', 'meta'])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: proj }, { data: sub }] = await Promise.all([
      supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
    ])

    setProjects(proj || [])
    setSubscription(sub)
    setLoading(false)
  }

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (platforms.length === 0) {
      toast.error('Select at least one platform')
      return
    }

    const limit = subscription?.plan === 'free' ? 3 : Infinity
    if (projects.length >= limit) {
      toast.error('Upgrade to Pro for unlimited projects')
      return
    }

    setCreating(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`

      // Create project
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user!.id,
          name: new URL(url).hostname.replace('www.', ''),
          website_url: url,
          business_goal: goal,
          monthly_budget: parseFloat(budget),
          target_country: country,
          platforms,
          status: 'analyzing',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Project created! Starting AI analysis...')

      // Trigger AI analysis in background
      fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      })

      router.push(`/projects/${project.id}`)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project and all its data?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
    toast.success('Project deleted')
  }

  const statusColor = (status: string) => ({
    completed: 'bg-green-50 text-green-600',
    analyzing: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    draft: 'bg-gray-50 text-gray-500',
  }[status] || 'bg-gray-50 text-gray-500')

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
            {subscription?.plan === 'free' && ` · ${projects.length}/3 free slots used`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Create project form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fade-in">
          <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-500" />
            Create New Project
          </h2>

          <form onSubmit={handleCreate} className="space-y-6">
            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="yourcompany.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Business Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Goal *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {GOALS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGoal(value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      goal === value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget (USD) *</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                  required
                  min="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Country *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advertising Platforms *</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => togglePlatform(value)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      platforms.includes(value)
                        ? color
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 transition-colors disabled:opacity-60"
              >
                {creating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                ) : (
                  <><Zap className="w-4 h-4" />Analyze & Generate</>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <FolderOpen className="w-10 h-10 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-700 mb-1">No projects yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create your first project to start generating campaigns.</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{project.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-3">
                  <span className="truncate">{project.website_url}</span>
                  <span>·</span>
                  <span>{project.platforms?.join(', ')}</span>
                  <span>·</span>
                  <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => router.push(`/projects/${project.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-brand-600 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                View <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

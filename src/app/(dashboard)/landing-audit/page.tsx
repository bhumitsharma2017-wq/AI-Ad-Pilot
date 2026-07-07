'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileSearch, Loader2, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project } from '@/types'
import LandingAuditCard from '@/components/analysis/LandingAuditCard'

export default function LandingAuditPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
    setProjects(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Landing Page Audit</h1>
        <p className="text-gray-500 mt-0.5">AI-powered CRO analysis with actionable recommendations</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Project</label>
        <select
          onChange={e => {
            const project = projects.find(p => p.id === e.target.value) || null
            setSelectedProject(project)
          }}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
        >
          <option value="">Choose a project to audit...</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name} — {p.website_url}</option>
          ))}
        </select>
      </div>

      {selectedProject ? (
        <LandingAuditCard
          audit={selectedProject.landing_audit}
          projectId={selectedProject.id}
          url={selectedProject.website_url}
        />
      ) : (
        <div className="flex flex-col items-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileSearch className="w-12 h-12 text-gray-200 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Select a project to audit</h3>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Our AI will analyze your landing page for conversion opportunities, trust signals, and CRO improvements.
          </p>
        </div>
      )}
    </div>
  )
}

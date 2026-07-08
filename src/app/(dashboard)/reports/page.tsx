'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Download, Loader2, BarChart3,
  Calendar, TrendingUp, Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { Project } from '@/types'
import { useUser } from '@/hooks'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'

const REPORT_TYPES = [
  { id: 'weekly', label: 'Weekly Report', icon: Calendar, desc: 'Performance snapshot for the week' },
  { id: 'monthly', label: 'Monthly Report', icon: BarChart3, desc: 'Full monthly campaign analysis' },
  { id: 'quarterly', label: 'Quarterly Review', icon: TrendingUp, desc: 'Strategic quarterly overview' },
  { id: 'client_presentation', label: 'Client Presentation', icon: Sparkles, desc: 'Polished deck for client meetings' },
]

export default function ReportsPage() {
  const { isPro, loading: userLoading } = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [reports, setReports] = useState<Record<string, unknown>[]>([])
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedType, setSelectedType] = useState('monthly')
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: proj }, { data: rep }] = await Promise.all([
      supabase.from('projects').select('*').eq('user_id', user.id).eq('status', 'completed'),
      supabase.from('reports').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setProjects(proj || [])
    setReports(rep || [])
    if (proj?.length) setSelectedProject(proj[0].id)
    setLoading(false)
  }, [supabase])

  useEffect(() => { void loadData() }, [loadData])

  const generateReport = async () => {
    if (!selectedProject) { toast.error('Select a project first'); return }
    setGenerating(true)
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: selectedProject, type: selectedType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Report generated!')
      await loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = async (reportId: string, format: 'pdf' | 'ppt') => {
    const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`)
    try {
      const res = await fetch(`/api/reports/export?id=${reportId}&format=${format}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report.${format === 'pdf' ? 'pdf' : 'pptx'}`
      a.click()
      toast.success('Downloaded!', { id: toastId })
    } catch {
      toast.error('Export failed', { id: toastId })
    }
  }

  // Plan gate: AI report generation is a Pro/Agency feature.
  if (!userLoading && !isPro) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-0.5">Generate client-ready reports and presentations</p>
        </div>
        <UpgradePrompt
          feature="Client Reports"
          requiredPlan="pro"
          description="Generate AI-written weekly, monthly, and quarterly reports with PDF and PowerPoint export. Available on the Pro plan and above."
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-0.5">Generate client-ready reports and presentations</p>
      </div>

      {/* Generate new report */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Generate New Report</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Project</label>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="">Choose a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {REPORT_TYPES.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                selectedType === id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1.5 ${selectedType === id ? 'text-brand-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-medium ${selectedType === id ? 'text-brand-700' : 'text-gray-900'}`}>
                {label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={generateReport}
          disabled={generating || !selectedProject}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium text-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Generating with AI...' : 'Generate Report'}
        </button>
      </div>

      {/* Reports list */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Generated Reports</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <FileText className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-medium text-gray-700 mb-1">No reports yet</h3>
            <p className="text-sm text-gray-400">Generate your first report above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <div key={report.id as string} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{report.title as string}</div>
                  <div className="text-xs text-gray-400 mt-0.5 capitalize">
                    {(report.type as string)?.replace('_', ' ')} ·{' '}
                    {new Date(report.created_at as string).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => downloadReport(report.id as string, 'pdf')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => downloadReport(report.id as string, 'ppt')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PPT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

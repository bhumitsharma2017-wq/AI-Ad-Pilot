import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  FolderOpen, Zap, TrendingUp, Clock,
  ArrowRight, Plus, BarChart3
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: projects },
    { data: profile },
    { data: subscription },
    { count: campaignCount },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user!.id).single(),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
  ])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const projectCount = projects?.length || 0
  const projectLimit = subscription?.plan === 'free' ? 3 : 'unlimited'

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your campaigns.
          </p>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          {
            label: 'Total Projects',
            value: projectCount,
            sub: projectLimit === 'unlimited' ? 'Unlimited' : `${projectCount}/${projectLimit} used`,
            icon: FolderOpen,
            color: 'brand',
          },
          {
            label: 'Campaigns Generated',
            value: campaignCount || 0,
            sub: 'All platforms',
            icon: Zap,
            color: 'indigo',
          },
          {
            label: 'Plan',
            value: subscription?.plan?.toUpperCase() || 'FREE',
            sub: subscription?.status === 'active' ? 'Active' : 'Inactive',
            icon: TrendingUp,
            color: 'violet',
          },
          {
            label: 'Member Since',
            value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
            sub: profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : '',
            icon: Clock,
            color: 'amber',
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Projects</h2>
          <Link href="/projects" className="flex items-center gap-1 text-sm text-brand-600 hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{project.name}</div>
                  <div className="text-sm text-gray-500 truncate">{project.website_url}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'completed' ? 'bg-green-50 text-green-600' :
                    project.status === 'analyzing' ? 'bg-amber-50 text-amber-600' :
                    project.status === 'error' ? 'bg-red-50 text-red-600' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {project.status}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <FolderOpen className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
              Create your first project and let AI generate a complete campaign blueprint.
            </p>
            <Link
              href="/projects"
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade banner for free users */}
      {subscription?.plan === 'free' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold mb-1">Unlock unlimited campaigns</div>
              <div className="text-brand-200 text-sm">
                Upgrade to Pro to get unlimited projects, competitor intelligence, and more.
              </div>
            </div>
            <Link
              href="/subscription"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Upgrade to Pro
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/projects', label: 'New Project', icon: Plus, desc: 'Start campaign planning' },
            { href: '/campaign-generator', label: 'Generate Campaign', icon: Zap, desc: 'Create ad campaigns' },
            { href: '/competitor-analysis', label: 'Analyze Competitors', icon: BarChart3, desc: 'Market intelligence' },
            { href: '/reports', label: 'Create Report', icon: TrendingUp, desc: 'Client-ready reports' },
          ].map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors">
                <Icon className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-sm font-medium text-gray-900">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

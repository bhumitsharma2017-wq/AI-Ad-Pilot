'use client'

import { Bell, Search, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'
import { useGenerationStore } from '@/store'
import { PLATFORM_META } from '@/lib/utils'

interface TopBarProps {
  profile: Profile | null
}

export default function TopBar({ profile: _profile }: TopBarProps) {
  const router = useRouter()
  const activeGenerations = useGenerationStore(s => s.activeGenerations)

  const inProgress = Object.entries(activeGenerations).filter(
    ([, gen]) => gen.status === 'generating'
  )

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-100 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 max-w-xs w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Background generation indicator — visible from any page */}
        {inProgress.length > 0 && (
          <button
            onClick={() => router.push(`/projects/${inProgress[0][1].projectId}`)}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generating {inProgress.length > 1
              ? `${inProgress.length} campaigns`
              : (PLATFORM_META[inProgress[0][1].platform]?.label || inProgress[0][1].platform)
            }...
          </button>
        )}

        <Link
          href="/projects"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Project
        </Link>
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
      </div>
    </div>
  )
}

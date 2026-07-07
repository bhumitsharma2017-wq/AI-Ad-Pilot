'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  LayoutDashboard, FolderOpen, Zap, Search, Palette,
  FileSearch, BarChart3, CreditCard, Settings,
  Sparkles, LogOut, ChevronRight, ChevronLeft, Crown, Users
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile, Subscription } from '@/types'
import { useAppStore } from '@/store'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/campaign-generator', label: 'Campaign Generator', icon: Zap },
  { href: '/competitor-analysis', label: 'Competitor Analysis', icon: Search },
  { href: '/creative-studio', label: 'Creative Studio', icon: Palette },
  { href: '/landing-audit', label: 'Landing Page Audit', icon: FileSearch },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

const BOTTOM_ITEMS = [
  { href: '/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  profile: Profile | null
  subscription: Subscription | null
}

export default function Sidebar({ profile, subscription }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { sidebarCollapsed, toggleSidebar, setProfile, setSubscription } = useAppStore()

  // Keep the global store in sync with server-fetched data so other
  // client components (e.g. TopBar, quick-action widgets) can read
  // profile/subscription without an extra fetch.
  useEffect(() => {
    setProfile(profile)
    setSubscription(subscription)
  }, [profile, subscription, setProfile, setSubscription])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const planBadgeColor = {
    free: 'bg-gray-100 text-gray-600',
    pro: 'bg-brand-50 text-brand-600',
    agency: 'bg-violet-50 text-violet-600',
    admin: 'bg-amber-50 text-amber-600',
  }[profile?.role || 'free']

  return (
    <div className={`${sidebarCollapsed ? 'w-[68px]' : 'w-64'} flex-shrink-0 flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-200`}>
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && <span className="font-bold text-gray-900 truncate">AdPilot AI</span>}
        </Link>
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="mx-auto mt-2 p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              className={`sidebar-item ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="flex-1">{label}</span>}
              {!sidebarCollapsed && isActive && <ChevronRight className="w-3 h-3 opacity-40" />}
            </Link>
          )
        })}

        {/* Admin link */}
        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            title={sidebarCollapsed ? 'Admin Panel' : undefined}
            className={`sidebar-item ${pathname.startsWith('/admin') ? 'active' : ''} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Crown className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </Link>
        )}

        {/* Agency team link */}
        {(profile?.role === 'agency' || profile?.role === 'admin') && (
          <Link
            href="/team"
            title={sidebarCollapsed ? 'Team Members' : undefined}
            className={`sidebar-item ${pathname === '/team' ? 'active' : ''} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Team Members</span>}
          </Link>
        )}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={sidebarCollapsed ? label : undefined}
            className={`sidebar-item ${pathname === href ? 'active' : ''} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 flex-shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'User'}
                </div>
                <div className={`text-xs px-1.5 py-0.5 rounded-full w-fit font-medium ${planBadgeColor} capitalize`}>
                  {subscription?.plan || 'free'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

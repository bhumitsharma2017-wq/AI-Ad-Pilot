'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, UserPlus, Trash2, Mail, Crown, Shield, Eye, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, EmptyState, Card } from '@/components/ui'

interface TeamMember {
  id: string
  member_id: string
  role: string
  invited_at: string
  accepted_at: string | null
  profiles: {
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

const ROLE_CONFIG = {
  admin: { label: 'Admin', icon: Crown, color: 'purple' as const },
  member: { label: 'Member', icon: Shield, color: 'info' as const },
  viewer: { label: 'Viewer', icon: Eye, color: 'default' as const },
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const loadTeam = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: subs }, { data: team }] = await Promise.all([
      supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
      supabase
        .from('team_members')
        .select('*, profiles:member_id(full_name, email, avatar_url)')
        .eq('owner_id', user.id),
    ])

    setIsPro(subs?.plan === 'agency')
    setMembers((team as TeamMember[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { void loadTeam() }, [loadTeam])

  const handleInvite = async () => {
    if (!inviteEmail) { toast.error('Enter an email address'); return }
    setInviting(true)
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      await loadTeam()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invite failed')
    } finally {
      setInviting(false)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('Remove this team member?')) return
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('team_members').delete()
      .eq('owner_id', user!.id)
      .eq('member_id', memberId)
    setMembers(prev => prev.filter(m => m.member_id !== memberId))
    toast.success('Member removed')
  }

  const updateRole = async (memberId: string, newRole: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('team_members')
      .update({ role: newRole })
      .eq('owner_id', user!.id)
      .eq('member_id', memberId)
    setMembers(prev => prev.map(m => m.member_id === memberId ? { ...m, role: newRole } : m))
    toast.success('Role updated')
  }

  if (!isPro) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <Card padding="lg">
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="Team Members — Agency Feature"
            description="Upgrade to the Agency plan to add team members, assign roles, and collaborate on client accounts."
            action={
              <a
                href="/subscription"
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors"
              >
                Upgrade to Agency
              </a>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-500 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''} · Agency plan</p>
      </div>

      {/* Invite form */}
      <Card padding="md">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-500" />
          Invite Team Member
        </h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              onKeyDown={e => e.key === 'Enter' && handleInvite()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={inviting}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Send Invite
          </button>
        </div>

        {/* Role legend */}
        <div className="flex gap-4 mt-3">
          {Object.entries(ROLE_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
              <config.icon className="w-3 h-3" />
              <strong>{config.label}:</strong>
              {key === 'admin' && ' Full access'}
              {key === 'member' && ' Can edit & generate'}
              {key === 'viewer' && ' Read-only access'}
            </div>
          ))}
        </div>
      </Card>

      {/* Members list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map(i => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border" />)}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="w-7 h-7" />}
            title="No team members yet"
            description="Invite your team to collaborate on projects and campaigns."
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {members.map(member => {
            const roleConfig = ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.member
            const RoleIcon = roleConfig.icon
            return (
              <Card key={member.id} padding="sm" className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600 flex-shrink-0">
                  {(member.profiles?.full_name || member.profiles?.email || 'U')[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{member.profiles?.full_name || '—'}</div>
                  <div className="text-xs text-gray-500">{member.profiles?.email}</div>
                </div>

                {/* Status */}
                <Badge variant={member.accepted_at ? 'success' : 'warning'} dot size="sm">
                  {member.accepted_at ? 'Active' : 'Pending'}
                </Badge>

                {/* Role selector */}
                <div className="flex items-center gap-1.5">
                  <RoleIcon className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={member.role}
                    onChange={e => updateRole(member.member_id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeMember(member.member_id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

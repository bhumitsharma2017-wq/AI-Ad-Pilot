import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, DollarSign, Zap, BarChart3, TrendingUp } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()

  // Check admin role
  const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch admin stats
  const [
    { count: userCount },
    { count: projectCount },
    { count: campaignCount },
    { data: recentUsers },
    { data: subscriptions },
    { data: usageLogs },
  ] = await Promise.all([
    adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    adminClient.from('projects').select('*', { count: 'exact', head: true }),
    adminClient.from('campaigns').select('*', { count: 'exact', head: true }),
    adminClient.from('profiles').select('*, subscriptions(plan, status)').order('created_at', { ascending: false }).limit(20),
    adminClient.from('subscriptions').select('plan').neq('plan', 'free'),
    adminClient.from('usage_logs').select('tokens_used').limit(1000),
  ])

  const totalTokens = usageLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0
  const proSubs = subscriptions?.filter(s => s.plan === 'pro').length || 0
  const agencySubs = subscriptions?.filter(s => s.plan === 'agency').length || 0
  const estimatedRevenue = proSubs * 2999 + agencySubs * 7999

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-0.5">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: userCount?.toLocaleString(), icon: Users, color: 'brand' },
          { label: 'Total Projects', value: projectCount?.toLocaleString(), icon: BarChart3, color: 'sky' },
          { label: 'Campaigns Generated', value: campaignCount?.toLocaleString(), icon: Zap, color: 'violet' },
          { label: 'Est. Monthly Revenue', value: `₹${estimatedRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Subscription breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
          <div className="space-y-3">
            {[
              { plan: 'Free', count: (userCount || 0) - proSubs - agencySubs, color: 'gray' },
              { plan: 'Pro', count: proSubs, color: 'brand', revenue: proSubs * 2999 },
              { plan: 'Agency', count: agencySubs, color: 'violet', revenue: agencySubs * 7999 },
            ].map(({ plan, count, color, revenue }) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 bg-${color}-50 text-${color}-600 text-xs rounded-full font-medium capitalize`}>
                    {plan}
                  </span>
                  <span className="text-sm text-gray-700">{count} users</span>
                </div>
                {revenue && (
                  <span className="text-sm text-green-600 font-medium">₹{revenue.toLocaleString()}/mo</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">API Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Tokens Used</span>
              <span className="font-medium text-gray-900">{totalTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Est. API Cost</span>
              <span className="font-medium text-gray-900">${((totalTokens / 1000) * 0.003).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg Tokens/User</span>
              <span className="font-medium text-gray-900">
                {userCount ? Math.round(totalTokens / userCount).toLocaleString() : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Plan', 'Role', 'Joined', 'Actions'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers?.map((user: Record<string, unknown>) => {
                const subs = user.subscriptions as Record<string, string>[] | null
                const plan = subs?.[0]?.plan || 'free'
                return (
                  <tr key={user.id as string} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                          {(user.full_name as string || user.email as string || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.full_name as string || '—'}</div>
                          <div className="text-xs text-gray-500">{user.email as string}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        plan === 'pro' ? 'bg-brand-50 text-brand-600' :
                        plan === 'agency' ? 'bg-violet-50 text-violet-600' :
                        'bg-gray-100 text-gray-500'
                      } capitalize`}>{plan}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{user.role as string}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.created_at as string).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-brand-600 hover:underline">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

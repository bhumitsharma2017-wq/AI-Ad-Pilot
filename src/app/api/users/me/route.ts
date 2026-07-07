import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/users/me
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createAdminClient()
  const [{ data: profile }, { data: subscription }, { data: usage }] = await Promise.all([
    adminClient.from('profiles').select('*').eq('id', user.id).single(),
    adminClient.from('subscriptions').select('*').eq('user_id', user.id).single(),
    adminClient.from('usage_logs')
      .select('tokens_used, action, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const totalTokens = usage?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0

  return NextResponse.json({
    profile,
    subscription,
    usage: {
      total_tokens: totalTokens,
      recent: usage?.slice(0, 10),
    },
  })
}

// PATCH /api/users/me — update profile
export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const allowed = ['full_name', 'company_name', 'phone', 'timezone']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

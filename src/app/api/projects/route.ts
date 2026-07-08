import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

// GET /api/projects — list user projects
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')
  const page = parseInt(searchParams.get('page') || '1')
  const offset = (page - 1) * limit

  const adminClient = createAdminClient()
  let query = adminClient
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data,
    count,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  })
}

// POST /api/projects — create project
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { website_url, business_goal, monthly_budget, target_country, platforms } = body

  if (!website_url || !business_goal || !monthly_budget) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Check plan limits
  const { data: sub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  if (sub?.plan === 'free') {
    const { count } = await adminClient
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count || 0) >= 3) {
      return NextResponse.json({
        error: 'Free plan limit reached (3 projects). Upgrade to Pro for unlimited projects.',
      }, { status: 403 })
    }
  }

  // Parse URL
  const url = website_url.startsWith('http') ? website_url : `https://${website_url}`
  let name = website_url
  try { name = new URL(url).hostname.replace('www.', '') } catch {}

  const { data: project, error } = await adminClient
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      website_url: url,
      business_goal,
      monthly_budget,
      target_country: target_country || 'India',
      platforms: platforms || ['google', 'meta'],
      status: 'analyzing',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log usage
  await adminClient.from('usage_logs').insert({
    user_id: user.id,
    action: 'project_created',
    metadata: { project_id: project.id },
  })

  return NextResponse.json({ success: true, project }, { status: 201 })
}

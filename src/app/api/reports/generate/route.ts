import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { generateReport } from '@/lib/ai/engine'

export async function POST(request: NextRequest) {
  try {
    const { project_id, type } = await request.json()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    // Check subscription for report access
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single()

    if (sub?.plan === 'free') {
      return NextResponse.json({ error: 'Upgrade to Pro to generate reports' }, { status: 403 })
    }

    const { data: project } = await adminClient
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const reportContent = await generateReport(
      type as 'weekly' | 'monthly' | 'quarterly',
      {
        project_name: project.name,
        website_url: project.website_url,
        business_goal: project.business_goal,
        monthly_budget: project.monthly_budget,
        platforms: project.platforms,
        business_analysis: project.business_analysis,
        competitor_analysis: project.competitor_analysis,
        campaign_strategy: project.campaign_strategy,
        forecasts: project.forecasts,
      }
    )

    const typeLabels: Record<string, string> = {
      weekly: 'Weekly Report',
      monthly: 'Monthly Report',
      quarterly: 'Quarterly Review',
      client_presentation: 'Client Presentation',
    }

    const { data: report } = await adminClient
      .from('reports')
      .insert({
        project_id,
        user_id: user.id,
        type,
        title: `${project.name} — ${typeLabels[type]} — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
        content: { text: reportContent, generated_at: new Date().toISOString() },
      })
      .select()
      .single()

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 })
  }
}

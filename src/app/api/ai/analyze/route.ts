import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import {
  analyzeWebsite,
  analyzeCompetitors,
  generateCampaignStrategy,
  generateForecasts,
  auditLandingPage,
} from '@/lib/ai/engine'

export async function POST(request: NextRequest) {
  try {
    const { project_id, regenerate } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    // Fetch project
    const { data: project, error: projectError } = await adminClient
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Run analysis pipeline
    let businessAnalysis = project.business_analysis
    let competitorAnalysis = project.competitor_analysis
    let campaignStrategy = project.campaign_strategy
    let forecasts = project.forecasts

    // Website analysis
    if (!businessAnalysis || regenerate === 'business') {
      businessAnalysis = await analyzeWebsite(project.website_url, project.business_goal)
    }

    // Competitor analysis
    if (!competitorAnalysis || regenerate === 'competitors') {
      competitorAnalysis = await analyzeCompetitors(businessAnalysis, project.target_country)
    }

    // Campaign strategy
    if (!campaignStrategy || regenerate === 'strategy') {
      campaignStrategy = await generateCampaignStrategy(
        businessAnalysis,
        competitorAnalysis,
        project.business_goal,
        project.monthly_budget,
        project.platforms,
        project.target_country
      )
    }

    // Forecasting
    if (!forecasts || regenerate === 'forecasts') {
      forecasts = await generateForecasts(
        businessAnalysis,
        campaignStrategy,
        project.monthly_budget,
        project.business_goal
      )
    }

    // Update project with all analysis results
    await adminClient
      .from('projects')
      .update({
        status: 'completed',
        business_analysis: businessAnalysis,
        competitor_analysis: competitorAnalysis,
        campaign_strategy: campaignStrategy,
        forecasts,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project_id)

    // Log usage
    await adminClient.from('usage_logs').insert({
      user_id: user.id,
      action: 'ai_analysis',
      metadata: { project_id, regenerate: regenerate || 'full' },
      tokens_used: 8000,
    })

    return NextResponse.json({ success: true, message: 'Analysis complete' })
  } catch (error) {
    console.error('AI Analysis error:', error)

    // Mark project as error
    const { project_id } = await new Request(request.clone()).json().catch(() => ({}))
    if (project_id) {
      const adminClient = createAdminClient()
      await adminClient
        .from('projects')
        .update({ status: 'error' })
        .eq('id', project_id)
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import {
  generateGoogleAdsCampaign,
  generateMetaAdsCampaign,
  generateLinkedInAdsCampaign,
  generateYouTubeAdsCampaign,
  generateEcommerceStrategy,
} from '@/lib/ai/engine'
import { generateDemandGenCampaign, generatePerformanceMaxCampaign } from '@/lib/ai/demandgen'
import type { Platform, GenerateCampaignInput } from '@/types'

type GeneratorFn = (input: GenerateCampaignInput) => Promise<Record<string, unknown>>

const GENERATORS: Partial<Record<Platform, GeneratorFn>> = {
  google: generateGoogleAdsCampaign,
  meta: generateMetaAdsCampaign,
  linkedin: generateLinkedInAdsCampaign,
  youtube: generateYouTubeAdsCampaign,
  shopping: generateEcommerceStrategy,
  demand_gen: generateDemandGenCampaign,
  performance_max: generatePerformanceMaxCampaign,
}

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Search',
  meta: 'Meta (Facebook/Instagram)',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  shopping: 'Google Shopping',
  demand_gen: 'Demand Gen',
  performance_max: 'Performance Max',
}

export async function POST(request: NextRequest) {
  try {
    const { project_id, platform } = await request.json()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()
    const { data: project } = await adminClient
      .from('projects').select('*').eq('id', project_id).single()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (!project.business_analysis)
      return NextResponse.json({ error: 'Run analysis first' }, { status: 400 })

    const { data: subscription } = await adminClient
      .from('subscriptions').select('plan').eq('user_id', user.id).single()

    const freePlatforms: Platform[] = ['google', 'meta']
    if (subscription?.plan === 'free' && platform && !freePlatforms.includes(platform as Platform)) {
      return NextResponse.json({ error: `${PLATFORM_LABELS[platform] || platform} requires Pro plan` }, { status: 403 })
    }

    const platformsToGenerate: Platform[] = platform ? [platform as Platform] : (project.platforms as Platform[])
    const input: GenerateCampaignInput = {
      project_id, platform: platformsToGenerate[0],
      business_analysis: project.business_analysis,
      competitor_analysis: project.competitor_analysis,
      campaign_strategy: project.campaign_strategy,
      monthly_budget: project.monthly_budget,
    }

    const results = []
    for (const p of platformsToGenerate) {
      const generator = GENERATORS[p]
      if (!generator) continue
      const generated = await generator({ ...input, platform: p })
      const campaignName = `${project.business_analysis.company_name} — ${PLATFORM_LABELS[p] || p}`
      const objective = (generated.structure as Record<string, unknown>)?.campaign_objective as string || 'Conversions'
      const { data: campaign } = await adminClient
        .from('campaigns')
        .upsert({ project_id, user_id: user.id, platform: p, name: campaignName, objective,
          status: 'ready', structure: generated.structure || null, settings: generated.settings || null,
          ad_copy: generated.ad_copy || null, keywords: generated.keywords || null,
          audiences: generated.audiences || null, creatives: generated.creatives || null,
        }, { onConflict: 'project_id, platform' })
        .select().single()
      results.push(campaign)
    }

    await adminClient.from('usage_logs').insert({
      user_id: user.id, action: 'campaign_generated',
      metadata: { project_id, platforms: platformsToGenerate },
      tokens_used: 4000 * platformsToGenerate.length,
    })

    return NextResponse.json({ success: true, campaigns: results })
  } catch (error) {
    console.error('Campaign generation error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Generation failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { googleAdsCampaignToCSV, metaAdsCampaignToCSV, arrayToCSV } from '@/lib/export'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const campaignId = searchParams.get('id')

  if (!campaignId) return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createAdminClient()
  const { data: campaign } = await adminClient
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('user_id', user.id)
    .single()

  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  let csv = ''
  const platform = campaign.platform as string

  switch (platform) {
    case 'google':
      csv = googleAdsCampaignToCSV(campaign)
      break
    case 'meta':
      csv = metaAdsCampaignToCSV(campaign)
      break
    case 'linkedin':
      csv = generateLinkedInCSV(campaign)
      break
    case 'youtube':
      csv = generateYouTubeCSV(campaign)
      break
    case 'shopping':
    case 'performance_max':
      csv = generateEcommerceCSV(campaign)
      break
    case 'demand_gen':
      csv = generateDemandGenCSV(campaign)
      break
    default:
      csv = arrayToCSV([
        ['Campaign Export — AdPilot AI'],
        ['Name', String(campaign.name)],
        ['Platform', platform],
        ['Objective', String(campaign.objective || '')],
        ['Status', String(campaign.status)],
      ])
  }

  await adminClient.from('usage_logs').insert({
    user_id: user.id,
    action: 'campaign_exported',
    metadata: { campaign_id: campaignId, platform },
  })

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${campaign.name.replace(/[^\w\s]/g, '').replace(/\s+/g, '_')}_${platform}.csv"`,
    },
  })
}

function generateLinkedInCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const audiences = campaign.audiences as Record<string, unknown> || {}
  const creatives = campaign.creatives as Record<string, unknown> || {}
  const structure = campaign.structure as Record<string, unknown> || {}
  const linkedin = audiences.linkedin_targeting as Record<string, string[]> || {}

  rows.push(['AdPilot AI — LinkedIn Ads Campaign Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])
  rows.push(['=== CAMPAIGN SETTINGS ==='])
  rows.push(['Campaign Name', String(structure.campaign_name || campaign.name || '')])
  rows.push(['Objective', String(structure.campaign_objective || '')])
  rows.push(['Bid Strategy', String(structure.bid_strategy || '')])
  rows.push(['Daily Budget ($)', String(structure.daily_budget || '')])
  rows.push([])

  rows.push(['=== B2B TARGETING ==='])
  if (linkedin.industries?.length) {
    rows.push(['Industries'])
    linkedin.industries.forEach(i => rows.push(['', i]))
    rows.push([])
  }
  if (linkedin.job_titles?.length) {
    rows.push(['Job Titles'])
    linkedin.job_titles.forEach(j => rows.push(['', j]))
    rows.push([])
  }
  if (linkedin.company_sizes?.length) {
    rows.push(['Company Sizes'])
    linkedin.company_sizes.forEach(s => rows.push(['', s]))
    rows.push([])
  }
  if (linkedin.seniority?.length) {
    rows.push(['Seniority Levels'])
    linkedin.seniority.forEach(s => rows.push(['', s]))
    rows.push([])
  }

  rows.push(['=== AD COPY ==='])
  rows.push(['#', 'Headline'])
  ;((adCopy.headlines as string[]) || []).forEach((h, i) => rows.push([String(i + 1), h]))
  rows.push([])
  rows.push(['#', 'Description'])
  ;((adCopy.descriptions as string[]) || []).forEach((d, i) => rows.push([String(i + 1), d]))
  rows.push([])

  rows.push(['=== LEAD GEN FORM FIELDS ==='])
  ;((creatives.lead_gen_form_fields as string[]) || []).forEach(f => rows.push([f]))
  rows.push([])

  rows.push(['=== CREATIVE ANGLES ==='])
  ;((creatives.creative_angles as string[]) || []).forEach((a, i) => rows.push([String(i + 1), a]))

  return arrayToCSV(rows)
}

function generateYouTubeCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const creatives = campaign.creatives as Record<string, unknown> || {}
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const scripts = creatives.video_scripts as Record<string, unknown>[] || []

  rows.push(['AdPilot AI — YouTube Ads Campaign Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])

  scripts.forEach((script, i) => {
    rows.push([`=== ${script.duration}s VIDEO SCRIPT (Script ${i + 1}) ===`])
    rows.push(['Hook (First 3s)', String(script.hook || '')])
    rows.push([])
    rows.push(['Full Voiceover Script'])
    rows.push([String(script.voiceover || '')])
    rows.push([])
    rows.push(['CTA', String(script.cta || '')])
    rows.push(['Production Notes', String(script.storyboard_notes || '')])
    rows.push([])

    const scenes = script.scenes as Record<string, unknown>[] || []
    if (scenes.length) {
      rows.push(['Scene #', 'Duration (s)', 'Visual', 'Audio / Voiceover', 'Text Overlay'])
      scenes.forEach(scene => {
        rows.push([
          String(scene.scene_number || ''),
          String(scene.duration_seconds || ''),
          String(scene.visual || ''),
          String(scene.audio || ''),
          String(scene.text_overlay || ''),
        ])
      })
    }
    rows.push([])
  })

  if ((adCopy.headlines as string[])?.length) {
    rows.push(['=== COMPANION BANNER HEADLINES ==='])
    ;(adCopy.headlines as string[]).forEach((h, i) => rows.push([String(i + 1), h]))
  }

  return arrayToCSV(rows)
}

function generateEcommerceCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const structure = campaign.structure as Record<string, unknown> || {}
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const perfMax = structure.performance_max_structure as Record<string, unknown> || {}

  rows.push(['AdPilot AI — Google Shopping / Performance Max Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])

  rows.push(['=== CAMPAIGN SETTINGS ==='])
  rows.push(['Campaign Name', String(structure.campaign_name || campaign.name || '')])
  rows.push(['Bid Strategy', String(structure.bid_strategy || '')])
  rows.push(['Daily Budget ($)', String(structure.daily_budget || '')])
  rows.push([])

  rows.push(['=== SHOPPING STRATEGY ==='])
  rows.push([String(structure.google_shopping_strategy || '')])
  rows.push([])

  rows.push(['=== ROAS STRATEGY ==='])
  rows.push([String(structure.roas_strategy || '')])
  rows.push([])

  if (perfMax.asset_groups) {
    rows.push(['=== ASSET GROUPS ==='])
    ;(perfMax.asset_groups as string[]).forEach(ag => rows.push([ag]))
    rows.push([])
  }

  if (perfMax.audience_signals) {
    rows.push(['=== AUDIENCE SIGNALS ==='])
    ;(perfMax.audience_signals as string[]).forEach(sig => rows.push([sig]))
    rows.push([])
  }

  if ((structure.audience_segments as string[])?.length) {
    rows.push(['=== AUDIENCE SEGMENTS ==='])
    ;(structure.audience_segments as string[]).forEach(seg => rows.push([seg]))
    rows.push([])
  }

  rows.push(['=== AD HEADLINES ==='])
  ;((adCopy.headlines as string[]) || []).forEach((h, i) => rows.push([String(i + 1), h]))
  rows.push([])

  if ((structure.product_feed_suggestions as string[])?.length) {
    rows.push(['=== PRODUCT FEED SUGGESTIONS ==='])
    ;(structure.product_feed_suggestions as string[]).forEach((s, i) => rows.push([String(i + 1), s]))
    rows.push([])
  }

  if ((structure.cross_sell_opportunities as string[])?.length) {
    rows.push(['=== CROSS-SELL OPPORTUNITIES ==='])
    ;(structure.cross_sell_opportunities as string[]).forEach((o, i) => rows.push([String(i + 1), o]))
    rows.push([])
  }

  if ((structure.upsell_opportunities as string[])?.length) {
    rows.push(['=== UPSELL OPPORTUNITIES ==='])
    ;(structure.upsell_opportunities as string[]).forEach((o, i) => rows.push([String(i + 1), o]))
  }

  return arrayToCSV(rows)
}

function generateDemandGenCSV(campaign: Record<string, unknown>): string {
  const rows: string[][] = []
  const adCopy = campaign.ad_copy as Record<string, unknown> || {}
  const creatives = campaign.creatives as Record<string, unknown> || {}
  const audiences = campaign.audiences as Record<string, unknown> || {}

  rows.push(['AdPilot AI — Demand Gen Campaign Export'])
  rows.push(['Generated:', new Date().toLocaleString()])
  rows.push([])

  rows.push(['=== SHORT HEADLINES (max 30 chars) ==='])
  rows.push(['#', 'Headline', 'Characters'])
  ;((adCopy.headlines as string[]) || []).forEach((h, i) => rows.push([String(i + 1), h, String(h.length)]))
  rows.push([])

  rows.push(['=== LONG HEADLINES (max 90 chars) ==='])
  rows.push(['#', 'Headline', 'Characters'])
  ;((adCopy.long_headlines as string[]) || (adCopy.headlines as string[]) || []).forEach((h, i) => rows.push([String(i + 1), h, String(h.length)]))
  rows.push([])

  rows.push(['=== DESCRIPTIONS (max 90 chars) ==='])
  ;((adCopy.descriptions as string[]) || []).forEach((d, i) => rows.push([String(i + 1), d, String(d.length)]))
  rows.push([])

  rows.push(['=== IMAGE CONCEPTS ==='])
  rows.push(['Format', 'Headline', 'Body Text', 'CTA', 'Concept', 'Colors'])
  ;((creatives.image_concepts as Record<string, unknown>[]) || []).forEach(c => {
    rows.push([
      String(c.format || ''),
      String(c.headline || ''),
      String(c.body_text || ''),
      String(c.cta || ''),
      String(c.concept || ''),
      ((c.color_scheme as string[]) || []).join('; '),
    ])
  })
  rows.push([])

  rows.push(['=== INTEREST TARGETING ==='])
  ;((audiences.interest_targeting as string[]) || []).forEach(i => rows.push([i]))
  rows.push([])

  rows.push(['=== CREATIVE ANGLES ==='])
  ;((creatives.creative_angles as string[]) || []).forEach((a, i) => rows.push([String(i + 1), a]))

  return arrayToCSV(rows)
}

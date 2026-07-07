/**
 * AdPilot AI — Database Seed Script
 *
 * Populates a test user with sample projects, campaigns, and analysis data
 * for local development without burning AI API credits.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SEED_EMAIL = 'demo@adpilot.ai'
const SEED_PASSWORD = 'DemoPassword123!'

const SAMPLE_BUSINESS_ANALYSIS = {
  company_name: 'CloudStack SaaS',
  business_category: 'B2B SaaS — Project Management',
  products: ['CloudStack Pro', 'CloudStack Teams', 'CloudStack Enterprise'],
  services: ['Onboarding Support', 'Custom Integrations', '24/7 Support'],
  features: ['Kanban Boards', 'Time Tracking', 'Team Analytics', 'API Access', 'SSO Login'],
  pricing: 'Tiered SaaS — $12/user/mo (Pro), $24/user/mo (Teams), Custom (Enterprise)',
  usp: [
    'Fastest setup in the industry — live in under 5 minutes',
    'Native integrations with 50+ tools',
    'Unlimited projects on every plan',
    'AI-powered task prioritization',
  ],
  target_audience: 'Mid-market companies (50-500 employees) with distributed teams needing project visibility',
  geographic_markets: ['United States', 'United Kingdom', 'India', 'Australia'],
  pain_points: [
    'Teams losing track of priorities across multiple tools',
    'Manual status update meetings wasting hours weekly',
    'Lack of visibility into team workload and capacity',
    'Disconnected tools causing data silos',
  ],
  objections: [
    'We already use [Competitor] and switching is painful',
    'Will my team actually adopt another tool?',
    'Is this worth the cost for a team our size?',
  ],
  summary: 'CloudStack is a project management SaaS built for distributed teams who need clarity without complexity. Unlike legacy tools, CloudStack focuses on fast onboarding and deep integrations rather than feature bloat, helping mid-market teams move from chaotic spreadsheets to coordinated execution in under a week.',
  analyzed_at: new Date().toISOString(),
}

const SAMPLE_COMPETITOR_ANALYSIS = {
  competitors: [
    {
      name: 'Asana',
      website: 'asana.com',
      positioning: 'Enterprise-grade work management for any team',
      messaging: 'Goals, projects, and tasks, all in one place',
      offer: 'Free tier + tiered enterprise pricing',
      strengths: ['Strong brand recognition', 'Robust automation', 'Extensive template library'],
      weaknesses: ['Steep learning curve', 'Expensive at scale', 'Feature overload for small teams'],
      ad_channels: ['Google Ads', 'LinkedIn Ads', 'YouTube'],
    },
    {
      name: 'Monday.com',
      website: 'monday.com',
      positioning: 'Work OS for teams of all sizes',
      messaging: 'One platform to run your team\'s entire workflow',
      offer: 'Free trial, per-seat pricing',
      strengths: ['Highly visual interface', 'Heavy marketing spend', 'Broad use-case flexibility'],
      weaknesses: ['Pricing complexity', 'Can feel overwhelming', 'Mobile app lags behind desktop'],
      ad_channels: ['Google Ads', 'Meta Ads', 'TV/CTV'],
    },
    {
      name: 'ClickUp',
      website: 'clickup.com',
      positioning: 'One app to replace them all',
      messaging: 'Save one day every week',
      offer: 'Generous free tier',
      strengths: ['Aggressive feature shipping', 'Strong free tier', 'Active community'],
      weaknesses: ['UI complexity', 'Performance issues at scale', 'Support response times'],
      ad_channels: ['Google Ads', 'Meta Ads', 'Podcast sponsorships'],
    },
  ],
  market_positioning: 'CloudStack should position against the "too complex" narrative — leading with speed-to-value and simplicity rather than competing on feature count. The fastest-setup angle is genuinely defensible against all three competitors.',
  gap_analysis: [
    'None of the top 3 lead with "5-minute setup" as a primary message — this is open territory',
    'Mid-market companies (50-500 employees) are underserved; competitors target either very small teams or large enterprise',
    'Onboarding friction is a common complaint across all competitor reviews',
  ],
  opportunities: [
    'Own the "fast setup" positioning with comparison landing pages',
    'Target switcher keywords (e.g. "Asana alternative") with dedicated migration messaging',
    'Build content around "time to value" as a category-defining metric',
  ],
  analyzed_at: new Date().toISOString(),
}

const SAMPLE_CAMPAIGN_STRATEGY = {
  recommended_channels: [
    { platform: 'Google Search', percentage: 40, budget: 2000, rationale: 'Capture high-intent switcher and comparison searches' },
    { platform: 'Meta Lead Generation', percentage: 30, budget: 1500, rationale: 'Build awareness with mid-market decision makers via interest targeting' },
    { platform: 'LinkedIn Ads', percentage: 20, budget: 1000, rationale: 'Precise B2B job-title targeting for economic buyers' },
    { platform: 'Remarketing', percentage: 10, budget: 500, rationale: 'Re-engage site visitors who didn\'t convert' },
  ],
  funnel_strategy: {
    awareness: ['LinkedIn thought leadership content', 'YouTube comparison videos', 'Meta interest-based prospecting'],
    consideration: ['Google comparison keyword campaigns', 'Case study retargeting', 'Free trial CTAs'],
    conversion: ['Branded search campaigns', 'Cart/signup abandonment remarketing', 'Demo request landing pages'],
  },
  audience_strategy: 'Primary targeting on Operations Managers, Project Managers, and IT Directors at companies with 50-500 employees. Secondary layer of in-market "project management software" signals combined with competitor app usage data where available.',
  key_messages: [
    'Live in 5 minutes, not 5 weeks — the fastest PM tool setup in the industry',
    'Stop drowning in tools. CloudStack connects to the 50+ apps your team already uses',
    'Built for teams of 50-500 who need clarity, not complexity',
  ],
  timeline: 'Weeks 1-2: Launch Search + Meta prospecting to establish baseline data. Weeks 3-4: Layer in LinkedIn + remarketing once pixel data matures. Week 5+: Optimize budget allocation based on CPL performance by channel.',
  generated_at: new Date().toISOString(),
}

const SAMPLE_FORECASTS = {
  estimated_cpc: 4.85,
  estimated_ctr: 3.4,
  estimated_clicks: 1030,
  estimated_leads: 72,
  estimated_cpl: 69.4,
  estimated_revenue: 21600,
  estimated_roas: 4.3,
  confidence_score: 72,
  assumptions: [
    'Based on B2B SaaS industry average CTR of 3-4% for search campaigns',
    'Assumes a 7% landing page to lead conversion rate',
    'CPL benchmarked against mid-market project management software category',
    'Revenue assumes $300 average first-year contract value per converted lead',
  ],
  generated_at: new Date().toISOString(),
}

async function seed() {
  console.log('🌱 Seeding AdPilot AI database...\n')

  // 1. Create or get demo user
  console.log('1️⃣  Creating demo user...')
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  let userId = existingUsers?.users.find(u => u.email === SEED_EMAIL)?.id

  if (!userId) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: 'Demo User' },
    })
    if (authError) throw authError
    userId = authData.user.id
    console.log(`   ✓ Created user: ${SEED_EMAIL} / ${SEED_PASSWORD}`)
  } else {
    console.log(`   ✓ User already exists: ${SEED_EMAIL}`)
  }

  // 2. Update profile + give Pro plan for full feature access in dev
  console.log('2️⃣  Setting up profile & Pro subscription...')
  await supabase.from('profiles').update({
    full_name: 'Demo User',
    company_name: 'CloudStack Inc.',
    role: 'pro',
    onboarding_completed: true,
  }).eq('id', userId)

  await supabase.from('subscriptions').upsert({
    user_id: userId,
    plan: 'pro',
    status: 'active',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'user_id' })
  console.log('   ✓ Profile + Pro subscription set')

  // 3. Create sample project with full analysis
  console.log('3️⃣  Creating sample project with AI analysis...')
  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('user_id', userId)
    .eq('website_url', 'https://cloudstack.example.com')
    .single()

  let projectId = existingProject?.id

  if (!projectId) {
    const { data: project, error } = await supabase.from('projects').insert({
      user_id: userId,
      name: 'cloudstack.example.com',
      website_url: 'https://cloudstack.example.com',
      business_goal: 'lead_generation',
      monthly_budget: 5000,
      target_country: 'United States',
      platforms: ['google', 'meta', 'linkedin'],
      status: 'completed',
      business_analysis: SAMPLE_BUSINESS_ANALYSIS,
      competitor_analysis: SAMPLE_COMPETITOR_ANALYSIS,
      campaign_strategy: SAMPLE_CAMPAIGN_STRATEGY,
      forecasts: SAMPLE_FORECASTS,
    }).select().single()

    if (error) throw error
    projectId = project.id
    console.log(`   ✓ Created project: ${projectId}`)
  } else {
    console.log(`   ✓ Project already exists: ${projectId}`)
  }

  // 4. Create a sample Google Ads campaign
  console.log('4️⃣  Creating sample Google Ads campaign...')
  await supabase.from('campaigns').upsert({
    project_id: projectId,
    user_id: userId,
    platform: 'google',
    name: 'CloudStack SaaS — Google Search',
    objective: 'Lead Generation',
    status: 'ready',
    structure: {
      campaign_name: 'CloudStack — Search — Lead Gen',
      campaign_objective: 'Lead Generation',
      bid_strategy: 'Target CPA',
      daily_budget: 65,
    },
    settings: {
      location_targeting: ['United States'],
      language_targeting: ['English'],
      ad_schedule: { monday: '8:00-20:00', tuesday: '8:00-20:00' },
      device_strategy: 'All devices, +20% bid adjustment on desktop',
    },
    ad_copy: {
      headlines: [
        'Project Mgmt, Set Up in 5 Min',
        'Stop Drowning in Tools',
        'CloudStack: PM Software',
        'Free 14-Day Trial Today',
        'Built for Teams of 50-500',
        'Connect 50+ Apps Instantly',
        'The Fast Asana Alternative',
        'Clarity Without Complexity',
        'No Credit Card Required',
        'Loved by 2,000+ Teams',
        'Try CloudStack Free Today',
        'PM Software That Just Works',
        'Cut Status Meetings in Half',
        'See Team Capacity Instantly',
        'Switch From Asana in 1 Day',
      ],
      descriptions: [
        'CloudStack connects to the tools your team already uses. Live in 5 minutes. Start your free trial today.',
        'Stop losing track of priorities across scattered tools. CloudStack gives your team one source of truth.',
        'Built for mid-market teams who need visibility without the complexity. No credit card required.',
        'Join 2,000+ teams who switched to CloudStack for faster setup and better adoption. Try free for 14 days.',
      ],
      sitelinks: [
        { title: 'Free Trial', description1: 'Start in 5 minutes', description2: 'No credit card needed', url: '/trial' },
        { title: 'Pricing', description1: 'Plans from $12/user', description2: 'Transparent pricing', url: '/pricing' },
        { title: 'Asana Alternative', description1: 'See the comparison', description2: 'Switch in one day', url: '/vs/asana' },
        { title: 'Customer Stories', description1: '2,000+ happy teams', description2: 'Read case studies', url: '/customers' },
      ],
      callouts: ['Free 14-Day Trial', 'No Credit Card Required', '50+ Integrations', '24/7 Support'],
      structured_snippets: [
        { header: 'Features', values: ['Kanban Boards', 'Time Tracking', 'Team Analytics', 'API Access'] },
      ],
    },
    keywords: {
      broad: ['project management software', 'team task management', 'work management tool', 'project tracking software'],
      phrase: ['project management for teams', 'asana alternative', 'best project management tool', 'team collaboration software'],
      exact: ['project management saas', 'cloudstack project management'],
      negative: ['free project management', 'open source', 'personal project management', 'student project management'],
      audience_signals: ['In-market: Business Software', 'In-market: Project Management Tools'],
    },
  }, { onConflict: 'project_id, platform' })
  console.log('   ✓ Google Ads campaign created')

  console.log('\n✅ Seed complete!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Demo login credentials:')
  console.log(`  Email:    ${SEED_EMAIL}`)
  console.log(`  Password: ${SEED_PASSWORD}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

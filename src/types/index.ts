// ============================================================
// AdPilot AI - Core Types
// ============================================================

export type UserRole = 'free' | 'pro' | 'agency' | 'admin'
export type SubscriptionPlan = 'free' | 'pro' | 'agency'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trialing'
export type Platform = 'google' | 'meta' | 'linkedin' | 'youtube' | 'demand_gen' | 'shopping' | 'performance_max'
export type BusinessGoal = 'lead_generation' | 'ecommerce_sales' | 'app_installs' | 'brand_awareness' | 'website_traffic'
export type ProjectStatus = 'draft' | 'analyzing' | 'completed' | 'error'
export type CampaignStatus = 'draft' | 'generating' | 'ready' | 'exported'

// ============================================================
// DATABASE MODELS
// ============================================================

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  company_name: string | null
  phone: string | null
  timezone: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  razorpay_subscription_id: string | null
  razorpay_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  website_url: string
  business_goal: BusinessGoal
  monthly_budget: number
  target_country: string
  platforms: Platform[]
  status: ProjectStatus
  business_analysis: BusinessAnalysis | null
  competitor_analysis: CompetitorAnalysis | null
  campaign_strategy: CampaignStrategy | null
  forecasts: Forecasts | null
  landing_audit: LandingAudit | null
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  project_id: string
  user_id: string
  platform: Platform
  name: string
  objective: string | null
  status: CampaignStatus
  structure: CampaignStructure | null
  settings: CampaignSettings | null
  ad_copy: AdCopy | null
  keywords: Keywords | null
  audiences: Audiences | null
  creatives: Creatives | null
  exported_at: string | null
  created_at: string
  updated_at: string
}

export interface CreativeAsset {
  id: string
  project_id: string
  user_id: string
  type: 'image' | 'copy' | 'video_script' | 'storyboard'
  platform: string | null
  format: string | null
  title: string | null
  content: Record<string, unknown>
  storage_path: string | null
  public_url: string | null
  created_at: string
}

// ============================================================
// AI ANALYSIS TYPES
// ============================================================

export interface BusinessAnalysis {
  company_name: string
  business_category: string
  products: string[]
  services: string[]
  features: string[]
  pricing: string
  usp: string[]
  target_audience: string
  geographic_markets: string[]
  pain_points: string[]
  objections: string[]
  summary: string
  analyzed_at: string
}

export interface Competitor {
  name: string
  website: string
  positioning: string
  messaging: string
  offer: string
  strengths: string[]
  weaknesses: string[]
  ad_channels: string[]
}

export interface CompetitorAnalysis {
  competitors: Competitor[]
  market_positioning: string
  gap_analysis: string[]
  opportunities: string[]
  analyzed_at: string
}

export interface ChannelAllocation {
  platform: string
  percentage: number
  budget: number
  rationale: string
}

export interface CampaignStrategy {
  recommended_channels: ChannelAllocation[]
  funnel_strategy: {
    awareness: string[]
    consideration: string[]
    conversion: string[]
  }
  audience_strategy: string
  key_messages: string[]
  timeline: string
  generated_at: string
}

// ============================================================
// CAMPAIGN STRUCTURE TYPES
// ============================================================

export interface AdGroup {
  name: string
  keywords: string[]
  match_types: string[]
  bids: Record<string, number>
  headlines: string[]
  descriptions: string[]
}

export interface CampaignStructure {
  campaign_name: string
  campaign_objective: string
  bid_strategy: string
  daily_budget: number
  ad_groups?: AdGroup[]
  ad_sets?: MetaAdSet[]
  // Platform-specific fields
  [key: string]: unknown
}

export interface CampaignSettings {
  location_targeting: string[]
  language_targeting: string[]
  ad_schedule: Record<string, string>
  device_strategy: string
  start_date?: string
  end_date?: string
}

export interface AdCopy {
  headlines: string[]          // Google: up to 15
  descriptions: string[]      // Google: up to 4
  primary_texts?: string[]    // Meta
  sitelinks?: Sitelink[]
  callouts?: string[]
  structured_snippets?: StructuredSnippet[]
  cta_options?: string[]
}

export interface Sitelink {
  title: string
  description1: string
  description2: string
  url: string
}

export interface StructuredSnippet {
  header: string
  values: string[]
}

export interface Keywords {
  broad: string[]
  phrase: string[]
  exact: string[]
  negative: string[]
  audience_signals?: string[]
}

export interface MetaAdSet {
  name: string
  objective: string
  interests: string[]
  lookalike_audiences: string[]
  remarketing_audiences: string[]
  age_min: number
  age_max: number
  gender: string
  placements: string[]
}

export interface Audiences {
  interest_targeting?: string[]
  lookalike?: string[]
  remarketing?: string[]
  custom_audiences?: string[]
  linkedin_targeting?: LinkedInTargeting
}

export interface LinkedInTargeting {
  industries: string[]
  job_titles: string[]
  company_sizes: string[]
  seniority: string[]
}

export interface Creatives {
  image_concepts?: ImageConcept[]
  video_scripts?: VideoScript[]
  creative_angles?: string[]
}

export interface ImageConcept {
  format: '1:1' | '4:5' | '1.91:1' | '16:9'
  concept: string
  headline: string
  body_text: string
  cta: string
  color_scheme: string[]
}

export interface VideoScript {
  duration: 15 | 30 | 60
  hook: string
  scenes: SceneBreakdown[]
  voiceover: string
  cta: string
  storyboard_notes: string
}

export interface SceneBreakdown {
  scene_number: number
  duration_seconds: number
  visual: string
  audio: string
  text_overlay: string
}

// ============================================================
// FORECASTING
// ============================================================

export interface Forecasts {
  estimated_cpc: number
  estimated_ctr: number
  estimated_clicks: number
  estimated_leads: number
  estimated_cpl: number
  estimated_revenue: number
  estimated_roas: number
  confidence_score: number  // 0-100
  assumptions: string[]
  generated_at: string
}

// ============================================================
// LANDING PAGE AUDIT
// ============================================================

export interface LandingAudit {
  trust_score: number         // 0-100
  conversion_score: number    // 0-100
  mobile_score: number        // 0-100
  page_speed_suggestions: string[]
  cro_suggestions: string[]
  cta_improvements: string[]
  form_improvements: string[]
  testimonial_suggestions: string[]
  trust_badge_suggestions: string[]
  overall_recommendations: string[]
  audited_at: string
}

// ============================================================
// SUBSCRIPTION PLANS CONFIG
// ============================================================
// Single source of truth for plan pricing/features, consumed by the
// subscription page UI. Razorpay plan IDs are intentionally NOT stored
// here — they're resolved server-side only, in src/lib/razorpay/client.ts
// (RAZORPAY_PLANS), since that file reads server-only env vars that
// would otherwise be undefined if read from this client-importable module.

export interface PlanFeatures {
  name: string
  price_monthly: number
  price_yearly: number
  currency: string
  projects_limit: number | 'unlimited'
  team_members: number | 'unlimited'
  features: string[]
}

export const PLAN_CONFIG: Record<SubscriptionPlan, PlanFeatures> = {
  free: {
    name: 'Free',
    price_monthly: 0,
    price_yearly: 0,
    currency: 'INR',
    projects_limit: 3,
    team_members: 1,
    features: [
      '3 Projects',
      'Basic Campaign Generation',
      'Google & Meta Ads',
      'CSV Export',
      'Community Support',
    ],
  },
  pro: {
    name: 'Pro',
    price_monthly: 2999,
    price_yearly: 29999,
    currency: 'INR',
    projects_limit: 'unlimited',
    team_members: 3,
    features: [
      'Unlimited Projects',
      'All Campaign Types',
      'Competitor Intelligence',
      'Creative Studio',
      'Landing Page Audit',
      'Forecasting Module',
      'PDF & PPT Reports',
      'Priority Support',
    ],
  },
  agency: {
    name: 'Agency',
    price_monthly: 7999,
    price_yearly: 79999,
    currency: 'INR',
    projects_limit: 'unlimited',
    team_members: 'unlimited',
    features: [
      'Everything in Pro',
      'Unlimited Team Members',
      'White Label Reports',
      'Multiple Client Accounts',
      'API Access',
      'Custom Branding',
      'Dedicated Account Manager',
    ],
  },
}

// ============================================================
// API TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

export interface CreateProjectInput {
  website_url: string
  business_goal: BusinessGoal
  monthly_budget: number
  target_country: string
  platforms: Platform[]
}

export interface GenerateCampaignInput {
  project_id: string
  platform: Platform
  business_analysis: BusinessAnalysis
  competitor_analysis?: CompetitorAnalysis
  campaign_strategy?: CampaignStrategy
  monthly_budget: number
}

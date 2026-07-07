import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import type {
  BusinessAnalysis,
  CompetitorAnalysis,
  CampaignStrategy,
  Forecasts,
  LandingAudit,
  BusinessGoal,
  Platform,
  GenerateCampaignInput,
} from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ============================================================
// WEBSITE ANALYSIS
// ============================================================
export async function analyzeWebsite(url: string, goal: BusinessGoal): Promise<BusinessAnalysis> {
  const websiteContent = await crawlWebsite(url)

  const prompt = `You are an expert digital marketing analyst. Analyze this website and extract detailed business intelligence.

Website URL: ${url}
Business Goal: ${goal}
Website Content:
${websiteContent}

Extract and return a JSON object with EXACTLY this structure:
{
  "company_name": "string",
  "business_category": "string (e.g. SaaS, E-commerce, Professional Services)",
  "products": ["array of product names"],
  "services": ["array of service names"],
  "features": ["array of key features/capabilities"],
  "pricing": "string describing pricing model",
  "usp": ["array of 3-5 unique selling propositions"],
  "target_audience": "string describing ideal customer",
  "geographic_markets": ["array of target markets"],
  "pain_points": ["array of customer pain points this business solves"],
  "objections": ["array of common objections customers might have"],
  "summary": "2-3 paragraph marketing summary"
}

Return ONLY valid JSON. No markdown, no explanation.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return { ...result, analyzed_at: new Date().toISOString() }
}

// ============================================================
// COMPETITOR ANALYSIS
// ============================================================
export async function analyzeCompetitors(
  businessAnalysis: BusinessAnalysis,
  country: string
): Promise<CompetitorAnalysis> {
  const prompt = `You are a competitive intelligence expert. Based on this business profile, identify and analyze the top 5 competitors.

Business: ${businessAnalysis.company_name}
Category: ${businessAnalysis.business_category}
USPs: ${businessAnalysis.usp.join(', ')}
Target Market: ${country}
Products/Services: ${[...businessAnalysis.products, ...businessAnalysis.services].join(', ')}

Generate a comprehensive competitor analysis as JSON:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "domain.com",
      "positioning": "How they position themselves",
      "messaging": "Their key marketing message",
      "offer": "Their main offer/value prop",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "ad_channels": ["Google Ads", "Meta Ads"]
    }
  ],
  "market_positioning": "How our client should position against these competitors",
  "gap_analysis": ["Gap 1 our client can exploit", "Gap 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"]
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return { ...result, analyzed_at: new Date().toISOString() }
}

// ============================================================
// CAMPAIGN STRATEGY
// ============================================================
export async function generateCampaignStrategy(
  businessAnalysis: BusinessAnalysis,
  competitorAnalysis: CompetitorAnalysis,
  goal: BusinessGoal,
  budget: number,
  platforms: Platform[],
  country: string
): Promise<CampaignStrategy> {
  const prompt = `You are a senior performance marketing strategist with 15+ years experience. Create a comprehensive campaign strategy.

Business: ${businessAnalysis.company_name}
Goal: ${goal}
Monthly Budget: $${budget}
Target Country: ${country}
Selected Platforms: ${platforms.join(', ')}
USPs: ${businessAnalysis.usp.join(', ')}
Target Audience: ${businessAnalysis.target_audience}
Competitor Gaps: ${competitorAnalysis.gap_analysis.join(', ')}

Create a data-driven campaign strategy as JSON:
{
  "recommended_channels": [
    {
      "platform": "Google Search",
      "percentage": 40,
      "budget": ${budget * 0.4},
      "rationale": "Why this allocation"
    }
  ],
  "funnel_strategy": {
    "awareness": ["tactic1", "tactic2"],
    "consideration": ["tactic1", "tactic2"],
    "conversion": ["tactic1", "tactic2"]
  },
  "audience_strategy": "Detailed audience strategy",
  "key_messages": ["Message 1", "Message 2", "Message 3"],
  "timeline": "Recommended timeline and phases"
}

Budget allocation must sum to 100%. Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return { ...result, generated_at: new Date().toISOString() }
}

// ============================================================
// GOOGLE ADS CAMPAIGN GENERATOR
// ============================================================
export async function generateGoogleAdsCampaign(input: GenerateCampaignInput) {
  const { business_analysis, competitor_analysis, monthly_budget } = input

  const prompt = `You are a Google Ads expert. Generate a complete, production-ready Google Ads campaign structure.

Business: ${business_analysis.company_name}
Category: ${business_analysis.business_category}
USPs: ${business_analysis.usp.join(' | ')}
Target Audience: ${business_analysis.target_audience}
Pain Points: ${business_analysis.pain_points.join(' | ')}
Monthly Budget: $${monthly_budget}
Competitors: ${competitor_analysis?.competitors.map(c => c.name).join(', ') || 'Unknown'}

Generate a complete Google Ads campaign as JSON:
{
  "structure": {
    "campaign_name": "string",
    "campaign_objective": "string",
    "bid_strategy": "Target CPA / Target ROAS / Maximize Conversions",
    "daily_budget": number,
    "ad_groups": [
      {
        "name": "Ad Group Name",
        "keywords": ["keyword 1", "keyword 2"],
        "match_types": ["broad", "phrase", "exact"],
        "bids": {"target_cpa": 50},
        "headlines": ["headline 1 (max 30 chars)"],
        "descriptions": ["description 1 (max 90 chars)"]
      }
    ]
  },
  "settings": {
    "location_targeting": ["Country/City"],
    "language_targeting": ["English"],
    "ad_schedule": {"monday": "8:00-20:00"},
    "device_strategy": "Strategy description"
  },
  "ad_copy": {
    "headlines": ["15 unique headlines, max 30 chars each"],
    "descriptions": ["4 descriptions, max 90 chars each"],
    "sitelinks": [
      {"title": "About Us", "description1": "desc1", "description2": "desc2", "url": "/about"}
    ],
    "callouts": ["callout1", "callout2", "callout3", "callout4"],
    "structured_snippets": [
      {"header": "Services", "values": ["Service1", "Service2"]}
    ]
  },
  "keywords": {
    "broad": ["30 broad match keywords"],
    "phrase": ["20 phrase match keywords"],
    "exact": ["15 exact match keywords"],
    "negative": ["20 negative keywords"],
    "audience_signals": ["In-market audience 1"]
  }
}

Headlines MUST be under 30 characters. Descriptions MUST be under 90 characters.
Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 4000,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}') as Record<string, unknown>
  const structure = {
    ...((result.structure as Record<string, unknown> | undefined) || {}),
    google_shopping_strategy: result.google_shopping_strategy,
    performance_max_structure: result.performance_max_structure,
    audience_segments: result.audience_segments,
    product_feed_suggestions: result.product_feed_suggestions,
    roas_strategy: result.roas_strategy,
    cross_sell_opportunities: result.cross_sell_opportunities,
    upsell_opportunities: result.upsell_opportunities,
  }

  return { ...result, structure }
}

// ============================================================
// META ADS CAMPAIGN GENERATOR
// ============================================================
export async function generateMetaAdsCampaign(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a Meta Ads expert. Generate a complete Facebook & Instagram campaign structure.

Business: ${business_analysis.company_name}
Category: ${business_analysis.business_category}
USPs: ${business_analysis.usp.join(' | ')}
Target Audience: ${business_analysis.target_audience}
Pain Points: ${business_analysis.pain_points.join(' | ')}
Monthly Budget: $${monthly_budget}

Generate a complete Meta Ads campaign as JSON:
{
  "structure": {
    "campaign_name": "string",
    "campaign_objective": "LEADS / CONVERSIONS / TRAFFIC",
    "bid_strategy": "LOWEST_COST / COST_CAP",
    "daily_budget": number,
    "ad_sets": [
      {
        "name": "Ad Set Name",
        "objective": "string",
        "interests": ["interest1", "interest2"],
        "lookalike_audiences": ["Website visitors 1-2%", "Customer list 1-3%"],
        "remarketing_audiences": ["Website visitors 30 days"],
        "age_min": 25,
        "age_max": 55,
        "gender": "All",
        "placements": ["Facebook Feed", "Instagram Feed", "Stories"]
      }
    ]
  },
  "ad_copy": {
    "primary_texts": ["5 primary text variations, 1-3 sentences each"],
    "headlines": ["10 headline variations, max 40 chars"],
    "descriptions": ["5 description variations"],
    "cta_options": ["Learn More", "Get Quote", "Sign Up"]
  },
  "audiences": {
    "interest_targeting": ["20 relevant interests"],
    "lookalike": ["Customer list", "Website visitors", "Engagers"],
    "remarketing": ["All website visitors", "Product viewers", "Cart abandoners"]
  },
  "creatives": {
    "creative_angles": ["angle1", "angle2", "angle3", "angle4", "angle5"],
    "image_concepts": [
      {
        "format": "1:1",
        "concept": "Visual concept description",
        "headline": "Headline",
        "body_text": "Body text",
        "cta": "Learn More",
        "color_scheme": ["#color1", "#color2"]
      }
    ]
  }
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 4000,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// ============================================================
// LINKEDIN ADS CAMPAIGN GENERATOR
// ============================================================
export async function generateLinkedInAdsCampaign(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a LinkedIn Ads expert specializing in B2B campaigns. Generate a complete LinkedIn campaign.

Business: ${business_analysis.company_name}
Category: ${business_analysis.business_category}
USPs: ${business_analysis.usp.join(' | ')}
Target Audience: ${business_analysis.target_audience}
Budget: $${monthly_budget}/month

Generate a LinkedIn campaign as JSON:
{
  "structure": {
    "campaign_name": "string",
    "campaign_objective": "LEAD_GENERATION / WEBSITE_VISITS / BRAND_AWARENESS",
    "bid_strategy": "AUTOMATED / MANUAL_CPC",
    "daily_budget": number
  },
  "audiences": {
    "linkedin_targeting": {
      "industries": ["10 relevant industries"],
      "job_titles": ["20 relevant job titles"],
      "company_sizes": ["11-50", "51-200", "201-500", "501-1000"],
      "seniority": ["Senior", "Manager", "Director", "VP", "C-Level"]
    }
  },
  "ad_copy": {
    "headlines": ["10 headlines, max 200 chars"],
    "descriptions": ["5 descriptions"],
    "cta_options": ["Learn More", "Download", "Get Quote", "Register"]
  },
  "creatives": {
    "creative_angles": ["Professional angle", "Problem/Solution", "ROI focused", "Social proof"],
    "lead_gen_form_fields": ["First Name", "Last Name", "Company", "Job Title", "Email", "Phone"]
  }
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// ============================================================
// YOUTUBE ADS CAMPAIGN GENERATOR
// ============================================================
export async function generateYouTubeAdsCampaign(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a YouTube Ads & video production expert. Generate complete video ad scripts and storyboards.

Business: ${business_analysis.company_name}
USPs: ${business_analysis.usp.join(' | ')}
Pain Points: ${business_analysis.pain_points.join(' | ')}
Budget: $${monthly_budget}/month

Generate YouTube campaign content as JSON:
{
  "structure": {
    "campaign_name": "string",
    "campaign_objective": "CONVERSIONS / AWARENESS / CONSIDERATION",
    "bid_strategy": "Target CPA / CPV",
    "daily_budget": number
  },
  "creatives": {
    "video_scripts": [
      {
        "duration": 15,
        "hook": "First 3 seconds hook line",
        "scenes": [
          {"scene_number": 1, "duration_seconds": 5, "visual": "What to show", "audio": "What to say", "text_overlay": "Text on screen"}
        ],
        "voiceover": "Full voiceover script",
        "cta": "Call to action",
        "storyboard_notes": "Production notes"
      },
      {
        "duration": 30,
        "hook": "Hook",
        "scenes": [],
        "voiceover": "Full 30-second script",
        "cta": "CTA",
        "storyboard_notes": "Notes"
      },
      {
        "duration": 60,
        "hook": "Hook",
        "scenes": [],
        "voiceover": "Full 60-second script",
        "cta": "CTA",
        "storyboard_notes": "Notes"
      }
    ]
  },
  "ad_copy": {
    "headlines": ["5 companion banner headlines"],
    "descriptions": ["3 descriptions"]
  }
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.6,
    max_tokens: 4000,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// ============================================================
// LANDING PAGE AUDIT
// ============================================================
export async function auditLandingPage(url: string, businessAnalysis: BusinessAnalysis): Promise<LandingAudit> {
  const pageContent = await crawlWebsite(url)

  const prompt = `You are a CRO (Conversion Rate Optimization) expert. Audit this landing page.

URL: ${url}
Business: ${businessAnalysis.company_name}
Goal: ${businessAnalysis.usp.join(' | ')}
Page Content: ${pageContent.substring(0, 3000)}

Provide a detailed audit as JSON:
{
  "trust_score": 75,
  "conversion_score": 65,
  "mobile_score": 80,
  "page_speed_suggestions": ["suggestion1", "suggestion2"],
  "cro_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "cta_improvements": ["improvement1", "improvement2"],
  "form_improvements": ["improvement1", "improvement2"],
  "testimonial_suggestions": ["suggestion1", "suggestion2"],
  "trust_badge_suggestions": ["SSL badge", "Review counts", "Money-back guarantee"],
  "overall_recommendations": ["Top recommendation 1", "Top recommendation 2", "Top recommendation 3"]
}

Scores are 0-100. Be specific and actionable. Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return { ...result, audited_at: new Date().toISOString() }
}

// ============================================================
// FORECASTING
// ============================================================
export async function generateForecasts(
  businessAnalysis: BusinessAnalysis,
  strategy: CampaignStrategy,
  budget: number,
  goal: BusinessGoal
): Promise<Forecasts> {
  const prompt = `You are a digital marketing forecasting expert. Generate realistic performance forecasts.

Business: ${businessAnalysis.company_name}
Category: ${businessAnalysis.business_category}
Monthly Budget: $${budget}
Business Goal: ${goal}
Target Audience: ${businessAnalysis.target_audience}

Generate realistic forecasts as JSON:
{
  "estimated_cpc": 2.50,
  "estimated_ctr": 3.2,
  "estimated_clicks": 400,
  "estimated_leads": 40,
  "estimated_cpl": 62.50,
  "estimated_revenue": 8000,
  "estimated_roas": 3.2,
  "confidence_score": 75,
  "assumptions": [
    "Based on industry average CTR of 3-4%",
    "Assumes well-optimized landing page",
    "Based on typical CPL for this category"
  ]
}

Be conservative and realistic. Confidence score reflects data availability.
Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return { ...result, generated_at: new Date().toISOString() }
}

// ============================================================
// REPORT GENERATOR (uses Claude for better writing)
// ============================================================
export async function generateReport(
  reportType: 'weekly' | 'monthly' | 'quarterly',
  projectData: Record<string, unknown>
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Generate a professional ${reportType} performance marketing report for a client.

Project Data: ${JSON.stringify(projectData, null, 2)}

Write a comprehensive, client-ready report with:
1. Executive Summary
2. Performance Highlights
3. Channel Performance Analysis
4. Key Insights
5. Recommendations for Next Period
6. Action Items

Write in a professional tone suitable for presenting to clients. Use clear sections with headers.`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// ============================================================
// WEBSITE CRAWLER (fallback text extraction)
// ============================================================
async function crawlWebsite(url: string): Promise<string> {
  try {
    // Try Firecrawl first if API key exists
    if (process.env.FIRECRAWL_API_KEY) {
      const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, formats: ['markdown'] }),
      })
      if (response.ok) {
        const data = await response.json()
        return data.data?.markdown || ''
      }
    }

    // Fallback: basic fetch
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AdPilotBot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    })
    const html = await response.text()
    // Basic text extraction
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000)
  } catch (error) {
    console.error('Website crawl error:', error)
    return `Could not crawl website at ${url}. Using URL-based analysis.`
  }
}

// ============================================================
// ECOMMERCE CAMPAIGN GENERATOR
// ============================================================
export async function generateEcommerceStrategy(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a Google Shopping & ecommerce advertising expert. Generate a complete ecommerce campaign strategy.

Business: ${business_analysis.company_name}
Products: ${business_analysis.products.join(', ')}
Budget: $${monthly_budget}/month

Generate ecommerce campaign strategy as JSON:
{
  "structure": {
    "campaign_name": "${business_analysis.company_name} - Shopping",
    "campaign_objective": "ROAS / Sales",
    "bid_strategy": "Target ROAS",
    "daily_budget": ${(monthly_budget / 30).toFixed(2)}
  },
  "google_shopping_strategy": "Detailed Shopping strategy",
  "performance_max_structure": {
    "asset_groups": ["Brand", "Product Categories", "Best Sellers"],
    "audience_signals": ["Customer match", "Website visitors", "In-market"],
    "final_urls": ["Homepage", "Category pages", "Product pages"]
  },
  "audience_segments": ["New customers", "Returning customers", "Cart abandoners", "High LTV"],
  "product_feed_suggestions": ["suggestion1", "suggestion2"],
  "roas_strategy": "ROAS optimization approach",
  "ad_copy": {
    "headlines": ["10 headlines"],
    "descriptions": ["5 descriptions"]
  },
  "cross_sell_opportunities": ["opportunity1", "opportunity2"],
  "upsell_opportunities": ["opportunity1", "opportunity2"]
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

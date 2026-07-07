import OpenAI from 'openai'
import type { GenerateCampaignInput } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Demand Gen Campaign Generator ────────────────────────────────────────────
export async function generateDemandGenCampaign(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a Google Demand Gen expert. Generate a complete Demand Gen campaign with multi-format assets.

Business: ${business_analysis.company_name}
Category: ${business_analysis.business_category}
USPs: ${business_analysis.usp.join(' | ')}
Target Audience: ${business_analysis.target_audience}
Budget: $${monthly_budget}/month

Generate a Demand Gen campaign as JSON:
{
  "structure": {
    "campaign_name": "${business_analysis.company_name} — Demand Gen",
    "campaign_objective": "CONVERSIONS",
    "bid_strategy": "Maximize Conversions",
    "daily_budget": ${(monthly_budget / 30).toFixed(0)}
  },
  "ad_copy": {
    "headlines": ["5 short headlines max 30 chars"],
    "long_headlines": ["5 long headlines max 90 chars"],
    "descriptions": ["5 descriptions max 90 chars"]
  },
  "creatives": {
    "image_concepts": [
      {
        "format": "1:1",
        "concept": "Visual concept description",
        "headline": "Short punchy headline",
        "body_text": "Supporting body text",
        "cta": "Learn More",
        "color_scheme": ["#primaryColor", "#secondaryColor"]
      },
      {
        "format": "4:5",
        "concept": "...",
        "headline": "...",
        "body_text": "...",
        "cta": "Get Started",
        "color_scheme": ["#color1", "#color2"]
      },
      {
        "format": "1.91:1",
        "concept": "...",
        "headline": "...",
        "body_text": "...",
        "cta": "Sign Up",
        "color_scheme": ["#color1", "#color2"]
      }
    ],
    "creative_angles": ["Angle 1", "Angle 2", "Angle 3", "Angle 4"]
  },
  "audiences": {
    "interest_targeting": ["10 relevant interests"],
    "lookalike": ["Customer list", "Website visitors"],
    "remarketing": ["All website visitors 30 days", "Video viewers"]
  }
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 3000,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

// ─── Performance Max Campaign Generator ─────────────────────────────────────
export async function generatePerformanceMaxCampaign(input: GenerateCampaignInput) {
  const { business_analysis, monthly_budget } = input

  const prompt = `You are a Performance Max (PMax) expert. Generate a complete PMax campaign strategy.

Business: ${business_analysis.company_name}
Products/Services: ${[...business_analysis.products, ...business_analysis.services].join(', ')}
USPs: ${business_analysis.usp.join(' | ')}
Budget: $${monthly_budget}/month

Generate a Performance Max campaign as JSON:
{
  "structure": {
    "campaign_name": "${business_analysis.company_name} — Performance Max",
    "campaign_objective": "CONVERSIONS",
    "bid_strategy": "Target ROAS",
    "daily_budget": ${(monthly_budget / 30).toFixed(0)},
    "performance_max_structure": {
      "asset_groups": [
        {
          "name": "Primary Asset Group",
          "final_url": "homepage URL",
          "audience_signals": ["In-market audience 1", "Custom intent segment"]
        }
      ],
      "asset_groups_strategy": "Strategy for organizing asset groups"
    },
    "roas_strategy": "ROAS optimization approach",
    "cross_sell_opportunities": ["opportunity 1", "opportunity 2"],
    "upsell_opportunities": ["opportunity 1", "opportunity 2"]
  },
  "ad_copy": {
    "headlines": ["15 headlines max 30 chars"],
    "descriptions": ["4 descriptions max 90 chars"],
    "long_headlines": ["5 long headlines max 90 chars"]
  },
  "creatives": {
    "image_concepts": [
      {
        "format": "1:1",
        "concept": "Visual concept",
        "headline": "Headline",
        "body_text": "Body",
        "cta": "Shop Now",
        "color_scheme": ["#color1", "#color2"]
      }
    ],
    "video_concepts": ["15s YouTube video concept", "6s bumper concept"]
  },
  "audiences": {
    "audience_signals": ["Custom segment 1", "In-market 1"],
    "lookalike": ["Customer list", "Converters"],
    "remarketing": ["Cart abandoners", "Product viewers"]
  },
  "product_feed_suggestions": ["Feed optimization tip 1", "tip 2", "tip 3"]
}

Return ONLY valid JSON.`

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 3500,
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

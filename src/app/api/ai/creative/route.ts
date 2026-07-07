import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { project_id, type, formats } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    // Check subscription
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single()
    if (sub?.plan === 'free') {
      return NextResponse.json({ error: 'Upgrade to Pro for Creative Studio' }, { status: 403 })
    }

    const { data: project } = await adminClient
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .single()

    if (!project?.business_analysis) {
      return NextResponse.json({ error: 'Run analysis first' }, { status: 400 })
    }

    const ba = project.business_analysis

    let prompt = ''
    let creatives: unknown[] = []

    if (type === 'image_concept') {
      prompt = `Generate compelling image ad concepts for these formats: ${formats.join(', ')}.

Business: ${ba.company_name}
USPs: ${ba.usp.join(' | ')}
Target Audience: ${ba.target_audience}
Pain Points: ${ba.pain_points.slice(0, 3).join(' | ')}

For EACH format (${formats.join(', ')}), create one image concept as JSON array:
[
  {
    "format": "1:1",
    "concept": "Detailed visual concept description for designer",
    "headline": "Short powerful headline max 8 words",
    "body_text": "Supporting text max 15 words",
    "cta": "Action CTA",
    "color_scheme": ["#primaryColor", "#secondaryColor", "#accentColor"],
    "visual_elements": ["element1", "element2"],
    "mood": "Professional/Energetic/Trustworthy/etc"
  }
]

Create ${formats.length} concepts (one per format). Return ONLY valid JSON array.`

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const text = response.choices[0].message.content || '[]'
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      creatives = JSON.parse(cleanText)

    } else if (type === 'copy_variations') {
      prompt = `Generate 6 compelling ad copy variations for ${ba.company_name}.

USPs: ${ba.usp.join(' | ')}
Target Audience: ${ba.target_audience}
Pain Points: ${ba.pain_points.slice(0, 3).join(' | ')}

Generate 6 copy variations across different angles as JSON array:
[
  {
    "angle": "Problem-Solution",
    "headline": "Powerful headline max 10 words",
    "body": "Compelling body text 2-3 sentences",
    "cta": "Strong CTA"
  }
]

Use these angles: Problem-Solution, Social Proof, Curiosity, Fear of Missing Out, Direct Benefit, Storytelling.
Return ONLY valid JSON array.`

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      })

      const text = response.choices[0].message.content || '[]'
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      creatives = JSON.parse(cleanText)

    } else if (type === 'video_script') {
      prompt = `Generate video ad scripts (15s, 30s, 60s) for ${ba.company_name}.

USPs: ${ba.usp.join(' | ')}
Target Audience: ${ba.target_audience}
Key Message: ${ba.usp[0]}

Generate 3 scripts as JSON array:
[
  {
    "duration": 15,
    "hook": "Attention-grabbing first 3 seconds",
    "voiceover": "Complete script for this duration",
    "cta": "Clear call to action",
    "storyboard_notes": "Visual production guidance"
  },
  {
    "duration": 30,
    ...
  },
  {
    "duration": 60,
    ...
  }
]

Return ONLY valid JSON array.`

      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      })

      const text = response.choices[0].message.content || '[]'
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
      creatives = JSON.parse(cleanText)
    }

    // Save to creative_assets
    if (creatives.length > 0) {
      await adminClient.from('creative_assets').insert(
        creatives.map(creative => ({
          project_id,
          user_id: user.id,
          type: type === 'image_concept' ? 'image' : type === 'video_script' ? 'video_script' : 'copy',
          content: creative,
          title: `${ba.company_name} — ${type} — ${new Date().toISOString().split('T')[0]}`,
        }))
      )
    }

    return NextResponse.json({ success: true, creatives })
  } catch (error) {
    console.error('Creative generation error:', error)
    return NextResponse.json({ error: 'Creative generation failed' }, { status: 500 })
  }
}

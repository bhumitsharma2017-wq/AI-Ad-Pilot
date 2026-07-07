import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { auditLandingPage } from '@/lib/ai/engine'

export async function POST(request: NextRequest) {
  try {
    const { project_id, url } = await request.json()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()
    const { data: project } = await adminClient
      .from('projects')
      .select('business_analysis')
      .eq('id', project_id)
      .single()

    if (!project?.business_analysis) {
      return NextResponse.json({ error: 'Run business analysis first' }, { status: 400 })
    }

    const audit = await auditLandingPage(url, project.business_analysis)

    await adminClient.from('projects').update({ landing_audit: audit }).eq('id', project_id)

    return NextResponse.json({ success: true, audit })
  } catch (error) {
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}

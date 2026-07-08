import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    // Check agency plan
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single()

    if (sub?.plan !== 'agency') {
      return NextResponse.json({ error: 'Agency plan required for team members' }, { status: 403 })
    }

    // Find member by email
    const { data: memberProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (!memberProfile) {
      // Member doesn't have an account yet — in production, send invite email
      // For now return a helpful message
      return NextResponse.json({
        error: 'User not found. They need to create an AdPilot account first, then you can add them.',
      }, { status: 404 })
    }

    // Check for duplicate
    const { data: existing } = await adminClient
      .from('team_members')
      .select('id')
      .eq('owner_id', user.id)
      .eq('member_id', memberProfile.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This user is already on your team' }, { status: 400 })
    }

    // Can't add yourself
    if (memberProfile.id === user.id) {
      return NextResponse.json({ error: 'You cannot add yourself as a team member' }, { status: 400 })
    }

    // Add team member
    const { data: member } = await adminClient
      .from('team_members')
      .insert({
        owner_id: user.id,
        member_id: memberProfile.id,
        role,
        accepted_at: new Date().toISOString(), // Auto-accept for now
      })
      .select()
      .single()

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error('Team invite error:', error)
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { memberId } = await request.json()
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createAdminClient()
  await adminClient.from('team_members')
    .delete()
    .eq('owner_id', user.id)
    .eq('member_id', memberId)

  return NextResponse.json({ success: true })
}

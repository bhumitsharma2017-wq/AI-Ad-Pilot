import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { plan, billing_cycle = 'monthly' } = await request.json()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const adminClient = createAdminClient()
    const { data: profile } = await adminClient.from('profiles').select('*').eq('id', user.id).single()
    const planKey = `RAZORPAY_${plan.toUpperCase()}_${billing_cycle.toUpperCase()}_PLAN_ID`
    const planId = process.env[planKey]
    if (!planId || planId === 'placeholder') {
      return NextResponse.json({ error: 'Razorpay plan not configured.' }, { status: 400 })
    }
    const { data: existingSub } = await adminClient.from('subscriptions').select('razorpay_customer_id').eq('user_id', user.id).single()
    return NextResponse.json({
      success: true,
      plan_id: planId,
      customer_id: existingSub?.razorpay_customer_id || null,
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: billing_cycle === 'monthly' ? (plan === 'pro' ? 299900 : 799900) : (plan === 'pro' ? 2999900 : 7999900),
      currency: 'INR',
      plan,
      user_email: user.email,
      user_name: profile?.full_name || '',
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed' }, { status: 500 })
  }
}

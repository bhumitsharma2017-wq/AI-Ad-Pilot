import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { createSubscription, RAZORPAY_PLANS } from '@/lib/razorpay/client'

export async function POST(request: NextRequest) {
  try {
    const { plan, billing_cycle = 'monthly' } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    const { data: profile } = await adminClient
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    // Get plan ID
    const planKey = `${plan}_${billing_cycle}` as keyof typeof RAZORPAY_PLANS
    const planId = RAZORPAY_PLANS[planKey]
    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create Razorpay subscription
    const razorpaySubscription = await createSubscription({
      plan_id: planId,
      customer_notify: true,
      notes: {
        user_id: user.id,
        plan,
        billing_cycle,
        email: profile?.email || user.email || '',
        name: profile?.full_name || 'User',
      },
    })

    // Update local subscription record
    await adminClient
      .from('subscriptions')
      .update({
        razorpay_customer_id: razorpaySubscription.customer_id,
        razorpay_subscription_id: razorpaySubscription.id,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      subscription_id: razorpaySubscription.id,
      customer_id: razorpaySubscription.customer_id,
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: billing_cycle === 'monthly'
        ? (plan === 'pro' ? 299900 : 799900)  // in paise
        : (plan === 'pro' ? 2999900 : 7999900),
      currency: 'INR',
      plan,
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Subscription failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { createSubscription, createRazorpayCustomer, RAZORPAY_PLANS } from '@/lib/razorpay/client'

export async function POST(request: NextRequest) {
  try {
    const { plan, billing_cycle = 'monthly' } = await request.json()

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminClient = createAdminClient()

    // Get user profile
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Get plan ID
    const planKey = `${plan}_${billing_cycle}` as keyof typeof RAZORPAY_PLANS
    const planId = RAZORPAY_PLANS[planKey]
    if (!planId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create or get Razorpay customer
    let { data: subscription } = await adminClient
      .from('subscriptions')
      .select('razorpay_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.razorpay_customer_id

    if (!customerId) {
      const customer = await createRazorpayCustomer({
        name: profile?.full_name || user.email || 'User',
        email: user.email || '',
      })
      customerId = customer.id
    }

    // Create Razorpay subscription
const razorpaySubscription: any = await createSubscription({
  plan_id: planId,
  customer_id: customerId,
  notify_info: {
    notify_email: user.email || '',
  },
})

    // Update local subscription record
    await adminClient
      .from('subscriptions')
      .update({
        razorpay_customer_id: customerId,
        razorpay_subscription_id: razorpaySubscription.id,
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      subscription_id: razorpaySubscription.id,
      customer_id: customerId,
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

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyWebhookSignature } from '@/lib/razorpay/client'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature') || ''
  const body = await request.text()

  // Verify signature
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(body)
  const adminClient = createAdminClient()

  // Idempotency check
  const { data: existing } = await adminClient
    .from('payment_events')
    .select('id')
    .eq('event_id', event.id)
    .single()

  if (existing) return NextResponse.json({ status: 'already_processed' })

  // Store event
  await adminClient.from('payment_events').insert({
    event_id: event.id,
    event_type: event.event,
    payload: event,
  })

  const payload = event.payload?.subscription?.entity || event.payload?.payment?.entity

  switch (event.event) {
    case 'subscription.activated': {
      const subscriptionId = payload?.id
      const customerId = payload?.customer_id

      // Find user by customer ID
      const { data: sub } = await adminClient
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_customer_id', customerId)
        .single()

      if (sub) {
        // Determine plan from plan_id
        const planId = payload?.plan_id
        let plan = 'pro'
        if (planId?.includes('agency')) plan = 'agency'

        await adminClient.from('subscriptions').update({
          plan,
          status: 'active',
          razorpay_subscription_id: subscriptionId,
          current_period_start: new Date(payload.current_start * 1000).toISOString(),
          current_period_end: new Date(payload.current_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('user_id', sub.user_id)

        await adminClient.from('profiles').update({ role: plan }).eq('id', sub.user_id)
      }
      break
    }

    case 'subscription.cancelled':
    case 'subscription.completed': {
      const subscriptionId = payload?.id
      const { data: sub } = await adminClient
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .single()

      if (sub) {
        await adminClient.from('subscriptions').update({
          status: event.event === 'subscription.cancelled' ? 'cancelled' : 'expired',
          updated_at: new Date().toISOString(),
        }).eq('user_id', sub.user_id)

        await adminClient.from('profiles').update({ role: 'free' }).eq('id', sub.user_id)
      }
      break
    }

    case 'subscription.charged': {
      // Payment successful - extend period
      const subscriptionId = payload?.subscription_id
      const { data: sub } = await adminClient
        .from('subscriptions')
        .select('user_id')
        .eq('razorpay_subscription_id', subscriptionId)
        .single()

      if (sub) {
        const invoiceData = event.payload?.payment?.entity
        await adminClient.from('subscriptions').update({
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }).eq('user_id', sub.user_id)
      }
      break
    }
  }

  // Mark as processed
  await adminClient.from('payment_events').update({ processed: true }).eq('event_id', event.id)

  return NextResponse.json({ received: true })
}

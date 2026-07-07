import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export { razorpay }

// Create a Razorpay customer
export async function createRazorpayCustomer(params: {
  name: string
  email: string
  contact?: string
}) {
  return await razorpay.customers.create(params)
}

// Create a subscription
export async function createSubscription(params: {
  plan_id: string
  customer_id?: string
  total_count?: number
  quantity?: number
  notify_info?: {
    notify_phone?: string
    notify_email?: string
  }
}) {
  const subscription = await (razorpay.subscriptions.create({
    plan_id: params.plan_id,
    customer_id: params.customer_id,
    total_count: params.total_count ?? 12,
    quantity: params.quantity ?? 1,
    notify_info: params.notify_info,
  }) as Promise<any>)

  return subscription
}

// Create an order (for one-time payments)
export async function createOrder(params: {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}) {
  return await razorpay.orders.create({
    amount: params.amount,
    currency: params.currency || 'INR',
    receipt: params.receipt || `order_${Date.now()}`,
    notes: params.notes,
  })
}

// Verify Razorpay payment signature
export function verifyPaymentSignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params

  const body = `${razorpay_order_id}|${razorpay_payment_id}`

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === razorpay_signature
}

// Verify webhook signature
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac(
      'sha256',
      process.env.RAZORPAY_WEBHOOK_SECRET ||
        process.env.RAZORPAY_KEY_SECRET!
    )
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return await razorpay.subscriptions.fetch(subscriptionId)
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  cancelAtCycleEnd = true
) {
  return await razorpay.subscriptions.cancel(
    subscriptionId,
    cancelAtCycleEnd
  )
}

// Plan IDs
export const RAZORPAY_PLANS = {
  pro_monthly:
    process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_pro_monthly',
  pro_yearly:
    process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || 'plan_pro_yearly',
  agency_monthly:
    process.env.RAZORPAY_AGENCY_MONTHLY_PLAN_ID || 'plan_agency_monthly',
  agency_yearly:
    process.env.RAZORPAY_AGENCY_YEARLY_PLAN_ID || 'plan_agency_yearly',
}

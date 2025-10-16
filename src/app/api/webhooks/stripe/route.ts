import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/resend'

// Disable body parsing, need raw body for webhook signature verification
export const runtime = 'nodejs'

/**
 * Stripe Webhook Handler
 *
 * Handles all Stripe webhook events for subscription management
 * Events handled:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.created: Subscription initialized
 * - customer.subscription.updated: Subscription changed
 * - customer.subscription.deleted: Subscription cancelled
 * - invoice.payment_succeeded: Payment successful
 * - invoice.payment_failed: Payment failed
 * - customer.created: New customer
 * - customer.updated: Customer details changed
 */
export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('[Webhook] Stripe is not configured')
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    // Check if Supabase Admin is configured
    if (!supabaseAdmin) {
      console.error('[Webhook] Supabase admin client is not configured')
      return NextResponse.json(
        { error: 'Supabase admin not configured' },
        { status: 500 }
      )
    }

    // Get the signature from headers
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('[Webhook] No signature found in headers')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Get the raw body
    const body = await req.text()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('[Webhook] STRIPE_WEBHOOK_SECRET not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const error = err as Error
      console.error('[Webhook] Signature verification failed:', error.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error.message}` },
        { status: 400 }
      )
    }

    // Log the event
    console.log(`[Webhook] Processing event: ${event.type}`, {
      eventId: event.id,
      created: new Date(event.created * 1000).toISOString()
    })

    // Route event to appropriate handler
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    // Return success response
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle checkout.session.completed event
 * Triggered when a user completes payment
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[Webhook] Handling checkout.session.completed:', session.id)

  try {
    const customerId = session.customer as string
    const customerEmail = session.customer_email || session.customer_details?.email

    if (!customerEmail) {
      console.error('[Webhook] No customer email found in checkout session')
      return
    }

    // Update or create profile with Stripe customer ID
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        email: customerEmail,
        stripe_customer_id: customerId,
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (profileError) {
      console.error('[Webhook] Error updating profile:', profileError)
      throw profileError
    }

    console.log(`[Webhook] Profile updated for ${customerEmail}`)

    // Send welcome email
    try {
      await sendEmail({
        to: customerEmail,
        subject: 'Welcome to Brewery Recipe Platform! 🍺',
        template: EMAIL_TEMPLATES.WELCOME,
        data: {
          name: session.customer_details?.name || 'Brewer',
        }
      })
      console.log(`[Webhook] Welcome email sent to ${customerEmail}`)
    } catch (emailError) {
      console.error('[Webhook] Error sending welcome email:', emailError)
      // Don't throw - email failure shouldn't fail the webhook
    }

  } catch (error) {
    console.error('[Webhook] Error in handleCheckoutCompleted:', error)
    throw error
  }
}

/**
 * Handle customer.subscription.created event
 * Triggered when a subscription is first created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[Webhook] Handling customer.subscription.created:', subscription.id)

  try {
    const customerId = subscription.customer as string
    const status = subscription.status

    // Map Stripe status to our status
    const subscriptionStatus = mapStripeStatus(status)

    // Find profile by Stripe customer ID
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('[Webhook] Profile not found for customer:', customerId)
      return
    }

    // Update subscription status
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (updateError) {
      console.error('[Webhook] Error updating subscription status:', updateError)
      throw updateError
    }

    console.log(`[Webhook] Subscription created for ${profile.email}, status: ${subscriptionStatus}`)

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionCreated:', error)
    throw error
  }
}

/**
 * Handle customer.subscription.updated event
 * Triggered when subscription status or plan changes
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[Webhook] Handling customer.subscription.updated:', subscription.id)

  try {
    const customerId = subscription.customer as string
    const status = subscription.status

    // Map Stripe status to our status
    const subscriptionStatus = mapStripeStatus(status)

    // Find profile by Stripe customer ID
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('[Webhook] Profile not found for customer:', customerId)
      return
    }

    // Update subscription status
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: subscriptionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (updateError) {
      console.error('[Webhook] Error updating subscription:', updateError)
      throw updateError
    }

    console.log(`[Webhook] Subscription updated for ${profile.email}, new status: ${subscriptionStatus}`)

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionUpdated:', error)
    throw error
  }
}

/**
 * Handle customer.subscription.deleted event
 * Triggered when a subscription is cancelled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[Webhook] Handling customer.subscription.deleted:', subscription.id)

  try {
    const customerId = subscription.customer as string

    // Find profile by Stripe customer ID
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('[Webhook] Profile not found for customer:', customerId)
      return
    }

    // Update status to cancelled
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (updateError) {
      console.error('[Webhook] Error updating subscription status:', updateError)
      throw updateError
    }

    console.log(`[Webhook] Subscription cancelled for ${profile.email}`)

    // Optionally send cancellation email
    // Note: Uncomment when ready to send
    /*
    try {
      await sendEmail({
        to: profile.email,
        subject: 'Subscription Cancelled',
        template: 'cancellation',
        data: { name: profile.full_name || 'Brewer' }
      })
    } catch (emailError) {
      console.error('[Webhook] Error sending cancellation email:', emailError)
    }
    */

  } catch (error) {
    console.error('[Webhook] Error in handleSubscriptionDeleted:', error)
    throw error
  }
}

/**
 * Handle invoice.payment_succeeded event
 * Triggered when a payment is successful
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[Webhook] Handling invoice.payment_succeeded:', invoice.id)

  try {
    const customerId = invoice.customer as string

    // Find profile by Stripe customer ID
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('[Webhook] Profile not found for customer:', customerId)
      return
    }

    // Ensure subscription is active
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (updateError) {
      console.error('[Webhook] Error updating subscription status:', updateError)
      throw updateError
    }

    console.log(`[Webhook] Payment succeeded for ${profile.email}`)

    // Optionally send payment receipt email
    // Note: Uncomment when ready to send
    /*
    try {
      await sendEmail({
        to: profile.email,
        subject: 'Payment Received - Thank You!',
        template: 'payment_success',
        data: {
          name: profile.full_name || 'Brewer',
          amount: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase()
        }
      })
    } catch (emailError) {
      console.error('[Webhook] Error sending receipt email:', emailError)
    }
    */

  } catch (error) {
    console.error('[Webhook] Error in handlePaymentSucceeded:', error)
    throw error
  }
}

/**
 * Handle invoice.payment_failed event
 * Triggered when a payment fails
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[Webhook] Handling invoice.payment_failed:', invoice.id)

  try {
    const customerId = invoice.customer as string
    const customerEmail = invoice.customer_email

    // Find profile by Stripe customer ID
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (findError || !profile) {
      console.error('[Webhook] Profile not found for customer:', customerId)
      return
    }

    // Update status to inactive or past_due
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (updateError) {
      console.error('[Webhook] Error updating subscription status:', updateError)
      throw updateError
    }

    console.log(`[Webhook] Payment failed for ${profile.email}`)

    // Send payment failure email
    if (customerEmail) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: 'Payment Update Required',
          template: EMAIL_TEMPLATES.PAYMENT_FAILED,
          data: {
            name: profile.full_name || 'Brewer',
            update_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing`
          }
        })
        console.log(`[Webhook] Payment failure email sent to ${customerEmail}`)
      } catch (emailError) {
        console.error('[Webhook] Error sending payment failure email:', emailError)
        // Don't throw - email failure shouldn't fail the webhook
      }
    }

  } catch (error) {
    console.error('[Webhook] Error in handlePaymentFailed:', error)
    throw error
  }
}

/**
 * Handle customer.created event
 * Triggered when a new customer is created in Stripe
 */
async function handleCustomerCreated(customer: Stripe.Customer) {
  console.log('[Webhook] Handling customer.created:', customer.id)

  try {
    const email = customer.email

    if (!email) {
      console.error('[Webhook] No email found for customer:', customer.id)
      return
    }

    // Update or create profile with Stripe customer ID
    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        email,
        stripe_customer_id: customer.id,
        full_name: customer.name || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (error) {
      console.error('[Webhook] Error updating profile with customer ID:', error)
      throw error
    }

    console.log(`[Webhook] Customer created and linked to profile: ${email}`)

  } catch (error) {
    console.error('[Webhook] Error in handleCustomerCreated:', error)
    throw error
  }
}

/**
 * Handle customer.updated event
 * Triggered when customer details are updated
 */
async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log('[Webhook] Handling customer.updated:', customer.id)

  try {
    const email = customer.email

    if (!email) {
      console.error('[Webhook] No email found for customer:', customer.id)
      return
    }

    // Update profile with latest customer info
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        email,
        full_name: customer.name || null,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customer.id)

    if (error) {
      console.error('[Webhook] Error updating profile:', error)
      throw error
    }

    console.log(`[Webhook] Customer updated: ${email}`)

  } catch (error) {
    console.error('[Webhook] Error in handleCustomerUpdated:', error)
    throw error
  }
}

/**
 * Map Stripe subscription status to our internal status
 */
function mapStripeStatus(stripeStatus: string): 'active' | 'inactive' | 'cancelled' | 'trial' {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trial'
    case 'canceled':
    case 'cancelled':
      return 'cancelled'
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
      return 'inactive'
    default:
      console.warn(`[Webhook] Unknown Stripe status: ${stripeStatus}, defaulting to inactive`)
      return 'inactive'
  }
}

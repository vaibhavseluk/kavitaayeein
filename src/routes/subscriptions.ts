import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';
import { createRazorpayOrder, fetchRazorpayPayment, usdToINR, inrToPaise, getRazorpayCurrency } from '../lib/razorpay';

const subscriptions = new Hono<{ Bindings: Env }>();

// Subscription pricing in USD (will be converted to INR)
const PLANS = {
  monthly: { usd: 8, months: 1 },
  quarterly: { usd: 20, months: 3 },
  annual: { usd: 70, months: 12 }
};

// Create Razorpay order for Featured Poet subscription
subscriptions.post('/create-checkout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    if (!token) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { plan } = await c.req.json();
    
    if (!plan || !['monthly', 'quarterly', 'annual'].includes(plan)) {
      return c.json({ error: 'Invalid plan. Must be monthly, quarterly, or annual' }, 400);
    }

    // Check if user already has active subscription
    const existing = await c.env.DB.prepare(
      'SELECT id FROM subscriptions WHERE user_id = ? AND status = ? AND end_date > datetime("now")'
    ).bind(payload.userId, 'active').first();

    if (existing) {
      return c.json({ error: 'You already have an active subscription' }, 400);
    }

    // Convert USD to INR
    const planDetails = PLANS[plan as keyof typeof PLANS];
    const amountINR = usdToINR(planDetails.usd);
    const amountPaise = inrToPaise(amountINR);

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      c.env.RAZORPAY_KEY_ID,
      c.env.RAZORPAY_KEY_SECRET,
      {
        amount: amountPaise,
        currency: getRazorpayCurrency(),
        receipt: `sub_${payload.userId}_${Date.now()}`,
        notes: {
          user_id: payload.userId.toString(),
          plan_type: 'featured_poet',
          plan: plan,
          username: payload.username
        }
      }
    );

    return c.json({
      order_id: razorpayOrder.id,
      amount: amountPaise,
      amount_inr: amountINR,
      amount_usd: planDetails.usd,
      currency: getRazorpayCurrency(),
      key_id: c.env.RAZORPAY_KEY_ID,
      plan: plan,
      user: {
        id: payload.userId,
        name: payload.username,
        email: payload.email
      }
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// Verify and confirm Razorpay payment
subscriptions.post('/verify-payment', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    if (!token) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      plan 
    } = await c.req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return c.json({ error: 'Missing payment verification data' }, 400);
    }

    // Fetch payment details from Razorpay to verify
    const payment = await fetchRazorpayPayment(
      c.env.RAZORPAY_KEY_ID,
      c.env.RAZORPAY_KEY_SECRET,
      razorpay_payment_id
    );

    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return c.json({ error: 'Payment not successful' }, 400);
    }

    // Calculate subscription end date based on plan
    const planDetails = PLANS[plan as keyof typeof PLANS];
    const monthsToAdd = planDetails?.months || 1;

    // Create subscription record
    const result = await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '+${monthsToAdd} months'))
      RETURNING id
    `).bind(
      payload.userId,
      'featured_poet',
      planDetails.usd,
      'USD',
      'active',
      'razorpay',
      razorpay_payment_id
    ).first();

    // Update user's featured status
    await c.env.DB.prepare(`
      UPDATE users 
      SET is_featured = 1, 
          featured_until = datetime('now', '+${monthsToAdd} months'),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(payload.userId).run();

    return c.json({
      message: 'Subscription activated successfully',
      subscription_id: result?.id,
      featured_until: new Date(Date.now() + monthsToAdd * 30 * 24 * 60 * 60 * 1000).toISOString(),
      payment_id: razorpay_payment_id
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

// Get user's subscription status
subscriptions.get('/status', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    if (!token) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const subscription = await c.env.DB.prepare(`
      SELECT id, plan_type, amount, currency, status, start_date, end_date, auto_renew, payment_id
      FROM subscriptions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(payload.userId).first();

    if (!subscription) {
      return c.json({ 
        has_subscription: false,
        message: 'No active subscription'
      });
    }

    // Check if subscription is still active
    const endDate = new Date(subscription.end_date as string);
    const isActive = endDate > new Date() && subscription.status === 'active';

    return c.json({
      has_subscription: true,
      subscription: {
        ...subscription,
        is_active: isActive,
        days_remaining: isActive ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return c.json({ error: 'Failed to get subscription status' }, 500);
  }
});

// Cancel subscription
subscriptions.post('/cancel', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    if (!token) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Update subscription status
    await c.env.DB.prepare(`
      UPDATE subscriptions 
      SET status = 'cancelled', auto_renew = 0, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND status = 'active'
    `).bind(payload.userId).run();

    return c.json({ 
      message: 'Subscription cancelled. You will retain featured status until the end of your billing period.'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
});

// Razorpay webhook handler
subscriptions.post('/webhook', async (c) => {
  try {
    const body = await c.req.json();
    
    // Handle different Razorpay events
    if (body.event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      
      // Payment was successful
      console.log('Payment captured:', payment.id);
      
      // Update subscription if needed
      // You can add additional logic here
    }

    if (body.event === 'payment.failed') {
      const payment = body.payload.payment.entity;
      
      console.log('Payment failed:', payment.id);
      
      // Handle failed payment
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

export default subscriptions;

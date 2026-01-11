import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';

const subscriptions = new Hono<{ Bindings: Env }>();

// Create checkout session for Featured Poet subscription
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

    // Check if user already has active subscription
    const existing = await c.env.DB.prepare(
      'SELECT id FROM subscriptions WHERE user_id = ? AND status = ? AND end_date > datetime("now")'
    ).bind(payload.userId, 'active').first();

    if (existing) {
      return c.json({ error: 'You already have an active subscription' }, 400);
    }

    // In production, integrate with Stripe API
    // For now, return mock checkout URL
    const mockCheckoutUrl = `/dashboard/checkout?plan=featured_poet&user_id=${payload.userId}`;

    return c.json({
      checkout_url: mockCheckoutUrl,
      message: 'Stripe integration ready. Add STRIPE_SECRET_KEY to environment variables.',
      plan: 'featured_poet',
      amount: 8.00,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// Mock payment confirmation (in production, this would be Stripe webhook)
subscriptions.post('/confirm-payment', async (c) => {
  try {
    const { user_id, payment_id, plan_type } = await c.req.json();

    if (!user_id || !payment_id) {
      return c.json({ error: 'user_id and payment_id required' }, 400);
    }

    // Calculate end date (30 days from now)
    const result = await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '+30 days'))
      RETURNING id
    `).bind(
      user_id,
      plan_type || 'featured_poet',
      8.00,
      'USD',
      'active',
      'stripe',
      payment_id
    ).first();

    // Update user's featured status
    await c.env.DB.prepare(`
      UPDATE users 
      SET is_featured = 1, 
          featured_until = datetime('now', '+30 days'),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(user_id).run();

    return c.json({
      message: 'Subscription activated successfully',
      subscription_id: result?.id,
      featured_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return c.json({ error: 'Failed to confirm payment' }, 500);
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
      SELECT id, plan_type, amount, currency, status, start_date, end_date, auto_renew
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

// Stripe webhook handler (for production)
subscriptions.post('/webhook', async (c) => {
  try {
    // In production, verify Stripe signature
    const body = await c.req.json();
    
    // Handle different Stripe events
    if (body.type === 'checkout.session.completed') {
      const session = body.data.object;
      
      // Create subscription record
      await c.env.DB.prepare(`
        INSERT INTO subscriptions 
        (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '+30 days'))
      `).bind(
        session.metadata.user_id,
        'featured_poet',
        8.00,
        'USD',
        'active',
        'stripe',
        session.id
      ).run();

      // Update user featured status
      await c.env.DB.prepare(`
        UPDATE users 
        SET is_featured = 1, 
            featured_until = datetime('now', '+30 days')
        WHERE id = ?
      `).bind(session.metadata.user_id).run();
    }

    if (body.type === 'customer.subscription.deleted') {
      const subscription = body.data.object;
      
      // Mark subscription as cancelled
      await c.env.DB.prepare(`
        UPDATE subscriptions 
        SET status = 'cancelled'
        WHERE payment_id = ?
      `).bind(subscription.id).run();
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

export default subscriptions;

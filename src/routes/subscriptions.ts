import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';
import { createRazorpayOrder, fetchRazorpayPayment, usdToINR, inrToPaise, getRazorpayCurrency } from '../lib/razorpay';

const subscriptions = new Hono<{ Bindings: Env }>();

// Subscription pricing in USD (will be converted to INR)
const PLANS = {
  // Premium unlimited poems plan
  premium_annual: { usd: 4.66, months: 12, type: 'premium' },
  
  // Featured poet plans (includes premium)
  monthly: { usd: 8, months: 1, type: 'featured' },
  quarterly: { usd: 20, months: 3, type: 'featured' },
  annual: { usd: 70, months: 12, type: 'featured' }
};

// Get all available subscription plans
subscriptions.get('/plans', async (c) => {
  try {
    return c.json({
      plans: {
        free: {
          name: 'Free Plan',
          price: 0,
          currency: 'USD',
          duration: 'Forever',
          poem_limit: 10,
          features: [
            'Up to 10 poems',
            'Basic editor features',
            'Community access',
            'Copyright-free content only'
          ]
        },
        premium: {
          name: 'Premium Unlimited',
          price: 4.66,
          price_inr: usdToINR(4.66),
          currency: 'USD',
          duration: '1 Year',
          poem_limit: 'unlimited',
          plan_key: 'premium_annual',
          features: [
            'Unlimited poems',
            'Advanced editor features',
            'Real-time transliteration',
            'Multiple input methods',
            'Priority support',
            'No ads',
            'Export poems'
          ],
          recommended: true
        },
        featured_monthly: {
          name: 'Featured Poet (Monthly)',
          price: 8,
          price_inr: usdToINR(8),
          currency: 'USD',
          duration: '1 Month',
          poem_limit: 'unlimited',
          plan_key: 'monthly',
          features: [
            'All Premium features',
            'Featured badge',
            'Priority listing',
            'Homepage highlight',
            'Monthly newsletter feature',
            'Analytics dashboard'
          ]
        },
        featured_quarterly: {
          name: 'Featured Poet (Quarterly)',
          price: 20,
          price_inr: usdToINR(20),
          currency: 'USD',
          duration: '3 Months',
          poem_limit: 'unlimited',
          plan_key: 'quarterly',
          features: [
            'All Premium features',
            'Featured badge',
            'Priority listing',
            'Homepage highlight',
            'Monthly newsletter feature',
            'Analytics dashboard'
          ],
          savings: '17% off'
        },
        featured_annual: {
          name: 'Featured Poet (Annual)',
          price: 70,
          price_inr: usdToINR(70),
          currency: 'USD',
          duration: '12 Months',
          poem_limit: 'unlimited',
          plan_key: 'annual',
          features: [
            'All Premium features',
            'Featured badge',
            'Priority listing',
            'Homepage highlight',
            'Monthly newsletter feature',
            'Analytics dashboard'
          ],
          savings: '27% off',
          best_value: true
        }
      }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    return c.json({ error: 'Failed to fetch plans' }, 500);
  }
});

// Create Razorpay order for subscriptions (Premium or Featured Poet)
subscriptions.post('/create-checkout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = extractToken(authHeader);
    if (!token) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const payload = await verifyToken(token, c.env);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { plan } = await c.req.json();
    
    if (!plan || !['premium_annual', 'monthly', 'quarterly', 'annual'].includes(plan)) {
      return c.json({ error: 'Invalid plan. Must be premium_annual, monthly, quarterly, or annual' }, 400);
    }

    // Check if user already has active featured subscription (premium can coexist)
    const planDetails = PLANS[plan as keyof typeof PLANS];
    
    if (planDetails.type === 'featured') {
      const existing = await c.env.DB.prepare(
        'SELECT id FROM subscriptions WHERE user_id = ? AND plan_type = ? AND status = ? AND end_date > datetime("now")'
      ).bind(payload.userId, 'featured_poet', 'active').first();

      if (existing) {
        return c.json({ error: 'You already have an active featured poet subscription' }, 400);
      }
    } else if (planDetails.type === 'premium') {
      // Check current tier
      const user = await c.env.DB.prepare(
        'SELECT subscription_tier, subscription_expires_at FROM users WHERE id = ?'
      ).bind(payload.userId).first<{ subscription_tier: string; subscription_expires_at: string | null }>();

      if (user?.subscription_tier === 'premium' && user.subscription_expires_at) {
        const expiresAt = new Date(user.subscription_expires_at);
        if (expiresAt > new Date()) {
          return c.json({ error: 'You already have an active premium subscription' }, 400);
        }
      }
    }

    // Convert USD to INR
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
          plan_type: planDetails.type === 'premium' ? 'premium_unlimited' : 'featured_poet',
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
      plan_type: planDetails.type,
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

    const payload = await verifyToken(token, c.env);
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
    const monthsToAdd = planDetails?.months || 12;
    const planType = planDetails?.type || 'premium';

    // Create subscription record
    const result = await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '+${monthsToAdd} months'))
      RETURNING id
    `).bind(
      payload.userId,
      planType === 'premium' ? 'premium_unlimited' : 'featured_poet',
      planDetails.usd,
      'USD',
      'active',
      'razorpay',
      razorpay_payment_id
    ).first();

    // Create payment transaction record
    await c.env.DB.prepare(`
      INSERT INTO payment_transactions
      (user_id, subscription_id, amount, currency, payment_provider, payment_id, payment_status, transaction_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      payload.userId,
      result?.id,
      planDetails.usd,
      'USD',
      'razorpay',
      razorpay_payment_id,
      'completed',
      'subscription'
    ).run();

    // Update user's subscription status
    if (planType === 'premium') {
      // Upgrade to premium unlimited
      await c.env.DB.prepare(`
        UPDATE users 
        SET subscription_tier = 'premium',
            subscription_expires_at = datetime('now', '+${monthsToAdd} months'),
            poem_limit = -1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(payload.userId).run();
    } else {
      // Featured poet (includes premium benefits)
      await c.env.DB.prepare(`
        UPDATE users 
        SET is_featured = 1, 
            featured_until = datetime('now', '+${monthsToAdd} months'),
            subscription_tier = 'premium',
            subscription_expires_at = datetime('now', '+${monthsToAdd} months'),
            poem_limit = -1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(payload.userId).run();
    }

    const expiresAt = new Date(Date.now() + monthsToAdd * 30 * 24 * 60 * 60 * 1000).toISOString();

    return c.json({
      message: planType === 'premium' 
        ? 'Premium subscription activated! You now have unlimited poems.' 
        : 'Featured Poet subscription activated successfully!',
      subscription_id: result?.id,
      subscription_type: planType,
      expires_at: expiresAt,
      featured_until: planType === 'featured' ? expiresAt : null,
      payment_id: razorpay_payment_id,
      benefits: planType === 'premium'
        ? ['Unlimited poems', 'Advanced editor features', 'Priority support']
        : ['Unlimited poems', 'Featured badge', 'Priority listing', 'Homepage highlight']
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

    const payload = await verifyToken(token, c.env);
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

    const payload = await verifyToken(token, c.env);
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

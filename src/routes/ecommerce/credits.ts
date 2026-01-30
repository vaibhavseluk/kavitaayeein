import { Hono } from 'hono';
import { requireAuth } from '../../lib/auth';
import type { Env, User, CreditPurchase } from '../../lib/types';

const credits = new Hono<{ Bindings: Env }>();

// GET /api/credits/balance - Get user's current credit balance
credits.get('/balance', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;

    const userData = await c.env.DB.prepare(`
      SELECT word_credits, total_words_used, subscription_plan
      FROM users WHERE id = ?
    `).bind(user.id).first<{
      word_credits: number;
      total_words_used: number;
      subscription_plan: string;
    }>();

    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get plan details
    const planData = await c.env.DB.prepare(`
      SELECT plan_name, price_usd, word_credits, features
      FROM subscription_plans
      WHERE LOWER(plan_name) = LOWER(?)
    `).bind(userData.subscription_plan).first<{
      plan_name: string;
      price_usd: number;
      word_credits: number;
      features: string;
    }>();

    return c.json({
      currentBalance: userData.word_credits,
      totalUsed: userData.total_words_used,
      currentPlan: {
        name: planData?.plan_name || userData.subscription_plan,
        monthlyAllocation: planData?.word_credits || 0,
        price: planData?.price_usd || 0,
        features: planData ? JSON.parse(planData.features) : []
      },
      usagePercentage: planData ? 
        Math.round((userData.total_words_used / planData.word_credits) * 100) : 0
    });

  } catch (error) {
    console.error('Balance check error:', error);
    return c.json({ error: 'Failed to fetch balance' }, 500);
  }
});

// GET /api/credits/history - Get credit transaction history
credits.get('/history', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    // Get credit purchases
    const purchases = await c.env.DB.prepare(`
      SELECT 
        id, amount_usd, word_credits, stripe_payment_id, status, created_at
      FROM credit_purchases
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(user.id, limit, offset).all<CreditPurchase>();

    // Get credit usage from translation jobs
    const usage = await c.env.DB.prepare(`
      SELECT 
        id, original_filename, credits_used as amount, created_at, 'translation' as type
      FROM translation_jobs
      WHERE user_id = ? AND status IN ('completed', 'partial')
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(user.id, limit, offset).all();

    // Combine and sort by date
    const allTransactions = [
      ...(purchases.results || []).map(p => ({
        id: p.id,
        type: 'purchase',
        amount: p.word_credits,
        amountUsd: p.amount_usd,
        status: p.status,
        paymentId: p.stripe_payment_id,
        created_at: p.created_at
      })),
      ...(usage.results || []).map((u: any) => ({
        id: u.id,
        type: 'usage',
        amount: -u.amount, // Negative for usage
        filename: u.original_filename,
        created_at: u.created_at
      }))
    ].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);

    const totalResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM credit_purchases WHERE user_id = ?'
    ).bind(user.id).first<{ count: number }>();

    return c.json({
      transactions: allTransactions,
      pagination: {
        page,
        limit,
        total: totalResult?.count || 0,
        pages: Math.ceil((totalResult?.count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('History fetch error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// POST /api/credits/purchase - Purchase credits (Lemon Squeezy)
credits.post('/purchase', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { planName } = await c.req.json();

    if (!planName) {
      return c.json({ error: 'Missing planName' }, 400);
    }

    // Get plan details
    const plan = await c.env.DB.prepare(`
      SELECT * FROM subscription_plans 
      WHERE LOWER(plan_name) = LOWER(?) AND active = 1
    `).bind(planName).first();

    if (!plan) {
      return c.json({ error: 'Invalid plan' }, 400);
    }

    // For free plan, just update the user
    if (plan.price_usd === 0) {
      await c.env.DB.prepare(`
        UPDATE users 
        SET subscription_plan = ?
        WHERE id = ?
      `).bind(planName.toLowerCase(), user.id).run();

      return c.json({
        success: true,
        message: 'Subscribed to free plan',
        plan: planName
      });
    }

    // For paid plans, create Lemon Squeezy checkout
    // NOTE: This requires Lemon Squeezy API keys to be configured
    const lemonSqueezyApiKey = c.env.LEMONSQUEEZY_API_KEY;
    const lemonSqueezyStoreId = c.env.LEMONSQUEEZY_STORE_ID;

    if (!lemonSqueezyApiKey || lemonSqueezyApiKey === 'placeholder') {
      return c.json({ 
        error: 'Payment system not configured. Please contact support.',
        note: 'Lemon Squeezy API keys needed'
      }, 503);
    }

    // Create checkout session with Lemon Squeezy
    // Documentation: https://docs.lemonsqueezy.com/api/checkouts
    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              user_id: user.id.toString(),
              plan_name: planName
            }
          },
          product_options: {
            name: `Shabdly ${planName} Plan`,
            description: `${plan.word_credits.toLocaleString()} word credits per month`
          },
          checkout_options: {
            button_color: '#3B82F6'
          }
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: lemonSqueezyStoreId
            }
          },
          variant: {
            data: {
              type: 'variants',
              id: plan.stripe_price_id // Using this field for Lemon Squeezy variant ID
            }
          }
        }
      }
    };

    const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${lemonSqueezyApiKey}`
      },
      body: JSON.stringify(checkoutData)
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text();
      console.error('Lemon Squeezy checkout error:', errorData);
      return c.json({ 
        error: 'Failed to create checkout session',
        details: errorData
      }, 500);
    }

    const checkoutSession = await checkoutResponse.json();
    const checkoutUrl = checkoutSession.data.attributes.url;

    // Create pending purchase record
    await c.env.DB.prepare(`
      INSERT INTO credit_purchases 
      (user_id, amount_usd, word_credits, stripe_payment_id, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(
      user.id,
      plan.price_usd,
      plan.word_credits,
      checkoutSession.data.id
    ).run();

    return c.json({
      success: true,
      checkoutUrl,
      sessionId: checkoutSession.data.id
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return c.json({ error: 'Failed to initiate purchase', details: error.message }, 500);
  }
});

// POST /api/credits/webhook - Lemon Squeezy webhook handler
credits.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('X-Signature');
    const webhookSecret = c.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    // Verify webhook signature
    // NOTE: Implement proper signature verification in production
    if (webhookSecret && webhookSecret !== 'placeholder') {
      // TODO: Verify signature using crypto
      // For now, we'll process all webhooks (insecure for production)
    }

    const event = await c.req.json();
    console.log('Lemon Squeezy webhook event:', event);

    const eventType = event.meta?.event_name;
    
    // Handle order_created event
    if (eventType === 'order_created') {
      const customData = event.data.attributes.first_order_item?.product_custom_data || {};
      const userId = parseInt(customData.user_id);
      const planName = customData.plan_name;
      const orderId = event.data.id;

      if (!userId || !planName) {
        console.error('Missing user_id or plan_name in webhook');
        return c.json({ error: 'Invalid webhook data' }, 400);
      }

      // Get plan details
      const plan = await c.env.DB.prepare(`
        SELECT * FROM subscription_plans 
        WHERE LOWER(plan_name) = LOWER(?)
      `).bind(planName).first();

      if (!plan) {
        console.error('Invalid plan in webhook:', planName);
        return c.json({ error: 'Invalid plan' }, 400);
      }

      // Update purchase record
      await c.env.DB.prepare(`
        UPDATE credit_purchases 
        SET status = 'completed'
        WHERE user_id = ? AND stripe_payment_id = ?
      `).bind(userId, orderId).run();

      // Update user subscription and add credits
      await c.env.DB.prepare(`
        UPDATE users 
        SET subscription_plan = ?,
            word_credits = word_credits + ?,
            stripe_customer_id = ?
        WHERE id = ?
      `).bind(
        planName.toLowerCase(),
        plan.word_credits,
        event.data.attributes.customer_id,
        userId
      ).run();

      // Log in admin analytics
      await c.env.DB.prepare(`
        INSERT INTO admin_analytics (date, new_signups, active_users, revenue_usd, words_translated)
        VALUES (DATE('now'), 0, 0, ?, 0)
        ON CONFLICT(date) DO UPDATE SET revenue_usd = revenue_usd + ?
      `).bind(plan.price_usd, plan.price_usd).run();

      console.log(`Subscription activated for user ${userId}: ${planName}`);
    }

    // Handle subscription_payment_success
    if (eventType === 'subscription_payment_success') {
      const customData = event.data.attributes.custom_data || {};
      const userId = parseInt(customData.user_id);
      const planName = customData.plan_name;

      if (userId && planName) {
        // Get plan details
        const plan = await c.env.DB.prepare(`
          SELECT * FROM subscription_plans 
          WHERE LOWER(plan_name) = LOWER(?)
        `).bind(planName).first();

        if (plan) {
          // Add monthly credits
          await c.env.DB.prepare(`
            UPDATE users 
            SET word_credits = word_credits + ?
            WHERE id = ?
          `).bind(plan.word_credits, userId).run();

          console.log(`Monthly credits added for user ${userId}: ${plan.word_credits}`);
        }
      }
    }

    return c.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// GET /api/credits/plans - Get all available subscription plans
credits.get('/plans', async (c) => {
  try {
    const plans = await c.env.DB.prepare(`
      SELECT 
        plan_name, price_usd, word_credits, features, stripe_price_id
      FROM subscription_plans
      WHERE active = 1
      ORDER BY price_usd ASC
    `).all();

    return c.json({
      plans: (plans.results || []).map((plan: any) => ({
        name: plan.plan_name,
        price: plan.price_usd,
        credits: plan.word_credits,
        features: JSON.parse(plan.features),
        variantId: plan.stripe_price_id
      }))
    });

  } catch (error) {
    console.error('Plans fetch error:', error);
    return c.json({ error: 'Failed to fetch plans' }, 500);
  }
});

// POST /api/credits/cancel - Cancel subscription
credits.post('/cancel', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;

    // Update user to free plan
    await c.env.DB.prepare(`
      UPDATE users 
      SET subscription_plan = 'free'
      WHERE id = ?
    `).bind(user.id).run();

    // Note: Actual cancellation in Lemon Squeezy should be done via their API
    // This is a placeholder for the frontend

    return c.json({
      success: true,
      message: 'Subscription cancelled. You will be downgraded to free plan at the end of billing period.',
      note: 'Your remaining credits will not be affected'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
});

export default credits;

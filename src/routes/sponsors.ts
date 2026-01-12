import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { createRazorpayOrder, usdToINR, inrToPaise, getRazorpayCurrency } from '../lib/razorpay';

// Sponsored content table schema (add to migrations if needed)
interface SponsoredContent {
  id: number;
  brand_name: string;
  brand_email: string;
  brand_logo_url?: string;
  plan_type: 'bronze' | 'silver' | 'gold';
  amount: number;
  status: 'pending' | 'active' | 'expired';
  poem_ids?: string;
  start_date: string;
  end_date: string;
  payment_id?: string;
}

const sponsors = new Hono<{ Bindings: Env }>();

// Sponsor plans in USD (will be converted to INR)
const SPONSOR_PLANS = {
  bronze: { usd: 50, days: 7, inr: 4150 },
  silver: { usd: 100, days: 30, inr: 8300 },
  gold: { usd: 200, days: 90, inr: 16600 }
};

// Get advertiser pricing plans
sponsors.get('/plans', (c) => {
  return c.json({
    plans: [
      {
        id: 'bronze',
        name: 'Bronze Package',
        price_usd: 50,
        price_inr: 4150,
        duration_days: 7,
        features: [
          '1 sponsored poem',
          'Brand logo on poem',
          '1 week visibility',
          'Featured in feed'
        ]
      },
      {
        id: 'silver',
        name: 'Silver Package',
        price_usd: 100,
        price_inr: 8300,
        duration_days: 30,
        features: [
          '3 sponsored poems',
          'Homepage banner placement',
          'Newsletter feature',
          '1 month visibility',
          'Priority support'
        ],
        popular: true
      },
      {
        id: 'gold',
        name: 'Gold Package',
        price_usd: 200,
        price_inr: 16600,
        duration_days: 90,
        features: [
          'Unlimited sponsored poems',
          'Premium homepage placement',
          'Social media posts (3x)',
          '3 months visibility',
          'Dedicated account manager',
          'Analytics dashboard'
        ]
      }
    ]
  });
});

// Create sponsored content request with Razorpay
sponsors.post('/create', async (c) => {
  try {
    const { brand_name, brand_email, brand_logo_url, plan_type, message } = await c.req.json();

    if (!brand_name || !brand_email || !plan_type) {
      return c.json({ error: 'brand_name, brand_email, and plan_type are required' }, 400);
    }

    if (!['bronze', 'silver', 'gold'].includes(plan_type)) {
      return c.json({ error: 'Invalid plan_type' }, 400);
    }

    // Get plan details
    const selectedPlan = SPONSOR_PLANS[plan_type as keyof typeof SPONSOR_PLANS];
    const amountINR = selectedPlan.inr;
    const amountPaise = inrToPaise(amountINR);

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      c.env.RAZORPAY_KEY_ID,
      c.env.RAZORPAY_KEY_SECRET,
      {
        amount: amountPaise,
        currency: getRazorpayCurrency(),
        receipt: `sponsor_${Date.now()}`,
        notes: {
          brand_name: brand_name,
          brand_email: brand_email,
          plan_type: plan_type
        }
      }
    );

    // Store sponsor request in database (pending payment)
    const result = await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
      VALUES (0, 'sponsored_slot', ?, 'USD', 'pending', 'razorpay', ?, datetime('now', '+${selectedPlan.days} days'))
      RETURNING id
    `).bind(
      selectedPlan.usd,
      razorpayOrder.id
    ).first();

    return c.json({
      message: 'Sponsorship request created',
      sponsor_id: result?.id,
      order_id: razorpayOrder.id,
      amount: amountPaise,
      amount_inr: amountINR,
      amount_usd: selectedPlan.usd,
      currency: getRazorpayCurrency(),
      key_id: c.env.RAZORPAY_KEY_ID,
      duration_days: selectedPlan.days,
      brand_name: brand_name,
      brand_email: brand_email
    }, 201);
  } catch (error) {
    console.error('Create sponsor error:', error);
    return c.json({ error: 'Failed to create sponsorship request' }, 500);
  }
});

// Admin: Get all sponsored content
sponsors.get('/admin/list', async (c) => {
  try {
    // Check admin authorization (simplified - in production use proper middleware)
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT id, user_id, plan_type, amount, status, payment_id, start_date, end_date
      FROM subscriptions
      WHERE plan_type = 'sponsored_slot'
      ORDER BY created_at DESC
    `).all();

    return c.json({ sponsors: results || [] });
  } catch (error) {
    console.error('Get sponsors error:', error);
    return c.json({ error: 'Failed to fetch sponsors' }, 500);
  }
});

// Admin: Approve sponsored content
sponsors.put('/admin/:id/approve', async (c) => {
  try {
    const id = c.req.param('id');

    await c.env.DB.prepare(`
      UPDATE subscriptions 
      SET status = 'active', start_date = CURRENT_TIMESTAMP
      WHERE id = ? AND plan_type = 'sponsored_slot'
    `).bind(id).run();

    return c.json({ message: 'Sponsorship approved and activated' });
  } catch (error) {
    console.error('Approve sponsor error:', error);
    return c.json({ error: 'Failed to approve sponsorship' }, 500);
  }
});

// Get active sponsors (for displaying on site)
sponsors.get('/active', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, plan_type, payment_id, start_date, end_date
      FROM subscriptions
      WHERE plan_type = 'sponsored_slot' 
        AND status = 'active'
        AND end_date > datetime('now')
      ORDER BY start_date DESC
      LIMIT 10
    `).all();

    return c.json({ sponsors: results || [] });
  } catch (error) {
    console.error('Get active sponsors error:', error);
    return c.json({ error: 'Failed to fetch active sponsors' }, 500);
  }
});

export default sponsors;

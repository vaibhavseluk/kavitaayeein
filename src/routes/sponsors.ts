import { Hono } from 'hono';
import type { Env } from '../lib/types';

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

// Get advertiser pricing plans
sponsors.get('/plans', (c) => {
  return c.json({
    plans: [
      {
        id: 'bronze',
        name: 'Bronze Package',
        price: 50,
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
        price: 100,
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
        price: 200,
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

// Create sponsored content request
sponsors.post('/create', async (c) => {
  try {
    const { brand_name, brand_email, brand_logo_url, plan_type, message } = await c.req.json();

    if (!brand_name || !brand_email || !plan_type) {
      return c.json({ error: 'brand_name, brand_email, and plan_type are required' }, 400);
    }

    if (!['bronze', 'silver', 'gold'].includes(plan_type)) {
      return c.json({ error: 'Invalid plan_type' }, 400);
    }

    // Calculate amount and duration
    const plans = {
      bronze: { amount: 50, days: 7 },
      silver: { amount: 100, days: 30 },
      gold: { amount: 200, days: 90 }
    };

    const selectedPlan = plans[plan_type as keyof typeof plans];

    // Create sponsored content request (stored in subscriptions table with plan_type = 'sponsored_slot')
    const result = await c.env.DB.prepare(`
      INSERT INTO subscriptions 
      (user_id, plan_type, amount, currency, status, payment_provider, payment_id, end_date)
      VALUES (0, 'sponsored_slot', ?, 'USD', 'pending', 'stripe', ?, datetime('now', '+${selectedPlan.days} days'))
      RETURNING id
    `).bind(
      selectedPlan.amount,
      `${plan_type}_${Date.now()}` // Temporary payment_id for tracking
    ).first();

    // In production, create Stripe checkout session here
    const mockCheckoutUrl = `/advertise/checkout?sponsor_id=${result?.id}&plan=${plan_type}`;

    return c.json({
      message: 'Sponsorship request created',
      sponsor_id: result?.id,
      checkout_url: mockCheckoutUrl,
      amount: selectedPlan.amount,
      duration_days: selectedPlan.days,
      instructions: 'Complete payment to activate sponsorship'
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

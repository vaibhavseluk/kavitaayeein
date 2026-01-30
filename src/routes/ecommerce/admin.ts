import { Hono } from 'hono';
import { requireAuth } from '../../lib/auth';
import type { Env, User } from '../../lib/types';

const admin = new Hono<{ Bindings: Env }>();

// Middleware to check if user is admin
const requireAdmin = async (c: any, next: any) => {
  const user = c.get('user') as User;
  
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }
  
  await next();
};

// GET /api/admin/stats - Platform statistics
admin.get('/stats', requireAuth, requireAdmin, async (c) => {
  try {
    // Get overall platform stats
    const stats = await c.env.DB.batch([
      // Total users
      c.env.DB.prepare('SELECT COUNT(*) as count FROM users'),
      
      // Active users (users with at least one translation job)
      c.env.DB.prepare(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM translation_jobs 
        WHERE created_at >= date('now', '-30 days')
      `),
      
      // Total revenue
      c.env.DB.prepare(`
        SELECT COALESCE(SUM(amount_usd), 0) as total 
        FROM credit_purchases 
        WHERE status = 'completed'
      `),
      
      // Total words translated
      c.env.DB.prepare('SELECT COALESCE(SUM(total_words_used), 0) as total FROM users'),
      
      // Pending translation jobs
      c.env.DB.prepare(`
        SELECT COUNT(*) as count 
        FROM translation_jobs 
        WHERE status = 'pending'
      `),
      
      // Failed jobs (last 7 days)
      c.env.DB.prepare(`
        SELECT COUNT(*) as count 
        FROM translation_jobs 
        WHERE status = 'failed' AND created_at >= date('now', '-7 days')
      `),
      
      // New signups (last 30 days)
      c.env.DB.prepare(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= date('now', '-30 days')
      `),
      
      // Revenue this month
      c.env.DB.prepare(`
        SELECT COALESCE(SUM(amount_usd), 0) as total 
        FROM credit_purchases 
        WHERE status = 'completed' 
        AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
      `)
    ]);

    return c.json({
      totalUsers: stats[0].results[0]?.count || 0,
      activeUsers: stats[1].results[0]?.count || 0,
      totalRevenue: stats[2].results[0]?.total || 0,
      totalWordsTranslated: stats[3].results[0]?.total || 0,
      pendingJobs: stats[4].results[0]?.count || 0,
      failedJobsThisWeek: stats[5].results[0]?.count || 0,
      newSignupsThisMonth: stats[6].results[0]?.count || 0,
      revenueThisMonth: stats[7].results[0]?.total || 0
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// GET /api/admin/users - List all users with pagination
admin.get('/users', requireAuth, requireAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const search = c.req.query('search') || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        id, username, email, display_name, role, subscription_plan,
        word_credits, total_words_used, created_at, last_login
      FROM users
    `;
    
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE email LIKE ? OR display_name LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await c.env.DB.prepare(query).bind(...params).all();

    const totalQuery = search 
      ? c.env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE email LIKE ? OR display_name LIKE ?').bind(`%${search}%`, `%${search}%`)
      : c.env.DB.prepare('SELECT COUNT(*) as count FROM users');
    
    const total = await totalQuery.first<{ count: number }>();

    return c.json({
      users: users.results || [],
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Admin users list error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// GET /api/admin/users/:id - Get detailed user info
admin.get('/users/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const userId = parseInt(c.req.param('id'));

    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    // Get user details
    const user = await c.env.DB.prepare(`
      SELECT 
        id, username, email, display_name, role, subscription_plan,
        word_credits, total_words_used, stripe_customer_id,
        created_at, last_login, company_name, phone
      FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get translation jobs
    const jobs = await c.env.DB.prepare(`
      SELECT id, original_filename, status, credits_used, created_at
      FROM translation_jobs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(userId).all();

    // Get purchase history
    const purchases = await c.env.DB.prepare(`
      SELECT id, amount_usd, word_credits, status, created_at
      FROM credit_purchases
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(userId).all();

    return c.json({
      user,
      recentJobs: jobs.results || [],
      recentPurchases: purchases.results || []
    });

  } catch (error) {
    console.error('Admin user detail error:', error);
    return c.json({ error: 'Failed to fetch user details' }, 500);
  }
});

// PUT /api/admin/users/:id/credits - Adjust user credits (admin override)
admin.put('/users/:id/credits', requireAuth, requireAdmin, async (c) => {
  try {
    const userId = parseInt(c.req.param('id'));
    const { amount, reason } = await c.req.json();

    if (isNaN(userId) || !amount) {
      return c.json({ error: 'Invalid user ID or amount' }, 400);
    }

    // Update credits
    await c.env.DB.prepare(`
      UPDATE users 
      SET word_credits = word_credits + ?
      WHERE id = ?
    `).bind(amount, userId).run();

    // Log the adjustment
    console.log(`Admin credit adjustment: User ${userId}, Amount: ${amount}, Reason: ${reason || 'N/A'}`);

    return c.json({
      message: 'Credits adjusted successfully',
      userId,
      adjustment: amount
    });

  } catch (error) {
    console.error('Admin credit adjustment error:', error);
    return c.json({ error: 'Failed to adjust credits' }, 500);
  }
});

// GET /api/admin/jobs - List all translation jobs
admin.get('/jobs', requireAuth, requireAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const status = c.req.query('status') || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        tj.id, tj.user_id, tj.original_filename, tj.status, 
        tj.credits_used, tj.created_at, tj.completed_at,
        u.email, u.display_name
      FROM translation_jobs tj
      LEFT JOIN users u ON tj.user_id = u.id
    `;
    
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE tj.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY tj.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const jobs = await c.env.DB.prepare(query).bind(...params).all();

    const totalQuery = status 
      ? c.env.DB.prepare('SELECT COUNT(*) as count FROM translation_jobs WHERE status = ?').bind(status)
      : c.env.DB.prepare('SELECT COUNT(*) as count FROM translation_jobs');
    
    const total = await totalQuery.first<{ count: number }>();

    return c.json({
      jobs: jobs.results || [],
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Admin jobs list error:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// GET /api/admin/analytics - Daily/monthly analytics
admin.get('/analytics', requireAuth, requireAdmin, async (c) => {
  try {
    const period = c.req.query('period') || 'daily'; // daily, weekly, monthly
    const days = period === 'daily' ? 30 : period === 'weekly' ? 90 : 365;

    // Get analytics for the period
    const analytics = await c.env.DB.prepare(`
      SELECT 
        date, new_signups, active_users, revenue_usd, words_translated
      FROM admin_analytics
      WHERE date >= date('now', '-${days} days')
      ORDER BY date DESC
    `).all();

    // Get plan distribution
    const planDistribution = await c.env.DB.prepare(`
      SELECT 
        subscription_plan,
        COUNT(*) as count
      FROM users
      WHERE subscription_plan != 'free'
      GROUP BY subscription_plan
    `).all();

    // Get top users by usage
    const topUsers = await c.env.DB.prepare(`
      SELECT 
        id, email, display_name, total_words_used, subscription_plan
      FROM users
      WHERE total_words_used > 0
      ORDER BY total_words_used DESC
      LIMIT 10
    `).all();

    return c.json({
      dailyAnalytics: analytics.results || [],
      planDistribution: planDistribution.results || [],
      topUsers: topUsers.results || []
    });

  } catch (error) {
    console.error('Admin analytics error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// GET /api/admin/api-costs - API cost tracking
admin.get('/api-costs', requireAuth, requireAdmin, async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '30');

    // Calculate estimated API costs from translation jobs
    // Assuming average cost per 1000 words
    const costPer1000Words = 0.002; // $0.002 for GPT-4o-mini

    const costs = await c.env.DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        SUM(credits_used) as total_words,
        COUNT(*) as job_count
      FROM translation_jobs
      WHERE status = 'completed'
        AND created_at >= date('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).all();

    const results = (costs.results || []).map((day: any) => ({
      date: day.date,
      totalWords: day.total_words,
      jobCount: day.job_count,
      estimatedCost: (day.total_words / 1000) * costPer1000Words
    }));

    const totalCost = results.reduce((sum, day) => sum + day.estimatedCost, 0);

    return c.json({
      dailyCosts: results,
      totalEstimatedCost: totalCost,
      period: `${days} days`,
      costPer1000Words
    });

  } catch (error) {
    console.error('Admin API costs error:', error);
    return c.json({ error: 'Failed to fetch API costs' }, 500);
  }
});

// DELETE /api/admin/jobs/:id - Delete a translation job (cleanup)
admin.delete('/jobs/:id', requireAuth, requireAdmin, async (c) => {
  try {
    const jobId = parseInt(c.req.param('id'));

    if (isNaN(jobId)) {
      return c.json({ error: 'Invalid job ID' }, 400);
    }

    await c.env.DB.prepare('DELETE FROM translation_jobs WHERE id = ?').bind(jobId).run();

    return c.json({
      message: 'Job deleted successfully',
      id: jobId
    });

  } catch (error) {
    console.error('Admin delete job error:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

export default admin;

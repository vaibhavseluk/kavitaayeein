// Admin API routes (admin-only access)

import { Hono } from 'hono';
import type { Env, User, Report } from '../lib/types';

const admin = new Hono<{ Bindings: Env }>();

// Middleware to check admin role
admin.use('/*', async (c, next) => {
  const userRole = c.get('userRole');
  if (userRole !== 'admin') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }
  await next();
});

// Get all users
admin.get('/users', async (c) => {
  try {
    const status = c.req.query('status'); // active, banned
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = parseInt(c.req.query('offset') || '0');

    let query = `
      SELECT id, username, email, role, status, display_name, is_featured, 
             featured_until, created_at
      FROM users
    `;

    const params: any[] = [];

    if (status && ['active', 'banned'].includes(status)) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await c.env.DB.prepare(query).bind(...params).all<User>();

    return c.json({
      users: result.results || [],
      count: result.results?.length || 0
    });

  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Ban/Unban user
admin.put('/users/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    if (!['active', 'banned'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const result = await c.env.DB.prepare(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, id).run();

    if (!result.success) {
      return c.json({ error: 'Failed to update user status' }, 500);
    }

    return c.json({ 
      success: true, 
      message: `User ${status === 'banned' ? 'banned' : 'unbanned'} successfully` 
    });

  } catch (error) {
    console.error('Update user status error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all reports
admin.get('/reports', async (c) => {
  try {
    const status = c.req.query('status') || 'pending';
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await c.env.DB.prepare(`
      SELECT r.*, p.title as poem_title, p.author_id, p.language,
             u1.username as reporter_username,
             u2.username as reviewer_username,
             u3.username as author_username
      FROM reports r
      LEFT JOIN poems p ON r.poem_id = p.id
      LEFT JOIN users u1 ON r.reporter_id = u1.id
      LEFT JOIN users u2 ON r.reviewed_by = u2.id
      LEFT JOIN users u3 ON p.author_id = u3.id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(status, limit, offset).all();

    return c.json({
      reports: result.results || [],
      count: result.results?.length || 0
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Review report
admin.put('/reports/:id', async (c) => {
  try {
    const reportId = c.req.param('id');
    const userId = c.get('userId');
    const { status, action } = await c.req.json();

    if (!['reviewed', 'dismissed', 'action_taken'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    // Get report details
    const report = await c.env.DB.prepare('SELECT poem_id FROM reports WHERE id = ?')
      .bind(reportId).first<{ poem_id: number }>();

    if (!report) {
      return c.json({ error: 'Report not found' }, 404);
    }

    // Update report status
    await c.env.DB.prepare(
      'UPDATE reports SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, userId, reportId).run();

    // Take action if specified
    if (action === 'delete_poem' && status === 'action_taken') {
      await c.env.DB.prepare(
        'UPDATE poems SET status = \'deleted\', updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(report.poem_id).run();
    } else if (action === 'flag_poem' && status === 'action_taken') {
      await c.env.DB.prepare(
        'UPDATE poems SET status = \'flagged\', updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(report.poem_id).run();
    }

    return c.json({ success: true, message: 'Report reviewed successfully' });

  } catch (error) {
    console.error('Review report error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Flag poem directly
admin.put('/poems/:id/flag', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    if (!['published', 'flagged', 'deleted'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const result = await c.env.DB.prepare(
      'UPDATE poems SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, id).run();

    if (!result.success) {
      return c.json({ error: 'Failed to update poem status' }, 500);
    }

    return c.json({ success: true, message: 'Poem status updated successfully' });

  } catch (error) {
    console.error('Flag poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get platform statistics
admin.get('/stats', async (c) => {
  try {
    // Total users
    const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users')
      .first<{ count: number }>();

    // Total poems
    const totalPoems = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM poems WHERE status = \'published\''
    ).first<{ count: number }>();

    // Pending reports
    const pendingReports = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM reports WHERE status = \'pending\''
    ).first<{ count: number }>();

    // Active subscriptions
    const activeSubscriptions = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM subscriptions WHERE status = \'active\''
    ).first<{ count: number }>();

    // Poems by language
    const poemsByLanguage = await c.env.DB.prepare(`
      SELECT language, COUNT(*) as count 
      FROM poems 
      WHERE status = 'published' 
      GROUP BY language
    `).all<{ language: string; count: number }>();

    // Recent activity (last 7 days)
    const recentPoems = await c.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM poems 
      WHERE status = 'published' AND created_at >= datetime('now', '-7 days')
    `).first<{ count: number }>();

    const recentUsers = await c.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', '-7 days')
    `).first<{ count: number }>();

    return c.json({
      stats: {
        total_users: totalUsers?.count || 0,
        total_poems: totalPoems?.count || 0,
        pending_reports: pendingReports?.count || 0,
        active_subscriptions: activeSubscriptions?.count || 0,
        poems_by_language: poemsByLanguage.results || [],
        recent_poems_7d: recentPoems?.count || 0,
        recent_users_7d: recentUsers?.count || 0
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get top poems for anthology
admin.get('/anthology/candidates', async (c) => {
  try {
    const language = c.req.query('language');
    const limit = parseInt(c.req.query('limit') || '50');

    let query = `
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' AND p.anthology_eligible = 1
    `;

    const params: any[] = [];

    if (language && ['en', 'hi', 'mr'].includes(language)) {
      query += ' AND p.language = ?';
      params.push(language);
    }

    query += ` 
      ORDER BY 
        (CAST(p.rating_sum AS REAL) / NULLIF(p.rating_count, 0)) DESC,
        p.like_count DESC,
        p.view_count DESC
      LIMIT ?
    `;
    params.push(limit);

    const result = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({
      candidates: result.results || [],
      count: result.results?.length || 0
    });

  } catch (error) {
    console.error('Get anthology candidates error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Mark poems for anthology
admin.post('/anthology/select', async (c) => {
  try {
    const { poem_ids, anthology_edition } = await c.req.json();

    if (!poem_ids || !Array.isArray(poem_ids) || poem_ids.length === 0) {
      return c.json({ error: 'poem_ids array is required' }, 400);
    }

    if (!anthology_edition) {
      return c.json({ error: 'anthology_edition is required' }, 400);
    }

    // Insert anthology submissions
    for (const poemId of poem_ids) {
      await c.env.DB.prepare(
        `INSERT OR IGNORE INTO anthology_submissions (poem_id, anthology_edition, status) 
         VALUES (?, ?, 'selected')`
      ).bind(poemId, anthology_edition).run();
    }

    return c.json({ 
      success: true, 
      message: `${poem_ids.length} poems selected for anthology: ${anthology_edition}` 
    });

  } catch (error) {
    console.error('Select anthology error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default admin;

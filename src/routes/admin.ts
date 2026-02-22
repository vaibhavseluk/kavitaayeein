import { Hono } from 'hono';
import type { Env, User, Report } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';

const admin = new Hono<{ Bindings: Env }>();

// Middleware to check admin role
const adminOnly = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  if (!token) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const payload = await verifyToken(token, c.env);
  if (!payload || payload.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  c.set('user', payload);
  await next();
};

admin.use('/*', adminOnly);

// Get dashboard statistics
admin.get('/stats', async (c) => {
  try {
    const totalUsers = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM users WHERE status = ?'
    ).bind('active').first<{ count: number }>();

    const totalPoems = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM poems WHERE status = ?'
    ).bind('published').first<{ count: number }>();

    const pendingReports = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM reports WHERE status = ?'
    ).bind('pending').first<{ count: number }>();

    const featuredPoets = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM users WHERE is_featured = 1 AND (featured_until IS NULL OR featured_until > CURRENT_TIMESTAMP)'
    ).first<{ count: number }>();

    return c.json({
      total_users: totalUsers?.count || 0,
      total_poems: totalPoems?.count || 0,
      pending_reports: pendingReports?.count || 0,
      featured_poets: featuredPoets?.count || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Get all users
admin.get('/users', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const { results } = await c.env.DB.prepare(`
      SELECT id, username, email, role, status, display_name, 
             is_featured, featured_until, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all<User>();

    return c.json({ users: results || [] });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
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

    await c.env.DB.prepare(
      'UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, id).run();

    return c.json({ message: `User ${status === 'banned' ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    console.error('Update user status error:', error);
    return c.json({ error: 'Failed to update user status' }, 500);
  }
});

// Delete user (hard delete)
admin.delete('/users/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // Don't allow deleting admin users
    const user = await c.env.DB.prepare(
      'SELECT role FROM users WHERE id = ?'
    ).bind(id).first<{ role: string }>();

    if (user?.role === 'admin') {
      return c.json({ error: 'Cannot delete admin users' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get all reports
admin.get('/reports', async (c) => {
  try {
    const status = c.req.query('status');
    
    let query = `
      SELECT r.*, p.title as poem_title, p.content as poem_content,
             u.username as reporter_username
      FROM reports r
      JOIN poems p ON r.poem_id = p.id
      LEFT JOIN users u ON r.reporter_id = u.id
    `;
    
    const params: any[] = [];
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const { results } = await c.env.DB.prepare(query).bind(...params).all<Report>();

    return c.json({ reports: results || [] });
  } catch (error) {
    console.error('Get reports error:', error);
    return c.json({ error: 'Failed to fetch reports' }, 500);
  }
});

// Update report status
admin.put('/reports/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, action } = await c.req.json();
    const user = c.get('user');

    if (!['pending', 'reviewed', 'dismissed', 'action_taken'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    // If action is taken, update the poem status
    if (action === 'delete_poem') {
      const report = await c.env.DB.prepare(
        'SELECT poem_id FROM reports WHERE id = ?'
      ).bind(id).first<{ poem_id: number }>();

      if (report) {
        await c.env.DB.prepare(
          'UPDATE poems SET status = ? WHERE id = ?'
        ).bind('deleted', report.poem_id).run();
      }
    }

    await c.env.DB.prepare(
      'UPDATE reports SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, user.userId, id).run();

    return c.json({ message: 'Report updated successfully' });
  } catch (error) {
    console.error('Update report error:', error);
    return c.json({ error: 'Failed to update report' }, 500);
  }
});

// Get all poems (including flagged and deleted)
admin.get('/poems', async (c) => {
  try {
    const status = c.req.query('status');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    let query = `
      SELECT p.*, u.username as author_name, u.display_name as author_display_name
      FROM poems p
      JOIN users u ON p.author_id = u.id
    `;
    
    const params: any[] = [];
    if (status) {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({ poems: results || [] });
  } catch (error) {
    console.error('Get all poems error:', error);
    return c.json({ error: 'Failed to fetch poems' }, 500);
  }
});

// Update poem status (feature/unflag)
admin.put('/poems/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status, is_featured, anthology_eligible } = await c.req.json();

    const updates: string[] = [];
    const params: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (is_featured !== undefined) {
      updates.push('is_featured = ?');
      params.push(is_featured ? 1 : 0);
    }

    if (anthology_eligible !== undefined) {
      updates.push('anthology_eligible = ?');
      params.push(anthology_eligible ? 1 : 0);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No updates provided' }, 400);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await c.env.DB.prepare(
      `UPDATE poems SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...params).run();

    return c.json({ message: 'Poem updated successfully' });
  } catch (error) {
    console.error('Update poem error:', error);
    return c.json({ error: 'Failed to update poem' }, 500);
  }
});

// Get top-rated poems for anthology selection
admin.get('/anthology/eligible', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const minRating = parseFloat(c.req.query('minRating') || '4.0');

    const { results } = await c.env.DB.prepare(`
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CAST(p.rating_sum AS REAL) / p.rating_count as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' 
        AND p.anthology_eligible = 1
        AND p.rating_count >= 10
        AND (CAST(p.rating_sum AS REAL) / p.rating_count) >= ?
      ORDER BY (CAST(p.rating_sum AS REAL) / p.rating_count) DESC, p.rating_count DESC
      LIMIT ?
    `).bind(minRating, limit).all();

    return c.json({ poems: results || [] });
  } catch (error) {
    console.error('Get anthology eligible poems error:', error);
    return c.json({ error: 'Failed to fetch eligible poems' }, 500);
  }
});

// Create anthology submission
admin.post('/anthology/submit', async (c) => {
  try {
    const { poem_ids, anthology_edition } = await c.req.json();

    if (!poem_ids || !Array.isArray(poem_ids) || poem_ids.length === 0) {
      return c.json({ error: 'poem_ids array is required' }, 400);
    }

    if (!anthology_edition) {
      return c.json({ error: 'anthology_edition is required' }, 400);
    }

    // Insert anthology submissions
    for (const poem_id of poem_ids) {
      await c.env.DB.prepare(
        'INSERT OR IGNORE INTO anthology_submissions (poem_id, anthology_edition, status) VALUES (?, ?, ?)'
      ).bind(poem_id, anthology_edition, 'selected').run();
    }

    return c.json({ 
      message: 'Anthology submissions created successfully',
      count: poem_ids.length
    });
  } catch (error) {
    console.error('Create anthology submission error:', error);
    return c.json({ error: 'Failed to create anthology submissions' }, 500);
  }
});

export default admin;

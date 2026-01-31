import { Hono } from 'hono';
import type { Env } from '../../lib/types';

const refunds = new Hono<{ Bindings: Env }>();

// Middleware to check authentication
const requireAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, is_admin FROM users WHERE id = ?
    `).bind(parseInt(token)).first();

    if (!user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// POST /api/refunds/request - Submit a refund request for technical errors
refunds.post('/request', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const { translation_job_id, reason, description, words_affected } = await c.req.json();

    // Validate input
    if (!reason || !description) {
      return c.json({ 
        error: 'reason and description are required' 
      }, 400);
    }

    const validReasons = ['technical_error', 'garbled_output', 'system_failure', 'other'];
    if (!validReasons.includes(reason)) {
      return c.json({ 
        error: 'Invalid reason. Must be one of: ' + validReasons.join(', ') 
      }, 400);
    }

    // If job_id provided, verify it belongs to user and get word count
    let actualWordsAffected = words_affected || 0;
    let creditsToRefund = 0;

    if (translation_job_id) {
      const job = await c.env.DB.prepare(`
        SELECT user_id, credits_used, words_translated, status
        FROM translation_jobs
        WHERE id = ? AND user_id = ?
      `).bind(translation_job_id, user.id).first();

      if (!job) {
        return c.json({ 
          error: 'Translation job not found or does not belong to you' 
        }, 404);
      }

      // Auto-calculate affected words and credits
      actualWordsAffected = job.words_translated;
      creditsToRefund = job.credits_used;
    }

    // Create refund request
    const result = await c.env.DB.prepare(`
      INSERT INTO refund_requests (
        user_id, translation_job_id, reason, description, 
        words_affected, credits_to_refund, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      user.id,
      translation_job_id || null,
      reason,
      description,
      actualWordsAffected,
      creditsToRefund
    ).run();

    // Get the created request
    const refundRequest = await c.env.DB.prepare(`
      SELECT * FROM refund_requests WHERE id = ?
    `).bind(result.meta.last_row_id).first();

    return c.json({
      message: 'Refund request submitted successfully. We will review it within 48 hours.',
      request: refundRequest
    }, 201);

  } catch (error) {
    console.error('Refund request error:', error);
    return c.json({ error: 'Failed to submit refund request' }, 500);
  }
});

// GET /api/refunds - Get user's refund requests
refunds.get('/', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const status = c.req.query('status') || '';

    let query = `
      SELECT 
        r.id, r.translation_job_id, r.reason, r.description,
        r.words_affected, r.credits_to_refund, r.status,
        r.admin_notes, r.created_at, r.reviewed_at, r.refunded_at,
        t.original_filename, t.target_languages
      FROM refund_requests r
      LEFT JOIN translation_jobs t ON r.translation_job_id = t.id
      WHERE r.user_id = ?
    `;

    const params: any[] = [user.id];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const requests = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({
      requests: requests.results || []
    });

  } catch (error) {
    console.error('Get refund requests error:', error);
    return c.json({ error: 'Failed to fetch refund requests' }, 500);
  }
});

// GET /api/refunds/:id - Get specific refund request details
refunds.get('/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const requestId = parseInt(c.req.param('id'));

    if (isNaN(requestId)) {
      return c.json({ error: 'Invalid request ID' }, 400);
    }

    const refundRequest = await c.env.DB.prepare(`
      SELECT 
        r.id, r.translation_job_id, r.reason, r.description,
        r.words_affected, r.credits_to_refund, r.status,
        r.admin_notes, r.created_at, r.reviewed_at, r.refunded_at,
        t.original_filename, t.target_languages, t.status as job_status
      FROM refund_requests r
      LEFT JOIN translation_jobs t ON r.translation_job_id = t.id
      WHERE r.id = ? AND r.user_id = ?
    `).bind(requestId, user.id).first();

    if (!refundRequest) {
      return c.json({ error: 'Refund request not found' }, 404);
    }

    return c.json({ request: refundRequest });

  } catch (error) {
    console.error('Get refund request error:', error);
    return c.json({ error: 'Failed to fetch refund request' }, 500);
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Middleware to check admin privileges
const requireAdmin = async (c: any, next: any) => {
  const user = c.get('user');
  if (!user || !user.is_admin) {
    return c.json({ error: 'Admin access required' }, 403);
  }
  await next();
};

// GET /api/refunds/admin/pending - Get all pending refund requests (Admin only)
refunds.get('/admin/pending', requireAuth, requireAdmin, async (c) => {
  try {
    const requests = await c.env.DB.prepare(`
      SELECT 
        r.id, r.user_id, r.translation_job_id, r.reason, r.description,
        r.words_affected, r.credits_to_refund, r.status,
        r.created_at,
        u.email, u.name,
        t.original_filename, t.target_languages
      FROM refund_requests r
      INNER JOIN users u ON r.user_id = u.id
      LEFT JOIN translation_jobs t ON r.translation_job_id = t.id
      WHERE r.status = 'pending'
      ORDER BY r.created_at ASC
    `).all();

    return c.json({
      requests: requests.results || [],
      count: requests.results?.length || 0
    });

  } catch (error) {
    console.error('Admin get pending refunds error:', error);
    return c.json({ error: 'Failed to fetch pending refunds' }, 500);
  }
});

// POST /api/refunds/admin/:id/approve - Approve and process refund (Admin only)
refunds.post('/admin/:id/approve', requireAuth, requireAdmin, async (c) => {
  try {
    const adminUser = c.get('user');
    const requestId = parseInt(c.req.param('id'));
    const { admin_notes } = await c.req.json();

    if (isNaN(requestId)) {
      return c.json({ error: 'Invalid request ID' }, 400);
    }

    // Get refund request details
    const refundRequest = await c.env.DB.prepare(`
      SELECT 
        r.id, r.user_id, r.credits_to_refund, r.status
      FROM refund_requests r
      WHERE r.id = ?
    `).bind(requestId).first<any>();

    if (!refundRequest) {
      return c.json({ error: 'Refund request not found' }, 404);
    }

    if (refundRequest.status !== 'pending') {
      return c.json({ 
        error: 'Refund request has already been processed' 
      }, 400);
    }

    // Start transaction-like operations
    const now = new Date().toISOString();

    // 1. Update refund request status to approved
    await c.env.DB.prepare(`
      UPDATE refund_requests
      SET status = 'approved',
          admin_notes = ?,
          reviewed_by = ?,
          reviewed_at = ?,
          refunded_at = ?
      WHERE id = ?
    `).bind(
      admin_notes || 'Refund approved',
      adminUser.id,
      now,
      now,
      requestId
    ).run();

    // 2. Refund credits to user account
    await c.env.DB.prepare(`
      UPDATE users
      SET word_credits = word_credits + ?
      WHERE id = ?
    `).bind(refundRequest.credits_to_refund, refundRequest.user_id).run();

    // 3. Log the credit transaction
    await c.env.DB.prepare(`
      INSERT INTO credit_purchases (
        user_id, amount_usd, word_credits, status, metadata
      ) VALUES (?, ?, ?, 'completed', ?)
    `).bind(
      refundRequest.user_id,
      0,
      refundRequest.credits_to_refund,
      JSON.stringify({
        type: 'refund',
        refund_request_id: requestId,
        reason: 'Technical error refund',
        approved_by: adminUser.id
      })
    ).run();

    // Get updated refund request
    const updated = await c.env.DB.prepare(`
      SELECT 
        r.*,
        u.email, u.name
      FROM refund_requests r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).bind(requestId).first();

    return c.json({
      message: 'Refund approved and credits refunded successfully',
      request: updated,
      credits_refunded: refundRequest.credits_to_refund
    });

  } catch (error) {
    console.error('Approve refund error:', error);
    return c.json({ error: 'Failed to approve refund' }, 500);
  }
});

// POST /api/refunds/admin/:id/reject - Reject refund request (Admin only)
refunds.post('/admin/:id/reject', requireAuth, requireAdmin, async (c) => {
  try {
    const adminUser = c.get('user');
    const requestId = parseInt(c.req.param('id'));
    const { admin_notes } = await c.req.json();

    if (isNaN(requestId)) {
      return c.json({ error: 'Invalid request ID' }, 400);
    }

    if (!admin_notes) {
      return c.json({ 
        error: 'admin_notes is required when rejecting a refund' 
      }, 400);
    }

    // Get refund request
    const refundRequest = await c.env.DB.prepare(`
      SELECT id, status FROM refund_requests WHERE id = ?
    `).bind(requestId).first<any>();

    if (!refundRequest) {
      return c.json({ error: 'Refund request not found' }, 404);
    }

    if (refundRequest.status !== 'pending') {
      return c.json({ 
        error: 'Refund request has already been processed' 
      }, 400);
    }

    // Update refund request status to rejected
    await c.env.DB.prepare(`
      UPDATE refund_requests
      SET status = 'rejected',
          admin_notes = ?,
          reviewed_by = ?,
          reviewed_at = ?
      WHERE id = ?
    `).bind(
      admin_notes,
      adminUser.id,
      new Date().toISOString(),
      requestId
    ).run();

    // Get updated refund request
    const updated = await c.env.DB.prepare(`
      SELECT 
        r.*,
        u.email, u.name
      FROM refund_requests r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).bind(requestId).first();

    return c.json({
      message: 'Refund request rejected',
      request: updated
    });

  } catch (error) {
    console.error('Reject refund error:', error);
    return c.json({ error: 'Failed to reject refund' }, 500);
  }
});

// GET /api/refunds/admin/stats - Get refund statistics (Admin only)
refunds.get('/admin/stats', requireAuth, requireAdmin, async (c) => {
  try {
    // Get overall stats
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN status = 'approved' THEN credits_to_refund ELSE 0 END) as total_credits_refunded
      FROM refund_requests
    `).first();

    // Get recent requests
    const recentRequests = await c.env.DB.prepare(`
      SELECT 
        r.id, r.reason, r.status, r.credits_to_refund, r.created_at,
        u.email, u.name
      FROM refund_requests r
      INNER JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `).all();

    return c.json({
      stats,
      recent_requests: recentRequests.results || []
    });

  } catch (error) {
    console.error('Get refund stats error:', error);
    return c.json({ error: 'Failed to fetch refund statistics' }, 500);
  }
});

export default refunds;

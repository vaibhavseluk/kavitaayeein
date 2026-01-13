import { Hono } from 'hono';
import type { Env, Poem } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';

const poems = new Hono<{ Bindings: Env }>();

// Get all poems (public, with filters and sorting)
poems.get('/', async (c) => {
  try {
    const language = c.req.query('language');
    const featured = c.req.query('featured');
    const sort = c.req.query('sort') || 'newest'; // newest, popular, top_rated
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    let query = `
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
    `;
    const params: any[] = [];

    if (language) {
      query += ' AND p.language = ?';
      params.push(language);
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = 1';
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        // Sort by like count, then rating, then views
        query += ' ORDER BY p.like_count DESC, (CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END) DESC, p.view_count DESC, p.created_at DESC';
        break;
      case 'top_rated':
        // Sort by rating, then likes
        query += ' ORDER BY (CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END) DESC, p.like_count DESC, p.created_at DESC';
        break;
      case 'newest':
      default:
        // Sort by newest first
        query += ' ORDER BY p.created_at DESC';
        break;
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all<Poem>();

    return c.json({ 
      poems: results || [],
      limit,
      offset,
      sort
    });
  } catch (error) {
    console.error('Get poems error:', error);
    return c.json({ error: 'Failed to fetch poems' }, 500);
  }
});

// Get single poem by ID
poems.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // Increment view count
    await c.env.DB.prepare(
      'UPDATE poems SET view_count = view_count + 1 WHERE id = ?'
    ).bind(id).run();

    // Get poem with author details
    const poem = await c.env.DB.prepare(`
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `).bind(id).first<Poem>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    return c.json({ poem });
  } catch (error) {
    console.error('Get poem error:', error);
    return c.json({ error: 'Failed to fetch poem' }, 500);
  }
});

// Create new poem (authenticated)
poems.post('/', async (c) => {
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

    const { title, content, language, status } = await c.req.json();

    if (!title || !content || !language) {
      return c.json({ error: 'Title, content, and language are required' }, 400);
    }

    if (!['en', 'hi', 'mr'].includes(language)) {
      return c.json({ error: 'Invalid language' }, 400);
    }

    // Check user's subscription tier and poem count
    const user = await c.env.DB.prepare(`
      SELECT subscription_tier, subscription_expires_at, poem_limit
      FROM users
      WHERE id = ?
    `).bind(payload.userId).first<{ 
      subscription_tier: string;
      subscription_expires_at: string | null;
      poem_limit: number;
    }>();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if subscription has expired
    if (user.subscription_tier === 'premium' && user.subscription_expires_at) {
      const expiresAt = new Date(user.subscription_expires_at);
      if (expiresAt < new Date()) {
        // Subscription expired, downgrade to free
        await c.env.DB.prepare(`
          UPDATE users 
          SET subscription_tier = 'free', poem_limit = 10
          WHERE id = ?
        `).bind(payload.userId).run();
        
        user.subscription_tier = 'free';
        user.poem_limit = 10;
      }
    }

    // For free tier, check poem limit
    if (user.subscription_tier === 'free') {
      const poemCount = await c.env.DB.prepare(`
        SELECT COUNT(*) as count
        FROM poems
        WHERE author_id = ? AND status != 'deleted'
      `).bind(payload.userId).first<{ count: number }>();

      if (poemCount && poemCount.count >= user.poem_limit) {
        return c.json({ 
          error: 'Poem limit reached',
          message: `You have reached the limit of ${user.poem_limit} poems for the free plan. Upgrade to Premium ($4.66/year) for unlimited poems.`,
          limit_reached: true,
          current_count: poemCount.count,
          limit: user.poem_limit,
          upgrade_required: true
        }, 403);
      }
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO poems (title, content, language, author_id, status)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id
    `).bind(title, content, language, payload.userId, status || 'published').first();

    // Get updated poem count
    const updatedCount = await c.env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM poems
      WHERE author_id = ? AND status != 'deleted'
    `).bind(payload.userId).first<{ count: number }>();

    return c.json({ 
      message: 'Poem created successfully',
      poem_id: result?.id,
      poems_remaining: user.subscription_tier === 'free' 
        ? user.poem_limit - (updatedCount?.count || 0)
        : 'unlimited'
    }, 201);
  } catch (error) {
    console.error('Create poem error:', error);
    return c.json({ error: 'Failed to create poem' }, 500);
  }
});

// Update poem (authenticated, owner or admin)
poems.put('/:id', async (c) => {
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

    const id = c.req.param('id');
    const { title, content, language, status } = await c.req.json();

    // Check ownership
    const poem = await c.env.DB.prepare(
      'SELECT author_id FROM poems WHERE id = ?'
    ).bind(id).first<{ author_id: number }>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    if (poem.author_id !== payload.userId && payload.role !== 'admin') {
      return c.json({ error: 'Not authorized' }, 403);
    }

    await c.env.DB.prepare(`
      UPDATE poems 
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          language = COALESCE(?, language),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(title, content, language, status, id).run();

    return c.json({ message: 'Poem updated successfully' });
  } catch (error) {
    console.error('Update poem error:', error);
    return c.json({ error: 'Failed to update poem' }, 500);
  }
});

// Delete poem (authenticated, owner or admin)
poems.delete('/:id', async (c) => {
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

    const id = c.req.param('id');

    // Check ownership
    const poem = await c.env.DB.prepare(
      'SELECT author_id FROM poems WHERE id = ?'
    ).bind(id).first<{ author_id: number }>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    if (poem.author_id !== payload.userId && payload.role !== 'admin') {
      return c.json({ error: 'Not authorized' }, 403);
    }

    // Soft delete
    await c.env.DB.prepare(
      'UPDATE poems SET status = ? WHERE id = ?'
    ).bind('deleted', id).run();

    return c.json({ message: 'Poem deleted successfully' });
  } catch (error) {
    console.error('Delete poem error:', error);
    return c.json({ error: 'Failed to delete poem' }, 500);
  }
});

// Get user's own poems (authenticated)
poems.get('/user/my-poems', async (c) => {
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

    const { results } = await c.env.DB.prepare(`
      SELECT p.*, 
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      WHERE p.author_id = ? AND p.status != 'deleted'
      ORDER BY p.created_at DESC
    `).bind(payload.userId).all<Poem>();

    return c.json({ poems: results || [] });
  } catch (error) {
    console.error('Get user poems error:', error);
    return c.json({ error: 'Failed to fetch poems' }, 500);
  }
});

// Get user's subscription status (authenticated)
poems.get('/user/subscription-status', async (c) => {
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

    const user = await c.env.DB.prepare(`
      SELECT subscription_tier, subscription_expires_at, poem_limit
      FROM users
      WHERE id = ?
    `).bind(payload.userId).first<{ 
      subscription_tier: string;
      subscription_expires_at: string | null;
      poem_limit: number;
    }>();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if subscription has expired
    let isExpired = false;
    if (user.subscription_tier === 'premium' && user.subscription_expires_at) {
      const expiresAt = new Date(user.subscription_expires_at);
      if (expiresAt < new Date()) {
        isExpired = true;
        // Auto-downgrade
        await c.env.DB.prepare(`
          UPDATE users 
          SET subscription_tier = 'free', poem_limit = 10
          WHERE id = ?
        `).bind(payload.userId).run();
        
        user.subscription_tier = 'free';
        user.poem_limit = 10;
      }
    }

    const poemCount = await c.env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM poems
      WHERE author_id = ? AND status != 'deleted'
    `).bind(payload.userId).first<{ count: number }>();

    return c.json({
      subscription_tier: user.subscription_tier,
      expires_at: user.subscription_expires_at,
      is_expired: isExpired,
      poem_limit: user.poem_limit,
      poems_used: poemCount?.count || 0,
      poems_remaining: user.subscription_tier === 'free' 
        ? Math.max(0, user.poem_limit - (poemCount?.count || 0))
        : 'unlimited',
      can_create_poem: user.subscription_tier === 'premium' || 
        (poemCount?.count || 0) < user.poem_limit
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return c.json({ error: 'Failed to fetch subscription status' }, 500);
  }
});

// Like a poem (authenticated)
poems.post('/:id/like', async (c) => {
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

    const id = c.req.param('id');

    // Check if already liked
    const existing = await c.env.DB.prepare(
      'SELECT id FROM poem_likes WHERE poem_id = ? AND user_id = ?'
    ).bind(id, payload.userId).first();

    if (existing) {
      // Unlike
      await c.env.DB.prepare(
        'DELETE FROM poem_likes WHERE poem_id = ? AND user_id = ?'
      ).bind(id, payload.userId).run();

      await c.env.DB.prepare(
        'UPDATE poems SET like_count = like_count - 1 WHERE id = ?'
      ).bind(id).run();

      return c.json({ message: 'Poem unliked', liked: false });
    } else {
      // Like
      await c.env.DB.prepare(
        'INSERT INTO poem_likes (poem_id, user_id) VALUES (?, ?)'
      ).bind(id, payload.userId).run();

      await c.env.DB.prepare(
        'UPDATE poems SET like_count = like_count + 1 WHERE id = ?'
      ).bind(id).run();

      return c.json({ message: 'Poem liked', liked: true });
    }
  } catch (error) {
    console.error('Like poem error:', error);
    return c.json({ error: 'Failed to like poem' }, 500);
  }
});

// Rate a poem (authenticated)
poems.post('/:id/rate', async (c) => {
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

    const id = c.req.param('id');
    const { rating } = await c.req.json();

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    // Check if already rated
    const existing = await c.env.DB.prepare(
      'SELECT rating FROM poem_ratings WHERE poem_id = ? AND user_id = ?'
    ).bind(id, payload.userId).first<{ rating: number }>();

    if (existing) {
      // Update rating
      const diff = rating - existing.rating;
      
      await c.env.DB.prepare(
        'UPDATE poem_ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE poem_id = ? AND user_id = ?'
      ).bind(rating, id, payload.userId).run();

      await c.env.DB.prepare(
        'UPDATE poems SET rating_sum = rating_sum + ? WHERE id = ?'
      ).bind(diff, id).run();
    } else {
      // New rating
      await c.env.DB.prepare(
        'INSERT INTO poem_ratings (poem_id, user_id, rating) VALUES (?, ?, ?)'
      ).bind(id, payload.userId, rating).run();

      await c.env.DB.prepare(
        'UPDATE poems SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?'
      ).bind(rating, id).run();
    }

    return c.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate poem error:', error);
    return c.json({ error: 'Failed to rate poem' }, 500);
  }
});

export default poems;

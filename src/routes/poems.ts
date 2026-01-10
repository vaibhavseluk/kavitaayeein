// Poems API routes

import { Hono } from 'hono';
import type { Env, Poem } from '../lib/types';

const poems = new Hono<{ Bindings: Env }>();

// Get all poems (public feed with filters)
poems.get('/', async (c) => {
  try {
    const language = c.req.query('language'); // Filter by language
    const sort = c.req.query('sort') || 'newest'; // newest, popular, top_rated
    const featured = c.req.query('featured'); // Filter featured poems
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

    if (language && ['en', 'hi', 'mr'].includes(language)) {
      query += ' AND p.language = ?';
      params.push(language);
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = 1';
    }

    // Sorting
    if (sort === 'popular') {
      query += ' ORDER BY p.view_count DESC, p.created_at DESC';
    } else if (sort === 'top_rated') {
      query += ' ORDER BY average_rating DESC, p.rating_count DESC, p.created_at DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await c.env.DB.prepare(query).bind(...params).all<Poem>();

    return c.json({
      poems: result.results || [],
      count: result.results?.length || 0
    });

  } catch (error) {
    console.error('Get poems error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get single poem by ID
poems.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const poem = await c.env.DB.prepare(`
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ? AND p.status != 'deleted'
    `).bind(id).first<Poem>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    // Increment view count
    await c.env.DB.prepare('UPDATE poems SET view_count = view_count + 1 WHERE id = ?')
      .bind(id).run();

    return c.json({ poem });

  } catch (error) {
    console.error('Get poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create new poem (authenticated)
poems.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, content, language, status } = await c.req.json();

    // Validate input
    if (!title || !content || !language) {
      return c.json({ error: 'Title, content, and language are required' }, 400);
    }

    if (!['en', 'hi', 'mr'].includes(language)) {
      return c.json({ error: 'Invalid language' }, 400);
    }

    const poemStatus = status === 'draft' ? 'draft' : 'published';

    const result = await c.env.DB.prepare(
      `INSERT INTO poems (title, content, language, author_id, status) 
       VALUES (?, ?, ?, ?, ?)`
    ).bind(title, content, language, userId, poemStatus).run();

    if (!result.success) {
      return c.json({ error: 'Failed to create poem' }, 500);
    }

    return c.json({ 
      success: true, 
      poem_id: result.meta.last_row_id,
      message: 'Poem created successfully' 
    }, 201);

  } catch (error) {
    console.error('Create poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update poem (authenticated, author only)
poems.put('/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const userRole = c.get('userRole');
    const id = c.req.param('id');

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, content, language, status } = await c.req.json();

    // Check ownership (unless admin)
    const poem = await c.env.DB.prepare('SELECT author_id FROM poems WHERE id = ?')
      .bind(id).first<{ author_id: number }>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    if (userRole !== 'admin' && poem.author_id !== userId) {
      return c.json({ error: 'Forbidden: You can only edit your own poems' }, 403);
    }

    const result = await c.env.DB.prepare(
      `UPDATE poems 
       SET title = ?, content = ?, language = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(title, content, language, status || 'published', id).run();

    if (!result.success) {
      return c.json({ error: 'Failed to update poem' }, 500);
    }

    return c.json({ success: true, message: 'Poem updated successfully' });

  } catch (error) {
    console.error('Update poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete poem (authenticated, author or admin)
poems.delete('/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const userRole = c.get('userRole');
    const id = c.req.param('id');

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check ownership (unless admin)
    const poem = await c.env.DB.prepare('SELECT author_id FROM poems WHERE id = ?')
      .bind(id).first<{ author_id: number }>();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    if (userRole !== 'admin' && poem.author_id !== userId) {
      return c.json({ error: 'Forbidden: You can only delete your own poems' }, 403);
    }

    // Soft delete
    const result = await c.env.DB.prepare(
      `UPDATE poems SET status = 'deleted', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(id).run();

    if (!result.success) {
      return c.json({ error: 'Failed to delete poem' }, 500);
    }

    return c.json({ success: true, message: 'Poem deleted successfully' });

  } catch (error) {
    console.error('Delete poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user's poems (authenticated)
poems.get('/user/me', async (c) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const result = await c.env.DB.prepare(`
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CASE WHEN p.rating_count > 0 THEN CAST(p.rating_sum AS REAL) / p.rating_count ELSE 0 END as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = ? AND p.status != 'deleted'
      ORDER BY p.created_at DESC
    `).bind(userId).all<Poem>();

    return c.json({
      poems: result.results || [],
      count: result.results?.length || 0
    });

  } catch (error) {
    console.error('Get user poems error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Like a poem
poems.post('/:id/like', async (c) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');

    // Check if already liked
    const existing = await c.env.DB.prepare(
      'SELECT id FROM poem_likes WHERE poem_id = ? AND user_id = ?'
    ).bind(id, userId).first();

    if (existing) {
      // Unlike
      await c.env.DB.prepare('DELETE FROM poem_likes WHERE poem_id = ? AND user_id = ?')
        .bind(id, userId).run();
      await c.env.DB.prepare('UPDATE poems SET like_count = like_count - 1 WHERE id = ?')
        .bind(id).run();
      return c.json({ success: true, liked: false });
    } else {
      // Like
      await c.env.DB.prepare('INSERT INTO poem_likes (poem_id, user_id) VALUES (?, ?)')
        .bind(id, userId).run();
      await c.env.DB.prepare('UPDATE poems SET like_count = like_count + 1 WHERE id = ?')
        .bind(id).run();
      return c.json({ success: true, liked: true });
    }

  } catch (error) {
    console.error('Like poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Rate a poem
poems.post('/:id/rate', async (c) => {
  try {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const { rating } = await c.req.json();

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400);
    }

    // Check if already rated
    const existing = await c.env.DB.prepare(
      'SELECT id, rating FROM poem_ratings WHERE poem_id = ? AND user_id = ?'
    ).bind(id, userId).first<{ id: number; rating: number }>();

    if (existing) {
      // Update rating
      const oldRating = existing.rating;
      await c.env.DB.prepare(
        'UPDATE poem_ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(rating, existing.id).run();
      
      const ratingDiff = rating - oldRating;
      await c.env.DB.prepare(
        'UPDATE poems SET rating_sum = rating_sum + ? WHERE id = ?'
      ).bind(ratingDiff, id).run();
    } else {
      // New rating
      await c.env.DB.prepare(
        'INSERT INTO poem_ratings (poem_id, user_id, rating) VALUES (?, ?, ?)'
      ).bind(id, userId, rating).run();
      
      await c.env.DB.prepare(
        'UPDATE poems SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE id = ?'
      ).bind(rating, id).run();
    }

    return c.json({ success: true, message: 'Rating submitted' });

  } catch (error) {
    console.error('Rate poem error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default poems;

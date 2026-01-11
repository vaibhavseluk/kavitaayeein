import { Hono } from 'hono';
import type { Env, Poem } from '../lib/types';
import { verifyToken, extractToken } from '../lib/auth';

const anthology = new Hono<{ Bindings: Env }>();

// Admin only middleware
const adminOnly = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);
  if (!token) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403);
  }

  c.set('user', payload);
  await next();
};

anthology.use('/*', adminOnly);

// Get eligible poems for anthology
anthology.get('/eligible', async (c) => {
  try {
    const minRating = parseFloat(c.req.query('minRating') || '4.0');
    const minRatings = parseInt(c.req.query('minRatings') || '5');
    const language = c.req.query('language');
    const limit = parseInt(c.req.query('limit') || '50');

    let query = `
      SELECT p.*, u.username as author_name, u.display_name as author_display_name,
             CAST(p.rating_sum AS REAL) / p.rating_count as average_rating
      FROM poems p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' 
        AND p.anthology_eligible = 1
        AND p.rating_count >= ?
        AND (CAST(p.rating_sum AS REAL) / p.rating_count) >= ?
    `;
    
    const params: any[] = [minRatings, minRating];

    if (language) {
      query += ' AND p.language = ?';
      params.push(language);
    }

    query += ' ORDER BY (CAST(p.rating_sum AS REAL) / p.rating_count) DESC, p.rating_count DESC LIMIT ?';
    params.push(limit);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({ poems: results || [] });
  } catch (error) {
    console.error('Get eligible poems error:', error);
    return c.json({ error: 'Failed to fetch eligible poems' }, 500);
  }
});

// Create anthology edition
anthology.post('/create', async (c) => {
  try {
    const { edition_name, poem_ids, description } = await c.req.json();

    if (!edition_name || !poem_ids || !Array.isArray(poem_ids)) {
      return c.json({ error: 'edition_name and poem_ids array required' }, 400);
    }

    // Insert anthology submissions
    let insertCount = 0;
    for (const poemId of poem_ids) {
      try {
        await c.env.DB.prepare(`
          INSERT OR IGNORE INTO anthology_submissions 
          (poem_id, anthology_edition, status, selection_criteria)
          VALUES (?, ?, 'selected', ?)
        `).bind(poemId, edition_name, description || 'Top rated poems').run();
        insertCount++;
      } catch (err) {
        console.error(`Failed to add poem ${poemId}:`, err);
      }
    }

    return c.json({
      message: 'Anthology created successfully',
      edition: edition_name,
      poems_added: insertCount,
      total_requested: poem_ids.length
    });
  } catch (error) {
    console.error('Create anthology error:', error);
    return c.json({ error: 'Failed to create anthology' }, 500);
  }
});

// Export anthology to text format (simplified - in production use docx library)
anthology.get('/export/:edition', async (c) => {
  try {
    const edition = c.req.param('edition');

    const { results } = await c.env.DB.prepare(`
      SELECT p.*, u.display_name as author_name,
             CAST(p.rating_sum AS REAL) / p.rating_count as average_rating
      FROM anthology_submissions a
      JOIN poems p ON a.poem_id = p.id
      JOIN users u ON p.author_id = u.id
      WHERE a.anthology_edition = ? AND a.status = 'selected'
      ORDER BY average_rating DESC
    `).bind(edition).all<Poem>();

    if (!results || results.length === 0) {
      return c.json({ error: 'No poems found for this anthology' }, 404);
    }

    // Generate text format (simplified)
    let output = `Poetry Anthology - ${edition}\n`;
    output += `${'='.repeat(50)}\n\n`;
    output += `A curated collection of the finest poetry from our community\n`;
    output += `Total Poems: ${results.length}\n\n`;
    output += `${'='.repeat(50)}\n\n`;

    results.forEach((poem, index) => {
      output += `\n${index + 1}. ${poem.title}\n`;
      output += `   by ${poem.author_name}\n`;
      output += `   Rating: ${poem.average_rating?.toFixed(1) || 'N/A'} ⭐\n`;
      output += `   Language: ${poem.language.toUpperCase()}\n\n`;
      output += `${poem.content}\n\n`;
      output += `${'-'.repeat(50)}\n`;
    });

    output += `\n\n${'='.repeat(50)}\n`;
    output += `End of Anthology\n`;
    output += `© ${new Date().getFullYear()} Poetry Platform. All rights reserved.\n`;

    // Return as downloadable text file
    return new Response(output, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="anthology_${edition.replace(/\s+/g, '_')}.txt"`
      }
    });
  } catch (error) {
    console.error('Export anthology error:', error);
    return c.json({ error: 'Failed to export anthology' }, 500);
  }
});

// Get anthology statistics
anthology.get('/stats', async (c) => {
  try {
    const totalPoems = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM anthology_submissions WHERE status = "selected"'
    ).first<{ count: number }>();

    const editions = await c.env.DB.prepare(`
      SELECT anthology_edition, COUNT(*) as poem_count, 
             MIN(created_at) as created_at
      FROM anthology_submissions
      WHERE status = 'selected'
      GROUP BY anthology_edition
      ORDER BY created_at DESC
    `).all();

    return c.json({
      total_poems: totalPoems?.count || 0,
      total_editions: editions.results?.length || 0,
      editions: editions.results || []
    });
  } catch (error) {
    console.error('Get anthology stats error:', error);
    return c.json({ error: 'Failed to fetch anthology statistics' }, 500);
  }
});

// List all anthology editions
anthology.get('/editions', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        anthology_edition,
        COUNT(*) as poem_count,
        MIN(created_at) as created_at,
        GROUP_CONCAT(status) as statuses
      FROM anthology_submissions
      GROUP BY anthology_edition
      ORDER BY created_at DESC
    `).all();

    return c.json({ editions: results || [] });
  } catch (error) {
    console.error('Get editions error:', error);
    return c.json({ error: 'Failed to fetch editions' }, 500);
  }
});

// Get poems in specific edition
anthology.get('/editions/:edition', async (c) => {
  try {
    const edition = c.req.param('edition');

    const { results } = await c.env.DB.prepare(`
      SELECT p.*, u.display_name as author_name, a.status as submission_status,
             CAST(p.rating_sum AS REAL) / p.rating_count as average_rating
      FROM anthology_submissions a
      JOIN poems p ON a.poem_id = p.id
      JOIN users u ON p.author_id = u.id
      WHERE a.anthology_edition = ?
      ORDER BY average_rating DESC
    `).bind(edition).all();

    return c.json({
      edition: edition,
      poem_count: results?.length || 0,
      poems: results || []
    });
  } catch (error) {
    console.error('Get edition poems error:', error);
    return c.json({ error: 'Failed to fetch edition poems' }, 500);
  }
});

// Update anthology submission status
anthology.put('/submissions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();

    if (!['pending', 'selected', 'published', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    await c.env.DB.prepare(
      'UPDATE anthology_submissions SET status = ? WHERE id = ?'
    ).bind(status, id).run();

    return c.json({ message: 'Submission status updated' });
  } catch (error) {
    console.error('Update submission error:', error);
    return c.json({ error: 'Failed to update submission' }, 500);
  }
});

export default anthology;

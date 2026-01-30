import { Hono } from 'hono';
import { requireAuth } from '../../lib/auth';
import type { Env, User, BrandGlossary } from '../../lib/types';

const glossary = new Hono<{ Bindings: Env }>();

// GET /api/glossary - Get user's brand glossary
glossary.get('/', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;

    const terms = await c.env.DB.prepare(`
      SELECT id, term, locked, category, created_at
      FROM brand_glossary
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(user.id).all<BrandGlossary>();

    return c.json({
      terms: terms.results || [],
      count: terms.results?.length || 0
    });

  } catch (error) {
    console.error('Glossary fetch error:', error);
    return c.json({ error: 'Failed to fetch glossary' }, 500);
  }
});

// POST /api/glossary - Add brand term
glossary.post('/', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { term, category } = await c.req.json();

    if (!term || !term.trim()) {
      return c.json({ error: 'Term is required' }, 400);
    }

    const trimmedTerm = term.trim();

    // Check if term already exists for this user
    const existing = await c.env.DB.prepare(`
      SELECT id FROM brand_glossary 
      WHERE user_id = ? AND LOWER(term) = LOWER(?)
    `).bind(user.id, trimmedTerm).first();

    if (existing) {
      return c.json({ error: 'This term already exists in your glossary' }, 409);
    }

    // Insert new term
    const result = await c.env.DB.prepare(`
      INSERT INTO brand_glossary (user_id, term, locked, category)
      VALUES (?, ?, 1, ?)
    `).bind(user.id, trimmedTerm, category || null).run();

    if (!result.success) {
      return c.json({ error: 'Failed to add term' }, 500);
    }

    // Fetch the created term
    const newTerm = await c.env.DB.prepare(`
      SELECT id, term, locked, category, created_at
      FROM brand_glossary
      WHERE user_id = ? AND LOWER(term) = LOWER(?)
    `).bind(user.id, trimmedTerm).first<BrandGlossary>();

    return c.json({
      message: 'Term added successfully',
      term: newTerm
    }, 201);

  } catch (error) {
    console.error('Add glossary term error:', error);
    return c.json({ error: 'Failed to add term' }, 500);
  }
});

// PUT /api/glossary/:id - Update term
glossary.put('/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const termId = parseInt(c.req.param('id'));
    const { term, locked, category } = await c.req.json();

    if (isNaN(termId)) {
      return c.json({ error: 'Invalid term ID' }, 400);
    }

    // Verify term belongs to user
    const existing = await c.env.DB.prepare(`
      SELECT id FROM brand_glossary 
      WHERE id = ? AND user_id = ?
    `).bind(termId, user.id).first();

    if (!existing) {
      return c.json({ error: 'Term not found' }, 404);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (term !== undefined && term.trim()) {
      updates.push('term = ?');
      values.push(term.trim());
    }
    if (locked !== undefined) {
      updates.push('locked = ?');
      values.push(locked ? 1 : 0);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    values.push(termId);
    values.push(user.id);

    await c.env.DB.prepare(`
      UPDATE brand_glossary 
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `).bind(...values).run();

    // Fetch updated term
    const updatedTerm = await c.env.DB.prepare(`
      SELECT id, term, locked, category, created_at
      FROM brand_glossary
      WHERE id = ? AND user_id = ?
    `).bind(termId, user.id).first<BrandGlossary>();

    return c.json({
      message: 'Term updated successfully',
      term: updatedTerm
    });

  } catch (error) {
    console.error('Update glossary term error:', error);
    return c.json({ error: 'Failed to update term' }, 500);
  }
});

// DELETE /api/glossary/:id - Remove term
glossary.delete('/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const termId = parseInt(c.req.param('id'));

    if (isNaN(termId)) {
      return c.json({ error: 'Invalid term ID' }, 400);
    }

    // Verify term belongs to user
    const existing = await c.env.DB.prepare(`
      SELECT id FROM brand_glossary 
      WHERE id = ? AND user_id = ?
    `).bind(termId, user.id).first();

    if (!existing) {
      return c.json({ error: 'Term not found' }, 404);
    }

    // Delete term
    await c.env.DB.prepare(`
      DELETE FROM brand_glossary 
      WHERE id = ? AND user_id = ?
    `).bind(termId, user.id).run();

    return c.json({
      message: 'Term deleted successfully',
      id: termId
    });

  } catch (error) {
    console.error('Delete glossary term error:', error);
    return c.json({ error: 'Failed to delete term' }, 500);
  }
});

// POST /api/glossary/bulk - Add multiple terms at once
glossary.post('/bulk', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { terms } = await c.req.json();

    if (!Array.isArray(terms) || terms.length === 0) {
      return c.json({ error: 'Terms array is required' }, 400);
    }

    const added: string[] = [];
    const skipped: string[] = [];

    for (const term of terms) {
      const trimmedTerm = String(term).trim();
      if (!trimmedTerm) continue;

      // Check if exists
      const existing = await c.env.DB.prepare(`
        SELECT id FROM brand_glossary 
        WHERE user_id = ? AND LOWER(term) = LOWER(?)
      `).bind(user.id, trimmedTerm).first();

      if (existing) {
        skipped.push(trimmedTerm);
        continue;
      }

      // Insert
      const result = await c.env.DB.prepare(`
        INSERT INTO brand_glossary (user_id, term, locked, category)
        VALUES (?, ?, 1, NULL)
      `).bind(user.id, trimmedTerm).run();

      if (result.success) {
        added.push(trimmedTerm);
      }
    }

    return c.json({
      message: `Added ${added.length} terms, skipped ${skipped.length} duplicates`,
      added,
      skipped
    });

  } catch (error) {
    console.error('Bulk add glossary error:', error);
    return c.json({ error: 'Failed to add terms' }, 500);
  }
});

export default glossary;

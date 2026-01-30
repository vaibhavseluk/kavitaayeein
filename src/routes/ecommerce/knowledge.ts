import { Hono } from 'hono';
import type { Env } from '../../lib/types';

const knowledge = new Hono<{ Bindings: Env }>();

// GET /api/knowledge - List all knowledge base articles
knowledge.get('/', async (c) => {
  try {
    const category = c.req.query('category') || '';
    
    let query = `
      SELECT 
        id, title, slug, category, excerpt, views, helpful_count, 
        not_helpful_count, created_at, updated_at
      FROM knowledge_base
      WHERE published = 1
    `;
    
    const params: any[] = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY views DESC, created_at DESC';

    const articles = await c.env.DB.prepare(query).bind(...params).all();

    // Get categories
    const categories = await c.env.DB.prepare(`
      SELECT DISTINCT category 
      FROM knowledge_base 
      WHERE published = 1
      ORDER BY category
    `).all();

    return c.json({
      articles: articles.results || [],
      categories: (categories.results || []).map((c: any) => c.category)
    });

  } catch (error) {
    console.error('Knowledge base list error:', error);
    return c.json({ error: 'Failed to fetch articles' }, 500);
  }
});

// GET /api/knowledge/:slug - Get article by slug
knowledge.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');

    // Get article
    const article = await c.env.DB.prepare(`
      SELECT 
        id, title, slug, category, content, excerpt,
        views, helpful_count, not_helpful_count,
        created_at, updated_at
      FROM knowledge_base
      WHERE slug = ? AND published = 1
    `).bind(slug).first();

    if (!article) {
      return c.json({ error: 'Article not found' }, 404);
    }

    // Increment view count
    await c.env.DB.prepare(`
      UPDATE knowledge_base 
      SET views = views + 1 
      WHERE id = ?
    `).bind(article.id).run();

    // Get related articles in same category
    const relatedArticles = await c.env.DB.prepare(`
      SELECT id, title, slug, excerpt
      FROM knowledge_base
      WHERE category = ? AND id != ? AND published = 1
      ORDER BY views DESC
      LIMIT 3
    `).bind(article.category, article.id).all();

    return c.json({
      article: {
        ...article,
        views: article.views + 1 // Include the incremented view
      },
      relatedArticles: relatedArticles.results || []
    });

  } catch (error) {
    console.error('Knowledge base article error:', error);
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

// POST /api/knowledge/:id/helpful - Vote article as helpful or not helpful
knowledge.post('/:id/helpful', async (c) => {
  try {
    const articleId = parseInt(c.req.param('id'));
    const { helpful } = await c.req.json();

    if (isNaN(articleId)) {
      return c.json({ error: 'Invalid article ID' }, 400);
    }

    if (helpful === undefined || typeof helpful !== 'boolean') {
      return c.json({ error: 'helpful field (boolean) is required' }, 400);
    }

    // Check if article exists
    const article = await c.env.DB.prepare(`
      SELECT id FROM knowledge_base WHERE id = ?
    `).bind(articleId).first();

    if (!article) {
      return c.json({ error: 'Article not found' }, 404);
    }

    // Update helpful count
    const field = helpful ? 'helpful_count' : 'not_helpful_count';
    await c.env.DB.prepare(`
      UPDATE knowledge_base 
      SET ${field} = ${field} + 1 
      WHERE id = ?
    `).bind(articleId).run();

    // Get updated counts
    const updated = await c.env.DB.prepare(`
      SELECT helpful_count, not_helpful_count 
      FROM knowledge_base 
      WHERE id = ?
    `).bind(articleId).first<{ helpful_count: number; not_helpful_count: number }>();

    return c.json({
      message: 'Thank you for your feedback!',
      helpful: helpful,
      counts: {
        helpful: updated?.helpful_count || 0,
        notHelpful: updated?.not_helpful_count || 0
      }
    });

  } catch (error) {
    console.error('Knowledge base vote error:', error);
    return c.json({ error: 'Failed to record feedback' }, 500);
  }
});

// GET /api/knowledge/search - Search knowledge base
knowledge.get('/search', async (c) => {
  try {
    const query = c.req.query('q') || '';

    if (!query || query.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400);
    }

    // Simple search in title, excerpt, and content
    const results = await c.env.DB.prepare(`
      SELECT 
        id, title, slug, category, excerpt, views
      FROM knowledge_base
      WHERE published = 1
        AND (
          title LIKE ? OR 
          excerpt LIKE ? OR 
          content LIKE ?
        )
      ORDER BY views DESC
      LIMIT 10
    `).bind(`%${query}%`, `%${query}%`, `%${query}%`).all();

    return c.json({
      query,
      results: results.results || [],
      count: results.results?.length || 0
    });

  } catch (error) {
    console.error('Knowledge base search error:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
});

// GET /api/knowledge/popular - Get most popular articles
knowledge.get('/popular', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '5');

    const articles = await c.env.DB.prepare(`
      SELECT 
        id, title, slug, category, excerpt, views, helpful_count
      FROM knowledge_base
      WHERE published = 1
      ORDER BY views DESC, helpful_count DESC
      LIMIT ?
    `).bind(limit).all();

    return c.json({
      articles: articles.results || []
    });

  } catch (error) {
    console.error('Knowledge base popular error:', error);
    return c.json({ error: 'Failed to fetch popular articles' }, 500);
  }
});

export default knowledge;

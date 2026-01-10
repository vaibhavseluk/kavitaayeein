// Report API routes

import { Hono } from 'hono';
import type { Env } from '../lib/types';

const reports = new Hono<{ Bindings: Env }>();

// Submit a report (authenticated)
reports.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    
    const { poem_id, reason, details } = await c.req.json();

    // Validate input
    if (!poem_id || !reason) {
      return c.json({ error: 'poem_id and reason are required' }, 400);
    }

    const validReasons = ['spam', 'adult_content', 'hate_speech', 'copyright', 'other'];
    if (!validReasons.includes(reason)) {
      return c.json({ error: 'Invalid reason' }, 400);
    }

    // Check if poem exists
    const poem = await c.env.DB.prepare('SELECT id FROM poems WHERE id = ?')
      .bind(poem_id).first();

    if (!poem) {
      return c.json({ error: 'Poem not found' }, 404);
    }

    // Insert report
    const result = await c.env.DB.prepare(
      `INSERT INTO reports (poem_id, reporter_id, reason, details, status) 
       VALUES (?, ?, ?, ?, 'pending')`
    ).bind(poem_id, userId || null, reason, details || null).run();

    if (!result.success) {
      return c.json({ error: 'Failed to submit report' }, 500);
    }

    return c.json({ 
      success: true, 
      message: 'Report submitted successfully. Our team will review it shortly.' 
    }, 201);

  } catch (error) {
    console.error('Submit report error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default reports;

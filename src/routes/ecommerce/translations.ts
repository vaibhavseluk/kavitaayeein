import { Hono } from 'hono';
import { requireAuth } from '../../lib/auth';
import { translateText, translateBatch } from '../../lib/translator';
import { processFile, generateOutputFile } from '../../lib/file-processor';
import type { Env, TranslationJob, User } from '../../lib/types';

const translations = new Hono<{ Bindings: Env }>();

// Helper to check if user has enough credits
async function checkCredits(db: D1Database, userId: number, requiredCredits: number): Promise<boolean> {
  const result = await db.prepare(
    'SELECT word_credits FROM users WHERE id = ?'
  ).bind(userId).first<{ word_credits: number }>();
  
  return result ? result.word_credits >= requiredCredits : false;
}

// Helper to deduct credits
async function deductCredits(db: D1Database, userId: number, credits: number): Promise<void> {
  await db.prepare(
    'UPDATE users SET word_credits = word_credits - ?, total_words_used = total_words_used + ? WHERE id = ?'
  ).bind(credits, credits, userId).run();
}

// POST /api/translations/translate - Single text translation (for testing)
translations.post('/translate', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { text, sourceLanguage, targetLanguage, tonePreset, brandTerms } = await c.req.json();

    // Validation
    if (!text || !sourceLanguage || !targetLanguage) {
      return c.json({ error: 'Missing required fields: text, sourceLanguage, targetLanguage' }, 400);
    }

    // Estimate word count
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    // Check credits
    const hasCredits = await checkCredits(c.env.DB, user.id, wordCount);
    if (!hasCredits) {
      return c.json({ 
        error: 'Insufficient credits',
        required: wordCount,
        available: user.word_credits
      }, 402);
    }

    // Get user's glossary terms
    const glossaryResult = await c.env.DB.prepare(
      'SELECT term FROM brand_glossary WHERE user_id = ? AND locked = 1'
    ).bind(user.id).all<{ term: string }>();
    
    const userBrandTerms = glossaryResult.results?.map(r => r.term) || [];
    const allBrandTerms = [...(brandTerms || []), ...userBrandTerms];

    // Translate
    const result = await translateText(
      {
        text,
        sourceLanguage,
        targetLanguage,
        tonePreset: tonePreset as 'formal' | 'bargain' | 'youth',
        brandTerms: allBrandTerms
      },
      c.env,
      c.env.DB
    );

    // Deduct credits
    await deductCredits(c.env.DB, user.id, result.wordCount);

    return c.json({
      translatedText: result.translatedText,
      wordCount: result.wordCount,
      cached: result.cached,
      creditsRemaining: user.word_credits - result.wordCount
    });

  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ error: 'Translation failed', details: error.message }, 500);
  }
});

// POST /api/translations/upload - Upload and process file
translations.post('/upload', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const formData = await c.req.formData();
    
    const file = formData.get('file') as File;
    const targetLanguagesStr = formData.get('targetLanguages') as string;
    const tonePreset = formData.get('tonePreset') as string || 'formal';
    
    if (!file || !targetLanguagesStr) {
      return c.json({ error: 'Missing file or targetLanguages' }, 400);
    }

    // Parse target languages
    const targetLanguages = JSON.parse(targetLanguagesStr);
    
    if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
      return c.json({ error: 'targetLanguages must be a non-empty array' }, 400);
    }

    // Check file size (10MB limit for Cloudflare Workers)
    const maxSize = parseInt(c.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }, 400);
    }

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv',
      '.xls',
      '.xlsx'
    ];
    
    const fileType = file.type || file.name.split('.').pop();
    const isValidType = validTypes.some(type => 
      fileType?.includes(type) || file.name.endsWith(type)
    );
    
    if (!isValidType) {
      return c.json({ error: 'Invalid file type. Only CSV and Excel files are supported' }, 400);
    }

    // Process file to extract data
    const fileBuffer = await file.arrayBuffer();
    const processedData = await processFile(fileBuffer, file.name);
    
    if (!processedData.textColumns || processedData.textColumns.length === 0) {
      return c.json({ error: 'No text columns found in file' }, 400);
    }

    // Estimate total words
    const estimatedWords = processedData.rows.reduce((total, row) => {
      return total + processedData.textColumns.reduce((rowTotal, col) => {
        const text = row[col] || '';
        return rowTotal + text.toString().split(/\s+/).filter(Boolean).length;
      }, 0);
    }, 0);

    const totalWords = estimatedWords * targetLanguages.length;

    // Check credits
    const hasCredits = await checkCredits(c.env.DB, user.id, totalWords);
    if (!hasCredits) {
      return c.json({ 
        error: 'Insufficient credits',
        required: totalWords,
        available: user.word_credits,
        estimatedCost: `${totalWords} words × ${targetLanguages.length} languages`
      }, 402);
    }

    // Create translation job
    const jobResult = await c.env.DB.prepare(`
      INSERT INTO translation_jobs 
      (user_id, original_filename, status, source_language, target_languages, tone_preset, total_words)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      file.name,
      'processing',
      'en',
      JSON.stringify(targetLanguages),
      tonePreset,
      totalWords
    ).run();

    const jobId = jobResult.meta.last_row_id;

    // Get user's glossary
    const glossaryResult = await c.env.DB.prepare(
      'SELECT term FROM brand_glossary WHERE user_id = ? AND locked = 1'
    ).bind(user.id).all<{ term: string }>();
    
    const brandTerms = glossaryResult.results?.map(r => r.term) || [];

    // Process translations in background (for MVP, we'll do it synchronously)
    // In production, this should be moved to a queue/worker
    try {
      const translatedRows: any[] = [];
      let wordsTranslated = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each row
      for (let i = 0; i < processedData.rows.length; i++) {
        const row = processedData.rows[i];
        const translatedRow: any = { ...row };

        // Translate each target language
        for (const targetLang of targetLanguages) {
          // Translate each text column
          for (const col of processedData.textColumns) {
            const text = row[col];
            if (!text || text.toString().trim() === '') continue;

            try {
              const result = await translateText(
                {
                  text: text.toString(),
                  sourceLanguage: 'en',
                  targetLanguage: targetLang,
                  tonePreset: tonePreset as 'formal' | 'bargain' | 'youth',
                  brandTerms
                },
                c.env,
                c.env.DB
              );

              // Create new column name: "Title_Hindi", "Description_Tamil", etc
              const langName = {
                'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu', 'kn': 'Kannada',
                'bn': 'Bengali', 'mr': 'Marathi', 'gu': 'Gujarati', 'ml': 'Malayalam',
                'pa': 'Punjabi', 'or': 'Odia', 'as': 'Assamese', 'ur': 'Urdu'
              }[targetLang] || targetLang;
              
              const newColName = `${col}_${langName}`;
              translatedRow[newColName] = result.translatedText;
              wordsTranslated += result.wordCount;

            } catch (error) {
              errorCount++;
              errors.push(`Row ${i + 1}, Column ${col}, Language ${targetLang}: ${error.message}`);
              translatedRow[`${col}_${targetLang}_error`] = 'Translation failed';
            }
          }
        }

        translatedRows.push(translatedRow);
      }

      // Generate output file (CSV format for now)
      const outputFile = await generateOutputFile(translatedRows, processedData.textColumns, targetLanguages);

      // For MVP, we'll store the file content in the database
      // In production, upload to R2 storage
      const resultFileUrl = `data:text/csv;base64,${btoa(outputFile)}`;

      // Update job status
      await c.env.DB.prepare(`
        UPDATE translation_jobs 
        SET status = ?, words_translated = ?, credits_used = ?, 
            error_count = ?, error_log = ?, result_file_url = ?, completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        errorCount > 0 ? 'partial' : 'completed',
        wordsTranslated,
        wordsTranslated,
        errorCount,
        errors.length > 0 ? errors.join('\n') : null,
        resultFileUrl,
        jobId
      ).run();

      // Deduct credits
      await deductCredits(c.env.DB, user.id, wordsTranslated);

      return c.json({
        success: true,
        jobId,
        status: errorCount > 0 ? 'partial' : 'completed',
        wordsTranslated,
        creditsUsed: wordsTranslated,
        errorCount,
        resultFileUrl: `/api/translations/download/${jobId}`,
        creditsRemaining: user.word_credits - wordsTranslated
      });

    } catch (error) {
      // Update job as failed
      await c.env.DB.prepare(`
        UPDATE translation_jobs 
        SET status = 'failed', error_log = ?
        WHERE id = ?
      `).bind(error.message, jobId).run();

      throw error;
    }

  } catch (error) {
    console.error('File upload error:', error);
    return c.json({ error: 'File processing failed', details: error.message }, 500);
  }
});

// GET /api/translations/jobs - List user's translation jobs
translations.get('/jobs', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = (page - 1) * limit;

    const jobs = await c.env.DB.prepare(`
      SELECT 
        id, original_filename, status, source_language, target_languages,
        tone_preset, total_words, words_translated, credits_used,
        error_count, created_at, completed_at
      FROM translation_jobs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(user.id, limit, offset).all<TranslationJob>();

    const totalResult = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM translation_jobs WHERE user_id = ?'
    ).bind(user.id).first<{ count: number }>();

    return c.json({
      jobs: jobs.results || [],
      pagination: {
        page,
        limit,
        total: totalResult?.count || 0,
        pages: Math.ceil((totalResult?.count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Jobs list error:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// GET /api/translations/jobs/:id - Get job details
translations.get('/jobs/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const jobId = c.req.param('id');

    const job = await c.env.DB.prepare(`
      SELECT * FROM translation_jobs 
      WHERE id = ? AND user_id = ?
    `).bind(jobId, user.id).first<TranslationJob>();

    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    return c.json({ job });

  } catch (error) {
    console.error('Job details error:', error);
    return c.json({ error: 'Failed to fetch job details' }, 500);
  }
});

// GET /api/translations/download/:id - Download translated file
translations.get('/download/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const jobId = c.req.param('id');

    const job = await c.env.DB.prepare(`
      SELECT original_filename, result_file_url, status 
      FROM translation_jobs 
      WHERE id = ? AND user_id = ?
    `).bind(jobId, user.id).first<TranslationJob>();

    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    if (job.status === 'processing') {
      return c.json({ error: 'Job is still processing' }, 400);
    }

    if (job.status === 'failed') {
      return c.json({ error: 'Job failed to process' }, 400);
    }

    if (!job.result_file_url) {
      return c.json({ error: 'Result file not available' }, 404);
    }

    // Parse data URL
    if (job.result_file_url.startsWith('data:')) {
      const matches = job.result_file_url.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const fileData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        // Generate filename
        const baseName = job.original_filename.replace(/\.[^/.]+$/, '');
        const downloadName = `${baseName}_translated_${Date.now()}.csv`;

        return new Response(fileData, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${downloadName}"`,
            'Content-Length': fileData.length.toString()
          }
        });
      }
    }

    return c.json({ error: 'Invalid result file format' }, 500);

  } catch (error) {
    console.error('Download error:', error);
    return c.json({ error: 'Failed to download file' }, 500);
  }
});

// DELETE /api/translations/jobs/:id - Delete a translation job
translations.delete('/jobs/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const jobId = c.req.param('id');

    const result = await c.env.DB.prepare(`
      DELETE FROM translation_jobs 
      WHERE id = ? AND user_id = ?
    `).bind(jobId, user.id).run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'Job not found' }, 404);
    }

    return c.json({ success: true, message: 'Job deleted successfully' });

  } catch (error) {
    console.error('Delete job error:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

export default translations;

import type { Env, TranslationRequest, TranslationResponse, TonePreset } from './types';
import { TONE_PRESETS } from './types';

// Word counting function
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Extract HTML tags and content
interface TextSegment {
  type: 'tag' | 'text';
  content: string;
  originalIndex: number;
}

function extractHTMLStructure(html: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const tagRegex = /<[^>]+>/g;
  let lastIndex = 0;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    // Add text before tag
    if (match.index > lastIndex) {
      const text = html.substring(lastIndex, match.index);
      if (text.trim()) {
        segments.push({
          type: 'text',
          content: text,
          originalIndex: lastIndex
        });
      }
    }
    
    // Add tag
    segments.push({
      type: 'tag',
      content: match[0],
      originalIndex: match.index
    });
    
    lastIndex = tagRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < html.length) {
    const text = html.substring(lastIndex);
    if (text.trim()) {
      segments.push({
        type: 'text',
        content: text,
        originalIndex: lastIndex
      });
    }
  }

  return segments;
}

// Replace brand terms in text (case-insensitive)
function protectBrandTerms(text: string, brandTerms: string[]): { protectedText: string; placeholders: Map<string, string> } {
  const placeholders = new Map<string, string>();
  let protectedText = text;

  brandTerms.forEach((term, index) => {
    const placeholder = `__BRAND_${index}__`;
    const regex = new RegExp(term, 'gi');
    
    // Store all matches with their original case
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        placeholders.set(placeholder, match);
      });
      protectedText = protectedText.replace(regex, placeholder);
    }
  });

  return { protectedText, placeholders };
}

// Restore brand terms
function restoreBrandTerms(text: string, placeholders: Map<string, string>): string {
  let restored = text;
  placeholders.forEach((original, placeholder) => {
    restored = restored.replace(new RegExp(placeholder, 'g'), original);
  });
  return restored;
}

// Build system prompt based on tone preset
function buildSystemPrompt(targetLanguage: string, tonePreset: string = 'formal', languageName: string): string {
  const preset = TONE_PRESETS[tonePreset] || TONE_PRESETS.formal;
  
  let systemPrompt = `You are an expert Indian E-commerce Copywriter specializing in Amazon/Flipkart listings. Your goal is to localize product descriptions into ${languageName} using a high-conversion, persuasive tone.

${preset.systemPrompt}

CRITICAL RULES:
1. Translate ONLY the text content - never modify placeholders like __BRAND_0__, __BRAND_1__, etc.
2. Preserve ALL HTML tags exactly as they appear (e.g., <b>, </b>, <li>, <br>, <p>)
3. Use English numerals (1, 2, 3) even in regional scripts - they are easier to read
4. For ${languageName}, use appropriate regional shopping slang where suitable
5. Keep the translation natural and persuasive for online shoppers
6. Return ONLY the translated text without any explanations or notes`;

  // Add examples for bargain and youth tones
  if (preset.examples.length > 0) {
    const relevantExamples = preset.examples.filter(ex => ex.language === targetLanguage);
    if (relevantExamples.length > 0) {
      systemPrompt += '\n\nEXAMPLES OF LOCAL SHOPPING SLANG:\n';
      relevantExamples.forEach(ex => {
        systemPrompt += `- "${ex.standard}" → "${ex.localized}"\n`;
      });
    }
  }

  return systemPrompt;
}

// Get language name for display
function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    'hi': 'Hindi (हिंदी)',
    'ta': 'Tamil (தமிழ்)',
    'te': 'Telugu (తెలుగు)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'bn': 'Bengali (বাংলা)',
    'mr': 'Marathi (मराठी)',
    'gu': 'Gujarati (ગુજરાતી)',
    'ml': 'Malayalam (മലയാളം)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'or': 'Odia (ଓଡ଼ିଆ)',
    'as': 'Assamese (অসমীয়া)',
    'ur': 'Urdu (اردو)'
  };
  return names[code] || code;
}

// Check translation cache
async function checkCache(
  sourceText: string,
  sourceLanguage: string,
  targetLanguage: string,
  db: D1Database
): Promise<string | null> {
  const cached = await db.prepare(
    'SELECT translated_text FROM translation_cache WHERE source_text = ? AND source_language = ? AND target_language = ?'
  ).bind(sourceText, sourceLanguage, targetLanguage).first<{ translated_text: string }>();

  return cached ? cached.translated_text : null;
}

// Save to cache
async function saveToCache(
  sourceText: string,
  sourceLanguage: string,
  targetLanguage: string,
  translatedText: string,
  wordCount: number,
  db: D1Database
): Promise<void> {
  await db.prepare(
    'INSERT OR REPLACE INTO translation_cache (source_text, source_language, target_language, translated_text, word_count, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))'
  ).bind(sourceText, sourceLanguage, targetLanguage, translatedText, wordCount).run();
}

// Main translation function
export async function translateText(
  request: TranslationRequest,
  env: Env,
  db: D1Database
): Promise<TranslationResponse> {
  const { text, sourceLanguage, targetLanguage, tonePreset = 'formal', brandTerms = [] } = request;

  // Check if translation caching is enabled
  const cacheEnabled = env.ENABLE_TRANSLATION_CACHE === 'true';
  
  // Check cache first (if no brand terms, as they're user-specific)
  if (cacheEnabled && brandTerms.length === 0) {
    const cached = await checkCache(text, sourceLanguage, targetLanguage, db);
    if (cached) {
      return {
        translatedText: cached,
        wordCount: countWords(text),
        cached: true
      };
    }
  }

  // Extract HTML structure
  const segments = extractHTMLStructure(text);
  const textSegments = segments.filter(s => s.type === 'text');
  
  // If no text to translate, return original
  if (textSegments.length === 0) {
    return {
      translatedText: text,
      wordCount: 0,
      cached: false
    };
  }

  // Protect brand terms
  const textsToTranslate = textSegments.map(seg => seg.content);
  const protectedTexts = textsToTranslate.map(t => protectBrandTerms(t, brandTerms));

  // Combine all text segments for translation
  const combinedText = protectedTexts.map(p => p.protectedText).join('\n___SEGMENT___\n');
  
  // Build system prompt
  const languageName = getLanguageName(targetLanguage);
  const systemPrompt = buildSystemPrompt(targetLanguage, tonePreset, languageName);

  // Call OpenAI API
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Translate the following text to ${languageName}:\n\n${combinedText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content || '';

    // Split translated segments
    const translatedSegments = translatedText.split('\n___SEGMENT___\n');

    // Restore brand terms
    const restoredSegments = translatedSegments.map((translated, index) => {
      const placeholders = protectedTexts[index]?.placeholders || new Map();
      return restoreBrandTerms(translated, placeholders);
    });

    // Reconstruct HTML with translated text
    let result = '';
    let textIndex = 0;
    
    for (const segment of segments) {
      if (segment.type === 'tag') {
        result += segment.content;
      } else {
        result += restoredSegments[textIndex] || segment.content;
        textIndex++;
      }
    }

    const wordCount = countWords(text);

    // Save to cache if enabled and no brand terms
    if (cacheEnabled && brandTerms.length === 0) {
      await saveToCache(text, sourceLanguage, targetLanguage, result, wordCount, db);
    }

    return {
      translatedText: result,
      wordCount,
      cached: false
    };

  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Batch translation for multiple texts
export async function batchTranslate(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string,
  tonePreset: string,
  brandTerms: string[],
  env: Env,
  db: D1Database,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i++) {
    const request: TranslationRequest = {
      text: texts[i],
      sourceLanguage,
      targetLanguage,
      tonePreset: tonePreset as any,
      brandTerms
    };

    const result = await translateText(request, env, db);
    results.push(result.translatedText);

    // Report progress
    if (onProgress) {
      const progress = Math.round(((i + 1) / texts.length) * 100);
      onProgress(progress);
    }
  }

  return results;
}

// Cost tracking helper
export async function trackAPIUsage(
  userId: number,
  wordCount: number,
  targetLanguages: number,
  db: D1Database
): Promise<void> {
  const totalWords = wordCount * targetLanguages;
  
  // Estimate cost: GPT-4o-mini is approximately $0.00015 per 1K input tokens
  // Assuming 1 word ≈ 1.3 tokens, cost per word ≈ $0.0002
  const estimatedCost = totalWords * 0.0002;

  // Log to database for admin tracking
  await db.prepare(
    'INSERT INTO api_usage_logs (user_id, endpoint, method, credits_used, created_at) VALUES (?, ?, ?, ?, datetime("now"))'
  ).bind(userId, '/api/translations/translate', 'POST', totalWords).run();

  // Could send alert email if approaching limits
  // This would be implemented in the admin dashboard
}

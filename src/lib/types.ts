// Type definitions for the e-commerce translation platform

export interface Env {
  DB: D1Database;
  
  // Google OAuth
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  
  // OpenAI
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  
  // Lemon Squeezy
  LEMONSQUEEZY_API_KEY: string;
  LEMONSQUEEZY_STORE_ID: string;
  LEMONSQUEEZY_WEBHOOK_SECRET: string;
  
  // JWT
  JWT_SECRET: string;
  
  // Admin
  ADMIN_EMAIL: string;
  ADMIN_NOTIFICATION_EMAIL: string;
  
  // Cost Monitoring
  MONTHLY_API_COST_LIMIT: string;
  DAILY_API_COST_LIMIT: string;
  COST_ALERT_EMAIL: string;
  
  // Feature Flags
  ENABLE_TRANSLATION_CACHE: string;
  ENABLE_CHATBOT: string;
  MAX_FILE_SIZE_MB: string;
  MAX_ROWS_PER_FILE: string;
  
  // Environment
  NODE_ENV: string;
}

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  name: string;
  google_id?: string;
  subscription_plan: 'free' | 'starter' | 'growth' | 'scale';
  word_credits: number;
  total_words_used: number;
  company_name?: string;
  phone?: string;
  onboarding_completed: number;
  is_admin: number;
  created_at: string;
  updated_at: string;
}

export interface TranslationJob {
  id: number;
  user_id: number;
  original_filename: string;
  file_url?: string;
  status: 'processing' | 'completed' | 'failed' | 'partial';
  source_language: string;
  target_languages: string; // JSON array
  tone_preset?: 'formal' | 'bargain' | 'youth';
  total_words: number;
  words_translated: number;
  credits_used: number;
  error_count: number;
  error_log?: string;
  result_file_url?: string;
  created_at: string;
  completed_at?: string;
}

export interface CreditPurchase {
  id: number;
  user_id: number;
  amount_usd: number;
  word_credits: number;
  stripe_payment_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

export interface BrandGlossaryTerm {
  id: number;
  user_id: number;
  term: string;
  locked: number;
  notes?: string;
  created_at: string;
}

export interface TranslationCache {
  id: number;
  source_text: string;
  source_language: string;
  target_language: string;
  translated_text: string;
  word_count: number;
  created_at: string;
}

export interface KnowledgeBase {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: 'getting-started' | 'billing' | 'troubleshooting' | 'api';
  views: number;
  helpful_votes: number;
  published: number;
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  tonePreset?: 'formal' | 'bargain' | 'youth';
  brandTerms?: string[];
}

export interface TranslationResponse {
  translatedText: string;
  wordCount: number;
  cached: boolean;
}

export interface FileUploadRequest {
  file: File;
  targetLanguages: string[];
  tonePreset?: string;
}

export interface SubscriptionPlan {
  id: number;
  plan_name: string;
  price_usd: number;
  word_credits: number;
  features: string; // JSON array
  stripe_price_id?: string;
  active: number;
}

// Tone preset definitions with regional slang
export interface TonePreset {
  name: string;
  description: string;
  systemPrompt: string;
  examples: {
    language: string;
    standard: string;
    localized: string;
  }[];
}

export const TONE_PRESETS: Record<string, TonePreset> = {
  formal: {
    name: 'Formal',
    description: 'Professional tone for high-end products',
    systemPrompt: 'Translate professionally, maintaining formal business language suitable for luxury and premium products.',
    examples: []
  },
  bargain: {
    name: 'Bargain/Street',
    description: 'Casual, persuasive tone for deals and offers',
    systemPrompt: 'Translate using enthusiastic, deal-focused language with local shopping slang. Make it sound exciting and persuasive.',
    examples: [
      { language: 'hi', standard: 'Best Quality', localized: 'Ek Number Quality' },
      { language: 'hi', standard: 'Great Deal', localized: 'Dhamaka Deal' },
      { language: 'ta', standard: 'Must Buy', localized: 'Kandippa Vaanganum' },
      { language: 'te', standard: 'Super Offer', localized: 'Keka Offer' },
      { language: 'bn', standard: 'Low Price', localized: 'Darun Offer' },
      { language: 'kn', standard: 'Huge Discount', localized: 'Bari Offer' }
    ]
  },
  youth: {
    name: 'Youth/Slang',
    description: 'Cool, trendy tone for gadgets and fashion',
    systemPrompt: 'Translate using modern, trendy language with Hinglish mix where appropriate. Appeal to Gen Z/Millennial shoppers.',
    examples: [
      { language: 'ta', standard: 'Superb Product', localized: 'Vera Level Product' },
      { language: 'te', standard: 'Beautiful', localized: 'Adirindi' },
      { language: 'kn', standard: 'Strong/Durable', localized: 'Gatti Product' }
    ]
  }
};

// Supported languages for translation
export const SUPPORTED_LANGUAGES = {
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

export const TOP_5_LANGUAGES = ['hi', 'ta', 'te', 'kn', 'bn'];

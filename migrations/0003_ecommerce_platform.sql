-- E-commerce Translation Platform Schema
-- Migration to transform poetry platform into e-commerce SaaS

-- ============================================
-- Drop old poetry tables (we'll keep users table structure but modify it)
-- ============================================
DROP TABLE IF EXISTS poem_ratings;
DROP TABLE IF EXISTS poem_likes;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS anthology_submissions;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS terms_acceptance;
DROP TABLE IF EXISTS poems;

-- ============================================
-- Modify users table for e-commerce sellers
-- ============================================
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN subscription_plan TEXT DEFAULT 'free'; -- free, starter, growth, scale
ALTER TABLE users ADD COLUMN word_credits INTEGER DEFAULT 1000; -- Free tier: 1000 words
ALTER TABLE users ADD COLUMN total_words_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN company_name TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0;

-- ============================================
-- Credit purchases and transactions
-- ============================================
CREATE TABLE IF NOT EXISTS credit_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount_usd REAL NOT NULL,
  word_credits INTEGER NOT NULL,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_credit_purchases_user ON credit_purchases(user_id);
CREATE INDEX idx_credit_purchases_status ON credit_purchases(status);

-- ============================================
-- Translation jobs (file uploads and processing)
-- ============================================
CREATE TABLE IF NOT EXISTS translation_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  file_url TEXT, -- Cloudflare R2 URL
  status TEXT DEFAULT 'processing', -- processing, completed, failed, partial
  source_language TEXT DEFAULT 'en',
  target_languages TEXT NOT NULL, -- JSON array: ["hi", "ta", "te", "kn", "bn"]
  total_words INTEGER DEFAULT 0,
  words_translated INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_log TEXT, -- JSON array of error details
  result_file_url TEXT, -- Translated file URL
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_translation_jobs_user ON translation_jobs(user_id);
CREATE INDEX idx_translation_jobs_status ON translation_jobs(status);
CREATE INDEX idx_translation_jobs_created ON translation_jobs(created_at);

-- ============================================
-- Brand glossary (lock words)
-- ============================================
CREATE TABLE IF NOT EXISTS brand_glossary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  term TEXT NOT NULL, -- e.g., "SwiftCook", "iPhone", brand names
  locked INTEGER DEFAULT 1, -- 1 = don't translate, 0 = allow translation
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_glossary_user ON brand_glossary(user_id);
CREATE UNIQUE INDEX idx_glossary_user_term ON brand_glossary(user_id, term);

-- ============================================
-- Translation cache (to avoid duplicate API calls)
-- ============================================
CREATE TABLE IF NOT EXISTS translation_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_cache_translation ON translation_cache(source_text, source_language, target_language);
CREATE INDEX idx_cache_created ON translation_cache(created_at);

-- ============================================
-- Admin analytics (revenue tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  total_revenue REAL DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  words_translated INTEGER DEFAULT 0,
  credits_purchased INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  jobs_failed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_analytics_date ON admin_analytics(date);

-- ============================================
-- Support tickets (for the 1% that need human help)
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);

-- ============================================
-- API usage logs (for debugging and rate limiting)
-- ============================================
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  credits_used INTEGER DEFAULT 0,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_logs_user ON api_usage_logs(user_id);
CREATE INDEX idx_api_logs_created ON api_usage_logs(created_at);

-- ============================================
-- Knowledge base articles (self-service support)
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- getting-started, billing, troubleshooting, api
  views INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_published ON knowledge_base(published);

-- ============================================
-- Subscription plans reference (for UI display)
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_name TEXT NOT NULL UNIQUE, -- free, starter, growth, scale
  price_usd REAL NOT NULL,
  word_credits INTEGER NOT NULL,
  features TEXT NOT NULL, -- JSON array of features
  stripe_price_id TEXT,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, price_usd, word_credits, features, active) VALUES
('free', 0, 1000, '["1,000 words/month", "5 languages", "CSV upload only"]', 1),
('starter', 19, 10000, '["10,000 words/month", "12 languages", "CSV/Excel upload", "Email support"]', 1),
('growth', 49, 100000, '["100,000 words/month", "12 languages", "CSV/Excel upload", "Priority support", "Brand glossary"]', 1),
('scale', 149, 500000, '["500,000 words/month", "12 languages", "API access", "24/7 support", "Custom glossary", "Dedicated account manager"]', 1);

-- ============================================
-- User onboarding progress (for guided tours)
-- ============================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  step_completed TEXT DEFAULT 'signup', -- signup, upload, translate, payment, done
  first_job_id INTEGER,
  first_payment_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

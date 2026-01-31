-- Production Database Migration: Poetry Platform → E-commerce Platform
-- WARNING: This will drop poetry-related tables
-- Run this ONLY if you're transforming the platform completely

-- ============================================
-- Step 1: Drop old poetry platform tables
-- ============================================
DROP TABLE IF EXISTS poem_ratings;
DROP TABLE IF EXISTS poem_likes;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS anthology_submissions;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS terms_acceptance;
DROP TABLE IF EXISTS poems;

-- ============================================
-- Step 2: Recreate users table
-- ============================================
-- Backup existing users (if any)
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;

-- Drop old users table
DROP TABLE IF EXISTS users;

-- Create new users table with e-commerce schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  google_id TEXT UNIQUE,
  subscription_plan TEXT DEFAULT 'free',
  word_credits INTEGER DEFAULT 1000,
  total_words_used INTEGER DEFAULT 0,
  company_name TEXT,
  phone TEXT,
  onboarding_completed INTEGER DEFAULT 0,
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_subscription ON users(subscription_plan);

-- ============================================
-- Step 3: Drop old subscription_plans table and recreate
-- ============================================
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS payment_transactions;

-- Create new subscription plans
CREATE TABLE subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_name TEXT NOT NULL UNIQUE,
  price_usd REAL NOT NULL,
  word_credits INTEGER NOT NULL,
  features TEXT NOT NULL,
  lemonsqueezy_variant_id TEXT,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans
INSERT INTO subscription_plans (plan_name, price_usd, word_credits, features, active) VALUES
('free', 0, 1000, '["1,000 words/month", "5 languages", "CSV upload only"]', 1),
('starter', 19, 10000, '["10,000 words/month", "12 languages", "CSV/Excel upload", "Email support"]', 1),
('growth', 49, 100000, '["100,000 words/month", "12 languages", "CSV/Excel upload", "Priority support", "Brand glossary"]', 1),
('scale', 149, 500000, '["500,000 words/month", "12 languages", "API access", "24/7 support", "Custom glossary", "Dedicated account manager"]', 1);

-- ============================================
-- Step 4: Create new e-commerce tables
-- ============================================

-- Credit purchases
CREATE TABLE credit_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount_usd REAL NOT NULL,
  word_credits INTEGER NOT NULL,
  lemonsqueezy_order_id TEXT UNIQUE,
  lemonsqueezy_customer_id TEXT,
  status TEXT DEFAULT 'pending',
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_credit_purchases_user ON credit_purchases(user_id);
CREATE INDEX idx_credit_purchases_status ON credit_purchases(status);
CREATE INDEX idx_credit_purchases_order_id ON credit_purchases(lemonsqueezy_order_id);

-- Translation jobs
CREATE TABLE translation_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'processing',
  source_language TEXT DEFAULT 'en',
  target_languages TEXT NOT NULL,
  tone TEXT DEFAULT 'formal',
  total_words INTEGER DEFAULT 0,
  words_translated INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_log TEXT,
  result_file_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_translation_jobs_user ON translation_jobs(user_id);
CREATE INDEX idx_translation_jobs_status ON translation_jobs(status);
CREATE INDEX idx_translation_jobs_created ON translation_jobs(created_at);

-- Brand glossary
CREATE TABLE brand_glossary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  term TEXT NOT NULL,
  locked INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_glossary_user ON brand_glossary(user_id);
CREATE UNIQUE INDEX idx_glossary_user_term ON brand_glossary(user_id, term);

-- Translation cache
CREATE TABLE translation_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  tone TEXT DEFAULT 'formal',
  translated_text TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_cache_translation ON translation_cache(source_text, source_language, target_language, tone);
CREATE INDEX idx_cache_created ON translation_cache(created_at);

-- Admin analytics
CREATE TABLE admin_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  total_revenue REAL DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  words_translated INTEGER DEFAULT 0,
  credits_purchased INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  jobs_failed INTEGER DEFAULT 0,
  openai_cost REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_analytics_date ON admin_analytics(date);

-- API usage logs
CREATE TABLE api_usage_logs (
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

-- Knowledge base
CREATE TABLE knowledge_base (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_published ON knowledge_base(published);
CREATE INDEX idx_kb_slug ON knowledge_base(slug);

-- Support tickets
CREATE TABLE support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);

-- Onboarding progress
CREATE TABLE onboarding_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  step_completed TEXT DEFAULT 'signup',
  first_job_id INTEGER,
  first_payment_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Refund requests for technical errors
-- Allows users to report translation failures and request credit refunds

CREATE TABLE IF NOT EXISTS refund_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  translation_job_id INTEGER,
  reason TEXT NOT NULL, -- technical_error, garbled_output, system_failure, other
  description TEXT NOT NULL,
  words_affected INTEGER DEFAULT 0,
  credits_to_refund INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, refunded
  admin_notes TEXT,
  reviewed_by INTEGER,
  reviewed_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (translation_job_id) REFERENCES translation_jobs(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_refund_requests_user ON refund_requests(user_id);
CREATE INDEX idx_refund_requests_status ON refund_requests(status);
CREATE INDEX idx_refund_requests_created ON refund_requests(created_at);

-- Add helpful_count and not_helpful_count columns to knowledge_base if not exists
-- These were referenced in the API but may not exist in the schema
ALTER TABLE knowledge_base ADD COLUMN helpful_count INTEGER DEFAULT 0;
ALTER TABLE knowledge_base ADD COLUMN not_helpful_count INTEGER DEFAULT 0;

-- Add excerpt column to knowledge_base for article summaries
ALTER TABLE knowledge_base ADD COLUMN excerpt TEXT;

-- Add subscription plan tracking for freemium model
-- Free plan: Up to 10 poems
-- Premium plan: $4.66/year for unlimited poems

-- Add subscription_tier to users table
ALTER TABLE users ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_expires_at DATETIME;
ALTER TABLE users ADD COLUMN poem_limit INTEGER NOT NULL DEFAULT 10;

-- Create a new subscription plans configuration table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_name TEXT UNIQUE NOT NULL,
  plan_type TEXT NOT NULL CHECK(plan_type IN ('free', 'premium', 'featured')),
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  duration_days INTEGER NOT NULL,
  poem_limit INTEGER,
  features TEXT, -- JSON string of features
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default plans
INSERT INTO subscription_plans (plan_name, plan_type, price, currency, duration_days, poem_limit, features) VALUES
  ('Free Plan', 'free', 0.00, 'USD', 365, 10, '["Up to 10 poems", "Basic editor features", "Community access", "Copyright-free content only"]'),
  ('Premium Unlimited', 'premium', 4.66, 'USD', 365, -1, '["Unlimited poems", "Advanced editor features", "Priority support", "No ads", "Analytics dashboard"]'),
  ('Featured Poet', 'featured', 9.99, 'USD', 30, -1, '["All Premium features", "Featured badge", "Priority listing", "Homepage highlight", "Monthly newsletter feature"]');

-- Create index for quick lookup
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_type ON subscription_plans(plan_type, is_active);

-- Add payment tracking for premium subscriptions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_provider TEXT NOT NULL CHECK(payment_provider IN ('stripe', 'razorpay', 'manual')),
  payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('subscription', 'upgrade', 'renewal')),
  metadata TEXT, -- JSON string for additional data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(payment_status);

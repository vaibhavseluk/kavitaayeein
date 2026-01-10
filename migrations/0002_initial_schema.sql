-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'poet' CHECK(role IN ('admin', 'poet')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'banned')),
  display_name TEXT,
  bio TEXT,
  profile_picture_url TEXT,
  language_preference TEXT DEFAULT 'en' CHECK(language_preference IN ('en', 'hi', 'mr')),
  is_featured INTEGER DEFAULT 0 CHECK(is_featured IN (0, 1)),
  featured_until DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Poems table with multilingual support
CREATE TABLE IF NOT EXISTS poems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('en', 'hi', 'mr')),
  author_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published', 'flagged', 'deleted')),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  rating_sum INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0 CHECK(is_featured IN (0, 1)),
  anthology_eligible INTEGER DEFAULT 1 CHECK(anthology_eligible IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports/Moderation table
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poem_id INTEGER NOT NULL,
  reporter_id INTEGER,
  reason TEXT NOT NULL CHECK(reason IN ('spam', 'adult_content', 'hate_speech', 'copyright', 'other')),
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed', 'dismissed', 'action_taken')),
  reviewed_by INTEGER,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Subscriptions table for Featured Poet feature
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'featured_poet' CHECK(plan_type IN ('featured_poet', 'sponsored_slot')),
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'expired', 'pending')),
  payment_provider TEXT NOT NULL CHECK(payment_provider IN ('stripe', 'razorpay')),
  payment_id TEXT,
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  auto_renew INTEGER DEFAULT 1 CHECK(auto_renew IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Likes table for poem engagement
CREATE TABLE IF NOT EXISTS poem_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poem_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(poem_id, user_id)
);

-- Ratings table for poem quality
CREATE TABLE IF NOT EXISTS poem_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poem_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(poem_id, user_id)
);

-- Anthology submissions tracking
CREATE TABLE IF NOT EXISTS anthology_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  poem_id INTEGER NOT NULL,
  anthology_edition TEXT NOT NULL,
  selection_criteria TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'selected', 'published', 'rejected')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  UNIQUE(poem_id, anthology_edition)
);

-- Terms acceptance tracking
CREATE TABLE IF NOT EXISTS terms_acceptance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  terms_version TEXT NOT NULL DEFAULT 'v1.0',
  accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_language ON poems(language);
CREATE INDEX IF NOT EXISTS idx_poems_status ON poems(status);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON poems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_featured ON poems(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_featured ON users(is_featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_poem_likes_poem_id ON poem_likes(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_ratings_poem_id ON poem_ratings(poem_id);

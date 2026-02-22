-- Add HeyShabdly-specific user fields to users table
-- These fields are needed for the poetry platform functionality
-- Note: Some fields like role, linkedin_url, github_url, calcom_username already exist from settings migration

-- Add username column (unique, used for login and profile URLs)
ALTER TABLE users ADD COLUMN username TEXT;

-- Add display_name column (user's display name on HeyShabdly)
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Add bio column for user profiles (if not exists from settings as different name)
ALTER TABLE users ADD COLUMN bio TEXT;

-- Add twitter_url column (linkedin and github already exist from settings)
ALTER TABLE users ADD COLUMN twitter_url TEXT;

-- Create unique index on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL;

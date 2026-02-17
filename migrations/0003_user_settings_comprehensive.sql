-- Comprehensive User Settings and Profile Management
-- Adds detailed profile fields for personal, professional, demographic data
-- Plus skills, certifications, and projects

-- ============================================
-- Extend users table with additional profile fields
-- ============================================

-- Personal Information
ALTER TABLE users ADD COLUMN full_name TEXT;
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN gender TEXT; -- male, female, non-binary, prefer-not-to-say
ALTER TABLE users ADD COLUMN profile_photo_url TEXT;
ALTER TABLE users ADD COLUMN phone_country_code TEXT DEFAULT '+91';
ALTER TABLE users ADD COLUMN phone_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN address_line1 TEXT;
ALTER TABLE users ADD COLUMN address_line2 TEXT;
ALTER TABLE users ADD COLUMN city TEXT;
ALTER TABLE users ADD COLUMN state TEXT;
ALTER TABLE users ADD COLUMN postal_code TEXT;
ALTER TABLE users ADD COLUMN country TEXT DEFAULT 'India';

-- Professional Information
ALTER TABLE users ADD COLUMN current_title TEXT; -- Job title
ALTER TABLE users ADD COLUMN current_company TEXT;
ALTER TABLE users ADD COLUMN industry TEXT;
ALTER TABLE users ADD COLUMN experience_years INTEGER; -- Years of experience
ALTER TABLE users ADD COLUMN linkedin_url TEXT;
ALTER TABLE users ADD COLUMN github_url TEXT;
ALTER TABLE users ADD COLUMN portfolio_url TEXT;
ALTER TABLE users ADD COLUMN resume_url TEXT;

-- Demographic Information
ALTER TABLE users ADD COLUMN education_level TEXT; -- high_school, bachelors, masters, phd, other
ALTER TABLE users ADD COLUMN languages_spoken TEXT; -- JSON array: ["English", "Hindi", "Tamil"]
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'Asia/Kolkata';
ALTER TABLE users ADD COLUMN preferred_contact_method TEXT DEFAULT 'email'; -- email, phone, whatsapp

-- HeyShabdly specific fields
ALTER TABLE users ADD COLUMN role TEXT; -- "Lending a Hand", "Seeking Guidance", etc.
ALTER TABLE users ADD COLUMN calcom_username TEXT;
ALTER TABLE users ADD COLUMN interest_tags TEXT; -- JSON array of interests
ALTER TABLE users ADD COLUMN availability TEXT; -- JSON object with schedule
ALTER TABLE users ADD COLUMN mentorship_areas TEXT; -- JSON array of areas

-- Privacy settings
ALTER TABLE users ADD COLUMN profile_visibility TEXT DEFAULT 'public'; -- public, private, connections-only
ALTER TABLE users ADD COLUMN show_email INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN show_phone INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN allow_messages INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN allow_connection_requests INTEGER DEFAULT 1;

-- Account deletion
ALTER TABLE users ADD COLUMN deletion_requested_at DATETIME;
ALTER TABLE users ADD COLUMN deletion_reason TEXT;
ALTER TABLE users ADD COLUMN deletion_scheduled_for DATETIME; -- 30 days after request

-- ============================================
-- Skills table
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'intermediate', -- beginner, intermediate, advanced, expert
  years_experience INTEGER,
  endorsed_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_name ON user_skills(skill_name);

-- ============================================
-- Certifications table
-- ============================================
CREATE TABLE IF NOT EXISTS user_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_certifications_user ON user_certifications(user_id);
CREATE INDEX idx_user_certifications_org ON user_certifications(issuing_organization);

-- ============================================
-- Projects table
-- ============================================
CREATE TABLE IF NOT EXISTS user_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  role TEXT, -- My role in the project
  start_date DATE,
  end_date DATE,
  is_current INTEGER DEFAULT 0,
  project_url TEXT,
  github_url TEXT,
  technologies_used TEXT, -- JSON array: ["React", "Node.js", "PostgreSQL"]
  achievements TEXT, -- Key achievements/outcomes
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_projects_user ON user_projects(user_id);
CREATE INDEX idx_user_projects_current ON user_projects(is_current);

-- ============================================
-- Work Experience table
-- ============================================
CREATE TABLE IF NOT EXISTS user_experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  employment_type TEXT DEFAULT 'full-time', -- full-time, part-time, contract, freelance, internship
  location TEXT,
  is_remote INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current INTEGER DEFAULT 0,
  description TEXT,
  achievements TEXT, -- Key achievements
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_experience_user ON user_experience(user_id);
CREATE INDEX idx_user_experience_current ON user_experience(is_current);
CREATE INDEX idx_user_experience_company ON user_experience(company_name);

-- ============================================
-- Education table
-- ============================================
CREATE TABLE IF NOT EXISTS user_education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  institution_name TEXT NOT NULL,
  degree TEXT NOT NULL, -- Bachelor of Science, Master of Arts, etc.
  field_of_study TEXT, -- Computer Science, Business Administration, etc.
  start_date DATE,
  end_date DATE,
  is_current INTEGER DEFAULT 0,
  grade TEXT, -- GPA, percentage, or grade
  activities TEXT, -- Extracurricular activities
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_education_user ON user_education(user_id);
CREATE INDEX idx_user_education_institution ON user_education(institution_name);

-- ============================================
-- User preferences/settings
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  email_notifications INTEGER DEFAULT 1,
  push_notifications INTEGER DEFAULT 1,
  sms_notifications INTEGER DEFAULT 0,
  marketing_emails INTEGER DEFAULT 1,
  weekly_digest INTEGER DEFAULT 1,
  connection_request_notifications INTEGER DEFAULT 1,
  message_notifications INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'light', -- light, dark, auto
  language TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Data deletion log (for compliance/audit)
-- ============================================
CREATE TABLE IF NOT EXISTS data_deletion_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  deletion_type TEXT NOT NULL, -- profile_only, all_data
  deletion_reason TEXT,
  requested_at DATETIME NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_summary TEXT, -- JSON summary of deleted data
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_deletion_log_user ON data_deletion_log(user_id);
CREATE INDEX idx_deletion_log_completed ON data_deletion_log(completed_at);

-- ============================================
-- Profile change history (audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS profile_change_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  change_type TEXT NOT NULL, -- create, update, delete
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_profile_changes_user ON profile_change_log(user_id);
CREATE INDEX idx_profile_changes_date ON profile_change_log(changed_at);

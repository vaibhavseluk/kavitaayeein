-- Seed data for development and testing

-- Insert admin user (password: admin123 - bcrypt hash)
INSERT OR IGNORE INTO users (id, username, email, password_hash, role, status, display_name, bio, language_preference) VALUES 
  (1, 'admin', 'admin@poetryplatform.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JLsvQZKxq3.K3g7tqGP3H2UuXJ/m.K', 'admin', 'active', 'Platform Administrator', 'Managing the poetry platform', 'en');

-- Insert sample poets
INSERT OR IGNORE INTO users (id, username, email, password_hash, role, status, display_name, bio, language_preference) VALUES 
  (2, 'marathi_poet', 'marathi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JLsvQZKxq3.K3g7tqGP3H2UuXJ/m.K', 'poet', 'active', 'मराठी कवी', 'मी मराठी कविता लिहितो', 'mr'),
  (3, 'hindi_poet', 'hindi@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JLsvQZKxq3.K3g7tqGP3H2UuXJ/m.K', 'poet', 'active', 'हिंदी कवि', 'मैं हिंदी कविता लिखता हूँ', 'hi'),
  (4, 'english_poet', 'english@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye5JLsvQZKxq3.K3g7tqGP3H2UuXJ/m.K', 'poet', 'active', 'English Poet', 'I write poetry in English', 'en');

-- Insert sample poems in different languages
INSERT OR IGNORE INTO poems (id, title, content, language, author_id, status, view_count, like_count, rating_sum, rating_count) VALUES 
  (1, 'सूर्योदय', 'उगवत सूर्य नवा दिन आणतो,
आशेचा किरण मनात पेटवतो.
पक्षांचे गाणे कानी पडते,
नवा दिवस नवा स्वप्न रंगवते.', 'mr', 2, 'published', 150, 25, 95, 20),
  
  (2, 'सुबह की किरण', 'सुबह की पहली किरण आई,
नई उम्मीद साथ लाई.
पंछी गाते मधुर गीत,
हर दिल में बसा है प्रीत.', 'hi', 3, 'published', 200, 40, 180, 40),
  
  (3, 'Morning Light', 'The morning light breaks through the night,
Bringing hope with gentle might.
Birds sing songs of joy and grace,
As dawn paints the sky with embrace.', 'en', 4, 'published', 100, 15, 70, 15),

  (4, 'प्रेम', 'प्रेम हे अमृत आहे जीवनाचे,
सुख दुःख सारे सहन करणे याचे.
एकत्र राहणे हीच शिकवण,
प्रेमात सापडते खरे जीवन.', 'mr', 2, 'published', 180, 30, 140, 30),

  (5, 'दोस्ती', 'दोस्ती है अनमोल रिश्ता,
साथ चलते हैं हर रास्ता.
खुशियों में हो या गम में,
दोस्त साथ हो हर दम में.', 'hi', 3, 'published', 220, 45, 200, 45);

-- Insert sample reports for testing moderation
INSERT OR IGNORE INTO reports (poem_id, reporter_id, reason, details, status) VALUES 
  (5, 4, 'other', 'Testing moderation system', 'pending');

-- Insert sample terms acceptance
INSERT OR IGNORE INTO terms_acceptance (user_id, terms_version, ip_address) VALUES 
  (2, 'v1.0', '192.168.1.1'),
  (3, 'v1.0', '192.168.1.2'),
  (4, 'v1.0', '192.168.1.3');

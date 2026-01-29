-- Update sh%admin to have admin role
UPDATE users SET role = 'admin' WHERE username = 'sh%admin';

-- Verify all users
SELECT id, username, email, role, created_at FROM users WHERE username LIKE 'sh%';

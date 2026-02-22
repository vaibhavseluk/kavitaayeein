import { Hono } from 'hono';
import type { Env, User, JWTPayload } from '../lib/types';
import { generateToken, hashPassword, verifyPassword } from '../lib/auth';

const auth = new Hono<{ Bindings: Env }>();

// Register new user
auth.post('/register', async (c) => {
  try {
    const { username, email, password, display_name, language_preference } = await c.req.json();

    // Validate input
    if (!username || !email || !password) {
      return c.json({ error: 'Username, email, and password are required' }, 400);
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).bind(username, email).first();

    if (existingUser) {
      return c.json({ error: 'Username or email already exists' }, 400);
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert new user
    const result = await c.env.DB.prepare(
      `INSERT INTO users (username, email, password_hash, display_name, language_preference) 
       VALUES (?, ?, ?, ?, ?) RETURNING id, username, email, role`
    ).bind(
      username,
      email,
      password_hash,
      display_name || username,
      language_preference || 'en'
    ).first();

    if (!result) {
      return c.json({ error: 'Failed to create user' }, 500);
    }

    // Generate JWT token
    const token = await generateToken({
      userId: result.id as number,
      username: result.username as string,
      email: result.email as string,
      role: result.role as 'admin' | 'poet'
    });

    // Record terms acceptance
    await c.env.DB.prepare(
      'INSERT INTO terms_acceptance (user_id, terms_version) VALUES (?, ?)'
    ).bind(result.id, 'v1.0').run();

    return c.json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role
      }
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: 'Username and password are required' }, 400);
    }

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT id, username, email, password_hash, role, status FROM users WHERE username = ? OR email = ?'
    ).bind(username, username).first<User & { password_hash: string }>();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return c.json({ error: 'Account has been banned' }, 403);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get current user profile
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { verifyToken } = await import('../lib/auth');
    const payload = await verifyToken(token, c.env);

    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Get user details
    const user = await c.env.DB.prepare(
      `SELECT id, username, email, role, status, display_name, bio, 
              profile_picture_url, language_preference, is_featured, featured_until
       FROM users WHERE id = ?`
    ).bind(payload.userId).first<User>();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
auth.put('/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { verifyToken } = await import('../lib/auth');
    const payload = await verifyToken(token, c.env);

    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const { 
      display_name, 
      bio, 
      language_preference, 
      role, 
      calcom_username, 
      interest_tags 
    } = await c.req.json();

    try {
      await c.env.DB.prepare(
        `UPDATE users 
         SET display_name = COALESCE(?, display_name),
             bio = COALESCE(?, bio),
             language_preference = COALESCE(?, language_preference),
             role = COALESCE(?, role),
             calcom_username = COALESCE(?, calcom_username),
             interest_tags = COALESCE(?, interest_tags),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(
        display_name, 
        bio, 
        language_preference, 
        role, 
        calcom_username,
        interest_tags ? JSON.stringify(interest_tags) : null,
        payload.userId
      ).run();

      return c.json({ message: 'Profile updated successfully' });
    } catch (dbError) {
      console.error('Database error during profile update:', dbError);
      // If columns don't exist, try without them
      try {
        await c.env.DB.prepare(
          `UPDATE users 
           SET display_name = COALESCE(?, display_name),
               bio = COALESCE(?, bio),
               language_preference = COALESCE(?, language_preference),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`
        ).bind(display_name, bio, language_preference, payload.userId).run();
        
        return c.json({ message: 'Profile updated successfully (partial)' });
      } catch (fallbackError) {
        console.error('Fallback update also failed:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export default auth;

import { Hono } from 'hono';
import type { Env, User } from '../../lib/types';
import {
  generateToken,
  hashPassword,
  verifyPassword,
  authenticate,
  requireAuth,
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleUserInfo
} from '../../lib/auth';
import { sendWelcomeEmail } from '../../lib/email';

const auth = new Hono<{ Bindings: Env }>();

// Register new user
auth.post('/register', async (c) => {
  try {
    const { email, password, name, company_name, phone } = await c.req.json();

    // Validation
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Check if user already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return c.json({ error: 'User with this email already exists' }, 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with free tier credits (1000 words)
    const result = await c.env.DB.prepare(
      `INSERT INTO users (email, password_hash, name, subscription_plan, word_credits, company_name, phone, created_at)
       VALUES (?, ?, ?, 'free', 1000, ?, ?, datetime('now'))`
    ).bind(
      email,
      hashedPassword,
      name,
      company_name || null,
      phone || null
    ).run();

    if (!result.success) {
      return c.json({ error: 'Failed to create user' }, 500);
    }

    // Fetch created user
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, is_admin, subscription_plan, word_credits FROM users WHERE email = ?'
    ).bind(email).first<User>();

    if (!user) {
      return c.json({ error: 'User creation failed' }, 500);
    }

    // Generate JWT token
    const token = await generateToken(user, c.env);

    // Create onboarding progress
    await c.env.DB.prepare(
      'INSERT INTO onboarding_progress (user_id, step_completed, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))'
    ).bind(user.id, 'signup').run();

    // Send welcome email (non-blocking, don't wait for result)
    if (c.env.SENDGRID_API_KEY && c.env.FROM_EMAIL) {
      sendWelcomeEmail(
        {
          email: user.email,
          name: user.name,
          userId: user.id.toString(),
        },
        c.env.SENDGRID_API_KEY,
        c.env.FROM_EMAIL
      ).catch(error => {
        console.error('Failed to send welcome email:', error);
        // Don't fail registration if email fails
      });
    } else {
      console.warn('⚠️ SendGrid not configured. Set SENDGRID_API_KEY and FROM_EMAIL environment variables.');
    }

    return c.json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        subscription_plan: user.subscription_plan,
        word_credits: user.word_credits
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
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Find user
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first<User>();

    if (!user || !user.password_hash) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate token
    const token = await generateToken(user, c.env);

    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        subscription_plan: user.subscription_plan,
        word_credits: user.word_credits,
        company_name: user.company_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Google OAuth - Initiate
auth.get('/google', (c) => {
  const authUrl = getGoogleAuthUrl(c.env);
  return c.redirect(authUrl);
});

// Google OAuth - Callback
auth.get('/google/callback', async (c) => {
  try {
    const code = c.req.query('code');
    
    if (!code) {
      return c.redirect('/?error=oauth_failed');
    }

    // Exchange code for tokens
    const tokens = await exchangeGoogleCode(code, c.env);
    
    // Get user info
    const googleUser = await getGoogleUserInfo(tokens.access_token);

    // Check if user exists
    let user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE google_id = ? OR email = ?'
    ).bind(googleUser.id, googleUser.email).first<User>();

    if (user) {
      // Update google_id if not set
      if (!user.google_id) {
        await c.env.DB.prepare(
          'UPDATE users SET google_id = ? WHERE id = ?'
        ).bind(googleUser.id, user.id).run();
        user.google_id = googleUser.id;
      }
    } else {
      // Create new user
      const result = await c.env.DB.prepare(
        `INSERT INTO users (email, google_id, name, subscription_plan, word_credits, created_at)
         VALUES (?, ?, ?, 'free', 1000, datetime('now'))`
      ).bind(
        googleUser.email,
        googleUser.id,
        googleUser.name || googleUser.email.split('@')[0]
      ).run();

      if (!result.success) {
        return c.redirect('/?error=registration_failed');
      }

      user = await c.env.DB.prepare(
        'SELECT * FROM users WHERE google_id = ?'
      ).bind(googleUser.id).first<User>();

      // Create onboarding progress
      if (user) {
        await c.env.DB.prepare(
          'INSERT INTO onboarding_progress (user_id, step_completed, created_at, updated_at) VALUES (?, ?, datetime("now"), datetime("now"))'
        ).bind(user.id, 'signup').run();

        // Send welcome email for new Google OAuth users (non-blocking)
        if (c.env.SENDGRID_API_KEY && c.env.FROM_EMAIL) {
          sendWelcomeEmail(
            {
              email: user.email,
              name: user.name,
              userId: user.id.toString(),
            },
            c.env.SENDGRID_API_KEY,
            c.env.FROM_EMAIL
          ).catch(error => {
            console.error('Failed to send welcome email:', error);
          });
        }
      }
    }

    if (!user) {
      return c.redirect('/?error=user_creation_failed');
    }

    // Generate token
    const token = await generateToken(user, c.env);

    // Redirect to dashboard with token
    return c.redirect(`/dashboard?token=${token}`);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return c.redirect('/?error=oauth_failed');
  }
});

// Get current user profile
auth.get('/me', requireAuth, async (c) => {
  const user = c.get('user') as User;
  
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      subscription_plan: user.subscription_plan,
      word_credits: user.word_credits,
      total_words_used: user.total_words_used,
      company_name: user.company_name,
      phone: user.phone,
      onboarding_completed: user.onboarding_completed,
      created_at: user.created_at
    }
  });
});

// Update user profile
auth.put('/profile', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { name, company_name, phone } = await c.req.json();

    const updates: string[] = [];
    const bindings: any[] = [];

    if (name) {
      updates.push('name = ?');
      bindings.push(name);
    }
    if (company_name !== undefined) {
      updates.push('company_name = ?');
      bindings.push(company_name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      bindings.push(phone);
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    bindings.push(user.id);

    await c.env.DB.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...bindings).run();

    // Fetch updated user
    const updatedUser = await c.env.DB.prepare(
      'SELECT id, email, name, is_admin, subscription_plan, word_credits, company_name, phone FROM users WHERE id = ?'
    ).bind(user.id).first<User>();

    return c.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Update onboarding progress
auth.post('/onboarding/progress', requireAuth, async (c) => {
  try {
    const user = c.get('user') as User;
    const { step } = await c.req.json();

    if (!['signup', 'upload', 'translate', 'payment', 'done'].includes(step)) {
      return c.json({ error: 'Invalid onboarding step' }, 400);
    }

    await c.env.DB.prepare(
      'UPDATE onboarding_progress SET step_completed = ?, updated_at = datetime("now") WHERE user_id = ?'
    ).bind(step, user.id).run();

    // If completed, mark user as onboarded
    if (step === 'done') {
      await c.env.DB.prepare(
        'UPDATE users SET onboarding_completed = 1 WHERE id = ?'
      ).bind(user.id).run();
    }

    return c.json({ message: 'Onboarding progress updated', step });

  } catch (error) {
    console.error('Onboarding update error:', error);
    return c.json({ error: 'Failed to update onboarding' }, 500);
  }
});

export default auth;

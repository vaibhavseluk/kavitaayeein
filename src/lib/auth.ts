import type { Context } from 'hono';
import type { Env, User, JWTPayload } from './types';

// Extract JWT token from Authorization header
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  // Support both "Bearer <token>" and just "<token>"
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  // If no Bearer prefix, assume the whole header is the token
  return authHeader;
}

// JWT utilities using Web Crypto API (Cloudflare Workers compatible)
export async function generateToken(user: User, env: Env): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const message = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${message}.${encodedSignature}`;
}

export async function verifyToken(token: string, env: Env): Promise<JWTPayload | null> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    
    const message = `${encodedHeader}.${encodedPayload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(atob(encodedSignature), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(message));
    
    if (!valid) return null;
    
    const payload: JWTPayload = JSON.parse(atob(encodedPayload));
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Password hashing using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === hashedPassword;
}

// Middleware to authenticate requests
export async function authenticate(c: Context<{ Bindings: Env }>): Promise<User | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token, c.env);
  
  if (!payload) {
    return null;
  }

  // Fetch user from database
  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(payload.userId).first<User>();

  return user || null;
}

// Middleware to require authentication
export async function requireAuth(c: Context<{ Bindings: Env }>, next: () => Promise<void>) {
  const user = await authenticate(c);
  
  if (!user) {
    return c.json({ error: 'Unauthorized. Please log in.' }, 401);
  }

  // Store user in context
  c.set('user', user);
  await next();
}

// Middleware to require admin role
export async function requireAdmin(c: Context<{ Bindings: Env }>, next: () => Promise<void>) {
  const user = await authenticate(c);
  
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Forbidden. Admin access required.' }, 403);
  }

  c.set('user', user);
  await next();
}

// Google OAuth helper functions
export function getGoogleAuthUrl(env: Env): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string, env: Env): Promise<any> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Google code');
  }

  return await response.json();
}

export async function getGoogleUserInfo(accessToken: string): Promise<any> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  return await response.json();
}

// Credit checking helper
export async function checkUserCredits(userId: number, requiredCredits: number, db: D1Database): Promise<boolean> {
  const user = await db.prepare(
    'SELECT word_credits FROM users WHERE id = ?'
  ).bind(userId).first<{ word_credits: number }>();

  return user ? user.word_credits >= requiredCredits : false;
}

// Deduct credits from user
export async function deductCredits(userId: number, credits: number, db: D1Database): Promise<boolean> {
  const result = await db.prepare(
    'UPDATE users SET word_credits = word_credits - ?, total_words_used = total_words_used + ? WHERE id = ? AND word_credits >= ?'
  ).bind(credits, credits, userId, credits).run();

  return result.success;
}

// Add credits to user
export async function addCredits(userId: number, credits: number, db: D1Database): Promise<boolean> {
  const result = await db.prepare(
    'UPDATE users SET word_credits = word_credits + ? WHERE id = ?'
  ).bind(credits, userId).run();

  return result.success;
}

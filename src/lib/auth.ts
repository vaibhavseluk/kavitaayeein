// JWT authentication utilities for Cloudflare Workers
// Using Web Crypto API (no Node.js dependencies)

import type { JWTPayload } from './types';

const JWT_SECRET = 'your-secret-key-change-in-production-via-wrangler-secret';
const JWT_ALGORITHM = 'HS256';

// Helper to encode base64url
function base64urlEncode(data: string): string {
  const base64 = btoa(data);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper to decode base64url
function base64urlDecode(data: string): string {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  const header = {
    alg: JWT_ALGORITHM,
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + (7 * 24 * 60 * 60) // 7 days expiry
  };

  const headerEncoded = base64urlEncode(JSON.stringify(header));
  const payloadEncoded = base64urlEncode(JSON.stringify(jwtPayload));
  const dataToSign = `${headerEncoded}.${payloadEncoded}`;

  // Create signature using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );

  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureBase64 = base64urlEncode(String.fromCharCode(...signatureArray));

  return `${dataToSign}.${signatureBase64}`;
}

// Verify and decode JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
    const dataToVerify = `${headerEncoded}.${payloadEncoded}`;

    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureData = base64urlDecode(signatureEncoded);
    const signatureArray = new Uint8Array(signatureData.split('').map(c => c.charCodeAt(0)));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureArray,
      encoder.encode(dataToVerify)
    );

    if (!isValid) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64urlDecode(payloadEncoded));

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Hash password using Web Crypto API (simple implementation)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Extract token from Authorization header
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

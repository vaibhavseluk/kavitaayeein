// Type definitions for the poetry platform

export interface Env {
  DB: D1Database;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  JWT_SECRET?: string;
  APP_URL?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'poet';
  status: 'active' | 'banned';
  display_name?: string;
  bio?: string;
  profile_picture_url?: string;
  language_preference: 'en' | 'hi' | 'mr';
  is_featured: number;
  featured_until?: string;
  created_at: string;
}

export interface Poem {
  id: number;
  title: string;
  content: string;
  language: 'en' | 'hi' | 'mr';
  author_id: number;
  status: 'draft' | 'published' | 'flagged' | 'deleted';
  view_count: number;
  like_count: number;
  rating_sum: number;
  rating_count: number;
  is_featured: number;
  anthology_eligible: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  author_display_name?: string;
  average_rating?: number;
}

export interface Report {
  id: number;
  poem_id: number;
  reporter_id?: number;
  reason: 'spam' | 'adult_content' | 'hate_speech' | 'copyright' | 'other';
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_type: 'featured_poet' | 'sponsored_slot';
  amount: number;
  currency: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  payment_provider: 'stripe' | 'razorpay';
  payment_id?: string;
  start_date: string;
  end_date?: string;
  auto_renew: number;
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'poet';
}

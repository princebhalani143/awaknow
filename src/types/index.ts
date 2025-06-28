export interface User {
  id: string;
  email?: string;
  phone?: string;
  language: string;
  subscription_tier: 'free' | 'premium';
  created_at: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Session {
  id: string;
  type: 'reflect' | 'resolve';
  created_by: string;
  members: string[];
  title?: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  emotion_tags: string[];
  sentiment_score?: number;
  voice_url?: string;
  ai_response?: string;
  created_at: string;
}

// Language interface for future translation support
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Translation interface for future i18n support
export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

export interface ApiKeys {
  supabase: {
    url: string;
    anonKey: string;
  };
  tavus: string;
  elevenlabs: string;
  revenuecat: string;
}
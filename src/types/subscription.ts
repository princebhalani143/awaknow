export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: {
    tavusMinutes: number;
    soloSessionsPerDay: number | 'unlimited';
    insightsPerWeek: number | 'unlimited';
    groupSessions: boolean;
    historyDays: number;
    prioritySupport: boolean;
  };
  revenueCatIds: {
    monthly: string;
    annual: string;
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  tavus_minutes_used: number;
  tavus_minutes_limit: number;
  last_solo_session_date?: string;
  solo_sessions_today: number;
  last_insight_date?: string;
  insights_this_week: number;
  revenuecat_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionData {
  id: string;
  session_type: 'reflect_alone' | 'resolve_together';
  title?: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  created_by: string;
  tavus_video_url?: string;
  tavus_session_id?: string;
  tavus_minutes_used: number;
  invite_code?: string;
  invite_expires_at?: string;
  max_participants: number;
  session_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  participants?: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  joined_at: string;
  private_notes?: string;
  emotion_state?: string;
  is_host: boolean;
}

export interface Insight {
  id: string;
  session_id: string;
  user_id: string;
  insight_type: 'emotion_analysis' | 'session_summary' | 'growth_recommendation' | 'conflict_resolution';
  title: string;
  content: string;
  emotion_score?: number;
  sentiment?: string;
  ai_confidence?: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface TavusUsage {
  id: string;
  user_id: string;
  session_id?: string;
  minutes_used: number;
  usage_date: string;
  tavus_video_id?: string;
  created_at: string;
}
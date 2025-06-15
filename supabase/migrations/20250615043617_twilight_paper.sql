/*
  # AwakNow Subscription & Session Management System

  1. New Tables
    - `user_subscriptions` - Track user subscription status and plan details
    - `sessions` - Store all session data (solo/group) with Tavus integration
    - `session_participants` - Track participants in group sessions
    - `insights` - Store AI-generated insights and analysis
    - `tavus_usage` - Track video minutes used per user per month

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Secure group session access

  3. Subscription Plans
    - Free: 25 minutes/month, 1 solo session/day, 1 insight/week
    - Reflect+: 100 minutes/month, unlimited solo, daily insights ($9.99/month, $99.99/year)
    - Resolve Together: 500 minutes/month, everything + group sessions ($19.99/month, $199.99/year)
*/

-- User subscription tracking
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id text NOT NULL DEFAULT 'awaknow_free',
  plan_name text NOT NULL DEFAULT 'Free',
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz DEFAULT (now() + interval '1 month'),
  cancel_at_period_end boolean DEFAULT false,
  tavus_minutes_used integer DEFAULT 0,
  tavus_minutes_limit integer DEFAULT 25,
  last_solo_session_date date,
  solo_sessions_today integer DEFAULT 0,
  last_insight_date date,
  insights_this_week integer DEFAULT 0,
  revenuecat_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sessions table for both solo and group sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type text NOT NULL CHECK (session_type IN ('reflect_alone', 'resolve_together')),
  title text,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tavus_video_url text,
  tavus_session_id text,
  tavus_minutes_used integer DEFAULT 0,
  invite_code text UNIQUE,
  invite_expires_at timestamptz,
  max_participants integer DEFAULT 2,
  session_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Session participants for group sessions
CREATE TABLE IF NOT EXISTS session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  private_notes text,
  emotion_state text,
  is_host boolean DEFAULT false,
  UNIQUE(session_id, user_id)
);

-- AI insights and analysis
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  insight_type text NOT NULL CHECK (insight_type IN ('emotion_analysis', 'session_summary', 'growth_recommendation', 'conflict_resolution')),
  title text NOT NULL,
  content text NOT NULL,
  emotion_score numeric(3,2),
  sentiment text,
  ai_confidence numeric(3,2),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tavus usage tracking
CREATE TABLE IF NOT EXISTS tavus_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  minutes_used integer NOT NULL DEFAULT 0,
  usage_date date DEFAULT CURRENT_DATE,
  tavus_video_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE tavus_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for sessions
CREATE POLICY "Users can read own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = created_by OR 
    auth.uid() IN (
      SELECT user_id FROM session_participants WHERE session_id = sessions.id
    )
  );

CREATE POLICY "Users can create sessions"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Session creators can update sessions"
  ON sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for session_participants
CREATE POLICY "Participants can read session participation"
  ON session_participants
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM session_participants sp2 WHERE sp2.session_id = session_participants.session_id
    )
  );

CREATE POLICY "Users can join sessions"
  ON session_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update own participation"
  ON session_participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for insights
CREATE POLICY "Users can read own insights"
  ON insights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create insights"
  ON insights
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tavus_usage
CREATE POLICY "Users can read own usage"
  ON tavus_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can track usage"
  ON tavus_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_by ON sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_sessions_invite_code ON sessions(invite_code);
CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user_id ON session_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_session_id ON insights(session_id);
CREATE INDEX IF NOT EXISTS idx_tavus_usage_user_id ON tavus_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tavus_usage_date ON tavus_usage(usage_date);

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, plan_id, plan_name)
  VALUES (NEW.id, 'awaknow_free', 'Free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create subscription on user signup
DROP TRIGGER IF EXISTS create_subscription_on_signup ON auth.users;
CREATE TRIGGER create_subscription_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Function to reset daily/weekly counters
CREATE OR REPLACE FUNCTION reset_usage_counters()
RETURNS void AS $$
BEGIN
  -- Reset daily solo session counter
  UPDATE user_subscriptions 
  SET solo_sessions_today = 0
  WHERE last_solo_session_date < CURRENT_DATE;
  
  -- Reset weekly insights counter
  UPDATE user_subscriptions 
  SET insights_this_week = 0
  WHERE last_insight_date < (CURRENT_DATE - INTERVAL '7 days');
  
  -- Reset monthly Tavus usage
  UPDATE user_subscriptions 
  SET tavus_minutes_used = 0
  WHERE current_period_start < (now() - INTERVAL '1 month');
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM sessions WHERE invite_code = code AND invite_expires_at > now()) INTO exists;
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
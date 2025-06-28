/*
  # Newsletter Subscription System

  1. New Tables
    - `newsletter_subscriptions` - Store email subscriptions with preferences
    
  2. Security
    - Enable RLS on newsletter_subscriptions table
    - Add policies for subscription management
    - Prevent duplicate subscriptions
    
  3. Features
    - Email validation and storage
    - Subscription preferences
    - Unsubscribe functionality
    - GDPR compliance fields
*/

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscription_type text NOT NULL DEFAULT 'wellness_insights' CHECK (subscription_type IN ('wellness_insights', 'product_updates', 'all')),
  source text DEFAULT 'website_footer',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz,
  email_verified boolean DEFAULT false,
  verification_token text,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own subscription"
  ON newsletter_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can update own subscription"
  ON newsletter_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Service role can manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
  ON newsletter_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_user_id ON newsletter_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_verification_token ON newsletter_subscriptions(verification_token);

-- Function to handle newsletter subscription
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  subscriber_email text,
  subscription_type text DEFAULT 'wellness_insights',
  source_location text DEFAULT 'website'
)
RETURNS jsonb AS $$
DECLARE
  existing_subscription newsletter_subscriptions;
  new_subscription newsletter_subscriptions;
  verification_token text;
BEGIN
  -- Validate email format (basic check)
  IF subscriber_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid email format'
    );
  END IF;

  -- Check if email already exists
  SELECT * INTO existing_subscription 
  FROM newsletter_subscriptions 
  WHERE email = subscriber_email;

  IF existing_subscription.id IS NOT NULL THEN
    -- Email already exists
    IF existing_subscription.status = 'active' THEN
      RETURN jsonb_build_object(
        'success', true,
        'message', 'You are already subscribed to our newsletter!',
        'already_subscribed', true
      );
    ELSE
      -- Reactivate subscription
      UPDATE newsletter_subscriptions 
      SET 
        status = 'active',
        subscription_type = subscribe_to_newsletter.subscription_type,
        source = source_location,
        subscribed_at = now(),
        unsubscribed_at = NULL,
        updated_at = now()
      WHERE email = subscriber_email
      RETURNING * INTO new_subscription;
      
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Welcome back! Your subscription has been reactivated.',
        'subscription_id', new_subscription.id
      );
    END IF;
  ELSE
    -- Generate verification token
    verification_token := encode(gen_random_bytes(32), 'hex');
    
    -- Create new subscription
    INSERT INTO newsletter_subscriptions (
      email,
      subscription_type,
      source,
      verification_token,
      user_id
    ) VALUES (
      subscriber_email,
      subscribe_to_newsletter.subscription_type,
      source_location,
      verification_token,
      auth.uid() -- Will be NULL for anonymous users
    ) RETURNING * INTO new_subscription;
    
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Thank you for subscribing! You will receive wellness insights and updates.',
      'subscription_id', new_subscription.id,
      'verification_token', verification_token
    );
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Failed to process subscription: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unsubscribe
CREATE OR REPLACE FUNCTION unsubscribe_from_newsletter(
  subscriber_email text,
  token text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  subscription_record newsletter_subscriptions;
BEGIN
  -- Find subscription
  SELECT * INTO subscription_record 
  FROM newsletter_subscriptions 
  WHERE email = subscriber_email 
  AND (token IS NULL OR verification_token = token);

  IF subscription_record.id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Subscription not found'
    );
  END IF;

  -- Update subscription status
  UPDATE newsletter_subscriptions 
  SET 
    status = 'unsubscribed',
    unsubscribed_at = now(),
    updated_at = now()
  WHERE id = subscription_record.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'You have been successfully unsubscribed from our newsletter.'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Failed to unsubscribe: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unsubscribe_from_newsletter(text, text) TO anon, authenticated;

-- Create a view for subscription analytics (admin only)
CREATE OR REPLACE VIEW newsletter_analytics AS
SELECT 
  DATE_TRUNC('day', subscribed_at) as subscription_date,
  COUNT(*) as new_subscriptions,
  COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
  subscription_type,
  source
FROM newsletter_subscriptions 
GROUP BY DATE_TRUNC('day', subscribed_at), subscription_type, source
ORDER BY subscription_date DESC;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Newsletter subscription system created successfully!';
  RAISE NOTICE 'Functions available: subscribe_to_newsletter(), unsubscribe_from_newsletter()';
  RAISE NOTICE 'Table: newsletter_subscriptions with RLS enabled';
END $$;
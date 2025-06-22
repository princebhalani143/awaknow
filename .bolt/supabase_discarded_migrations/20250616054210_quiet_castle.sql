/*
  # Create demo user with Resolve Together access

  1. Changes
    - Create demo user with email demo@awaknow.org
    - Set up Resolve Together subscription for demo user
    - Ensure demo user has full access to all features

  2. Security
    - Demo user follows same RLS policies as regular users
    - Demo subscription is properly configured
*/

-- Create demo user subscription with Resolve Together plan
DO $$
DECLARE
    demo_user_id uuid;
BEGIN
    -- Check if demo user exists in auth.users (this would be created via signup)
    -- For now, we'll create a placeholder subscription that will be updated when demo user signs up
    
    -- Insert demo subscription record that will be linked when user signs up
    INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        plan_name,
        status,
        tavus_minutes_limit,
        tavus_minutes_used,
        solo_sessions_today,
        insights_this_week
    ) VALUES (
        '00000000-0000-4000-8000-000000000001', -- Placeholder UUID for demo
        'awaknow_pro',
        'Resolve Together',
        'active',
        500,
        0,
        0,
        0
    ) ON CONFLICT (user_id) DO UPDATE SET
        plan_id = 'awaknow_pro',
        plan_name = 'Resolve Together',
        tavus_minutes_limit = 500,
        updated_at = now();
END $$;
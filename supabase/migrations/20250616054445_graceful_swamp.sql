/*
  # Create demo user subscription with Resolve Together plan

  1. Changes
    - Create a demo subscription record for testing
    - Use placeholder UUID that will be updated when demo user actually signs up
    - Remove ON CONFLICT clause since user_id is not unique in user_subscriptions table
    - Add check to prevent duplicate entries

  2. Demo Account Features
    - Resolve Together plan (awaknow_pro)
    - 500 Tavus minutes
    - Full premium access for testing
*/

-- Create demo user subscription with Resolve Together plan
DO $$
DECLARE
    demo_user_id uuid := '00000000-0000-4000-8000-000000000001';
    existing_count integer;
BEGIN
    -- Check if demo subscription already exists
    SELECT COUNT(*) INTO existing_count 
    FROM user_subscriptions 
    WHERE user_id = demo_user_id;
    
    -- Only insert if doesn't exist
    IF existing_count = 0 THEN
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
            demo_user_id,
            'awaknow_pro',
            'Resolve Together',
            'active',
            500,
            0,
            0,
            0
        );
    ELSE
        -- Update existing demo subscription to Resolve Together
        UPDATE user_subscriptions 
        SET 
            plan_id = 'awaknow_pro',
            plan_name = 'Resolve Together',
            tavus_minutes_limit = 500,
            tavus_minutes_used = 0,
            solo_sessions_today = 0,
            insights_this_week = 0,
            status = 'active',
            updated_at = now()
        WHERE user_id = demo_user_id;
    END IF;
END $$;
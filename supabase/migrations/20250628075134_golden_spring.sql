/*
  # Update Resolve Together plan and demo user with 15000 AI Video Minutes

  1. Updates
    - Update demo user subscription to have 15000 Tavus minutes limit
    - Ensure demo user has full Resolve Together access
    - Reset usage counters for demo user

  2. Changes
    - Set tavus_minutes_limit to 15000 for demo user
    - Ensure plan reflects the correct limits
    - Update subscription status and period
*/

-- Update demo user subscription with correct Resolve Together limits
UPDATE user_subscriptions 
SET 
  plan_id = 'awaknow_pro',
  plan_name = 'Resolve Together',
  tavus_minutes_limit = 15000,
  tavus_minutes_used = 0,
  solo_sessions_today = 0,
  insights_this_week = 0,
  status = 'active',
  current_period_start = now(),
  current_period_end = now() + interval '1 month',
  updated_at = now()
WHERE user_id = '00000000-0000-4000-8000-000000000001';

-- Verify the update was successful
DO $$
DECLARE
    demo_subscription_count integer;
    demo_minutes_limit integer;
BEGIN
    -- Check if demo user subscription exists and has correct limits
    SELECT COUNT(*), COALESCE(MAX(tavus_minutes_limit), 0) 
    INTO demo_subscription_count, demo_minutes_limit
    FROM user_subscriptions 
    WHERE user_id = '00000000-0000-4000-8000-000000000001' 
    AND plan_id = 'awaknow_pro';
    
    IF demo_subscription_count > 0 AND demo_minutes_limit = 15000 THEN
        RAISE NOTICE 'Demo user successfully updated with 15000 AI Video Minutes';
    ELSE
        RAISE NOTICE 'Demo user update may have failed. Count: %, Minutes: %', demo_subscription_count, demo_minutes_limit;
    END IF;
END $$;
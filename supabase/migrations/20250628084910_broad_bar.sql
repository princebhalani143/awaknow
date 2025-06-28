/*
  # Update Subscription Plan Minutes

  1. Changes
    - Update the Resolve Together plan to have 15000 minutes instead of 500
    - Ensure all demo users have the correct minute limit
    - Update any existing subscriptions with the new limit

  2. Verification
    - Check that the update was successful
    - Log the number of subscriptions updated
*/

-- Update all existing Resolve Together subscriptions to have 15000 minutes
UPDATE user_subscriptions 
SET 
  tavus_minutes_limit = 15000,
  updated_at = now()
WHERE plan_id = 'awaknow_pro';

-- Specifically ensure demo user has correct limits
UPDATE user_subscriptions 
SET 
  tavus_minutes_limit = 15000,
  updated_at = now()
WHERE user_id = '00000000-0000-4000-8000-000000000001';

-- Verify the update was successful
DO $$
DECLARE
    updated_count integer;
    demo_minutes integer;
BEGIN
    -- Check how many subscriptions were updated
    SELECT COUNT(*) INTO updated_count
    FROM user_subscriptions 
    WHERE plan_id = 'awaknow_pro' AND tavus_minutes_limit = 15000;
    
    -- Check demo user specifically
    SELECT tavus_minutes_limit INTO demo_minutes
    FROM user_subscriptions 
    WHERE user_id = '00000000-0000-4000-8000-000000000001';
    
    RAISE NOTICE 'Updated % Resolve Together subscriptions to 15000 minutes', updated_count;
    RAISE NOTICE 'Demo user now has % minutes', demo_minutes;
END $$;
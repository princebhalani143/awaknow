/*
  # Fix Demo User Minutes and Accurate Minute Counting

  1. Updates
    - Set demo user to have 15000 minutes (Resolve Together plan)
    - Fix any existing Resolve Together subscriptions to have correct minute limit
    - Add function to track partial minute usage

  2. Changes
    - Update demo user subscription to 15000 minutes
    - Add function for tracking partial minute usage
    - Fix any existing subscriptions with incorrect limits
*/

-- Update all Resolve Together subscriptions to have 15000 minutes
UPDATE user_subscriptions 
SET 
  tavus_minutes_limit = 15000,
  updated_at = now()
WHERE plan_id = 'awaknow_pro';

-- Specifically ensure demo user has correct limits
UPDATE user_subscriptions 
SET 
  tavus_minutes_limit = 15000,
  tavus_minutes_used = 0, -- Reset usage to 0
  updated_at = now()
WHERE user_id = '00000000-0000-4000-8000-000000000001';

-- Create function to track partial minute usage
CREATE OR REPLACE FUNCTION track_tavus_usage(
  user_id uuid,
  session_id uuid,
  seconds_used integer
)
RETURNS boolean AS $$
DECLARE
  minutes_used numeric;
BEGIN
  -- Convert seconds to fractional minutes (rounded to 2 decimal places)
  minutes_used := ROUND((seconds_used::numeric / 60), 2);
  
  -- Insert usage record
  INSERT INTO tavus_usage (
    user_id,
    session_id,
    minutes_used,
    usage_date,
    created_at
  ) VALUES (
    user_id,
    session_id,
    minutes_used,
    CURRENT_DATE,
    now()
  );
  
  -- Update user subscription with precise usage
  UPDATE user_subscriptions
  SET 
    tavus_minutes_used = tavus_minutes_used + minutes_used,
    updated_at = now()
  WHERE user_id = track_tavus_usage.user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error tracking Tavus usage: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION track_tavus_usage(uuid, uuid, integer) TO authenticated, service_role;

-- Verify the update was successful
DO $$
DECLARE
    demo_minutes integer;
    pro_plan_count integer;
    pro_plan_correct_count integer;
BEGIN
    -- Check demo user specifically
    SELECT tavus_minutes_limit INTO demo_minutes
    FROM user_subscriptions 
    WHERE user_id = '00000000-0000-4000-8000-000000000001';
    
    -- Check all pro plan subscriptions
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE tavus_minutes_limit = 15000)
    INTO 
      pro_plan_count,
      pro_plan_correct_count
    FROM user_subscriptions 
    WHERE plan_id = 'awaknow_pro';
    
    RAISE NOTICE 'Demo user now has % minutes', demo_minutes;
    RAISE NOTICE '% out of % Resolve Together subscriptions have correct 15000 minute limit', 
      pro_plan_correct_count, pro_plan_count;
    
    IF demo_minutes = 15000 THEN
      RAISE NOTICE 'Demo user minutes successfully updated to 15000';
    ELSE
      RAISE NOTICE 'WARNING: Demo user minutes update failed!';
    END IF;
    
    IF pro_plan_count = pro_plan_correct_count THEN
      RAISE NOTICE 'All Resolve Together plans successfully updated to 15000 minutes';
    ELSE
      RAISE NOTICE 'WARNING: Some Resolve Together plans still have incorrect minute limits!';
    END IF;
    
    RAISE NOTICE 'Added track_tavus_usage() function for accurate second-based tracking';
END $$;
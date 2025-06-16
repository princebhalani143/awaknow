/*
  # Create demo user and subscription

  1. Creates demo user in auth.users (Supabase auth system)
  2. Creates demo subscription with Resolve Together plan
  3. Handles existing records gracefully
*/

-- Create demo user and subscription
DO $$
DECLARE
    demo_user_id uuid := '00000000-0000-4000-8000-000000000001';
    demo_email text := 'demo@awaknow.org';
    existing_auth_user_count integer;
    existing_subscription_count integer;
BEGIN
    -- Check if demo user exists in auth.users
    SELECT COUNT(*) INTO existing_auth_user_count 
    FROM auth.users 
    WHERE id = demo_user_id OR email = demo_email;
    
    -- Create demo user in auth.users if doesn't exist
    IF existing_auth_user_count = 0 THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            demo_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            demo_email,
            crypt('demo123456', gen_salt('bf')),
            now(),
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Created demo user in auth.users with id: %', demo_user_id;
    ELSE
        RAISE NOTICE 'Demo user already exists in auth.users';
    END IF;
    
    -- Check if demo subscription already exists
    SELECT COUNT(*) INTO existing_subscription_count 
    FROM user_subscriptions 
    WHERE user_id = demo_user_id;
    
    -- Create or update demo subscription
    IF existing_subscription_count = 0 THEN
        INSERT INTO user_subscriptions (
            user_id,
            plan_id,
            plan_name,
            status,
            tavus_minutes_limit,
            tavus_minutes_used,
            solo_sessions_today,
            insights_this_week,
            current_period_start,
            current_period_end
        ) VALUES (
            demo_user_id,
            'awaknow_pro',
            'Resolve Together',
            'active',
            500,
            0,
            0,
            0,
            now(),
            now() + interval '1 month'
        );
        
        RAISE NOTICE 'Created demo subscription for user_id: %', demo_user_id;
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
            current_period_start = now(),
            current_period_end = now() + interval '1 month',
            updated_at = now()
        WHERE user_id = demo_user_id;
        
        RAISE NOTICE 'Updated demo subscription for user_id: %', demo_user_id;
    END IF;
    
    RAISE NOTICE 'Demo user and subscription setup completed successfully';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during demo setup: %', SQLERRM;
        -- Don't re-raise the error to allow migration to continue
END $$;
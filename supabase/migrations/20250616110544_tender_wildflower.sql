/*
  # Create demo user and subscription with Resolve Together plan

  1. New Demo User
    - Creates demo user in auth.users if not exists
    - Creates corresponding user in public.users table
    - Sets up demo credentials for testing

  2. Demo Subscription
    - Creates subscription with Resolve Together plan (awaknow_pro)
    - Sets up 500 Tavus minutes limit
    - Enables all premium features for testing

  3. Security
    - Uses proper foreign key relationships
    - Handles existing records gracefully
    - Maintains data integrity
*/

-- First, create the demo user in auth.users if it doesn't exist
DO $$
DECLARE
    demo_user_id uuid := '00000000-0000-4000-8000-000000000001';
    demo_email text := 'demo@awaknow.org';
    existing_auth_user_count integer;
    existing_public_user_count integer;
    existing_subscription_count integer;
BEGIN
    -- Check if demo user exists in auth.users
    SELECT COUNT(*) INTO existing_auth_user_count 
    FROM auth.users 
    WHERE id = demo_user_id;
    
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
    END IF;
    
    -- Check if demo user exists in public.users
    SELECT COUNT(*) INTO existing_public_user_count 
    FROM public.users 
    WHERE id = demo_user_id;
    
    -- Create demo user in public.users if doesn't exist
    IF existing_public_user_count = 0 THEN
        INSERT INTO public.users (
            id,
            email,
            created_at,
            updated_at
        ) VALUES (
            demo_user_id,
            demo_email,
            now(),
            now()
        );
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
    
    RAISE NOTICE 'Demo user and subscription setup completed for user_id: %', demo_user_id;
END $$;
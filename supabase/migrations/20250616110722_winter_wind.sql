/*
  # Create missing users table and fix demo user setup

  1. New Tables
    - `users` table to satisfy foreign key constraint from user_subscriptions
  
  2. Demo User Setup
    - Create demo user in both auth.users and public.users
    - Create demo subscription with Resolve Together plan
  
  3. Security
    - Enable RLS on users table
    - Add policies for users to manage their own data
*/

-- Create the missing users table that user_subscriptions references
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text,
  full_name text,
  avatar_url text,
  language text DEFAULT 'en',
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Now create the demo user setup
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
            recovery_token,
            raw_user_meta_data
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
            '',
            '{"full_name": "Demo User"}'::jsonb
        );
        
        RAISE NOTICE 'Created demo user in auth.users with id: %', demo_user_id;
    ELSE
        RAISE NOTICE 'Demo user already exists in auth.users';
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
            full_name,
            language,
            subscription_tier,
            created_at,
            updated_at
        ) VALUES (
            demo_user_id,
            demo_email,
            'Demo User',
            'en',
            'premium',
            now(),
            now()
        );
        
        RAISE NOTICE 'Created demo user in public.users with id: %', demo_user_id;
    ELSE
        RAISE NOTICE 'Demo user already exists in public.users';
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
        RAISE NOTICE 'Error during demo setup: % - %', SQLSTATE, SQLERRM;
        -- Don't re-raise the error to allow migration to continue
END $$;
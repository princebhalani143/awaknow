/*
  # User Profile Storage and Functions

  1. Storage Setup
    - Create user-avatars bucket for profile images
    - Set up storage policies for avatar management
    - Handle conflicts gracefully

  2. Profile Functions
    - Function to update user profile information
    - Function to handle avatar uploads
    - Proper security and validation

  3. Security
    - Users can only manage their own avatars
    - Public read access for avatar images
    - Authenticated users can upload/update/delete their own avatars
*/

-- Create storage bucket for user avatars (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user-avatars') THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('user-avatars', 'user-avatars', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
    RAISE NOTICE 'Created user-avatars storage bucket';
  ELSE
    RAISE NOTICE 'user-avatars bucket already exists';
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
  
  RAISE NOTICE 'Dropped existing storage policies';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some policies may not have existed: %', SQLERRM;
END $$;

-- Create storage policies for user avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    name LIKE ('avatars/' || auth.uid()::text || '%')
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND
    name LIKE ('avatars/' || auth.uid()::text || '%')
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND
    name LIKE ('avatars/' || auth.uid()::text || '%')
  );

-- Add function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  target_user_id uuid,
  new_full_name text DEFAULT NULL,
  new_avatar_url text DEFAULT NULL,
  new_language text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  updated_user public.users;
BEGIN
  -- Check if user exists and is the authenticated user
  IF target_user_id != auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Can only update own profile'
    );
  END IF;

  -- Update the user profile
  UPDATE public.users
  SET
    full_name = COALESCE(new_full_name, full_name),
    avatar_url = COALESCE(new_avatar_url, avatar_url),
    language = COALESCE(new_language, language),
    updated_at = now()
  WHERE id = target_user_id
  RETURNING * INTO updated_user;
  
  IF updated_user IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', to_jsonb(updated_user)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_profile(uuid, text, text, text) TO authenticated;

-- Add function to get avatar upload URL
CREATE OR REPLACE FUNCTION get_avatar_upload_url(
  target_user_id uuid,
  file_name text
)
RETURNS jsonb AS $$
DECLARE
  file_path text;
  upload_url text;
  public_url text;
BEGIN
  -- Check if user is authenticated and getting URL for own profile
  IF target_user_id != auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Can only get upload URL for own avatar'
    );
  END IF;

  -- Create file path
  file_path := 'avatars/' || target_user_id::text || '/' || file_name;
  
  -- Create public URL (this will be the final URL after upload)
  public_url := '/storage/v1/object/public/user-avatars/' || file_path;
  
  RETURN jsonb_build_object(
    'success', true,
    'file_path', file_path,
    'public_url', public_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission for avatar URL function
GRANT EXECUTE ON FUNCTION get_avatar_upload_url(uuid, text) TO authenticated;

-- Add function to increment usage counters (if not exists)
CREATE OR REPLACE FUNCTION increment_solo_session_count(uid uuid)
RETURNS void AS $$
DECLARE
  today_date date := CURRENT_DATE;
BEGIN
  UPDATE user_subscriptions 
  SET 
    solo_sessions_today = CASE 
      WHEN last_solo_session_date = today_date THEN solo_sessions_today + 1
      ELSE 1
    END,
    last_solo_session_date = today_date,
    updated_at = now()
  WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to increment Tavus usage (if not exists)
CREATE OR REPLACE FUNCTION increment_tavus_usage(uid uuid, minutes integer)
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions 
  SET 
    tavus_minutes_used = tavus_minutes_used + minutes,
    updated_at = now()
  WHERE user_id = uid;
  
  -- Also insert into tavus_usage table for tracking
  INSERT INTO tavus_usage (user_id, minutes_used, usage_date)
  VALUES (uid, minutes, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions for usage functions
GRANT EXECUTE ON FUNCTION increment_solo_session_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_tavus_usage(uuid, integer) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'User profile storage and functions created successfully!';
END $$;
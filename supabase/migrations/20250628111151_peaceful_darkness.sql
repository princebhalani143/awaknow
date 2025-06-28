-- Create storage bucket for user avatars (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user-avatars') THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('user-avatars', 'user-avatars', true, false, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
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
EXCEPTION
  WHEN undefined_object THEN
    -- Policies don't exist, continue
    NULL;
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

-- Add function to upload avatar and update profile
CREATE OR REPLACE FUNCTION upload_user_avatar(
  target_user_id uuid,
  file_name text,
  file_data bytea,
  content_type text
)
RETURNS jsonb AS $$
DECLARE
  file_path text;
  avatar_url text;
  result jsonb;
  supabase_url text;
BEGIN
  -- Check if user is authenticated and updating own profile
  IF target_user_id != auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Unauthorized: Can only upload own avatar'
    );
  END IF;

  -- Validate content type
  IF content_type NOT IN ('image/png', 'image/jpeg', 'image/gif', 'image/webp') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid file type. Only PNG, JPEG, GIF, and WebP are allowed.'
    );
  END IF;

  -- Create file path
  file_path := 'avatars/' || target_user_id::text || '/' || file_name;
  
  -- Try to get Supabase URL from settings, fallback to placeholder
  BEGIN
    supabase_url := current_setting('app.settings.supabase_url', true);
  EXCEPTION
    WHEN undefined_object THEN
      supabase_url := 'your-project.supabase.co';
  END;
  
  -- Create avatar URL
  avatar_url := 'https://' || supabase_url || '/storage/v1/object/public/user-avatars/' || file_path;
  
  -- Update user profile with new avatar URL
  SELECT update_user_profile(target_user_id, NULL, avatar_url, NULL) INTO result;
  
  -- Add file path to result
  result := result || jsonb_build_object('file_path', file_path);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission for avatar upload function
GRANT EXECUTE ON FUNCTION upload_user_avatar(uuid, text, bytea, text) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'User profile storage and functions created successfully!';
END $$;
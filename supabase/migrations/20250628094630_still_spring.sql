-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('user-avatars', 'user-avatars', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for user avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    (storage.foldername(name))[1] = 'avatars' AND
    (storage.filename(name))[1] LIKE (auth.uid() || '%')
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND
    (storage.foldername(name))[1] = 'avatars' AND
    (storage.filename(name))[1] LIKE (auth.uid() || '%')
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'user-avatars' AND
    (storage.foldername(name))[1] = 'avatars' AND
    (storage.filename(name))[1] LIKE (auth.uid() || '%')
  );

-- Add function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  user_id uuid,
  full_name text DEFAULT NULL,
  avatar_url text DEFAULT NULL,
  language text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Update the user profile
  UPDATE public.users
  SET
    full_name = COALESCE(update_user_profile.full_name, users.full_name),
    avatar_url = COALESCE(update_user_profile.avatar_url, users.avatar_url),
    language = COALESCE(update_user_profile.language, users.language),
    updated_at = now()
  WHERE id = user_id
  RETURNING to_jsonb(users.*) INTO result;
  
  IF result IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', result
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_user_profile(uuid, text, text, text) TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'User profile storage and functions created successfully!';
END $$;
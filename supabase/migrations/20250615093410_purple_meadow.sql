/*
  # Fix RLS infinite recursion between sessions and session_participants

  1. Policy Changes
    - Update sessions SELECT policy to remove recursion
    - Update session_participants SELECT policy to be simpler
    - Ensure users can still access their own data without circular dependencies

  2. Security
    - Users can read sessions they created
    - Users can read sessions they participate in (via direct participant check)
    - Users can read their own participant records
    - Maintain data isolation between users

  3. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies
    - Test policies work without circular dependencies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read accessible sessions" ON sessions;
DROP POLICY IF EXISTS "Users can read session participants for accessible sessions" ON session_participants;

-- Create new non-recursive policy for sessions
-- Users can read sessions they created OR sessions where they are explicitly listed as participants
CREATE POLICY "Users can read own and participated sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = created_by) OR 
    (id IN (
      SELECT sp.session_id 
      FROM session_participants sp 
      WHERE sp.user_id = auth.uid()
    ))
  );

-- Create simple policy for session_participants
-- Users can only read their own participant records
CREATE POLICY "Users can read own participant records"
  ON session_participants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure other policies remain intact for session_participants
-- (INSERT and UPDATE policies should already exist and work fine)
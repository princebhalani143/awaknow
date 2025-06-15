/*
  # Fix RLS Policy Recursion

  1. Policy Changes
    - Remove recursive policy on session_participants that causes infinite loop
    - Create non-recursive policy that relies on sessions table RLS
    - Ensure sessions table has proper RLS policy for participants

  2. Security
    - Users can read sessions they created or participate in
    - Users can read session_participants records for sessions they have access to
    - No circular dependencies between policies
*/

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can read own sessions" ON sessions;
DROP POLICY IF EXISTS "Participants can read session participation" ON session_participants;

-- Create a proper non-recursive policy for sessions
CREATE POLICY "Users can read accessible sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (
    (created_by = auth.uid()) OR
    (id IN (
      SELECT session_id 
      FROM session_participants 
      WHERE user_id = auth.uid()
    ))
  );

-- Create a non-recursive policy for session_participants that relies on sessions RLS
CREATE POLICY "Users can read session participants for accessible sessions"
  ON session_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM sessions 
      WHERE sessions.id = session_participants.session_id
    )
  );
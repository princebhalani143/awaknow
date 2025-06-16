/*
  # Fix RLS policy for user_subscriptions table

  1. Security Policy Updates
    - Drop existing INSERT policy that uses incorrect uid() function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure users can create subscription records for themselves

  This fixes the RLS violation error when creating default subscriptions.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create own subscription" ON user_subscriptions;

-- Create a new INSERT policy with the correct auth.uid() function
CREATE POLICY "Users can create own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also update the UPDATE policy to use auth.uid() for consistency
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update the SELECT policy to use auth.uid() for consistency
DROP POLICY IF EXISTS "Users can read own subscription" ON user_subscriptions;

CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
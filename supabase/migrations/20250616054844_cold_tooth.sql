/*
  # Fix RLS policies for user_subscriptions table

  1. Security Updates
    - Drop existing INSERT policy that may be causing issues
    - Create new INSERT policy with proper conditions
    - Ensure users can create their own subscription records
    - Add policy for service role operations

  2. Policy Changes
    - Allow authenticated users to insert their own subscription records
    - Allow service role to insert subscription records (for system operations)
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can create own subscription" ON user_subscriptions;

-- Create new INSERT policy for authenticated users
CREATE POLICY "Users can create own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create INSERT policy for service role (for system operations like creating default subscriptions)
CREATE POLICY "Service role can create subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure the existing SELECT policy is correct
DROP POLICY IF EXISTS "Users can read own subscription" ON user_subscriptions;
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the existing UPDATE policy is correct
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;
CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
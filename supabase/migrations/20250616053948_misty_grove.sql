/*
  # Fix RLS policies for user_subscriptions table

  1. Security Updates
    - Drop existing policies that use incorrect uid() function
    - Create new policies using correct auth.uid() function
    - Ensure users can create, read, and update their own subscription records

  2. Policy Changes
    - INSERT policy: Allow authenticated users to create their own subscription
    - SELECT policy: Allow users to read their own subscription data
    - UPDATE policy: Allow users to update their own subscription data

  This fixes the "new row violates row-level security policy" error when creating default subscriptions.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can read own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON user_subscriptions;

-- Create corrected policies using auth.uid()
CREATE POLICY "Users can create own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
/*
  # Add INSERT policy for user_subscriptions table

  1. Security Changes
    - Add INSERT policy for `user_subscriptions` table
    - Allow authenticated users to create subscription records for themselves
    - Policy ensures users can only insert records where user_id matches their auth.uid()

  This resolves the RLS violation error when creating default subscriptions for new users.
*/

-- Add INSERT policy for user_subscriptions table
CREATE POLICY "Users can create own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
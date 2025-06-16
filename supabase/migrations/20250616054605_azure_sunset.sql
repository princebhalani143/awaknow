/*
  # Fix RLS policy for user_subscriptions table

  1. Security Policy Updates
    - Drop existing INSERT policy that uses uid() function
    - Create new INSERT policy using auth.uid() function
    - Ensure authenticated users can create their own subscription records

  2. Changes
    - Replace uid() with auth.uid() in INSERT policy
    - Maintain same security level while fixing function reference
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create own subscription" ON user_subscriptions;

-- Create new INSERT policy with correct auth.uid() function
CREATE POLICY "Users can create own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- Add blocked emails table to prevent re-registration
CREATE TABLE IF NOT EXISTS blocked_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  blocked_at timestamptz DEFAULT now(),
  reason text DEFAULT 'user_requested_deletion',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blocked_emails ENABLE ROW LEVEL SECURITY;

-- Only allow system/admin access to blocked emails
CREATE POLICY "Only system can access blocked emails"
  ON blocked_emails
  FOR ALL
  TO authenticated
  USING (false);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_blocked_emails_email ON blocked_emails(email);
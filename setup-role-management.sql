-- Create role_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  requested_role TEXT NOT NULL CHECK (requested_role IN ('member', 'alumni', 'admin')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS role_requests_user_id_idx ON role_requests(user_id);

-- Make tridibeshss30@gmail.com an admin
UPDATE profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT profiles.id 
  FROM profiles 
  JOIN auth.users ON profiles.id = auth.users.id 
  WHERE auth.users.email = 'tridibeshss30@gmail.com'
);

-- Add a notification system for role approvals
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

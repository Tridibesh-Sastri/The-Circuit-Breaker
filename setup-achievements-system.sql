-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  badge_color TEXT DEFAULT '#3B82F6',
  points INTEGER DEFAULT 0,
  category TEXT CHECK (category IN ('projects', 'forum', 'events', 'collaboration', 'special')),
  criteria JSONB NOT NULL, -- Stores achievement criteria
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all user achievements" ON user_achievements
  FOR SELECT USING (true);

CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, criteria, points) VALUES
('First Project', 'Submit your first project', '🚀', 'projects', '{"projects_submitted": 1}', 10),
('Project Master', 'Submit 5 projects', '🏆', 'projects', '{"projects_submitted": 5}', 50),
('Forum Contributor', 'Make 10 forum posts', '💬', 'forum', '{"forum_posts": 10}', 25),
('Event Attendee', 'Attend your first event', '📅', 'events', '{"events_attended": 1}', 15),
('Social Butterfly', 'Comment on 20 forum posts', '🦋', 'forum', '{"forum_comments": 20}', 30),
('Team Player', 'Collaborate on 3 projects', '🤝', 'collaboration', '{"collaborations": 3}', 40),
('Early Bird', 'One of the first 100 members', '🐦', 'special', '{"member_number": 100}', 100)
ON CONFLICT (name) DO NOTHING;

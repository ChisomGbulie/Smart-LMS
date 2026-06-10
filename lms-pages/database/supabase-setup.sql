-- Create user_assessments table
CREATE TABLE IF NOT EXISTS user_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  career_goal TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  years_experience NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create learning_paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  assessment_id UUID NOT NULL REFERENCES user_assessments(id) ON DELETE CASCADE,
  roadmap_content TEXT NOT NULL,
  recommended_courses JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_learning_progress table (for tracking progress through courses)
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_name)
);

-- Create indexes for faster queries
CREATE INDEX idx_user_assessments_user_id ON user_assessments(user_id);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_progress_user_id ON user_learning_progress(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, can be restricted later)
CREATE POLICY "Users can view own assessment" ON user_assessments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own assessment" ON user_assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own assessment" ON user_assessments
  FOR UPDATE USING (true);

CREATE POLICY "Users can view own learning path" ON learning_paths
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own learning path" ON learning_paths
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own learning path" ON learning_paths
  FOR UPDATE USING (true);

CREATE POLICY "Users can view own progress" ON user_learning_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own progress" ON user_learning_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own progress" ON user_learning_progress
  FOR UPDATE USING (true);

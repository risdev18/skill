-- SkillSync Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor if connecting a live Supabase project

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  bio TEXT,
  availability TEXT DEFAULT '10-15 hrs/week',
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skills Table
CREATE TABLE IF NOT EXISTS student_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency INT CHECK (proficiency IN (1, 2, 3)),
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  max_team_size INT DEFAULT 4,
  duration TEXT NOT NULL,
  experience_preference TEXT DEFAULT 'All Levels',
  deadline DATE,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Project Required Skills
CREATE TABLE IF NOT EXISTS project_required_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  weight NUMERIC NOT NULL CHECK (weight >= 0),
  minimum_proficiency INT CHECK (minimum_proficiency IN (1, 2, 3)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS project_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Withdrawn')),
  pitch TEXT,
  match_score NUMERIC,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, student_id)
);

-- 6. Team Memberships
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'Team Member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (project_id, student_id)
);

-- 7. Tasks Table
CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_required_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Skills viewable by everyone" ON student_skills FOR SELECT USING (true);
CREATE POLICY "Users can modify own skills" ON student_skills FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Projects viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Project owners can manage projects" ON projects FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Applications viewable by applicant and project owner" ON project_applications
  FOR SELECT USING (auth.uid() = student_id OR auth.uid() IN (SELECT owner_id FROM projects WHERE id = project_id));

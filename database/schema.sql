-- CV Builder AI Database Schema
-- This schema sets up tables for CVs and AI cache with proper security policies
--
-- NOTE (2026-08 reconciliation): the profiles table below was corrected to match
-- the LIVE database, which uses `profiles` keyed by `user_id` (the old committed
-- version defined `user_profiles` keyed by `id`, which the app never used). The
-- app reads/writes profiles via user_id with columns email/first_name/last_name/
-- avatar_url. Run database/verify_rls.sql after applying to confirm RLS.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Profiles Table
-- ============================================
-- One row per auth user, keyed by user_id. In the live project a row is created
-- automatically by the signup trigger (handle_new_user, below); the app also
-- upserts on user_id, so a row is guaranteed either way.
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================
-- CVs Table
-- ============================================
CREATE TABLE IF NOT EXISTS cvs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_role text,
  data jsonb NOT NULL, -- full CV content
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cvs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for CVs table
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_created_at ON cvs(created_at DESC);
CREATE INDEX idx_cvs_updated_at ON cvs(updated_at DESC);

-- ============================================
-- AI Cache Table
-- ============================================
CREATE TABLE IF NOT EXISTS ai_cache (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- "skills" | "experience" | "summary"
  input_hash text NOT NULL,
  output jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_cache_type_check CHECK (type IN ('skills', 'experience', 'summary')),
  CONSTRAINT ai_cache_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for AI Cache table
CREATE INDEX idx_ai_cache_user_id ON ai_cache(user_id);
CREATE INDEX idx_ai_cache_type ON ai_cache(type);
CREATE INDEX idx_ai_cache_input_hash ON ai_cache(input_hash);
CREATE INDEX idx_ai_cache_created_at ON ai_cache(created_at DESC);
CREATE INDEX idx_ai_cache_user_type_hash ON ai_cache(user_id, type, input_hash);

-- ============================================
-- Row Level Security Policies (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies (self-scoped on user_id)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- CVs RLS Policies
CREATE POLICY "Users can view their own CVs"
  ON cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own CVs"
  ON cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON cvs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
  ON cvs FOR DELETE
  USING (auth.uid() = user_id);

-- AI Cache RLS Policies
CREATE POLICY "Users can view their own AI cache"
  ON ai_cache FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their AI cache"
  ON ai_cache FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI cache"
  ON ai_cache FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on cvs table
DROP TRIGGER IF EXISTS update_cvs_updated_at ON cvs;
CREATE TRIGGER update_cvs_updated_at
  BEFORE UPDATE ON cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Signup trigger: auto-create a profile row
-- ============================================
-- Mirrors the live project: when a new auth user is created, seed their
-- profiles row. SECURITY DEFINER so it runs regardless of the caller's RLS.
-- ON CONFLICT DO NOTHING keeps it safe alongside the app's own upsert.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Notes
-- ============================================
-- 1. All tables implement RLS for security - users can only access their own data
-- 2. User data is automatically deleted when a user is deleted from auth.users
-- 3. The updated_at timestamp auto-updates on CVs table modifications
-- 4. AI Cache uses input_hash to deduplicate requests and avoid repeated API calls
-- 5. Indexes optimize queries on frequently filtered columns

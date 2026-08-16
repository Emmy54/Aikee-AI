-- VERIFICATION QUERIES FOR CV BUILDER DATABASE
-- Run these in Supabase SQL Editor to diagnose save issues

-- ========================================
-- 1. CHECK RLS STATUS
-- ========================================
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('cvs', 'ai_cache')
ORDER BY tablename;

-- Expected output:
-- tablename | rowsecurity
-- ai_cache  | t
-- cvs       | t

-- If rowsecurity is "f", run:
-- ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;


-- ========================================
-- 2. CHECK RLS POLICIES
-- ========================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('cvs', 'ai_cache')
ORDER BY tablename, policyname;

-- Expected: Should see 4 policies for cvs (SELECT, INSERT, UPDATE, DELETE)
-- and 3 for ai_cache (SELECT, INSERT, DELETE)


-- ========================================
-- 3. CHECK YOUR USER IN AUTH
-- ========================================
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Look for your email and check email_confirmed_at is NOT NULL
-- If it's NULL, you need to verify your email


-- ========================================
-- 4. VERIFY FUNCTIONS EXIST
-- ========================================
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Expected functions:
-- - update_updated_at_column (FUNCTION)
-- - clear_old_cache (FUNCTION)
-- - delete_cv (FUNCTION)
-- - get_ai_cache (FUNCTION)
-- - get_cv_by_id (FUNCTION)
-- - get_user_cvs (FUNCTION)
-- - save_ai_cache (FUNCTION)
-- - upsert_cv (FUNCTION)


-- ========================================
-- 5. CHECK TABLE STRUCTURE
-- ========================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'cvs'
ORDER BY ordinal_position;

-- Should show columns: id, user_id, title, target_role, data, created_at, updated_at


-- ========================================
-- 6. MANUAL INSERT TEST
-- ========================================
-- First, get your user ID:
SELECT id FROM auth.users WHERE email = 'your-email@example.com' LIMIT 1;

-- Then insert a test CV (replace UUID with your user ID):
INSERT INTO cvs (user_id, title, target_role, data)
VALUES (
  'YOUR-USER-ID-HERE',
  'Manual Test CV',
  'Test Role',
  '{"test": true}'::jsonb
);

-- Check if it was inserted:
SELECT id, user_id, title FROM cvs WHERE title = 'Manual Test CV';

-- If the INSERT succeeds but you can't SELECT, it's a RLS issue
-- If the INSERT fails with error, check the error message


-- ========================================
-- 7. VIEW ACTUAL DATA
-- ========================================
-- See all CVs for your user:
SELECT id, title, target_role, created_at, updated_at 
FROM cvs 
WHERE user_id = 'YOUR-USER-ID-HERE'
ORDER BY created_at DESC;

-- See all AI cache for your user:
SELECT id, type, created_at 
FROM ai_cache 
WHERE user_id = 'YOUR-USER-ID-HERE'
ORDER BY created_at DESC;


-- ========================================
-- 8. TEST RLS POLICY
-- ========================================
-- This should work if you're authenticated:
SELECT id, title FROM cvs;

-- If you get "RLS violation" error, check:
-- 1. Are you logged in to Supabase client?
-- 2. Is auth.uid() returning NULL?
-- 3. Are RLS policies using auth.uid() = user_id?


-- ========================================
-- 9. CHECK INDEXES
-- ========================================
SELECT 
  indexname,
  tablename
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename IN ('cvs', 'ai_cache')
ORDER BY tablename;

-- Expected indexes:
-- idx_cvs_user_id
-- idx_cvs_created_at
-- idx_cvs_updated_at
-- idx_ai_cache_user_id
-- idx_ai_cache_type
-- idx_ai_cache_input_hash
-- idx_ai_cache_created_at
-- idx_ai_cache_user_type_hash


-- ========================================
-- 10. TEST FOREIGN KEY CONSTRAINT
-- ========================================
-- Check foreign key is set up:
SELECT
  constraint_name,
  table_name,
  column_name,
  foreign_table_name,
  foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu USING (constraint_name)
JOIN information_schema.constraint_column_usage ccu USING (constraint_name)
WHERE tc.table_name = 'cvs' AND tc.constraint_type = 'FOREIGN KEY';

-- Expected: user_id should reference auth.users(id)

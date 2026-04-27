-- CV Builder AI - Common Database Queries and Helper Functions
-- Use these functions in your application for standard operations

-- ============================================
-- CVs Helper Functions
-- ============================================

-- Get all CVs for current user (ordered by most recent first)
CREATE OR REPLACE FUNCTION get_user_cvs()
RETURNS TABLE (
  id uuid,
  title text,
  target_role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT cvs.id, cvs.title, cvs.target_role, cvs.created_at, cvs.updated_at
  FROM cvs
  WHERE user_id = auth.uid()
  ORDER BY cvs.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get single CV with full data
CREATE OR REPLACE FUNCTION get_cv_by_id(cv_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  target_role text,
  data jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT cvs.id, cvs.title, cvs.target_role, cvs.data, cvs.created_at, cvs.updated_at
  FROM cvs
  WHERE cvs.id = cv_id AND cvs.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or update a CV
CREATE OR REPLACE FUNCTION upsert_cv(
  cv_id uuid,
  cv_title text,
  cv_target_role text,
  cv_data jsonb
)
RETURNS uuid AS $$
DECLARE
  result_id uuid;
BEGIN
  INSERT INTO cvs (id, user_id, title, target_role, data)
  VALUES (COALESCE(cv_id, uuid_generate_v4()), auth.uid(), cv_title, cv_target_role, cv_data)
  ON CONFLICT (id) DO UPDATE
  SET title = cv_title,
      target_role = cv_target_role,
      data = cv_data,
      updated_at = now()
  WHERE cvs.user_id = auth.uid()
  RETURNING cvs.id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete a CV
CREATE OR REPLACE FUNCTION delete_cv(cv_id uuid)
RETURNS boolean AS $$
BEGIN
  DELETE FROM cvs
  WHERE id = cv_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AI Cache Helper Functions
-- ============================================

-- Get cached AI response (if exists)
CREATE OR REPLACE FUNCTION get_ai_cache(
  cache_type text,
  cache_input_hash text
)
RETURNS TABLE (
  id uuid,
  output jsonb,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT ai_cache.id, ai_cache.output, ai_cache.created_at
  FROM ai_cache
  WHERE ai_cache.user_id = auth.uid()
    AND ai_cache.type = cache_type
    AND ai_cache.input_hash = cache_input_hash
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Save AI cache result
CREATE OR REPLACE FUNCTION save_ai_cache(
  cache_type text,
  cache_input_hash text,
  cache_output jsonb
)
RETURNS uuid AS $$
DECLARE
  result_id uuid;
BEGIN
  INSERT INTO ai_cache (user_id, type, input_hash, output)
  VALUES (auth.uid(), cache_type, cache_input_hash, cache_output)
  RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all cache entries for a type (for user dashboard/stats)
CREATE OR REPLACE FUNCTION get_user_cache_by_type(cache_type text)
RETURNS TABLE (
  id uuid,
  type text,
  input_hash text,
  created_at timestamp with time zone,
  outputs_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT ai_cache.id, ai_cache.type, ai_cache.input_hash, ai_cache.created_at, COUNT(*) OVER () as outputs_count
  FROM ai_cache
  WHERE ai_cache.user_id = auth.uid() AND ai_cache.type = cache_type
  ORDER BY ai_cache.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear old cache entries (older than X days)
CREATE OR REPLACE FUNCTION clear_old_cache(days_old integer DEFAULT 30)
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM ai_cache
  WHERE user_id = auth.uid()
    AND created_at < NOW() - INTERVAL '1 day' * days_old;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Views for Analytics
-- ============================================

-- View: User statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  auth.uid() as user_id,
  (SELECT COUNT(*) FROM cvs WHERE user_id = auth.uid()) as total_cvs,
  (SELECT COUNT(*) FROM ai_cache WHERE user_id = auth.uid()) as total_cache_entries,
  (SELECT COUNT(DISTINCT type) FROM ai_cache WHERE user_id = auth.uid()) as cache_types_used,
  (SELECT MAX(updated_at) FROM cvs WHERE user_id = auth.uid()) as last_cv_update,
  (SELECT MAX(created_at) FROM ai_cache WHERE user_id = auth.uid()) as last_cache_use;

-- ============================================
-- Notes for Frontend Integration
-- ============================================
-- 
-- Usage Examples in JavaScript:
--
-- 1. Get all CVs:
--    const { data } = await supabase.rpc('get_user_cvs');
--
-- 2. Get specific CV:
--    const { data } = await supabase.rpc('get_cv_by_id', { cv_id: 'uuid' });
--
-- 3. Save CV:
--    const { data } = await supabase.rpc('upsert_cv', {
--      cv_id: null, // null for new, uuid for update
--      cv_title: 'My CV',
--      cv_target_role: 'Software Engineer',
--      cv_data: { /* full CV object */ }
--    });
--
-- 4. Check cache before calling AI:
--    const { data } = await supabase.rpc('get_ai_cache', {
--      cache_type: 'skills',
--      cache_input_hash: hashInputString('user input')
--    });
--
-- 5. Save AI result to cache:
--    const { data } = await supabase.rpc('save_ai_cache', {
--      cache_type: 'skills',
--      cache_input_hash: hashInputString('user input'),
--      cache_output: { /* AI response */ }
--    });
--
-- 6. Clear old cache:
--    await supabase.rpc('clear_old_cache', { days_old: 30 });

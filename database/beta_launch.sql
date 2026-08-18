-- ============================================================
-- Aikee AI — Beta Launch Migration
-- ============================================================
-- Adds beta-gating + per-user AI usage limits.
--
-- SAFE TO RUN ON THE LIVE DB: everything here is idempotent and
-- purely additive. It creates two NEW tables (beta_allowlist, usage)
-- and a few RPCs. It does NOT touch profiles / cvs / ai_cache data.
--
-- HOW TO RUN:
--   Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
--   Re-running is safe (CREATE ... IF NOT EXISTS / CREATE OR REPLACE).
--
-- WHAT IT GIVES YOU:
--   * beta_allowlist  — approved tester emails (task #4)
--   * usage           — per-user counter of full-CV generations (task #1)
--   * try_consume_full_cv_generation() — atomic "allow + increment" gate (task #2)
--   * is_email_allowlisted()           — is the caller an approved tester? (task #4)
--   * get_my_generation_status()       — powers the client UI (X of 2 used)
--
-- TO APPROVE A TESTER (run in SQL editor, or add via Table editor):
--   INSERT INTO beta_allowlist (email) VALUES ('tester@example.com')
--   ON CONFLICT (email) DO NOTHING;
-- ============================================================

-- ============================================
-- Beta Allowlist Table  (task #4)
-- ============================================
-- Emails are stored lowercased. RLS is ENABLED with NO policies, so
-- clients cannot read the list at all — the only read path is the
-- SECURITY DEFINER function is_email_allowlisted() below, plus the
-- server / dashboard (service_role bypasses RLS).
CREATE TABLE IF NOT EXISTS beta_allowlist (
  email      text PRIMARY KEY,
  note       text,
  added_at   timestamp with time zone DEFAULT now()
);

ALTER TABLE beta_allowlist ENABLE ROW LEVEL SECURITY;
-- (intentionally no policies — table is server/dashboard-only)

-- ============================================
-- Usage Table  (task #1)
-- ============================================
-- One row per user. Currently tracks full-CV generations; extra
-- counters can be added later without a schema break.
-- RLS: a user may READ ONLY their own row (for the "X of 2 used" UI).
-- There are deliberately NO insert/update/delete policies, so the
-- counter cannot be tampered with from the browser — it is mutated
-- exclusively by the SECURITY DEFINER RPC below.
CREATE TABLE IF NOT EXISTS usage (
  user_id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_cv_count    integer NOT NULL DEFAULT 0,
  last_full_cv_at  timestamp with time zone,
  created_at       timestamp with time zone DEFAULT now(),
  updated_at       timestamp with time zone DEFAULT now()
);

ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own usage" ON usage;
CREATE POLICY "Users can view their own usage"
  ON usage FOR SELECT
  USING (auth.uid() = user_id);
-- (no INSERT/UPDATE/DELETE policies — writes go through the RPC only)

-- ============================================
-- RPC: is_email_allowlisted()  (task #4)
-- ============================================
-- Returns TRUE if the CURRENTLY AUTHENTICATED user's email is on the
-- beta allowlist. Reads the email from auth.users (not from client
-- input) so it can't be spoofed. search_path is pinned for safety.
CREATE OR REPLACE FUNCTION is_email_allowlisted()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT lower(u.email) INTO v_email
  FROM auth.users u
  WHERE u.id = auth.uid();

  IF v_email IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.beta_allowlist b
    WHERE lower(b.email) = v_email
  );
END;
$$;

-- ============================================
-- RPC: try_consume_full_cv_generation(p_limit)  (task #2)
-- ============================================
-- Atomic gate for the expensive "Generate CV" action. In one call it:
--   1. rejects unauthenticated callers,
--   2. rejects non-allowlisted testers,
--   3. locks the user's usage row (FOR UPDATE) so two concurrent
--      requests can't both slip past the cap,
--   4. increments and returns allowed=true only if under p_limit.
-- Returns a single row: (allowed, used, cap, reason).
--   reason ∈ 'ok' | 'not_authenticated' | 'not_allowlisted' | 'limit_reached'
CREATE OR REPLACE FUNCTION try_consume_full_cv_generation(p_limit integer DEFAULT 2)
RETURNS TABLE (allowed boolean, used integer, cap integer, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN QUERY SELECT false, 0, p_limit, 'not_authenticated';
    RETURN;
  END IF;

  IF NOT is_email_allowlisted() THEN
    RETURN QUERY SELECT false, 0, p_limit, 'not_allowlisted';
    RETURN;
  END IF;

  -- Ensure a row exists, then lock it for an atomic check-and-increment.
  INSERT INTO public.usage (user_id) VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT full_cv_count INTO v_count
  FROM public.usage
  WHERE user_id = v_uid
  FOR UPDATE;

  IF v_count >= p_limit THEN
    RETURN QUERY SELECT false, v_count, p_limit, 'limit_reached';
    RETURN;
  END IF;

  UPDATE public.usage
  SET full_cv_count   = full_cv_count + 1,
      last_full_cv_at = now(),
      updated_at      = now()
  WHERE user_id = v_uid;

  RETURN QUERY SELECT true, v_count + 1, p_limit, 'ok';
END;
$$;

-- ============================================
-- RPC: refund_full_cv_generation()
-- ============================================
-- Gives back one credit for the current user (never below 0). The server
-- calls this if the Gemini request fails AFTER a credit was consumed, so a
-- transient upstream error never costs a tester one of their generations.
CREATE OR REPLACE FUNCTION refund_full_cv_generation()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;
  UPDATE public.usage
  SET full_cv_count = GREATEST(full_cv_count - 1, 0),
      updated_at    = now()
  WHERE user_id = v_uid;
END;
$$;

-- ============================================
-- RPC: get_my_generation_status(p_limit)  (client UI helper)
-- ============================================
-- Read-only. Powers the "you have N of 2 generations left" UI and the
-- waitlist gate, in a single round-trip. Does NOT increment anything.
CREATE OR REPLACE FUNCTION get_my_generation_status(p_limit integer DEFAULT 2)
RETURNS TABLE (allowlisted boolean, used integer, cap integer, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN QUERY SELECT false, 0, p_limit, 0;
    RETURN;
  END IF;

  SELECT COALESCE(full_cv_count, 0) INTO v_count
  FROM public.usage
  WHERE user_id = v_uid;
  v_count := COALESCE(v_count, 0);

  RETURN QUERY
    SELECT is_email_allowlisted(), v_count, p_limit, GREATEST(p_limit - v_count, 0);
END;
$$;

-- ============================================
-- Grants — authenticated users only, never anon
-- ============================================
REVOKE ALL ON FUNCTION is_email_allowlisted()                         FROM public, anon;
REVOKE ALL ON FUNCTION try_consume_full_cv_generation(integer)        FROM public, anon;
REVOKE ALL ON FUNCTION refund_full_cv_generation()                    FROM public, anon;
REVOKE ALL ON FUNCTION get_my_generation_status(integer)              FROM public, anon;

GRANT EXECUTE ON FUNCTION is_email_allowlisted()                      TO authenticated;
GRANT EXECUTE ON FUNCTION try_consume_full_cv_generation(integer)     TO authenticated;
GRANT EXECUTE ON FUNCTION refund_full_cv_generation()                 TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_generation_status(integer)           TO authenticated;

-- ============================================
-- Notes
-- ============================================
-- 1. The 2-generation cap is enforced server-side (server/index.js calls
--    try_consume_full_cv_generation before hitting Gemini) so it cannot be
--    bypassed from the browser.
-- 2. beta_allowlist has RLS on with no policies => unreadable by clients.
--    Manage it from the Supabase dashboard or the server (service_role).
-- 3. To raise/lower the cap later, change the p_limit argument passed by
--    the server — no migration needed.

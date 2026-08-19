-- ============================================================
-- Aikee AI — Beta Access Window + metering hardening
-- ============================================================
-- Run AFTER database/beta_launch.sql. Additive and idempotent; safe to
-- re-run. Touches no existing rows except to add one nullable column.
--
-- HOW TO RUN:
--   Supabase Dashboard -> SQL Editor -> paste this whole file -> Run.
--
-- WHAT THIS ADDS
--   1. A per-tester 24-hour access window that starts on their FIRST SIGN-IN,
--      not at a fixed global deadline. A tester who is busy on launch day still
--      gets their full 24 hours whenever they first show up.
--   2. get_beta_session() — one round-trip that starts the clock if needed and
--      reports allowlist + usage + window state. Used by BOTH the client (to
--      show the "beta has closed" page) and the server (to reject API calls).
--
-- WHAT THIS FIXES (important)
--   refund_full_cv_generation() was granted to `authenticated` and keyed purely
--   off auth.uid(). Any signed-in tester could open devtools and run
--       await supabase.rpc('refund_full_cv_generation')
--   to reset their own counter — making the 2-generation cap meaningless.
--
--   This migration REVOKES that grant. To keep working without it, the server
--   switches from "consume then refund on failure" to "check first, consume only
--   after a successful generation". Two problems disappear together: the bypass
--   above, and the case where a killed/timed-out function consumed a credit and
--   never got to refund it.
--
--   Trade-off, stated plainly: a tester firing N generations *concurrently* can
--   exceed the cap by up to N-1, because each request checks before any of them
--   increments. At a cap of 2 in a closed beta that is a far smaller problem than
--   a one-line devtools bypass. Closing it completely needs request-scoped
--   reservations (a `pending` row with an expiry), which is more machinery than a
--   24-hour beta warrants.
-- ============================================================

-- ============================================
-- 1. Access window column
-- ============================================
-- NULL means "this tester has not started yet". Set exactly once, on the first
-- sign-in (or the first API call, whichever happens first — see below).
ALTER TABLE usage
  ADD COLUMN IF NOT EXISTS access_started_at timestamp with time zone;

COMMENT ON COLUMN usage.access_started_at IS
  'When this tester first signed in. Their beta window runs 24h from here. NULL = not started.';

-- ============================================
-- 2. RPC: get_beta_session(p_limit, p_window_hours)
-- ============================================
-- Starts the tester's window on first call, then reports everything the client
-- and server need in ONE round-trip.
--
-- Deliberately mutating-but-idempotent: access_started_at is only ever written
-- when it is NULL, so calling this on every page load is safe and the clock can
-- never be restarted or extended by the client.
--
-- The clock is started here rather than purely client-side so a tester cannot
-- avoid starting it by blocking the request — the server calls this too, on
-- every paid endpoint, so the window begins at the earlier of the two.
--
-- Non-allowlisted callers do NOT get a clock started; they are on the waitlist,
-- and their 24 hours should begin when you actually approve them.
CREATE OR REPLACE FUNCTION get_beta_session(
  p_limit         integer DEFAULT 2,
  p_window_hours  integer DEFAULT 24
)
RETURNS TABLE (
  allowlisted        boolean,
  used               integer,
  cap                integer,
  remaining          integer,
  started_at         timestamp with time zone,
  expires_at         timestamp with time zone,
  window_expired     boolean,
  seconds_remaining  integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid        uuid := auth.uid();
  v_allowed    boolean;
  v_count      integer;
  v_started    timestamp with time zone;
  v_expires    timestamp with time zone;
  v_expired    boolean;
  v_secs       integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN QUERY SELECT false, 0, p_limit, 0, NULL::timestamptz, NULL::timestamptz, false, 0;
    RETURN;
  END IF;

  v_allowed := is_email_allowlisted();

  IF NOT v_allowed THEN
    -- Waitlisted: no clock, no window. The waitlist screen handles this.
    RETURN QUERY SELECT false, 0, p_limit, 0, NULL::timestamptz, NULL::timestamptz, false, 0;
    RETURN;
  END IF;

  -- Ensure a row exists, then start the clock if this is their first contact.
  INSERT INTO public.usage (user_id, access_started_at)
  VALUES (v_uid, now())
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.usage
  SET access_started_at = now(),
      updated_at        = now()
  WHERE user_id = v_uid
    AND access_started_at IS NULL;   -- write-once; never restarts or extends

  SELECT COALESCE(full_cv_count, 0), access_started_at
  INTO v_count, v_started
  FROM public.usage
  WHERE user_id = v_uid;

  v_count   := COALESCE(v_count, 0);
  v_expires := v_started + make_interval(hours => p_window_hours);
  v_expired := now() >= v_expires;
  v_secs    := GREATEST(0, FLOOR(EXTRACT(EPOCH FROM (v_expires - now())))::integer);

  RETURN QUERY SELECT
    true,
    v_count,
    p_limit,
    GREATEST(p_limit - v_count, 0),
    v_started,
    v_expires,
    v_expired,
    v_secs;
END;
$$;

-- ============================================
-- 3. RPC: record_full_cv_generation(p_limit)
-- ============================================
-- Consume ONE credit, called only AFTER a generation has actually succeeded.
-- Still atomic (row lock) and still enforces the cap, so it doubles as the
-- last line of defence if the pre-check was somehow skipped.
-- Also re-checks the access window, so a request that started before expiry
-- and finished after it cannot slip a credit through.
-- Returns (recorded, used, cap, reason).
--   reason ∈ 'ok' | 'not_authenticated' | 'not_allowlisted'
--            | 'window_closed' | 'limit_reached'
CREATE OR REPLACE FUNCTION record_full_cv_generation(
  p_limit        integer DEFAULT 2,
  p_window_hours integer DEFAULT 24
)
RETURNS TABLE (recorded boolean, used integer, cap integer, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid     uuid := auth.uid();
  v_count   integer;
  v_started timestamp with time zone;
BEGIN
  IF v_uid IS NULL THEN
    RETURN QUERY SELECT false, 0, p_limit, 'not_authenticated';
    RETURN;
  END IF;

  IF NOT is_email_allowlisted() THEN
    RETURN QUERY SELECT false, 0, p_limit, 'not_allowlisted';
    RETURN;
  END IF;

  INSERT INTO public.usage (user_id, access_started_at)
  VALUES (v_uid, now())
  ON CONFLICT (user_id) DO NOTHING;

  SELECT full_cv_count, access_started_at
  INTO v_count, v_started
  FROM public.usage
  WHERE user_id = v_uid
  FOR UPDATE;

  IF v_started IS NOT NULL
     AND now() >= v_started + make_interval(hours => p_window_hours) THEN
    RETURN QUERY SELECT false, v_count, p_limit, 'window_closed';
    RETURN;
  END IF;

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
-- 4. Close the refund bypass
-- ============================================
-- No longer used by the server (credits are consumed only after success), and
-- it must not remain callable from the browser.
REVOKE ALL ON FUNCTION refund_full_cv_generation() FROM public, anon, authenticated;

-- ============================================
-- 5. Grants — authenticated only, never anon
-- ============================================
REVOKE ALL ON FUNCTION get_beta_session(integer, integer)             FROM public, anon;
REVOKE ALL ON FUNCTION record_full_cv_generation(integer, integer)    FROM public, anon;

GRANT EXECUTE ON FUNCTION get_beta_session(integer, integer)          TO authenticated;
GRANT EXECUTE ON FUNCTION record_full_cv_generation(integer, integer) TO authenticated;

-- ============================================
-- Operating notes
-- ============================================
-- GIVE A TESTER A FRESH 24 HOURS (e.g. they never got to try it):
--   UPDATE usage SET access_started_at = NULL WHERE user_id =
--     (SELECT id FROM auth.users WHERE lower(email) = 'tester@example.com');
--   -- their clock restarts the next time they load the app
--
-- SEE WHERE EVERY TESTER STANDS:
--   SELECT u.email,
--          us.full_cv_count,
--          us.access_started_at,
--          us.access_started_at + interval '24 hours' AS expires_at,
--          now() >= us.access_started_at + interval '24 hours' AS expired
--   FROM usage us JOIN auth.users u ON u.id = us.user_id
--   ORDER BY us.access_started_at NULLS FIRST;
--
-- CHANGE THE WINDOW LENGTH: it is a function argument (p_window_hours), passed
-- by the server from BETA_WINDOW_HOURS — no migration needed.
--
-- RESET A TESTER'S GENERATIONS:
--   UPDATE usage SET full_cv_count = 0 WHERE user_id = '<uuid>';

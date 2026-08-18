-- ============================================================
-- Aikee AI — RLS / Security Verification  (task #6)
-- ============================================================
-- READ-ONLY. Safe to run anytime. Run in: Supabase Dashboard -> SQL Editor.
--
-- Purpose: prove that beta testers CANNOT read each other's data —
--   * usage          : a tester may read ONLY their own row
--   * beta_allowlist  : no tester can read the allowlist at all
--   * profiles        : a tester may read ONLY their own profile
-- and that the usage counter can't be tampered with from the browser.
--
-- HOW TO READ THE RESULTS: each SECTION below returns a table with a
-- `verdict` column. You want every verdict to say PASS. Sections A–E are
-- pure introspection and always safe. Section F is an OPTIONAL live
-- simulation you run separately.
-- ============================================================


-- ── A. Row-Level Security is ENABLED on every sensitive table ───────────────
-- Expect rls_enabled = true (PASS) for all three rows.
SELECT
  c.relname                        AS table_name,
  c.relrowsecurity                 AS rls_enabled,
  CASE WHEN c.relrowsecurity THEN 'PASS'
       ELSE 'FAIL — run: ALTER TABLE ' || c.relname || ' ENABLE ROW LEVEL SECURITY;'
  END                              AS verdict
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('usage', 'beta_allowlist', 'profiles')
ORDER BY c.relname;


-- ── B. beta_allowlist has NO policies (⇒ unreadable by any client) ──────────
-- RLS on + zero policies = every client SELECT returns 0 rows. Only the
-- SECURITY DEFINER RPCs and the service_role (server/dashboard) can read it.
SELECT
  CASE WHEN count(*) = 0
       THEN 'PASS — 0 policies; testers cannot read the allowlist'
       ELSE 'REVIEW — beta_allowlist unexpectedly has ' || count(*) || ' policy(ies)'
  END AS verdict
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'beta_allowlist';


-- ── C. usage exposes ONLY a self-scoped SELECT, and NO write policies ───────
-- Inspect the policies (expect exactly one: SELECT, qual = auth.uid() = user_id).
SELECT tablename, policyname, cmd, roles::text AS roles, qual AS using_expr
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'usage'
ORDER BY cmd, policyname;

-- Verdicts for the usage table:
SELECT
  CASE WHEN count(*) FILTER (WHERE cmd = 'SELECT') >= 1
       THEN 'PASS — a SELECT policy exists' ELSE 'FAIL — no SELECT policy' END
    AS has_select_policy,
  CASE WHEN count(*) FILTER (WHERE cmd <> 'SELECT') = 0
       THEN 'PASS — no INSERT/UPDATE/DELETE policy (counter is tamper-proof from the browser)'
       ELSE 'FAIL — usage exposes a client write policy' END
    AS no_write_policies,
  CASE WHEN bool_and(qual ILIKE '%auth.uid()%user_id%' OR qual ILIKE '%user_id%auth.uid()%')
            FILTER (WHERE cmd = 'SELECT')
       THEN 'PASS — SELECT is scoped to the caller''s own row'
       ELSE 'REVIEW — confirm the SELECT policy is scoped to auth.uid() = user_id' END
    AS select_is_self_scoped
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'usage';


-- ── D. profiles is self-scoped too (each tester sees only their own) ────────
SELECT tablename, policyname, cmd, roles::text AS roles, qual AS using_expr
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY cmd, policyname;


-- ── E. The gating RPCs are SECURITY DEFINER, search_path-pinned, and
--        executable ONLY by authenticated (never anon / public) ─────────────
SELECT
  p.proname                                             AS function_name,
  p.prosecdef                                           AS security_definer,
  p.proconfig                                           AS settings,
  CASE WHEN p.prosecdef
        AND EXISTS (SELECT 1 FROM unnest(coalesce(p.proconfig, '{}')) s
                    WHERE s ILIKE 'search_path=%')
       THEN 'PASS'
       ELSE 'REVIEW — expected SECURITY DEFINER + pinned search_path' END AS verdict
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('is_email_allowlisted',
                    'try_consume_full_cv_generation',
                    'refund_full_cv_generation',
                    'get_my_generation_status')
ORDER BY p.proname;

-- Who can EXECUTE the RPCs? Expect ONLY grantee = 'authenticated'.
-- Any row with grantee 'anon' or 'PUBLIC' is a FAIL.
SELECT
  routine_name,
  grantee,
  privilege_type,
  CASE WHEN grantee = 'authenticated' THEN 'PASS'
       ELSE 'FAIL — revoke EXECUTE from ' || grantee END AS verdict
FROM information_schema.role_routine_grants
WHERE routine_schema = 'public'
  AND routine_name IN ('is_email_allowlisted',
                       'try_consume_full_cv_generation',
                       'refund_full_cv_generation',
                       'get_my_generation_status')
  AND grantee IN ('anon', 'authenticated', 'PUBLIC')
ORDER BY routine_name, grantee;


-- ============================================================
-- F. OPTIONAL — live cross-tester isolation simulation
-- ============================================================
-- The SQL editor runs as a superuser, which BYPASSES RLS — so a plain
-- `SELECT * FROM usage` here would (misleadingly) show every row. To actually
-- exercise RLS we drop to the `authenticated` role and forge a JWT `sub` claim,
-- exactly as the API does. Run this whole DO block on its own.
--
-- FIRST, get two real user ids to test with:
--     SELECT id, email FROM auth.users ORDER BY created_at LIMIT 5;
-- then paste one id into :tester_a below.

DO $$
DECLARE
  tester_a uuid := '00000000-0000-0000-0000-000000000000';  -- <-- REPLACE with a real auth.users.id
  visible  integer;
  total    integer;
BEGIN
  IF tester_a = '00000000-0000-0000-0000-000000000000' THEN
    RAISE NOTICE 'SKIPPED: edit the DO block and set tester_a to a real auth.users.id first.';
    RETURN;
  END IF;

  SELECT count(*) INTO total FROM public.usage;   -- as superuser: sees everything

  -- Become an authenticated user with tester_a's identity.
  PERFORM set_config('request.jwt.claim.sub', tester_a::text, true);
  PERFORM set_config('request.jwt.claims',
                     json_build_object('sub', tester_a::text, 'role', 'authenticated')::text,
                     true);
  SET LOCAL ROLE authenticated;

  SELECT count(*) INTO visible FROM public.usage;  -- as tester_a: RLS applies

  RESET ROLE;

  RAISE NOTICE 'Total usage rows in table (superuser view): %', total;
  RAISE NOTICE 'Rows visible to tester_a via RLS: %', visible;
  IF visible <= 1 THEN
    RAISE NOTICE 'PASS: tester_a sees at most their own row (%), not all % rows.', visible, total;
  ELSE
    RAISE NOTICE 'FAIL: tester_a can see % rows — RLS is not isolating usage.', visible;
  END IF;
END $$;

// ============================================================================
// Auth / beta-gating helpers (tasks #2, #4, #6)
// ============================================================================
// Verifies the caller's Supabase session, checks the beta allowlist, and meters
// full-CV generations. Every paid endpoint runs authorize() before doing work.

import { createClient } from "@supabase/supabase-js";
import { sendJson } from "./http.js";
import {
  REQUIRE_AUTH,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  FULL_CV_LIMIT,
  BETA_WINDOW_HOURS,
} from "./config.js";

// One shared client is enough to VERIFY tokens (getUser needs no user context).
// Memoised per process; on Vercel a cold start simply rebuilds it, which is
// cheap and carries no state worth preserving (persistSession is off).
let _authClient = null;
const getAuthClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!_authClient) {
    _authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _authClient;
};

const getBearerToken = (req) => {
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
};

// Client-facing messages, keyed by error code. The codes are the contract with
// src/services/apiClient.js (ApiError.code) — keep them stable.
export const AUTH_MESSAGES = {
  auth_not_configured: "Sign-in isn't configured on the server yet.",
  missing_token: "Please sign in to continue.",
  invalid_token: "Your session has expired — please sign in again.",
  not_allowlisted:
    "This account isn't on the Aikee AI beta list yet. Join the waitlist and we'll be in touch.",
  allowlist_check_failed: "Couldn't verify your beta access — please try again.",
  usage_check_failed: "Couldn't check your generation limit — please try again.",
  limit_reached:
    "You've used all your beta CV generations. Thanks for helping us test Aikee AI!",
  beta_window_closed:
    "Your beta testing window has closed. Thanks for helping us test Aikee AI!",
};

// Verifies the Supabase JWT, then in ONE RPC establishes: allowlist membership,
// the 24-hour access window (starting it if this is the tester's first contact),
// and their remaining generation allowance.
//
// That single call replaces the old separate is_email_allowlisted() round-trip,
// so a metered request costs the same three Supabase calls it always did —
// getUser, this, and record-on-success.
//
// Returns { ok, status, error, user, userClient, session, bypassed }.
export const authorize = async (req, { requireAllowlist = true } = {}) => {
  if (!REQUIRE_AUTH) {
    return { ok: true, user: null, userClient: null, session: null, bypassed: true };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, status: 503, error: "auth_not_configured" };
  }

  const token = getBearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "missing_token" };
  }

  const { data, error } = await getAuthClient().auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: "invalid_token" };
  }

  // Per-request client bound to the user's token so RPCs run with the correct
  // auth.uid() under RLS / SECURITY DEFINER. (The memoised anon client above
  // cannot be reused here — the beta RPCs are granted to `authenticated` only.)
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (!requireAllowlist) {
    return { ok: true, user: data.user, userClient, session: null };
  }

  const session = await getBetaSession(userClient);
  if (!session) {
    return { ok: false, status: 500, error: "allowlist_check_failed" };
  }
  if (!session.allowlisted) {
    return { ok: false, status: 403, error: "not_allowlisted", user: data.user };
  }
  // Calling this here (not only from the client) is what stops a tester from
  // dodging the clock: the window starts at the earlier of first sign-in or
  // first API call, and expiry is enforced regardless of the UI.
  if (session.window_expired) {
    return { ok: false, status: 403, error: "beta_window_closed", user: data.user };
  }

  return { ok: true, user: data.user, userClient, session };
};

export const sendAuthError = (res, auth) =>
  sendJson(res, auth.status, {
    error: auth.error,
    message: AUTH_MESSAGES[auth.error] || "Request not allowed.",
  });

// Starts (if needed) and reads the tester's beta session. Returns null on error.
const getBetaSession = async (userClient) => {
  const { data, error } = await userClient.rpc("get_beta_session", {
    p_limit: FULL_CV_LIMIT,
    p_window_hours: BETA_WINDOW_HOURS,
  });
  if (error) {
    console.error("[auth] get_beta_session failed:", error.message);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row || null;
};

// Records ONE consumed full-CV generation. Called only AFTER Gemini has actually
// returned a result — see database/beta_window.sql for why this replaced the old
// consume-then-refund flow (the refund RPC was callable from the browser, which
// made the cap bypassable, and a killed function could orphan a credit).
// Still atomic and still cap-enforcing, so it doubles as a backstop.
export const recordFullCv = async (userClient) => {
  const { data, error } = await userClient.rpc("record_full_cv_generation", {
    p_limit: FULL_CV_LIMIT,
    p_window_hours: BETA_WINDOW_HOURS,
  });
  if (error) {
    // The generation already succeeded and has been sent, so this is logged
    // rather than surfaced: the tester got their CV, we just failed to count it.
    console.error("[usage] record failed:", error.message);
    return null;
  }
  return Array.isArray(data) ? data[0] : data;
};

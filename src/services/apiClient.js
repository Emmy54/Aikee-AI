// ============================================================================
// Shared API client for the Aikee AI backend (server/index.js)
// ============================================================================
// Every AI call goes through our own Node server, never straight to Google /
// Groq / Stability from the browser. That means:
//   * No provider API keys are ever shipped in the client bundle.
//   * The server can verify the caller's Supabase session, check the beta
//     allowlist, and meter full-CV generations (tasks #2/#4/#6).
//
// This module centralises two things so no individual service has to repeat
// them: (1) attaching the current Supabase access token as a Bearer header,
// and (2) turning the server's typed error responses (401/403/429) into an
// ApiError the UI can branch on.

import { supabase } from "../../lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Error thrown for any non-2xx response. `code` mirrors the server's `error`
// field (e.g. "limit_reached", "not_allowlisted", "invalid_token") so callers
// can react without string-matching the message.
export class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.message || payload?.error || `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = payload?.error || null;
    this.used = payload?.used;
    this.cap = payload?.cap;
  }

  get isAuthError() {
    return this.status === 401 || this.code === "invalid_token" || this.code === "missing_token";
  }

  get isNotAllowlisted() {
    return this.status === 403 && this.code === "not_allowlisted";
  }

  get isLimitReached() {
    return this.status === 429 || this.code === "limit_reached";
  }
}

// Refresh a token that is about to expire rather than sending it and losing the
// round trip. Supabase access tokens live ~1 hour, and a tester who leaves the
// tab open (very likely during a 24-hour beta window) would otherwise hit
// "your session has expired" mid-generation.
const EXPIRY_MARGIN_MS = 60_000;

// Reads the current session token WITHOUT calling supabase.auth.getUser().
// getSession() reads the locally-cached session, so it's cheap and — crucially —
// safe to call from user-triggered flows. (Never call it from inside
// onAuthStateChange; that deadlocks the GoTrue lock. These service functions
// run on button clicks / effects, not in the auth callback — which is also why
// refreshSession() below is safe here.)
const getAccessToken = async ({ forceRefresh = false } = {}) => {
  try {
    if (forceRefresh) {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn("[apiClient] Token refresh failed:", error.message);
        return null;
      }
      return data?.session?.access_token || null;
    }

    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (!session) return null;

    const expiresInMs = session.expires_at
      ? session.expires_at * 1000 - Date.now()
      : Infinity;
    if (expiresInMs < EXPIRY_MARGIN_MS) {
      const { data: refreshed, error } = await supabase.auth.refreshSession();
      if (!error && refreshed?.session?.access_token) {
        return refreshed.session.access_token;
      }
    }

    return session.access_token || null;
  } catch (err) {
    console.warn("[apiClient] Could not read session token:", err?.message || err);
    return null;
  }
};

// POST JSON to an /api route with the Supabase Bearer token attached.
// Returns the parsed JSON body on success; throws ApiError on any non-2xx.
export const authedPostJson = async (path, body) => {
  const send = async (token) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body ?? {}),
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  };

  let { response, data } = await send(await getAccessToken());

  // Retry once with a force-refreshed token. Safe to retry: the server verifies
  // auth BEFORE doing any provider work or consuming a generation credit, so a
  // 401 guarantees nothing happened — no double generation, no double charge.
  if (response.status === 401) {
    const refreshed = await getAccessToken({ forceRefresh: true });
    if (refreshed) {
      ({ response, data } = await send(refreshed));
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }
  return data;
};

// GET an /api route (status endpoints — unauthenticated, no cost). Never throws;
// returns null on failure so status checks degrade gracefully.
export const getJson = async (path) => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { method: "GET" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

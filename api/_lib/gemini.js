// ============================================================================
// Gemini: full-CV + per-section generation, and a status probe
// ============================================================================

import { sendJson, readBody, isRateLimitError, reqId } from "./http.js";
import {
  authorize,
  sendAuthError,
  recordFullCv,
  AUTH_MESSAGES,
} from "./auth.js";
import {
  GEMINI_API_KEY,
  GEMINI_API_KEY_FALLBACK,
  GEMINI_MODEL_PRIMARY,
  GEMINI_MODEL_FALLBACK,
  FULL_CV_LIMIT,
} from "./config.js";

const buildGeminiUrl = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

export const handleGeminiGenerateContent = async (req, res) => {
  if (!GEMINI_API_KEY && !GEMINI_API_KEY_FALLBACK) {
    return sendJson(res, 400, {
      error: "provider_not_configured",
      message: "AI writing isn't configured on the server yet.",
    });
  }

  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const contents =
    body.contents || (body.prompt ? [{ parts: [{ text: body.prompt }] }] : null);

  if (!contents) {
    return sendJson(res, 400, {
      error: "bad_request",
      message: "Missing contents or prompt.",
    });
  }

  // Only the full-CV generation counts against the beta cap. The cheaper
  // per-section helpers (skills/summary/experience) share this endpoint but are
  // NOT tagged, so they pass through without consuming a credit.
  const metered = body.meter === "full_cv" && !auth.bypassed;

  // Pre-check using the allowance authorize() already fetched — no extra
  // round-trip. The credit is consumed only after a successful generation
  // (see database/beta_window.sql), so nothing needs refunding on failure.
  if (metered) {
    const remaining = auth.session?.remaining ?? 0;
    if (remaining <= 0) {
      return sendJson(res, 429, {
        error: "limit_reached",
        message: AUTH_MESSAGES.limit_reached,
        used: auth.session?.used ?? FULL_CV_LIMIT,
        cap: auth.session?.cap ?? FULL_CV_LIMIT,
      });
    }
  }

  const primaryKey = GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK;
  const fallbackKey =
    GEMINI_API_KEY && GEMINI_API_KEY_FALLBACK ? GEMINI_API_KEY_FALLBACK : null;

  // Timing is logged with explicit deltas rather than console.time: those labels
  // live in a process-global map, so two concurrent generations would collide on
  // the same label and report garbage. The rid tag keeps interleaved lines
  // attributable to a single request.
  const rid = reqId(req);
  const makeRequest = async (model, key) => {
    const startedAt = Date.now();
    try {
      const response = await fetch(buildGeminiUrl(model, key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });
      const data = await response.json().catch(() => ({}));
      return { response, data };
    } finally {
      console.log(
        `[gemini ${rid}] ${model} generateContent ${Date.now() - startedAt}ms`
      );
    }
  };

  // Success path: count the generation BEFORE responding, so the credit is only
  // ever spent on a CV the tester actually received. record_full_cv_generation
  // re-checks the cap and the access window atomically, so it is also the
  // backstop if the pre-check above was somehow bypassed.
  const succeed = async (data, fallbackUsed) => {
    if (metered) {
      const recorded = await recordFullCv(auth.userClient);
      // The generation is already paid for upstream; if the DB says the tester
      // is now over cap or out of time, honour that rather than hand it over.
      if (recorded && recorded.recorded === false) {
        const status = recorded.reason === "limit_reached" ? 429 : 403;
        return sendJson(res, status, {
          error: recorded.reason,
          message: AUTH_MESSAGES[recorded.reason] || "Generation not allowed.",
          used: recorded.used,
          cap: recorded.cap,
        });
      }
    }
    return sendJson(res, 200, { ...data, fallbackUsed });
  };

  // Upstream failures are ALWAYS reported as 502 — never with the provider's own
  // status. Passing Gemini's 429 straight through would trip ApiError.isLimitReached
  // in src/services/apiClient.js, so a transient Google rate-limit would tell the
  // tester "you've used all your beta CV generations". Nothing needs refunding
  // here: the credit is only consumed on success.
  const failUpstream = (payload) => sendJson(res, 502, payload);

  const totalStartedAt = Date.now();
  try {
    const primaryResult = await makeRequest(GEMINI_MODEL_PRIMARY, primaryKey);
    if (primaryResult.response.ok) {
      return await succeed(primaryResult.data, false);
    }

    const shouldFallback =
      fallbackKey &&
      isRateLimitError(primaryResult.response.status, primaryResult.data);

    if (shouldFallback) {
      console.warn("Gemini fallback triggered due to rate-limit/quota error.");
      const fallbackResult = await makeRequest(GEMINI_MODEL_FALLBACK, fallbackKey);
      if (fallbackResult.response.ok) {
        return await succeed(fallbackResult.data, true);
      }
      return failUpstream({
        error: "provider_error",
        message: "The AI service is busy right now. Please try again in a moment.",
        providerStatus: fallbackResult.response.status,
        details: fallbackResult.data,
        fallbackAttempted: true,
      });
    }

    return failUpstream({
      error: "provider_error",
      message: "The AI service is busy right now. Please try again in a moment.",
      providerStatus: primaryResult.response.status,
      details: primaryResult.data,
      fallbackAttempted: false,
    });
  } catch (err) {
    // Network/DNS/abort — refund before surfacing, same as any other failure.
    return failUpstream({
      error: "provider_unreachable",
      message: "Couldn't reach the AI service. Please try again.",
      details: err?.message,
    });
  } finally {
    console.log(`[gemini ${rid}] total generation ${Date.now() - totalStartedAt}ms`);
  }
};

// Status probe. Reports key PRESENCE only — it deliberately does not call Gemini.
//
// This route is unauthenticated (the client's getJson sends no token), and the
// previous version made a real billable generateContent call on every hit, so
// anyone who found the public URL could loop it and burn the Gemini quota. It
// now behaves like the Groq and Stability status routes. The trade-off: a key
// that is present but invalid reports valid:true here, and only reveals itself
// on the first real generation — which surfaces a clear error anyway.
export const handleGeminiStatus = async (_req, res) => {
  const configured = Boolean(GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK);
  return sendJson(res, 200, {
    configured,
    valid: configured,
    message: configured
      ? "API key present"
      : "API key not found in environment",
  });
};

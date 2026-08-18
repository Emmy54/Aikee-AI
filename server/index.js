import http from "http";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");

const loadEnvFile = (filePath) => {
  if (!existsSync(filePath)) return;
  const raw = readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
};

loadEnvFile(join(ROOT_DIR, ".env.local"));
loadEnvFile(join(ROOT_DIR, ".env"));

const PORT = Number(process.env.PORT || 8787);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const GEMINI_API_KEY_FALLBACK = process.env.GEMINI_API_KEY_FALLBACK;
const GEMINI_MODEL_PRIMARY =
  process.env.GEMINI_MODEL_PRIMARY ||
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash-lite";
const GEMINI_MODEL_FALLBACK =
  process.env.GEMINI_MODEL_FALLBACK ||
  (GEMINI_MODEL_PRIMARY.includes("flash-lite")
    ? "gemini-2.5-flash"
    : "gemini-2.5-flash-lite");
const GROQ_API_KEY =
  process.env.GROQ_QUESTIONS_API_KEY ||
  process.env.VITE_GROQ_QUESTIONS_API_KEY ||
  process.env.GROQ_QUESTIONS_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || process.env.VITE_STABILITY_API_KEY;

// --- Supabase auth / beta-gating config (tasks #2, #4, #6) ---
const SUPABASE_URL =
  process.env.VITE_SUPABASE_PUBLIC_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLIC_ANON_KEY || process.env.SUPABASE_ANON_KEY;
// Full-CV generations allowed per beta tester (raise/lower without a migration).
const FULL_CV_LIMIT = Number(process.env.BETA_FULL_CV_LIMIT || 2);
// Fail-closed by default: every paid endpoint requires a valid Supabase session
// whose email is on the beta allowlist. Set BETA_REQUIRE_AUTH=false ONLY for
// local development without Supabase configured — never in production.
const REQUIRE_AUTH = String(process.env.BETA_REQUIRE_AUTH ?? "true") !== "false";

if (REQUIRE_AUTH && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    "[auth] BETA_REQUIRE_AUTH is on but SUPABASE_URL / ANON_KEY are missing — " +
      "paid endpoints will reject every request until these are set."
  );
}

// HTTPS enforcement (task #6). The TLS-terminating reverse proxy in front of
// this server is the PRIMARY control (see docs/BETA_LAUNCH_CHECKLIST.md); this
// flag adds a belt-and-braces redirect + HSTS at the app layer. Leave OFF for
// local HTTP dev (turning HSTS on over localhost would pin HTTPS and break it).
const ENFORCE_HTTPS = String(process.env.ENFORCE_HTTPS || "false") === "true";

const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const buildGeminiUrl = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

const isRateLimitError = (status, data) => {
  if (status === 429 || status === 503) return true;
  const errStatus = data?.error?.status || "";
  const message = (data?.error?.message || "").toLowerCase();
  if (errStatus === "RESOURCE_EXHAUSTED") return true;
  if (message.includes("rate") || message.includes("quota") || message.includes("limit")) {
    return true;
  }
  return false;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Parse a Retry-After header (Groq sends it in seconds, sometimes fractional).
// Returns milliseconds, or null if absent/unparseable.
const parseRetryAfterMs = (headerValue) => {
  if (!headerValue) return null;
  const seconds = Number(headerValue);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);
  return null;
};

// ============================================================================
// Auth / beta-gating helpers (tasks #2, #4, #6)
// ============================================================================

// One shared client is enough to VERIFY tokens (getUser needs no user context).
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

// Client-facing messages, keyed by error code.
const AUTH_MESSAGES = {
  auth_not_configured: "Sign-in isn't configured on the server yet.",
  missing_token: "Please sign in to continue.",
  invalid_token: "Your session has expired — please sign in again.",
  not_allowlisted:
    "This account isn't on the Aikee AI beta list yet. Join the waitlist and we'll be in touch.",
  allowlist_check_failed: "Couldn't verify your beta access — please try again.",
  usage_check_failed: "Couldn't check your generation limit — please try again.",
  limit_reached:
    "You've used all your beta CV generations. Thanks for helping us test Aikee AI!",
};

// Verifies the Supabase JWT and (optionally) that the caller's email is on the
// beta allowlist. Returns { ok, status, error, user, userClient, bypassed }.
const authorize = async (req, { requireAllowlist = true } = {}) => {
  if (!REQUIRE_AUTH) {
    return { ok: true, user: null, userClient: null, bypassed: true };
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
  // auth.uid() under RLS / SECURITY DEFINER.
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (requireAllowlist) {
    const { data: allowed, error: allowErr } = await userClient.rpc(
      "is_email_allowlisted"
    );
    if (allowErr) {
      console.error("[auth] allowlist check failed:", allowErr.message);
      return { ok: false, status: 500, error: "allowlist_check_failed" };
    }
    if (!allowed) {
      return { ok: false, status: 403, error: "not_allowlisted", user: data.user };
    }
  }

  return { ok: true, user: data.user, userClient };
};

const sendAuthError = (res, auth) =>
  sendJson(res, auth.status, {
    error: auth.error,
    message: AUTH_MESSAGES[auth.error] || "Request not allowed.",
  });

// Atomically consume one full-CV credit. Returns { allowed, used, cap, reason }.
const consumeFullCv = async (userClient, limit) => {
  const { data, error } = await userClient.rpc("try_consume_full_cv_generation", {
    p_limit: limit,
  });
  if (error) {
    console.error("[usage] consume failed:", error.message);
    return { allowed: false, reason: "usage_check_failed", used: 0, cap: limit };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return row || { allowed: false, reason: "usage_check_failed", used: 0, cap: limit };
};

// Give a credit back (best-effort) when a metered generation ultimately fails.
const refundFullCv = async (userClient) => {
  try {
    await userClient.rpc("refund_full_cv_generation");
  } catch (err) {
    console.error("[usage] refund failed:", err?.message || err);
  }
};

const handleGeminiGenerateContent = async (req, res) => {
  if (!GEMINI_API_KEY && !GEMINI_API_KEY_FALLBACK) {
    return sendJson(res, 400, { error: "GEMINI_API_KEY not configured" });
  }

  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const contents =
    body.contents ||
    (body.prompt
      ? [
          {
            parts: [{ text: body.prompt }],
          },
        ]
      : null);

  if (!contents) {
    return sendJson(res, 400, { error: "Missing contents or prompt" });
  }

  // Only the full-CV generation counts against the beta cap. The cheaper
  // per-section helpers (skills/summary/experience) share this endpoint but are
  // NOT tagged, so they pass through without consuming a credit.
  const metered = body.meter === "full_cv" && !auth.bypassed;
  if (metered) {
    const gate = await consumeFullCv(auth.userClient, FULL_CV_LIMIT);
    if (!gate.allowed) {
      const status = gate.reason === "limit_reached" ? 429 : 403;
      return sendJson(res, status, {
        error: gate.reason,
        message: AUTH_MESSAGES[gate.reason] || "Generation not allowed.",
        used: gate.used,
        cap: gate.cap,
      });
    }
  }

  const primaryKey = GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK;
  const fallbackKey = GEMINI_API_KEY && GEMINI_API_KEY_FALLBACK ? GEMINI_API_KEY_FALLBACK : null;
  const primaryModel = GEMINI_MODEL_PRIMARY;
  const fallbackModel = GEMINI_MODEL_FALLBACK;

  const makeRequest = async (model, key) => {
    const response = await fetch(buildGeminiUrl(model, key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  };

  // If a credit was consumed but the generation ultimately fails, refund it so
  // a transient upstream error never costs a tester one of their generations.
  const fail = async (status, payload) => {
    if (metered) await refundFullCv(auth.userClient);
    return sendJson(res, status, payload);
  };

  try {
    const primaryResult = await makeRequest(primaryModel, primaryKey);
    if (primaryResult.response.ok) {
      return sendJson(res, 200, { ...primaryResult.data, fallbackUsed: false });
    }

    const shouldFallback =
      fallbackKey &&
      isRateLimitError(primaryResult.response.status, primaryResult.data);

    if (shouldFallback) {
      console.warn("Gemini fallback triggered due to rate-limit/quota error.");
      const fallbackResult = await makeRequest(fallbackModel, fallbackKey);
      if (fallbackResult.response.ok) {
        return sendJson(res, 200, { ...fallbackResult.data, fallbackUsed: true });
      }
      return fail(fallbackResult.response.status, {
        error: "Gemini API error",
        details: fallbackResult.data,
        fallbackAttempted: true,
      });
    }

    return fail(primaryResult.response.status, {
      error: "Gemini API error",
      details: primaryResult.data,
      fallbackAttempted: false,
    });
  } catch (err) {
    return fail(502, { error: "Gemini request failed", details: err?.message });
  }
};

const handleGeminiStatus = async (_req, res) => {
  if (!GEMINI_API_KEY) {
    return sendJson(res, 200, {
      configured: false,
      valid: false,
      message: "API key not found in environment",
    });
  }

  try {
    const response = await fetch(
      buildGeminiUrl(GEMINI_MODEL_PRIMARY, GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "test" }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return sendJson(res, 200, {
        configured: true,
        valid: false,
        message: "API key validation failed",
        status: response.status,
        details: errorText,
      });
    }

    return sendJson(res, 200, {
      configured: true,
      valid: true,
      message: "API key is valid",
    });
  } catch (error) {
    return sendJson(res, 200, {
      configured: true,
      valid: false,
      message: `Connection error: ${error.message}`,
    });
  }
};

const handleStabilityHeadshot = async (req, res) => {
  if (!STABILITY_API_KEY) {
    return sendJson(res, 400, { error: "STABILITY_API_KEY not configured" });
  }

  // Paid endpoint: valid session + allowlisted email required (not metered —
  // only full-CV generations count against the beta cap).
  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const { base64ImageData, prompt, mimeType } = body || {};

  if (!base64ImageData || !prompt) {
    return sendJson(res, 400, { error: "Missing base64ImageData or prompt" });
  }

  const imageBuffer = Buffer.from(base64ImageData, "base64");
  const imageBlob = new Blob([imageBuffer], { type: mimeType || "image/jpeg" });

  const formData = new FormData();
  formData.append("image", imageBlob);
  formData.append("prompt", prompt);
  formData.append("output_format", "jpeg");

  const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STABILITY_API_KEY}`,
      Accept: "image/*",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return sendJson(res, response.status, {
      error: "Stability API error",
      details: errorText,
    });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (contentType.startsWith("image/")) {
    const arrayBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    return sendJson(res, 200, { image: imageBase64, mimeType: contentType });
  }

  const data = await response.json().catch(() => ({}));
  if (data?.image) {
    return sendJson(res, 200, { image: data.image, mimeType: "image/jpeg" });
  }

  return sendJson(res, 200, { image: null });
};

const handleStabilityStatus = async (_req, res) => {
  if (!STABILITY_API_KEY) {
    return sendJson(res, 200, {
      configured: false,
      valid: false,
      message: "API key not found in environment",
    });
  }

  return sendJson(res, 200, {
    configured: true,
    valid: true,
    message: "API key present",
  });
};

const handleGroqGenerateContent = async (req, res) => {
  if (!GROQ_API_KEY) {
    return sendJson(res, 400, { error: "GROQ_API_KEY not configured" });
  }

  // Paid endpoint: valid session + allowlisted email required (not metered —
  // interview questions stay free per the beta plan).
  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) {
    return sendJson(res, 400, { error: "Missing messages" });
  }

  const model = body.model || GROQ_MODEL;
  const temperature = typeof body.temperature === "number" ? body.temperature : 0.3;
  const maxTokens = Number.isFinite(body.max_tokens) ? body.max_tokens : 512;

  // Reasoning models (e.g. openai/gpt-oss-*) spend hidden chain-of-thought
  // tokens BEFORE the answer, and those count against max_tokens — which can
  // truncate the actual output mid-JSON and break parsing. Cap the reasoning to
  // "low" for these models so the budget goes to the answer. Client may override.
  const isReasoningModel = /gpt-oss|reasoning|o1|deepseek-r/i.test(model);
  const reasoningEffort =
    body.reasoning_effort || (isReasoningModel ? "low" : undefined);

  const groqPayload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };
  if (reasoningEffort) {
    groqPayload.reasoning_effort = reasoningEffort;
  }

  // Groq's free tier enforces tight per-minute limits, so a transient 429 is
  // common and usually clears within a second or two. Retry with backoff that
  // honors the Retry-After header, capped so a long daily-quota cooldown can't
  // hang the request — in that case we surface the 429 to the client.
  const MAX_RETRIES = 3;
  const MAX_RETRY_WAIT_MS = 8000;

  try {
    let response;
    let data;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(groqPayload),
      });

      data = await response.json().catch(() => ({}));
      if (response.ok) {
        return sendJson(res, 200, data);
      }

      // Only retry rate-limit/transient errors, and only if attempts remain.
      if (!isRateLimitError(response.status, data) || attempt === MAX_RETRIES) {
        break;
      }

      const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
      // Exponential backoff (0.5s, 1s, 2s…) when the header is absent.
      const backoffMs = retryAfterMs ?? 500 * 2 ** attempt;
      const waitMs = Math.min(backoffMs, MAX_RETRY_WAIT_MS);

      // If the server tells us to wait longer than we're willing to, give up now.
      if (retryAfterMs !== null && retryAfterMs > MAX_RETRY_WAIT_MS) {
        break;
      }

      console.warn(
        `Groq 429/transient (status ${response.status}), retry ${attempt + 1}/${MAX_RETRIES} in ${waitMs}ms`
      );
      await sleep(waitMs);
    }

    return sendJson(res, response.status, {
      error: "Groq API error",
      details: data,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Groq API request failed",
      details: error.message,
    });
  }
};

const handleGroqStatus = async (_req, res) => {
  if (!GROQ_API_KEY) {
    return sendJson(res, 200, {
      configured: false,
      valid: false,
      message: "API key not found in environment",
    });
  }

  return sendJson(res, 200, {
    configured: true,
    valid: true,
    message: "API key present",
  });
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // --- HTTPS enforcement + security headers (task #6) ---
  // Behind a proxy, the original scheme arrives in X-Forwarded-Proto. When
  // ENFORCE_HTTPS is on we 301 any plaintext request to https and advertise
  // HSTS so browsers refuse to downgrade on subsequent visits.
  if (ENFORCE_HTTPS) {
    const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
      .split(",")[0]
      .trim()
      .toLowerCase();
    const isHttps = forwardedProto === "https" || Boolean(req.socket?.encrypted);
    if (!isHttps) {
      const host = req.headers.host || "";
      res.writeHead(301, { Location: `https://${host}${req.url}` });
      return res.end();
    }
    // 2 years, include subdomains, and eligible for browser preload lists.
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  // Cheap, always-on hardening for an API that only ever returns JSON.
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method === "POST" && url.pathname === "/api/gemini/generate-content") {
    return handleGeminiGenerateContent(req, res);
  }

  if (req.method === "GET" && url.pathname === "/api/gemini/status") {
    return handleGeminiStatus(req, res);
  }

  if (req.method === "POST" && url.pathname === "/api/stability/headshot") {
    return handleStabilityHeadshot(req, res);
  }

  if (req.method === "GET" && url.pathname === "/api/stability/status") {
    return handleStabilityStatus(req, res);
  }

  if (req.method === "POST" && url.pathname === "/api/groq/generate-content") {
    return handleGroqGenerateContent(req, res);
  }

  if (req.method === "GET" && url.pathname === "/api/groq/status") {
    return handleGroqStatus(req, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

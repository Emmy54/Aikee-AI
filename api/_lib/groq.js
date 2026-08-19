// ============================================================================
// Groq: interview-question generation (not metered — free per the beta plan)
// ============================================================================

import {
  sendJson,
  readBody,
  isRateLimitError,
  parseRetryAfterMs,
  sleep,
} from "./http.js";
import { authorize, sendAuthError } from "./auth.js";
import { GROQ_API_KEY, GROQ_MODEL } from "./config.js";

export const handleGroqGenerateContent = async (req, res) => {
  if (!GROQ_API_KEY) {
    return sendJson(res, 400, {
      error: "provider_not_configured",
      message: "Question generation isn't configured on the server yet.",
    });
  }

  // Paid endpoint: valid session + allowlisted email required.
  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) {
    return sendJson(res, 400, {
      error: "bad_request",
      message: "Missing messages.",
    });
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

  const groqPayload = { model, messages, temperature, max_tokens: maxTokens };
  if (reasoningEffort) {
    groqPayload.reasoning_effort = reasoningEffort;
  }

  // Groq's free tier enforces tight per-minute limits, so a transient 429 is
  // common and usually clears within a second or two. Retry with backoff that
  // honors the Retry-After header, capped so a long daily-quota cooldown can't
  // hang the request — in that case we surface the 429 to the client.
  const MAX_RETRIES = 3;
  const MAX_RETRY_WAIT_MS = 8000;

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

  // Reported as 502, never with Groq's own status. A pass-through 429 would trip
  // ApiError.isLimitReached in src/services/apiClient.js and tell the tester they
  // had used up their CV generations — on an endpoint that isn't even metered.
  return sendJson(res, 502, {
    error: "provider_error",
    message: "The question service is busy right now. Please try again.",
    providerStatus: response.status,
    details: data,
  });
};

export const handleGroqStatus = async (_req, res) => {
  const configured = Boolean(GROQ_API_KEY);
  return sendJson(res, 200, {
    configured,
    valid: configured,
    message: configured ? "API key present" : "API key not found in environment",
  });
};

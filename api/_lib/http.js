// ============================================================================
// Transport helpers shared by the Vercel functions and the local dev server
// ============================================================================
// Everything here is written against the raw Node http API (IncomingMessage /
// ServerResponse). Vercel's Node runtime passes those same objects and only
// *adds* helpers (res.status/res.json, req.body) on top, so this code is
// portable between the two adapters without branching.

export const sendJson = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const safeParse = (raw) => {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    // Malformed JSON is treated as an empty body (handlers then fail their own
    // required-field checks with a clear 400 rather than a parser stack trace).
    return {};
  }
};

// Reads and JSON-parses the request body in either environment.
//
// On Vercel, the runtime has already parsed the body into `req.body` and has
// consumed the underlying stream in doing so — so the old stream-only version
// would find nothing to read. Two extra wrinkles: `req.body` is a lazy getter
// that THROWS when the JSON is malformed, and its value depends on the
// Content-Type (object for application/json, string for text/plain, Buffer for
// application/octet-stream, undefined when no Content-Type was sent).
//
// Locally there is no such helper, so we fall through to reading the stream.
export const readBody = async (req) => {
  let preParsed;
  try {
    preParsed = req.body;
  } catch {
    return {}; // malformed JSON — same silent {} the stream path yields
  }

  // Objects (application/json) are already what we want.
  if (preParsed && typeof preParsed === "object" && !Buffer.isBuffer(preParsed)) {
    return preParsed;
  }

  // Non-empty string / Buffer: parse it ourselves.
  if (
    Buffer.isBuffer(preParsed) ||
    (typeof preParsed === "string" && preParsed.length > 0)
  ) {
    const raw = Buffer.isBuffer(preParsed)
      ? preParsed.toString("utf8")
      : preParsed;
    const parsed = safeParse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  }

  // Anything falsy falls through to the stream ON PURPOSE. When a request has no
  // Content-Type at all, Vercel sets req.body to "" *without* consuming the
  // stream — so short-circuiting on a falsy body here would silently discard a
  // real payload. If the stream truly was drained, readableEnded is set and
  // iterating would stall, so bail on that instead.
  if (req.readableEnded) return {};

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const parsed = safeParse(Buffer.concat(chunks).toString("utf8"));
  return parsed && typeof parsed === "object" ? parsed : {};
};

// Cheap, always-on hardening for an API that only ever returns JSON.
// Used by the LOCAL server only — on Vercel these are applied at the edge via
// the `headers` block in vercel.json, so setting them here too would duplicate.
export const setSecurityHeaders = (res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
};

// Wraps a handler so no rejection can escape. Without this, an unhandled
// rejection takes down the local server process, and on Vercel it becomes an
// opaque FUNCTION_INVOCATION_FAILED with no parseable body — which the client
// then reports as a generic failure. The shape below keeps the ApiError
// contract in src/services/apiClient.js intact (`error` -> code, plus message).
export const withErrorHandling = (handler) => async (req, res) => {
  try {
    return await handler(req, res);
  } catch (err) {
    console.error("[api] unhandled error:", err?.stack || err?.message || err);
    if (res.headersSent || res.writableEnded) return;
    return sendJson(res, 500, {
      error: "server_error",
      message: "Something went wrong on our side. Please try again.",
    });
  }
};

// Short tag for correlating log lines belonging to one request. Vercel stamps
// every request with x-vercel-id; locally we generate one. Matters because a
// warm instance can serve several invocations at once, so interleaved timing
// lines are otherwise impossible to attribute.
export const reqId = (req) =>
  String(req?.headers?.["x-vercel-id"] || "").split("::").pop() ||
  Math.random().toString(36).slice(2, 8);

// Shared by the Groq retry loop.
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Builds a Vercel function entrypoint: enforces the HTTP method (Vercel routes
// every method to the same file, whereas the old server 404'd a mismatch) and
// guarantees no rejection escapes.
export const createEndpoint = (method, handler) =>
  withErrorHandling(async (req, res) => {
    if (req.method !== method) {
      res.setHeader("Allow", method);
      return sendJson(res, 405, {
        error: "method_not_allowed",
        message: `This endpoint accepts ${method} only.`,
      });
    }
    return handler(req, res);
  });

// Treats a response as retryable/transient. NOTE: the substring test is
// deliberately broad (Gemini and Groq word these differently), which means a
// non-transient error merely *mentioning* a limit is also retried.
export const isRateLimitError = (status, data) => {
  if (status === 429 || status === 503) return true;
  if (data?.error?.status === "RESOURCE_EXHAUSTED") return true;
  const message = String(data?.error?.message || "").toLowerCase();
  return (
    message.includes("rate") ||
    message.includes("quota") ||
    message.includes("limit")
  );
};

// Parses the delta-seconds form of Retry-After into ms. Returns null for the
// HTTP-date form or anything unparseable.
export const parseRetryAfterMs = (headerValue) => {
  if (!headerValue) return null;
  const seconds = Number(headerValue);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);
  return null;
};

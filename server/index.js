import http from "http";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const STABILITY_API_KEY = process.env.STABILITY_API_KEY || process.env.VITE_STABILITY_API_KEY;

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

const handleGeminiGenerateContent = async (req, res) => {
  if (!GEMINI_API_KEY && !GEMINI_API_KEY_FALLBACK) {
    return sendJson(res, 400, { error: "GEMINI_API_KEY not configured" });
  }

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
    return sendJson(res, fallbackResult.response.status, {
      error: "Gemini API error",
      details: fallbackResult.data,
      fallbackAttempted: true,
    });
  }

  return sendJson(res, primaryResult.response.status, {
    error: "Gemini API error",
    details: primaryResult.data,
    fallbackAttempted: false,
  });
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

  const body = await readBody(req);
  const messages = Array.isArray(body.messages) ? body.messages : null;
  if (!messages || messages.length === 0) {
    return sendJson(res, 400, { error: "Missing messages" });
  }

  const model = body.model || GROQ_MODEL;
  const temperature = typeof body.temperature === "number" ? body.temperature : 0.3;
  const maxTokens = Number.isFinite(body.max_tokens) ? body.max_tokens : 512;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return sendJson(res, response.status, {
        error: "Groq API error",
        details: data,
      });
    }

    return sendJson(res, 200, data);
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

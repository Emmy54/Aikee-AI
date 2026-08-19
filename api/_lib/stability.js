// ============================================================================
// Stability AI: headshot generation (not metered — only full-CV counts)
// ============================================================================
// Unhandled rejections here are caught by withErrorHandling() at the entrypoint,
// which is what the original handler lacked entirely: Buffer.from, new Blob,
// fetch and arrayBuffer() were all unprotected, so a bad upload could take the
// process down locally, or return an unparseable 500 on Vercel.

import { sendJson, readBody } from "./http.js";
import { authorize, sendAuthError } from "./auth.js";
import { STABILITY_API_KEY } from "./config.js";

export const handleStabilityHeadshot = async (req, res) => {
  if (!STABILITY_API_KEY) {
    return sendJson(res, 400, {
      error: "provider_not_configured",
      message: "Headshot generation isn't configured on the server yet.",
    });
  }

  // Paid endpoint: valid session + allowlisted email required.
  const auth = await authorize(req, { requireAllowlist: true });
  if (!auth.ok) return sendAuthError(res, auth);

  const body = await readBody(req);
  const { base64ImageData, prompt, mimeType } = body || {};

  if (!base64ImageData || !prompt) {
    return sendJson(res, 400, {
      error: "bad_request",
      message: "Missing base64ImageData or prompt.",
    });
  }

  const imageBuffer = Buffer.from(base64ImageData, "base64");
  const imageBlob = new Blob([imageBuffer], { type: mimeType || "image/jpeg" });

  const formData = new FormData();
  formData.append("image", imageBlob);
  formData.append("prompt", prompt);
  formData.append("output_format", "jpeg");

  const response = await fetch(
    "https://api.stability.ai/v2beta/stable-image/generate/core",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        Accept: "image/*",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    // 502 rather than the provider's status — see the note in _lib/gemini.js:
    // a pass-through 429 reads as "you've used all your generations" client-side.
    return sendJson(res, 502, {
      error: "provider_error",
      message: "The headshot service returned an error. Please try again.",
      providerStatus: response.status,
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

export const handleStabilityStatus = async (_req, res) => {
  const configured = Boolean(STABILITY_API_KEY);
  return sendJson(res, 200, {
    configured,
    valid: configured,
    message: configured ? "API key present" : "API key not found in environment",
  });
};

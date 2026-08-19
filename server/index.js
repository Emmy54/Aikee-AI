// ============================================================================
// Local development API server
// ============================================================================
// This is NOT what runs in production. On Vercel each route below is its own
// serverless function, invoked directly by the platform.
//
// Note what this file imports: the api/** ENTRYPOINTS, not the underlying
// handlers. That means local requests pass through the exact same method guard
// and error wrapper (createEndpoint) that production uses, so the two adapters
// cannot behave differently. The only thing unique to this file is listen().
//
// Routing here is by pathname only — deliberately method-agnostic, because
// that is how Vercel's file-based routing works. The method check belongs to
// createEndpoint, and is therefore exercised identically in both environments.

import http from "http";

import { PORT } from "../api/_lib/config.js";
import { sendJson, setSecurityHeaders } from "../api/_lib/http.js";

import geminiGenerateContent from "../api/gemini/generate-content.js";
import geminiStatus from "../api/gemini/status.js";
import groqGenerateContent from "../api/groq/generate-content.js";
import groqStatus from "../api/groq/status.js";
import stabilityHeadshot from "../api/stability/headshot.js";
import stabilityStatus from "../api/stability/status.js";

// Mirrors the api/** file layout one-for-one. A route added here needs a
// matching file under api/, and vice versa.
const routes = {
  "/api/gemini/generate-content": geminiGenerateContent,
  "/api/gemini/status": geminiStatus,
  "/api/groq/generate-content": groqGenerateContent,
  "/api/groq/status": groqStatus,
  "/api/stability/headshot": stabilityHeadshot,
  "/api/stability/status": stabilityStatus,
};

// A stray rejection must not take the dev server down mid-session. Each route is
// already wrapped by createEndpoint; these are the last-resort nets.
process.on("unhandledRejection", (err) =>
  console.error("[server] unhandledRejection:", err?.stack || err)
);
process.on("uncaughtException", (err) =>
  console.error("[server] uncaughtException:", err?.stack || err)
);

// No HTTPS enforcement here: Vercel terminates TLS and serves HTTPS only, and
// the security headers are applied at its edge via vercel.json. Locally this is
// plain http on localhost, with the same headers set for parity.
const server = http.createServer(async (req, res) => {
  try {
    setSecurityHeaders(res);

    let pathname;
    try {
      // Host can be absent on a raw socket probe, which would otherwise throw.
      pathname = new URL(req.url, `http://${req.headers.host || "localhost"}`)
        .pathname;
    } catch {
      return sendJson(res, 400, {
        error: "bad_request",
        message: "Malformed URL.",
      });
    }

    const endpoint = routes[pathname];
    if (!endpoint) {
      return sendJson(res, 404, { error: "not_found", message: "Not found." });
    }

    return await endpoint(req, res);
  } catch (err) {
    console.error("[server] dispatch error:", err?.stack || err);
    if (!res.headersSent) {
      return sendJson(res, 500, {
        error: "server_error",
        message: "Something went wrong on our side. Please try again.",
      });
    }
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Local API server listening on http://localhost:${PORT}`);
  console.log(`Routes:\n${Object.keys(routes).map((p) => `  ${p}`).join("\n")}`);
});

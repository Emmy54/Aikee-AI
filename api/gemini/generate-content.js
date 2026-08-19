// Vercel function -> POST /api/gemini/generate-content
// The implementation lives in ../_lib/gemini.js so the local dev server in
// server/index.js can serve the exact same handler.
import { createEndpoint } from "../_lib/http.js";
import { handleGeminiGenerateContent } from "../_lib/gemini.js";

export default createEndpoint("POST", handleGeminiGenerateContent);

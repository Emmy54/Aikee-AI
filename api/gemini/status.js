// Vercel function -> GET /api/gemini/status
import { createEndpoint } from "../_lib/http.js";
import { handleGeminiStatus } from "../_lib/gemini.js";

export default createEndpoint("GET", handleGeminiStatus);

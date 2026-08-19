// Vercel function -> GET /api/groq/status
import { createEndpoint } from "../_lib/http.js";
import { handleGroqStatus } from "../_lib/groq.js";

export default createEndpoint("GET", handleGroqStatus);

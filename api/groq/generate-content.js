// Vercel function -> POST /api/groq/generate-content
import { createEndpoint } from "../_lib/http.js";
import { handleGroqGenerateContent } from "../_lib/groq.js";

export default createEndpoint("POST", handleGroqGenerateContent);

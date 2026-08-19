// Vercel function -> POST /api/stability/headshot
import { createEndpoint } from "../_lib/http.js";
import { handleStabilityHeadshot } from "../_lib/stability.js";

export default createEndpoint("POST", handleStabilityHeadshot);

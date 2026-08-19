// Vercel function -> GET /api/stability/status
import { createEndpoint } from "../_lib/http.js";
import { handleStabilityStatus } from "../_lib/stability.js";

export default createEndpoint("GET", handleStabilityStatus);

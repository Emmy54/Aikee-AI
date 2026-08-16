import { withCache } from '../utils/databaseHelpers';

const USE_SERVER = import.meta.env.VITE_USE_SERVER !== "true";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const apiFetch = (path, options) => fetch(`${API_BASE_URL}${path}`, options);

const normalizeQuestion = (question) => (question || "").replace(/\s+/g, " ").trim();

// Extract the question strings from the model's reply.
// The reply is *supposed* to be a raw JSON array, but two things go wrong in
// practice: the model wraps it in prose/markdown, or it gets truncated when it
// hits the token cap (finish_reason: "length") — leaving an unterminated array
// that JSON.parse can't handle. So: try a clean parse first, then fall back to
// salvaging every complete "quoted string" after the first '['.
const extractQuestions = (content) => {
  if (!content) return [];

  // Fast path: a complete, well-formed JSON array.
  const full = content.match(/\[[\s\S]*\]/);
  if (full) {
    try {
      const parsed = JSON.parse(full[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to salvage
    }
  }

  // Salvage path: pull out each complete double-quoted string literal that
  // appears after the opening bracket. A trailing, half-written string (from a
  // truncated response) simply won't match, so we keep only the complete ones.
  const start = content.indexOf("[");
  const scope = start === -1 ? content : content.slice(start);
  const matches = scope.match(/"(?:[^"\\]|\\.)*"/g) || [];
  return matches
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return "";
      }
    })
    .filter(Boolean);
};

export const generateRoleQuestionsWithGroq = async (role, experienceLevel, count = 5) => {
  if (!USE_SERVER) {
    throw new Error("Groq API is only supported via server mode in this app.");
  }

  try {
    const result = await withCache(
      'skills', // Cache as skills since this is for skill discovery
      _generateRoleQuestionsAPI,
      { role, experienceLevel, count }
    );

    if (result.success) {
      return result.data || [];
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Role questions generation error:", error);
    return [];
  }
};

const _generateRoleQuestionsAPI = async ({ role, experienceLevel, count }) => {
  try {
    const safeCount = Math.max(3, Math.min(10, Number(count) || 5));
    const isStudent = (experienceLevel || "").toLowerCase() === "student";
    const prompt = isStudent
      ? `You are a career coach for students and recent graduates. Generate ${safeCount} concise, role-specific questions to uncover academic, project-based, and extracurricular experience relevant to a ${role || "target"} role.

Experience level: student

Requirements:
- Keep each question to one sentence
- Focus on coursework, projects, tools/technologies, collaboration, leadership, and measurable outcomes
- Avoid asking about full-time job experience
- Avoid generic questions that apply to any role

Return ONLY a JSON array of strings, like: ["Question 1", "Question 2"]
Do not include code block formatting, just the raw JSON array.`
      : `You are a professional CV coach. Generate ${safeCount} concise, role-specific questions to uncover relevant skills and experience for a ${role || "target"} role.

Experience level: ${experienceLevel || "not specified"}

Requirements:
- Keep each question SHORT — one sentence, under 20 words
- Focus on skills, tools, responsibilities, and impact
- Avoid generic questions that apply to any job

Return ONLY a JSON array of strings, like: ["Question 1", "Question 2"]
Do not include code block formatting, just the raw JSON array.`;

    const response = await apiFetch("/api/groq/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful CV assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const parsed = extractQuestions(content);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid response format from Groq");
    }
    return parsed.map(normalizeQuestion).filter(Boolean).slice(0, safeCount);
  } catch (error) {
    console.error("Role questions API error:", error);
    throw error;
  }
};

export const isGroqConfigured = () => {
  return USE_SERVER;
};

export const getGroqStatus = async () => {
  if (!USE_SERVER) {
    return { configured: false, message: "Server mode disabled" };
  }

  try {
    const response = await apiFetch("/api/groq/status", { method: "GET" });
    if (!response.ok) {
      return { configured: true, valid: false, message: "Status check failed" };
    }
    return await response.json();
  } catch (error) {
    return {
      configured: true,
      valid: false,
      message: `Connection error: ${error.message}`,
    };
  }
};

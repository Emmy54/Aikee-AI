/**
 * Gemini AI Service
 * Handles all interactions with Google Gemini API
 * Two main features: Skills Discovery, Experience Enhancement
 *
 * Database Caching: All major AI requests are cached to reduce API calls
 * Cache types: 'skills', 'experience', 'summary'
 *
 * Transport: every request goes through our own server (/api/gemini/*) via the
 * shared authed API client. No Google API key is ever referenced in the client
 * bundle, and the Supabase session token rides along so the server can enforce
 * the beta allowlist + generation limit. The full-CV call is tagged
 * `meter: "full_cv"` so ONLY it counts against the 2-generation beta cap.
 */

import { withCache } from '../utils/databaseHelpers';
import { authedPostJson, getJson } from './apiClient';

const normalizeBullet = (bullet) =>
  (bullet || "").replace(/<br>\s*$/i, "").trim();
const normalizeQuestion = (question) => (question || "").replace(/\s+/g, " ").trim();

// All Gemini traffic funnels through here: POST to our server with the auth
// token attached, returns Google's parsed response, throws ApiError on failure.
const postGemini = (body) => authedPostJson("/api/gemini/generate-content", body);

// ============================================================================
// 1. SKILLS DISCOVERY - Generate skills based on answers
// ============================================================================

export const generateRoleQuestionsWithGemini = async (role, experienceLevel, count = 5) => {
  const safeCount = Math.max(3, Math.min(10, Number(count) || 5));
  const prompt = `You are a professional CV coach. Generate ${safeCount} concise, role-specific questions to uncover relevant skills and experience for a ${role || "target"} role.

Experience level: ${experienceLevel || "not specified"}

Requirements:
- Keep each question to one sentence
- Focus on skills, tools, responsibilities, and impact
- Avoid generic questions that apply to any job

Return ONLY a JSON array of strings, like: ["Question 1", "Question 2"]
Do not include code block formatting, just the raw JSON array.`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const data = await postGemini(body);
  const content = data.candidates[0].content.parts[0].text;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Gemini");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizeQuestion).filter(Boolean).slice(0, safeCount);
};

export const generateSkillsFromGemini = async (answers, role, questions) => {
  // Use cached version with database support
  try {
    const result = await withCache(
      'skills',
      _generateSkillsAPI,
      { answers, role, questions }
    );

    if (result.success) {
      return result.data || [];
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Skills generation error:", error);
    // Fallback to basic skills if cache or API fails
    return ["Communication", "Problem Solving", "Team Collaboration"];
  }
};

// Internal API function - called by withCache
const _generateSkillsAPI = async ({ answers, role, questions }) => {
  try {
    // Build context with Q&A pairs
    const qaContext = questions
      .map((q, i) => `Q: ${q}\nA: ${answers[i] || "Not answered"}`)
      .join("\n\n");

    const prompt = `You are a professional CV consultant. Based on this person's background, suggest 5-7 highly relevant professional skills for a ${role} role.

${qaContext}

Return ONLY a JSON array of skill strings, like: ["Skill1", "Skill2", "Skill3"]
Make skills specific and industry-relevant for a ${role}.
Do not include the markdown code block formatting, just the raw JSON array.`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const content = data.candidates[0].content.parts[0].text;

    // Parse the JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const skills = JSON.parse(jsonMatch[0]);
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error("Skills API error:", error);
    throw error;
  }
};

// ============================================================================
// 2. EXPERIENCE ENHANCEMENT - Transform raw experience into professional bullets
// ============================================================================

export const enhanceExperienceWithGemini = async (rawExperience, jobTitle, role) => {
  try {
    const result = await withCache(
      'experience',
      _enhanceExperienceAPI,
      { rawExperience, jobTitle, role }
    );

    if (result.success) {
      return result.data || [];
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Experience enhancement error:", error);
    // Fallback bullets
    return [
      `Executed ${rawExperience.slice(0, 30)}... with measurable outcomes`,
      `Leveraged skills to deliver consistent results`,
      `Demonstrated initiative and ownership`,
    ].map(normalizeBullet);
  }
};

const _enhanceExperienceAPI = async ({ rawExperience, jobTitle, role }) => {
  try {
    const prompt = `You are an expert CV writer. Transform this raw experience description into 3 professional, impactful bullet points suitable for a CV. The person is applying for a ${jobTitle} position.

Raw experience: "${rawExperience}"

Requirements:
- Start each bullet with a strong action verb
- Include metrics or outcomes when possible
- Make it relevant to a ${jobTitle} role
- Use professional language
- Each bullet should fit on one line

Return ONLY a JSON array of 3 bullet point strings, like: ["• Bullet 1", "• Bullet 2", "• Bullet 3"]
Do not include code block formatting, just the raw JSON.`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const content = data.candidates[0].content.parts[0].text;

    // Parse the JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const bullets = JSON.parse(jsonMatch[0]);
    return Array.isArray(bullets) ? bullets.map(normalizeBullet) : [];
  } catch (error) {
    console.error("Experience API error:", error);
    throw error;
  }
};

// ============================================================================
// 2B. PROJECT ENHANCEMENT - Transform raw project notes into bullet points
// ============================================================================

export const enhanceProjectWithGemini = async (rawProject, jobTitle) => {
  try {
    const result = await withCache(
      'experience', // Reuse experience cache type for projects
      _enhanceProjectAPI,
      { rawProject, jobTitle }
    );

    if (result.success) {
      return result.data || [];
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Project enhancement error:", error);
    // Fallback bullets
    return [
      `Built ${rawProject.slice(0, 30)}... to solve a concrete problem`,
      `Applied relevant tools and collaboration to deliver results`,
      `Demonstrated ownership, learning, and impact`,
    ].map(normalizeBullet);
  }
};

const _enhanceProjectAPI = async ({ rawProject, jobTitle }) => {
  try {
    const prompt = `You are an expert CV writer. Transform this raw project description into 3 professional, impactful bullet points suitable for a CV. The person is applying for a ${jobTitle} position.

Raw project description: "${rawProject}"

Requirements:
- Start each bullet with a strong action verb
- Include metrics or outcomes when possible
- Make it relevant to a ${jobTitle} role
- Use professional language
- Each bullet should fit on one line

Return ONLY a JSON array of 3 bullet point strings, like: ["• Bullet 1", "• Bullet 2", "• Bullet 3"]
Do not include code block formatting, just the raw JSON.`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const content = data.candidates[0].content.parts[0].text;

    // Parse the JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const bullets = JSON.parse(jsonMatch[0]);
    return Array.isArray(bullets) ? bullets.map(normalizeBullet) : [];
  } catch (error) {
    console.error("Project API error:", error);
    throw error;
  }
};

// ============================================================================
// 3. HEADSHOT GENERATOR - Generate professional avatar images
// ============================================================================

// Legacy placeholder function
export const generateHeadshotWithGemini = async (name, jobTitle) => {
  try {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const colors = ["#c8a96e", "#d4b575", "#b89968"];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];

    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="${bgColor}"/>
        <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)"/>
        <text x="100" y="110" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">
          ${initials}
        </text>
      </svg>
    `;

    const svgBase64 = btoa(svg);
    return `data:image/svg+xml;base64,${svgBase64}`;
  } catch (error) {
    console.error("Headshot generation error:", error);
    return null;
  }
};

// Gemini image-based headshot generation intentionally removed.


// ============================================================================
// ADVANCED: Generate Professional Summary using Gemini
// ============================================================================

export const generateProfessionalSummaryWithGemini = async (
  name,
  jobTitle,
  company,
  skills,
  experiences
) => {
  try {
    const result = await withCache(
      'summary',
      _generateProfessionalSummaryAPI,
      { name, jobTitle, company, skills, experiences }
    );

    if (result.success) {
      return result.data || '';
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Summary generation error:", error);
    return `Motivated professional with expertise in ${skills.slice(0, 2).join(" and ")}. Committed to delivering results and contributing to ${company || "organizational"} success.`;
  }
};

const _generateProfessionalSummaryAPI = async ({ name, jobTitle, company, skills, experiences }) => {
  try {
    const expSummary = experiences
      .map((e) => `${e.title} at ${e.company}`)
      .join(", ");

    const prompt = `Write a 2-3 sentence professional summary for a CV. Keep it concise and compelling.

Name: ${name}
Target Role: ${jobTitle}
Target Company: ${company}
Key Skills: ${skills.join(", ")}
Experience: ${expSummary || "Early career professional"}

Requirements:
- Highlight unique value proposition
- Mention relevant skills
- Show company/role alignment
- Use professional tone
- 2-3 sentences maximum

Return ONLY the summary text, no quotes or formatting.`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const summary = data.candidates[0].content.parts[0].text.trim();
    return summary;
  } catch (error) {
    console.error("Summary API error:", error);
    throw error;
  }
};

// ============================================================================
// ADVANCED: Rewrite Summary with Tone
// ============================================================================

export const rewriteSummaryWithGemini = async (summaryText, tone) => {
  if (!summaryText || !summaryText.trim()) {
    throw new Error("Summary text is required");
  }

  try {
    const result = await withCache(
      'summary',
      _rewriteSummaryAPI,
      { summaryText, tone }
    );

    if (result.success) {
      return result.data || summaryText;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Rewrite summary error:", error);
    return summaryText; // Return original if rewrite fails
  }
};

const _rewriteSummaryAPI = async ({ summaryText, tone }) => {
  try {
    const toneLabel = tone === "casual" ? "casual and friendly" : "professional and formal";
    const prompt = `Rewrite the following professional summary to sound ${toneLabel}.
Keep the meaning and key details intact.
Return only the rewritten summary text, no quotes or formatting.

Summary:
${summaryText}`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const content = data.candidates[0].content.parts[0].text.trim();
    return content;
  } catch (error) {
    console.error("Rewrite API error:", error);
    throw error;
  }
};

// ============================================================================
// ADVANCED: Generate Full CV Data in One Call
// ============================================================================

export const generateFullCVData = async ({
  jobTitle,
  company,
  experienceLevel,
  questions,
  skillAnswers,
  experiences,
  projects,
  selectedSkills,
}) => {
  const qaContext = questions
    .map((q, i) => `Q: ${q}\nA: ${skillAnswers[i] || "Not answered"}`)
    .join("\n\n");

  const experienceContext = experiences
    .map((exp, i) => {
      const header = `Experience ${i + 1}: ${exp.position || "Role"} at ${exp.company || "Company"}`;
      const details = [
        exp.startDate ? `Start: ${exp.startDate}` : null,
        exp.endDate ? `End: ${exp.endDate}` : null,
        exp.description ? `Description: ${exp.description}` : null,
      ].filter(Boolean).join(" | ");
      return `${header}\n${details || "Description: Not provided"}`;
    })
    .join("\n\n");

  const projectContext = (projects || [])
    .map((project, i) => {
      const header = `Project ${i + 1}: ${project.name || "Project"}`;
      const details = [
        project.role ? `Role: ${project.role}` : null,
        project.tools ? `Tools: ${project.tools}` : null,
        project.description ? `Description: ${project.description}` : null,
      ].filter(Boolean).join(" | ");
      return `${header}\n${details || "Description: Not provided"}`;
    })
    .join("\n\n");

  const prompt = `You are an expert CV writer. Based on the information below, generate a single JSON response with:
1) skills: 5-7 relevant skills for the target role
2) experienceBullets: an array of bullet arrays (3 bullets per experience, in order)
3) projectBullets: an array of bullet arrays (3 bullets per project, in order)
4) summary: a 2-3 sentence professional summary

Target Role: ${jobTitle || "Not specified"}
Target Company: ${company || "Not specified"}
Experience Level: ${experienceLevel || "Not specified"}

SKILLS & BACKGROUND Q&A:
${qaContext || "No answers provided"}

SELECTED SKILLS:
${selectedSkills?.length ? selectedSkills.join(", ") : "None provided"}

WORK EXPERIENCE:
${experienceContext || "No experience provided"}

PROJECTS / SCHOOL WORK:
${projectContext || "No projects provided"}

Requirements:
- skills: concise, role-specific
- experienceBullets: start each bullet with a strong action verb
- projectBullets: start each bullet with a strong action verb
- summary: professional, concise, no formatting

Return ONLY valid JSON with this exact shape:
{
  "skills": ["skill1", "skill2"],
  "experienceBullets": [
    ["bullet 1", "bullet 2", "bullet 3"],
    ["bullet 1", "bullet 2", "bullet 3"]
  ],
  "projectBullets": [
    ["bullet 1", "bullet 2", "bullet 3"],
    ["bullet 1", "bullet 2", "bullet 3"]
  ],
  "summary": "summary text"
}`;

  // `meter: "full_cv"` is the ONLY request tagged for metering — the server
  // consumes one of the tester's 2 beta credits for this call (and refunds it
  // if Gemini ultimately fails). All the per-section helpers above are untagged.
  const body = {
    meter: "full_cv",
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const data = await postGemini(body);
  const content = data.candidates[0].content.parts[0].text;
  const fallbackUsed = !!data.fallbackUsed;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response format from Gemini");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (Array.isArray(parsed.experienceBullets)) {
    parsed.experienceBullets = parsed.experienceBullets.map((group) =>
      Array.isArray(group) ? group.map(normalizeBullet) : group
    );
  }
  if (Array.isArray(parsed.projectBullets)) {
    parsed.projectBullets = parsed.projectBullets.map((group) =>
      Array.isArray(group) ? group.map(normalizeBullet) : group
    );
  }
  parsed._meta = { fallbackUsed };
  return parsed;
};

// ============================================================================
// ADVANCED: Generate Enhanced CV Experience (Skills + Experience Combined)
// ============================================================================

export const generateEnhancedCVExperienceWithGemini = async (
  skillQuestionAnswers,
  experiences,
  role,
  jobTitle
) => {
  try {
    const result = await withCache(
      'skills', // Use skills cache type as primary input is questions
      _generateEnhancedCVExperienceAPI,
      { skillQuestionAnswers, experiences, role, jobTitle }
    );

    if (result.success) {
      return result.data || {};
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Enhanced CV generation error:", error);
    // Fallback response
    return {
      keyStrengths: ["Problem Solving", "Communication", "Technical Proficiency"],
      recommendedSkills: ["Leadership", "Project Management", "Problem Solving", "Team Collaboration", "Strategic Thinking"],
      professionalSummary: `Results-driven ${role} with proven expertise in delivering solutions. Passionate about driving excellence and contributing to team success.`,
      experienceEnhancements: {
        advice: "Focus on quantifiable achievements and impact. Use action verbs to highlight your contributions.",
        keyThemes: ["Impact", "Growth", "Technical Excellence"],
      },
    };
  }
};

const _generateEnhancedCVExperienceAPI = async ({ skillQuestionAnswers, experiences, role, jobTitle }) => {
  try {
    // Build comprehensive context from skill answers
    const skillContext = skillQuestionAnswers
      .filter((answer) => answer && answer.trim())
      .map((answer, i) => `${i + 1}. ${answer}`)
      .join("\n");

    // Build experience context
    const experienceContext = experiences
      .filter((exp) => exp.description && exp.description.trim())
      .map((exp) => `${exp.position} at ${exp.company}: ${exp.description}`)
      .join("\n\n");

    const prompt = `You are an expert CV and career development consultant. Analyze this professional's background and create enhanced, targeted content for their CV.

ROLE TARGET: ${role} (Position: ${jobTitle})

SKILLS & BACKGROUND DISCOVERY:
${skillContext || "No skill answers provided"}

WORK EXPERIENCE:
${experienceContext || "No experience details provided"}

Based on the above information, provide a JSON response with the following structure (ONLY return valid JSON):
{
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "professionalSummary": "2-3 sentence professional summary",
  "experienceEnhancements": {
    "advice": "General advice for enhancing experience descriptions",
    "keyThemes": ["theme1", "theme2", "theme3"]
  }
}

Requirements:
- keyStrengths: Top 3 professional strengths based on the answers
- recommendedSkills: 5 most relevant skills for the target role
- professionalSummary: Compelling 2-3 sentence summary
- experienceEnhancements: Advice on how to position experience for this role
- All text should be professional, concise, and role-specific

Return ONLY valid JSON, no markdown formatting or code blocks.`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const data = await postGemini(body);
    const content = data.candidates[0].content.parts[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from Gemini");
    }

    const enhancedCV = JSON.parse(jsonMatch[0]);
    return enhancedCV;
  } catch (error) {
    console.error("Enhanced CV API error:", error);
    throw error;
  }
};

// ============================================================================
// UTILITY: Check API configuration
// ============================================================================

// Server-only now: availability is decided by the backend (which holds the
// keys and the auth/allowlist gate), so the client always considers Gemini
// "configured" and lets the server return a real error if it isn't.
export const isGeminiConfigured = () => true;

export const getApiStatus = async () => {
  const status = await getJson("/api/gemini/status");
  if (!status) {
    return { configured: true, valid: false, message: "Status check failed" };
  }
  return status;
};

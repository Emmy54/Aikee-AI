// Throwaway timing harness for the full-CV generation (beta launch perf check).
// Builds the SAME prompt shape as generateFullCVData() in src/services/geminiService.js
// with realistic filled-in data, posts it to the local API server, and reports
// the client-observed round trip. The server logs its own console.time lines.
//
// Usage: node scripts/time-full-cv.mjs [runs]

const BASE = process.env.API_BASE || "http://localhost:8787";
const RUNS = Number(process.argv[2] || 1);

const jobTitle = "Frontend Engineer";
const company = "Stripe";
const experienceLevel = "regular";

const questions = [
  "What frontend frameworks have you worked with most deeply?",
  "Describe a performance problem you diagnosed and fixed.",
  "How do you approach accessibility in a component library?",
  "Tell me about a time you shipped under a tight deadline.",
  "What testing strategies do you rely on for UI code?",
];

const skillAnswers = [
  "React for four years, plus Vue on two earlier projects. Deep on hooks, context, suspense and concurrent rendering.",
  "Our dashboard took 4s to interactive. I profiled with the Chrome performance panel, found a 1.8MB bundle from a date library and a chart lib imported eagerly, code-split both and memoised an expensive table render. Got it to 1.1s.",
  "I start from semantic HTML, test with keyboard only, then screen reader. I bake focus management and aria into the component API so consumers cannot get it wrong.",
  "We had a launch pulled forward by three weeks. I cut scope to the two flows that mattered, wrote a throwaway mock layer so frontend could progress without the API, and we shipped on the new date.",
  "Vitest for logic, React Testing Library for behaviour, Playwright for the three critical user journeys. I avoid snapshot tests as they rot.",
];

const selectedSkills = ["React", "TypeScript", "Performance optimisation", "Accessibility", "Playwright"];

const experiences = [
  {
    position: "Senior Frontend Engineer",
    company: "Linear",
    startDate: "2022-03",
    endDate: "Present",
    description:
      "Owned the issue-tracking board UI used by every customer. Rebuilt the virtualised list to handle 10k issues without jank, led the migration from styled-components to CSS modules across 400 files, and mentored two juniors.",
  },
  {
    position: "Frontend Engineer",
    company: "Monzo",
    startDate: "2019-06",
    endDate: "2022-02",
    description:
      "Built the customer onboarding flow in React Native and the internal support console in React. Cut onboarding drop-off by 18% by reordering steps and adding inline validation. On call for the web platform.",
  },
];

const projects = [
  {
    name: "openmetrics-dashboard",
    role: "Creator and maintainer",
    tools: "React, D3, Vite, Cloudflare Workers",
    description:
      "Open-source dashboard for visualising Prometheus metrics without a Grafana install. 1.2k GitHub stars, used by around 40 small teams. Handles streaming updates over websockets.",
  },
  {
    name: "a11y-lint",
    role: "Contributor",
    tools: "TypeScript, ESLint",
    description:
      "Added six new accessibility rules to a popular ESLint plugin, including one that catches focus traps in modal implementations. Wrote the docs and codemod for the breaking change.",
  },
];

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

const projectContext = projects
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

Target Role: ${jobTitle}
Target Company: ${company}
Experience Level: ${experienceLevel}

SKILLS & BACKGROUND Q&A:
${qaContext}

SELECTED SKILLS:
${selectedSkills.join(", ")}

WORK EXPERIENCE:
${experienceContext}

PROJECTS / SCHOOL WORK:
${projectContext}

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

const body = {
  meter: "full_cv",
  contents: [{ parts: [{ text: prompt }] }],
};

console.log(`prompt length: ${prompt.length} chars (~${Math.round(prompt.length / 4)} tokens)`);
console.log(`posting to ${BASE}/api/gemini/generate-content — ${RUNS} run(s)\n`);

const timings = [];

for (let i = 1; i <= RUNS; i++) {
  const started = performance.now();
  let status = 0;
  let note = "";
  try {
    const res = await fetch(`${BASE}/api/gemini/generate-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    status = res.status;
    const data = await res.json().catch(() => ({}));
    const elapsed = performance.now() - started;
    timings.push(elapsed);

    if (res.ok) {
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const usage = data?.usageMetadata;
      note = `${text.length} chars out`;
      if (usage) {
        note += `, tokens in/out/total: ${usage.promptTokenCount}/${usage.candidatesTokenCount}/${usage.totalTokenCount}`;
      }
      if (data.fallbackUsed) note += " [FALLBACK MODEL USED]";
    } else {
      note = `ERROR ${JSON.stringify(data).slice(0, 300)}`;
    }
    console.log(`run ${i}: ${(elapsed / 1000).toFixed(2)}s  status ${status}  ${note}`);
  } catch (err) {
    const elapsed = performance.now() - started;
    console.log(`run ${i}: ${(elapsed / 1000).toFixed(2)}s  FAILED  ${err?.message}`);
  }
}

if (timings.length > 1) {
  const sorted = [...timings].sort((a, b) => a - b);
  const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
  console.log(
    `\nmin ${(sorted[0] / 1000).toFixed(2)}s  ` +
    `median ${(sorted[Math.floor(sorted.length / 2)] / 1000).toFixed(2)}s  ` +
    `max ${(sorted[sorted.length - 1] / 1000).toFixed(2)}s  ` +
    `avg ${(avg / 1000).toFixed(2)}s`
  );
}

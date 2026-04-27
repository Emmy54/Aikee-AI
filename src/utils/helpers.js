import { SKILL_QUESTIONS, INTERNSHIP_QUESTIONS, ENTRY_LEVEL_QUESTIONS,STUDENT_QUESTIONS } from '../constants/questions';

const pickQuestionKey = (questionSet, keys) => keys.find((key) => questionSet[key]);

export function getQuestionsForRoleMeta(role, experienceLevel = "regular") {
  const r = (role || "").toLowerCase().trim();
  let questionSet = SKILL_QUESTIONS;

  if (experienceLevel === "internship") {
    questionSet = INTERNSHIP_QUESTIONS;
  } else if (experienceLevel === "entry-level") {
    questionSet = ENTRY_LEVEL_QUESTIONS;
  } else if (experienceLevel === "student") {
    questionSet = STUDENT_QUESTIONS;
  }

  const defaultQuestions = Array.isArray(questionSet.default)
    ? questionSet.default
    : (Array.isArray(SKILL_QUESTIONS.default) ? SKILL_QUESTIONS.default : []);
  const resolveQuestions = (key) =>
    Array.isArray(questionSet[key]) ? questionSet[key] : defaultQuestions;

  const matchers = [
    { when: r.includes("frontend"), keys: ["frontend_engineer"] },
    { when: r.includes("backend"), keys: ["backend_developer"] },
    { when: r.includes("fullstack") || r.includes("full stack"), keys: ["fullstack_developer", "software_engineer"] },
    { when: r.includes("software engineer") || r.includes("software developer") || r.includes("developer"), keys: ["software_engineer"] },
    { when: r.includes("devops"), keys: ["devops_engineer", "software_engineer"] },
    { when: r.includes("data scientist"), keys: ["data_scientist", "data_analyst"] },
    { when: r.includes("data analyst"), keys: ["data_analyst"] },
    { when: r.includes("cybersecurity") || r.includes("security analyst"), keys: ["cybersecurity_analyst"] },
    { when: r.includes("it support") || r.includes("it specialist"), keys: ["it_support"] },
    { when: r.includes("graphic"), keys: ["graphic_designer"] },
    { when: r.includes("ui") && r.includes("ux"), keys: ["uiux_designer"] },
    { when: r.includes("product designer"), keys: ["product_designer"] },
    { when: r.includes("product manager"), keys: ["product_manager"] },
    { when: r.includes("project manager"), keys: ["project_manager"] },
    { when: r.includes("business analyst"), keys: ["business_analyst"] },
    { when: r.includes("digital marketing") || r.includes("digital marketer"), keys: ["digital_marketer", "marketing"] },
    { when: r.includes("marketer"), keys: ["marketing", "digital_marketer"] },
    { when: r.includes("customer support"), keys: ["customer_support"] },
    { when: r.includes("admin assistant"), keys: ["admin_assistant", "administration"] },
    { when: r.includes("admin") && r.includes("assistant"), keys: ["admin_assistant", "administration"] },
    { when: r.includes("administration"), keys: ["administration", "admin_assistant"] },
    { when: r.includes("hr"), keys: ["hr_specialist"] },
    { when: r.includes("content writer"), keys: ["content_writer"] },
    { when: r.includes("virtual assistant"), keys: ["virtual_assistant"] },
    { when: r.includes("seo"), keys: ["seo_specialist"] },
    { when: r.includes("social media"), keys: ["social_media_manager", "marketing"] },
    { when: r.includes("sales"), keys: ["sales_rep"] },
    { when: r.includes("creative"), keys: ["graphic_designer"] },
  ];

  for (const matcher of matchers) {
    if (!matcher.when) continue;
    const matchedKey = pickQuestionKey(questionSet, matcher.keys);
    if (matchedKey) {
      return {
        questions: resolveQuestions(matchedKey),
        usedDefault: false,
        matchedKey,
      };
    }
    return {
      questions: defaultQuestions,
      usedDefault: true,
      matchedKey: matcher.keys[0] || "default",
    };
  }

  return {
    questions: defaultQuestions,
    usedDefault: true,
    matchedKey: "default",
  };
}

export function getQuestionsForRole(role, experienceLevel = "regular") {
  return getQuestionsForRoleMeta(role, experienceLevel).questions;
}

export function generateSkillsFromAnswers(answers, role) {
  const skills = [];
  const r = role.toLowerCase();
  answers.forEach((ans, i) => {
    const a = ans.toLowerCase();
    if (a.includes("yes") || a.includes("have") || a.includes("do") || a.includes("use") || a.includes("know")) {
      if (i === 0) skills.push(r.includes("engineer") ? "Software Development" : "Project Management");
      if (i === 1) skills.push(r.includes("designer") ? "UX Research" : "Data Analysis");
      if (i === 2) skills.push(r.includes("designer") ? "Figma / Adobe Suite" : "Collaboration Tools");
      if (i === 3) skills.push(r.includes("engineer") ? "Cloud Platforms (AWS/GCP)" : "Technical Proficiency");
      if (i === 4) skills.push(r.includes("manager") ? "Hiring & Performance Management" : "Team Leadership");
    }
  });
  if (skills.length === 0) skills.push("Communication", "Problem Solving", "Adaptability");
  return [...new Set(skills)];
}

export function generateExperienceBullets(rawExp) {
  const templates = [
    `Executed ${rawExp} with a focus on measurable outcomes and operational efficiency`,
    `Leveraged transferable skills from ${rawExp} to deliver consistent results`,
    `Demonstrated initiative and ownership while handling ${rawExp}`,
  ];
  return templates;
}

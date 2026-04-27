export const REGULAR_STEPS = [
  "target",
  "personal",
  "skills",
  "experience",
  "education",
  "certifications",
  "summary",
  "extras",
  "preview",
];

export const STEP_LABELS = {
  target: "Job Target",
  personal: "Personal Info",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
  summary: "Professional Summary",
  extras: "Languages & References",
  preview: "Review & Download",
  projects: "Projects / School Work",
  interests: "Interests & Career Goals",
  extra: "Extra Step",
  awards: "Awards & Achievements",
  activities: "Activities & Hobbies",
};

export function getStepsForExperienceLevel(level = "regular") {
  if (level === "internship") {
    return [
      "target",
      "personal",
      "education",
      "skills",
      "experience", 
      "projects",
      "extras",
      "summary",
      "preview",
    ];
  }

  if (level === "entry-level") {
    return [
      "target",
      "personal",
      "education",
      "skills",
      "projects",
      "certifications",
      "experience",
      "extras",
      "preview",
    ];
  }

  if (level === "student") {
    return [
      "target",
      "personal",
      "education",
      "experience",
      "projects",
      "skills",
      "awards",
      "certifications",
      "activities",
      "extras",
      "summary",
      "preview",
    ];
  }

  return REGULAR_STEPS;
}

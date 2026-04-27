import { useMemo } from "react";

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isNonEmptyNumber = (value) => typeof value === "number" && Number.isFinite(value);

const hasArrayContent = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.some((item) => hasContent(item));
};

const hasObjectContent = (obj, depth = 2) => {
  if (!obj || typeof obj !== "object") return false;
  if (depth <= 0) return false;
  return Object.values(obj).some((value) => hasContent(value, depth - 1));
};

export const hasContent = (value, depth = 2) => {
  if (value == null) return false;
  if (isNonEmptyString(value)) return true;
  if (isNonEmptyNumber(value)) return true;
  if (Array.isArray(value)) return hasArrayContent(value);
  if (typeof value === "object") return hasObjectContent(value, depth);
  return false;
};

const hasAnyText = (values = []) => values.some((value) => isNonEmptyString(value));

export const DEFAULT_SECTION_CHECKS = {
  summary: (data) => hasContent(data.summary || data.profile || data.about),
  contact: (data) => hasAnyText([data.phone, data.email, data.address, data.website]),
  skills: (data) => hasArrayContent(data.skills),
  education: (data) => hasArrayContent(data.education || data.educations),
  experience: (data) => hasArrayContent(data.experience || data.experiences),
  certifications: (data) => hasArrayContent(data.certifications),
  languages: (data) => hasArrayContent(data.languages),
  references: (data) => hasArrayContent(data.references || (data.reference ? [data.reference] : [])),
  projects: (data) => hasArrayContent(data.projects),
  awards: (data) => hasArrayContent(data.awards),
  activities: (data) => hasArrayContent(data.activities),
  interests: (data) => hasContent(data.careerInterests || data.interests),
  extras: (data) => hasContent(data.extraDetails),
};

export function useDynamicSections(data = {}, config = {}) {
  const {
    sidebar = [],
    main = [],
    minMain = 1,
    checks = {},
  } = config;

  return useMemo(() => {
    const present = {};
    const allNames = new Set([
      ...sidebar,
      ...main,
      ...Object.keys(checks || {}),
    ]);

    allNames.forEach((name) => {
      const checker = checks[name] || DEFAULT_SECTION_CHECKS[name] || ((payload) => hasContent(payload?.[name]));
      present[name] = Boolean(checker(data));
    });

    let sidebarList = sidebar.filter((name) => present[name]);
    let mainList = main.filter((name) => present[name]);

    if (mainList.length < minMain && sidebarList.length > 0) {
      const needed = Math.min(minMain - mainList.length, sidebarList.length);
      const moved = sidebarList.slice(0, needed);
      mainList = [...mainList, ...moved];
      sidebarList = sidebarList.slice(needed);
    }

    return { present, sidebar: sidebarList, main: mainList };
  }, [data, sidebar.join("|"), main.join("|"), minMain, JSON.stringify(Object.keys(checks || {}))]);
}

// cvTemplateEngine.jsx
// Shared engine that turns raw builder form state into per-template data objects and
// exposes the template registry. Consumed by both the always-visible LiveCVPreview pane
// and the final-step CVPreview, so this logic exists exactly once.

import { useMemo } from 'react';
import { ModernCV1 } from '../pdftemplates/ModernTemplates/ModernCV1';
import { ProfessionalCV } from '../pdftemplates/ClassicTemplates/ClassicCV1';
import { ProfessionalModernCV } from '../pdftemplates/ModernTemplates/ProfessionalModernCV';
import { ModernProfessionalCV3 } from '../pdftemplates/ModernTemplates/ModernProfessionalCV3';
import { PinkCuteCV } from '../pdftemplates/CreativeTemplates/PinkCuteCV';
import { MemphisRetro2 } from '../pdftemplates/CreativeTemplates/MemphisRetro2';
import { RetroCreativeCV } from '../pdftemplates/CreativeTemplates/RetroCreativeCV';
import { MinimalistCV1 } from '../pdftemplates/MinimalTemplates/MinimalistCV1';
import { MinimalistCV2 } from '../pdftemplates/MinimalTemplates/MinimalistCV2';
import BlueGrayTemplate from '../pdftemplates/BlueGrayTemplates/BlueGrayTemplate';
import { MemphisCV } from '../pdftemplates/CreativeTemplates/MemphisCV';
import { GrayRedMinimalistCV } from '../pdftemplates/ClassicTemplates/GrayRedMinimalistCV';
import { BlackBlueModernCV } from '../pdftemplates/ClassicTemplates/BlackBlueModernCV';
import { BlackGreyClassicCV } from '../pdftemplates/ClassicTemplates/BlackGreyClassicCV';
import {
  MinimalistStudentCV1,
  MinimalistStudentCV2,
  BlueGrayStudentCV,
  GrayRedStudentCV,
  ModernStudentCV,
} from '../pdftemplates/StudentTemplates';

// ── Formatting helpers ────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonthYear(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return value;
  return `${MONTHS[monthIndex]} ${year}`;
}

export function formatDateRange(start, end) {
  const startLabel = formatMonthYear(start);
  const endLabel = end ? formatMonthYear(end) : "Present";
  if (!startLabel && !end) return "";
  if (!startLabel) return endLabel;
  return `${startLabel} - ${endLabel}`;
}

export function asText(value) {
  if (value == null) return "";
  return value.toString().trim();
}

export function bulletsToProse(bullets) {
  if (!Array.isArray(bullets) || bullets.length === 0) return "";
  return bullets
    .map((bullet) =>
      (bullet || "")
        .replace(/<br>\s*$/i, "")
        .replace(/^[•\-\s]+/, "")
        .trim()
    )
    .filter(Boolean)
    .join(" ");
}

export function levelToPercents(level) {
  const normalized = (level || "").toLowerCase();
  if (normalized.includes("native")) return { green: 80, yellow: 10 };
  if (normalized.includes("fluent")) return { green: 70, yellow: 20 };
  if (normalized.includes("professional")) return { green: 60, yellow: 20 };
  if (normalized.includes("conversational")) return { green: 50, yellow: 20 };
  if (normalized.includes("basic")) return { green: 40, yellow: 20 };
  return { green: 55, yellow: 20 };
}

export function splitName(fullName) {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

// ── Data mapping ──────────────────────────────────────────────────────────────

/**
 * Pure. Maps a flat CV snapshot to the per-template data objects each template expects.
 * No hooks, no JSX — safe to call anywhere.
 */
export function buildTemplateData(cv = {}) {
  const {
    name = "",
    jobTitle = "",
    email = "",
    phone = "",
    address = "",
    photoPreview = null,
    summary = "",
    allSkills = [],
    experiences = [],
    educations = [],
    certifications = [],
    languages = [],
    references = [],
    projects = [],
    projectBullets = {},
    awards = [],
    experienceBullets = {},
  } = cv;

  const safeSkills = Array.isArray(allSkills) ? allSkills : [];
  const safeEducations = Array.isArray(educations) ? educations : [];

  const baseExperiences = Array.isArray(experiences) ? experiences : [];
  const normalizedExperiences = baseExperiences.map((exp, idx) => ({
    ...exp,
    __bullets: ((experienceBullets || {})[idx] || []).filter((bullet) => (bullet || "").trim()),
  }));
  const displayExperiences = normalizedExperiences.filter((exp) => {
    const hasBullets = exp.__bullets.length > 0;
    const hasText = [exp.company, exp.position, exp.description, exp.location, exp.startDate, exp.endDate]
      .some((value) => (value || "").toString().trim());
    return hasBullets || hasText;
  });
  const displayExperienceBullets = displayExperiences.map((exp) => exp.__bullets);

  const { firstName, lastName } = splitName(name);

  const normalizedEducation = safeEducations
    .map((edu) => {
      const school = asText(edu.school);
      const degreeText = [edu.degree, edu.field].filter(Boolean).join(' — ');
      const years = asText(edu.graduationYear);
      if (!school && !degreeText && !years) return null;
      return {
        school,
        degree: degreeText,
        years,
        bullets: degreeText ? [degreeText] : [],
      };
    })
    .filter(Boolean);
  const normalizedExperience = displayExperiences
    .map((exp, idx) => {
      const company = asText(exp.company);
      const role = asText(exp.position);
      const years = formatDateRange(exp.startDate, exp.endDate);
      const bullets = displayExperienceBullets[idx] || [];
      if (!company && !role && !years && bullets.length === 0) return null;
      return { company, role, years, bullets };
    })
    .filter(Boolean);
  const normalizedProjects = (projects || [])
    .map((project, idx) => {
      const projectName = asText(project?.name || project?.title);
      const role = [project?.role, project?.tools].filter(Boolean).join(' • ');
      const years = asText(project?.year || project?.date);
      const bullets = ((projectBullets || {})[idx] || []).filter((bullet) => asText(bullet));
      const description = asText(project?.description);
      const finalBullets = bullets.length > 0 ? bullets : (description ? [description] : []);
      if (!projectName && !role && !years && finalBullets.length === 0) return null;
      return {
        company: projectName || "Project",
        role,
        years,
        bullets: finalBullets,
      };
    })
    .filter(Boolean);
  const normalizedCertifications = (certifications || [])
    .map((cert) => {
      const role = asText(cert?.name);
      const company = asText(cert?.issuer);
      const years = asText(cert?.year);
      if (!role && !company && !years) return null;
      return { role, company, years, bullets: [] };
    })
    .filter(Boolean);
  const normalizedAwards = (awards || [])
    .map((award) => {
      const role = asText(award?.title);
      const company = asText(award?.issuer);
      const years = asText(award?.year);
      if (!role && !company && !years) return null;
      return { role, company, years, bullets: [] };
    })
    .filter(Boolean);
  const normalizedReferences = (references || [])
    .map((ref) => {
      const refName = asText(ref?.name);
      const company = asText(ref?.company);
      const refPhone = asText(ref?.phone);
      const refEmail = asText(ref?.email);
      if (!refName && !company && !refPhone && !refEmail) return null;
      return { name: refName, company, phone: refPhone, email: refEmail };
    })
    .filter(Boolean);
  const normalizedLanguages = (languages || [])
    .filter((lang) => lang.name)
    .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ""}`);
  const normalizedSkills = safeSkills.filter(Boolean);

  const templateProps = {
    name,
    jobTitle,
    summary,
    phone,
    email,
    website: '',
    address,
    profileImage: photoPreview,
    skills: safeSkills.map((skill, idx) => ({
      name: skill,
      rating: 4,
      color: ['#61DAFB', '#F7DF1E', '#339933', '#06B6D4', '#FF6B9D'][idx % 5]
    })),
    educations: safeEducations.map((edu, idx) => ({
      school: edu.school,
      degree: edu.degree,
      years: edu.graduationYear || '',
      dotColor: ['bg-green-500', 'bg-blue-500', 'bg-purple-500'][idx % 3]
    })),
    experiences: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      location: exp.location || 'Remote',
      description: displayExperienceBullets[idx]?.join(' • ') || exp.position,
      dotColor: ['bg-orange-500', 'bg-pink-500', 'bg-purple-500'][idx % 3]
    }))
  };
  const memphisData = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    photo: photoPreview,
    profile: summary,
    phone,
    email,
    website: '',
    address,
    skills: safeSkills.map((skill) => ({ name: skill, rating: 4 })),
    education: safeEducations.map((edu) => ({
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      years: edu.graduationYear || '',
    })),
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      location: exp.position || 'Role',
      years: formatDateRange(exp.startDate, exp.endDate),
      description: displayExperienceBullets[idx]?.join(' • ') || exp.description || '',
    })),
  };
  const professionalModernData = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    profile: summary,
    education: safeEducations.map((edu) => ({
      years: edu.graduationYear || '',
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: safeSkills,
    languages: normalizedLanguages,
    contact: [
      { icon: "📞", text: phone },
      { icon: "✉", text: email },
      { icon: "📍", text: address },
    ].filter((item) => item.text),
    experience: displayExperiences.map((exp, idx) => ({
      role: exp.position,
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
      description: displayExperienceBullets[idx]?.join(' • ') || exp.description || '',
    })),
    references: (references || []).map((ref) => ({
      name: ref.name || '',
      company: `${ref.company || ''}${ref.title ? ` / ${ref.title}` : ''}`.trim(),
      phone: ref.phone || '',
      email: ref.email || '',
    })),
  };
  const pinkCuteData = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    phone,
    address,
    email,
    profile: summary,
    education: safeEducations.map((edu) => ({
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      years: edu.graduationYear || '',
    })),
    expertise: safeSkills,
    experience: displayExperiences.map((exp) => ({
      role: exp.position,
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
    })),
    certifications: (certifications || [])
      .filter((cert) => cert.name)
      .map((cert) => ({
        title: cert.name,
        year: cert.year || '',
        description: cert.issuer || '',
      })),
  };
  const memphisRetro2Data = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    photo: photoPreview,
    phone,
    email,
    profile: summary,
    skills: safeSkills,
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
      role: exp.position,
      description: bulletsToProse(displayExperienceBullets[idx]) || exp.description || '',
    })),
    education: safeEducations.map((edu) => ({
      school: edu.school,
      field: edu.field || edu.degree || '',
      years: edu.graduationYear || '',
    })),
  };
  const retroCreativeData = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    phone,
    email,
    address,
    about: summary,
    skills: safeSkills.map((skill, idx) => ({
      name: `${skill}:`,
      green: 60 + (idx % 3) * 5,
      yellow: 20,
    })),
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => {
        const { green, yellow } = levelToPercents(lang.level);
        return { name: `${lang.name}:`, green, yellow };
      }),
    education: safeEducations.map((edu) => ({
      years: edu.graduationYear || '',
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
    })),
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      role: exp.position,
      years: formatDateRange(exp.startDate, exp.endDate),
      description: bulletsToProse(displayExperienceBullets[idx]) || exp.description || '',
    })),
  };
  const modernCV1Data = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    phone,
    email,
    address,
    education: safeEducations.map((edu) => ({
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      school: edu.school,
      years: edu.graduationYear || '',
    })),
    skills: safeSkills,
    experience: displayExperiences.map((exp, idx) => ({
      role: exp.position,
      company: exp.company,
      yearStart: formatMonthYear(exp.startDate) || '',
      yearEnd: formatMonthYear(exp.endDate) || 'Present',
      description: displayExperienceBullets[idx]?.join(' • ') || exp.description || '',
    })),
  };
  const modernProfessionalCV3Data = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    phone,
    email,
    address,
    about: summary,
    education: safeEducations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
    })),
    skills: safeSkills,
    languages: normalizedLanguages,
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      location: exp.position || 'Role',
      years: formatDateRange(exp.startDate, exp.endDate),
      description: displayExperienceBullets[idx]?.join(' • ') || exp.description || '',
    })),
    references: (references || []).map((ref) => ({
      name: ref.name || '',
      company: `${ref.company || ''}${ref.title ? ` / ${ref.title}` : ''}`.trim(),
      phone: ref.phone || '',
      email: ref.email || '',
    })),
  };
  const grayRedMinimalistData = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    photo: photoPreview,
    phone,
    email,
    address,
    profile: summary,
    skills: safeSkills,
    education: safeEducations.map((edu) => ({
      level: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim() || 'EDUCATION',
      school: edu.school,
      years: edu.graduationYear || '',
    })),
    experience: displayExperiences.map((exp, idx) => ({
      role: exp.position,
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx]?.length ? displayExperienceBullets[idx] : exp.description ? [exp.description] : [],
    })),
  };
  const blackBlueModernData = {
    firstName,
    lastName,
    title: jobTitle || '',
    photo: photoPreview,
    phone,
    email,
    address,
    summary,
    skills: safeSkills,
    education: safeEducations.map((edu) => ({
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      graduated: edu.graduationYear || '',
    })),
    certifications: (certifications || []).filter((cert) => cert.name).map((cert) => cert.name),
    languages: normalizedLanguages,
    experience: displayExperiences.map((exp, idx) => ({
      role: exp.position,
      company: exp.company,
      location: 'Remote',
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx]?.length ? displayExperienceBullets[idx] : exp.description ? [exp.description] : [],
    })),
  };
  const blackGreyClassicData = {
    firstName,
    lastName,
    firstNameScript: firstName,
    title: (jobTitle || '').toUpperCase(),
    photo: photoPreview,
    phone,
    email,
    address,
    profile: summary,
    skills: safeSkills,
    languages: normalizedLanguages,
    education: safeEducations.map((edu) => ({
      level: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim() || 'EDUCATION',
      school: edu.school,
      years: edu.graduationYear || '',
    })),
    experience: displayExperiences.map((exp, idx) => ({
      role: exp.position,
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx]?.length ? displayExperienceBullets[idx] : exp.description ? [exp.description] : [],
    })),
  };
  const primaryReference = references && references.length > 0 ? references[0] : null;
  const classicData = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    phone,
    email,
    address,
    website: '',
    profile: summary,
    skills: safeSkills,
    languages: normalizedLanguages,
    reference: {
      name: primaryReference?.name || '',
      company: `${primaryReference?.company || ''}${primaryReference?.title ? ` / ${primaryReference.title}` : ''}`.trim(),
      phone: primaryReference?.phone || '',
      email: primaryReference?.email || '',
    },
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      role: exp.position,
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx] || [],
    })),
    education: safeEducations.map((edu) => ({
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      school: edu.school,
      years: edu.graduationYear || '',
    })),
  };
  const minimalistData = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    address,
    website: '',
    email,
    profile: summary,
    education: safeEducations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: safeSkills,
    languages: normalizedLanguages,
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      role: exp.position,
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx] || [],
    })),
    references: (references || []).map((ref) => ({
      name: ref.name || '',
      company: `${ref.company || ''}${ref.title ? ` / ${ref.title}` : ''}`.trim(),
      phone: ref.phone || '',
      email: ref.email || '',
    })),
  };
  const minimalistCV2Data = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    phone,
    address,
    website: '',
    email,
    profile: summary,
    education: safeEducations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: safeSkills,
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      role: exp.position,
      years: formatDateRange(exp.startDate, exp.endDate),
      bullets: displayExperienceBullets[idx] || [],
    })),
    references: (references || []).map((ref) => ({
      name: ref.name || '',
      company: `${ref.company || ''}${ref.title ? ` / ${ref.title}` : ''}`.trim(),
      phone: ref.phone || '',
      email: ref.email || '',
    })),
  };
  const minimalistStudentCV1Data = {
    firstName,
    lastName,
    title: (jobTitle || '').toUpperCase(),
    address,
    website: '',
    email,
    profile: summary,
    education: normalizedEducation,
    skills: normalizedSkills,
    languages: normalizedLanguages,
    experience: normalizedExperience,
    projects: normalizedProjects,
    certifications: normalizedCertifications,
    awards: normalizedAwards,
    references: normalizedReferences,
  };
  const minimalistStudentCV2Data = {
    firstName,
    lastName,
    title: jobTitle || '',
    email,
    website: '',
    phone,
    address,
    summary,
    education: normalizedEducation,
    skills: normalizedSkills,
    experience: normalizedExperience,
    projects: normalizedProjects,
    certifications: normalizedCertifications,
    awards: normalizedAwards,
    references: normalizedReferences,
  };

  return {
    // Shared normalized pieces (the text preview in CVPreview needs these)
    displayExperiences,
    displayExperienceBullets,
    firstName,
    lastName,
    // Per-template payloads
    templateProps,
    memphisData,
    professionalModernData,
    pinkCuteData,
    memphisRetro2Data,
    retroCreativeData,
    modernCV1Data,
    modernProfessionalCV3Data,
    grayRedMinimalistData,
    blackBlueModernData,
    blackGreyClassicData,
    classicData,
    minimalistData,
    minimalistCV2Data,
    minimalistStudentCV1Data,
    minimalistStudentCV2Data,
  };
}

// ── Registry ──────────────────────────────────────────────────────────────────

const EARLY_CAREER_LEVELS = ['student', 'internship', 'entry-level'];

function buildRegistry(d) {
  return [
    {
      id: 'modern-geo',
      label: 'Modern Geo',
      description: 'Geometric header with accents',
      folder: 'Modern',
      render: () => <ModernCV1 data={d.modernCV1Data} />,
    },
    {
      id: 'modern-professional',
      label: 'Modern Professional',
      description: 'Gray header, timeline layout',
      folder: 'Modern',
      render: () => <ProfessionalModernCV data={d.professionalModernData} />,
    },
    {
      id: 'modern-professional-3',
      label: 'Modern Professional 3',
      description: 'Circle photo, clean columns',
      folder: 'Modern',
      render: () => <ModernProfessionalCV3 data={d.modernProfessionalCV3Data} />,
    },
    {
      id: 'classic-professional',
      label: 'Classic Professional',
      description: 'Editorial timeline layout',
      folder: 'Classic',
      render: () => <ProfessionalCV data={d.classicData} />,
    },
    {
      id: 'creative-pink-cute',
      label: 'Pink Cute',
      description: 'Soft pink editorial style',
      folder: 'Creative',
      render: () => <PinkCuteCV data={d.pinkCuteData} />,
    },
    {
      id: 'creative-memphis-retro-2',
      label: 'Memphis Retro 2',
      description: 'Bold retro browser cards',
      folder: 'Creative',
      render: () => <MemphisRetro2 data={d.memphisRetro2Data} />,
    },
    {
      id: 'creative-retro-playful',
      label: 'Retro Creative',
      description: 'Playful pastel layout',
      folder: 'Creative',
      render: () => <RetroCreativeCV data={d.retroCreativeData} />,
    },
    {
      id: 'minimalist-lines',
      label: 'Minimalist 1',
      description: 'White & blue linework',
      folder: 'Minimal',
      render: () => <MinimalistCV1 data={d.minimalistData} />,
    },
    {
      id: 'minimalist-lines-2',
      label: 'Minimalist 2',
      description: 'Clean White, Spaced-Caps Headings',
      folder: 'Minimal',
      render: () => <MinimalistCV2 data={d.minimalistCV2Data} />,
    },
    {
      id: 'minimal-gray-red',
      label: 'Gray Red Minimal',
      description: 'Gray & red minimalist',
      folder: 'Minimal',
      render: () => <GrayRedMinimalistCV data={d.grayRedMinimalistData} />,
    },
    {
      id: 'blue-gray',
      label: 'Blue & Gray',
      description: 'Simple professional design',
      folder: 'Minimal',
      render: () => <BlueGrayTemplate {...d.templateProps} />,
    },
    {
      id: 'modern-black-blue',
      label: 'Black Blue Modern',
      description: 'Dark modern with purple accents',
      folder: 'Modern',
      render: () => <BlackBlueModernCV data={d.blackBlueModernData} />,
    },
    {
      id: 'classic-black-grey',
      label: 'Black Grey Classic',
      description: 'Minimal classic in charcoal',
      folder: 'Classic',
      render: () => <BlackGreyClassicCV data={d.blackGreyClassicData} />,
    },
    {
      id: 'retro-memphis',
      label: 'Retro Memphis',
      description: 'Memphis-inspired layout',
      folder: 'Creative',
      render: () => <MemphisCV data={d.memphisData} />,
    },
  ];
}

function buildEarlyCareerTemplates(d) {
  return [
    {
      id: 'student-minimalist-1',
      label: 'Minimalist Student 1',
      description: 'White & blue lines',
      folder: 'Early Career',
      render: () => <MinimalistStudentCV1 data={d.minimalistStudentCV1Data} />,
    },
    {
      id: 'student-minimalist-2',
      label: 'Minimalist Student 2',
      description: 'Circle timeline layout',
      folder: 'Early Career',
      render: () => <MinimalistStudentCV2 data={d.minimalistStudentCV2Data} />,
    },
    {
      id: 'student-blue-gray',
      label: 'Blue Gray Student',
      description: 'Timeline icons layout',
      folder: 'Early Career',
      render: () => <BlueGrayStudentCV data={d.minimalistStudentCV2Data} />,
    },
    {
      id: 'student-gray-red',
      label: 'Gray Red Student',
      description: 'Split panel, bold badges',
      folder: 'Early Career',
      render: () => <GrayRedStudentCV data={d.minimalistStudentCV2Data} />,
    },
    {
      id: 'student-modern',
      label: 'Modern Student',
      description: 'Photo circle, italic headings',
      folder: 'Early Career',
      render: () => <ModernStudentCV data={d.minimalistStudentCV2Data} />,
    },
  ];
}

/**
 * Resolves the next {folder, templateId} pair for a folder/template click.
 * Pure so both the live pane and the final step share identical selection semantics.
 */
export function resolveFolderSelection({ registry, isExperienceLevel, folder, templateId }) {
  if (isExperienceLevel) {
    return templateId ? { templateId } : {};
  }
  if (templateId) {
    const matched = registry.find((t) => t.id === templateId && t.folder === folder);
    if (matched) return { folder, templateId: matched.id };
  }
  const first = registry.find((t) => t.folder === folder);
  return { folder, templateId: first ? first.id : undefined };
}

/**
 * Template registry + experience-level/folder filtering + active selection.
 * `cv` should be a memoized snapshot so the internal useMemo actually hits.
 */
export function useCVTemplates({ cv, experienceLevel, selectedFolder, selectedTemplate }) {
  const data = useMemo(() => buildTemplateData(cv), [cv]);

  const templateRegistry = useMemo(() => buildRegistry(data), [data]);
  const earlyCareerTemplates = useMemo(() => buildEarlyCareerTemplates(data), [data]);

  const folders = useMemo(
    () => [...new Set(templateRegistry.map((t) => t.folder))],
    [templateRegistry]
  );

  const isExperienceLevel = EARLY_CAREER_LEVELS.includes(experienceLevel);

  const visibleExperienceSections = useMemo(() => {
    if (!isExperienceLevel) return [];
    const labels = {
      student: 'Student PDF Templates',
      internship: 'Intern PDF Templates',
      'entry-level': 'Entry-Level PDF Templates',
    };
    return [{
      level: experienceLevel,
      label: labels[experienceLevel],
      templates: earlyCareerTemplates,
    }];
  }, [isExperienceLevel, experienceLevel, earlyCareerTemplates]);

  const currentTemplates = isExperienceLevel
    ? earlyCareerTemplates
    : templateRegistry.filter((t) => t.folder === selectedFolder);

  const activeTemplate =
    currentTemplates.find((t) => t.id === selectedTemplate) || currentTemplates[0];

  const renderTemplate = () => activeTemplate?.render?.();

  return {
    data,
    templateRegistry,
    folders,
    isExperienceLevel,
    visibleExperienceSections,
    currentTemplates,
    activeTemplate,
    renderTemplate,
  };
}

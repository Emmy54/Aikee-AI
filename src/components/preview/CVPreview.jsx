import { colors } from '../../constants/theme';
import { generateExperienceBullets } from '../../utils/helpers';
import CurriculumVitae from '../pdftemplates/CurriculumVitae';
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
import TemplateSelector from './TemplateSelector';
import { useEffect, useRef, useState } from 'react';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatMonthYear(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return value;
  return `${MONTHS[monthIndex]} ${year}`;
}

function formatDateRange(start, end) {
  const startLabel = formatMonthYear(start);
  const endLabel = end ? formatMonthYear(end) : "Present";
  if (!startLabel && !end) return "";
  if (!startLabel) return endLabel;
  return `${startLabel} - ${endLabel}`;
}

function asText(value) {
  if (value == null) return "";
  return value.toString().trim();
}

function bulletsToProse(bullets) {
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

function levelToPercents(level) {
  const normalized = (level || "").toLowerCase();
  if (normalized.includes("native")) return { green: 80, yellow: 10 };
  if (normalized.includes("fluent")) return { green: 70, yellow: 20 };
  if (normalized.includes("professional")) return { green: 60, yellow: 20 };
  if (normalized.includes("conversational")) return { green: 50, yellow: 20 };
  if (normalized.includes("basic")) return { green: 40, yellow: 20 };
  return { green: 55, yellow: 20 };
}

function splitName(fullName) {
  const trimmed = (fullName || "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
}

export default function CVPreview({
  stepNumber,
  stepTitle,
  experienceLevel,
  name,
  jobTitle,
  company,
  email,
  phone,
  address,
  photoPreview,
  summary,
  allSkills,
  experiences,
  educations,
  certifications,
  languages,
  references,
  projects,
  projectBullets,
  careerInterests,
  extraDetails,
  awards,
  activities,
  experienceBullets,
  enhancedCVData,
  loadingEnhancedCV,
  fallbackUsed,
  generateSummary,
  generatePDF,
  loadingPDF,
  next,
  back,
}) {
  const [viewMode, setViewMode] = useState('text'); // 'text' or 'template'
  const [selectedFolder, setSelectedFolder] = useState('Modern');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-standard');
  const templatePreviewRef = useRef(null);
  const [templateScale, setTemplateScale] = useState(1);
  const [supportsZoom, setSupportsZoom] = useState(false);

  const baseExperiences = Array.isArray(experiences) ? experiences : [];
  const normalizedExperiences = baseExperiences.map((exp, idx) => ({
    ...exp,
    __bullets: (experienceBullets[idx] || []).filter((bullet) => (bullet || "").trim()),
  }));
  const displayExperiences = normalizedExperiences.filter((exp) => {
    const hasBullets = exp.__bullets.length > 0;
    const hasText = [exp.company, exp.position, exp.description, exp.location, exp.startDate, exp.endDate]
      .some((value) => (value || "").toString().trim());
    return hasBullets || hasText;
  });
  const displayExperienceBullets = displayExperiences.map((exp) => exp.__bullets);

  const { firstName, lastName } = splitName(name);
  const normalizedEducation = (educations || [])
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
      const name = asText(project?.name || project?.title);
      const role = [project?.role, project?.tools].filter(Boolean).join(' • ');
      const years = asText(project?.year || project?.date);
      const bullets = (projectBullets?.[idx] || []).filter((bullet) => asText(bullet));
      const description = asText(project?.description);
      const finalBullets = bullets.length > 0 ? bullets : (description ? [description] : []);
      if (!name && !role && !years && finalBullets.length === 0) return null;
      return {
        company: name || "Project",
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
      const name = asText(ref?.name);
      const company = asText(ref?.company);
      const phone = asText(ref?.phone);
      const email = asText(ref?.email);
      if (!name && !company && !phone && !email) return null;
      return { name, company, phone, email };
    })
    .filter(Boolean);
  const normalizedLanguages = (languages || [])
    .filter((lang) => lang.name)
    .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ""}`);
  const normalizedSkills = (allSkills || []).filter(Boolean);
  const templateProps = {
    name,
    jobTitle,
    summary,
    phone,
    email,
    website: '',
    address,
    profileImage: photoPreview,
    skills: allSkills.map((skill, idx) => ({
      name: skill,
      rating: 4,
      color: ['#61DAFB', '#F7DF1E', '#339933', '#06B6D4', '#FF6B9D'][idx % 5]
    })),
    educations: educations.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      years: edu.graduationYear || '',
      dotColor: ['bg-green-500', 'bg-blue-500', 'bg-purple-500'][educations.indexOf(edu) % 3]
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
    skills: allSkills.map((skill) => ({ name: skill, rating: 4 })),
    education: educations.map((edu) => ({
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
    education: educations.map((edu) => ({
      years: edu.graduationYear || '',
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: allSkills,
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
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
    education: educations.map((edu) => ({
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      years: edu.graduationYear || '',
    })),
    expertise: allSkills,
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
    skills: allSkills,
    experience: displayExperiences.map((exp, idx) => ({
      company: exp.company,
      years: formatDateRange(exp.startDate, exp.endDate),
      role: exp.position,
      description: bulletsToProse(displayExperienceBullets[idx]) || exp.description || '',
    })),
    education: educations.map((edu) => ({
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
    skills: allSkills.map((skill, idx) => ({
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
    education: educations.map((edu) => ({
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
    education: educations.map((edu) => ({
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      school: edu.school,
      years: edu.graduationYear || '',
    })),
    skills: allSkills,
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
    education: educations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
    })),
    skills: allSkills,
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
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
    skills: allSkills,
    education: educations.map((edu) => ({
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
    skills: allSkills,
    education: educations.map((edu) => ({
      school: edu.school,
      degree: `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      graduated: edu.graduationYear || '',
    })),
    certifications: (certifications || []).filter((cert) => cert.name).map((cert) => cert.name),
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
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
    skills: allSkills,
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
    education: educations.map((edu) => ({
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
    skills: allSkills,
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
    reference: {
      name: primaryReference?.name || '',
      company: `${primaryReference?.company || ''}${primaryReference?.title ? ` / ${primaryReference.title}` : ''}`.trim(),
      phone: primaryReference?.phone || '',
      email: primaryReference?.email || '',
    },
    experience: displayExperiences.map((exp, idx) => {
      const aiBullets = displayExperienceBullets[idx] || [];
      return {
        company: exp.company,
        role: exp.position,
        years: formatDateRange(exp.startDate, exp.endDate),
        bullets: aiBullets,
      };
    }),
    education: educations.map((edu) => ({
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
    education: educations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: allSkills,
    languages: (languages || [])
      .filter((lang) => lang.name)
      .map((lang) => `${lang.name}${lang.level ? ` (${lang.level})` : ''}`),
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
    education: educations.map((edu) => ({
      years: edu.graduationYear || '',
      school: edu.school,
      bullets: [
        `${edu.degree || ''}${edu.field ? ` — ${edu.field}` : ''}`.trim(),
      ].filter(Boolean),
    })),
    skills: allSkills,
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

  const templateRegistry = [
    {
      id: 'modern-geo',
      label: 'Modern Geo',
      description: 'Geometric header with accents',
      folder: 'Modern',
      render: () => <ModernCV1 data={modernCV1Data} />,
    },
    {
      id: 'modern-professional',
      label: 'Modern Professional',
      description: 'Gray header, timeline layout',
      folder: 'Modern',
      render: () => <ProfessionalModernCV data={professionalModernData} />,
    },
    {
      id: 'modern-professional-3',
      label: 'Modern Professional 3',
      description: 'Circle photo, clean columns',
      folder: 'Modern',
      render: () => <ModernProfessionalCV3 data={modernProfessionalCV3Data} />,
    },
    {
      id: 'classic-professional',
      label: 'Classic Professional',
      description: 'Editorial timeline layout',
      folder: 'Classic',
      render: () => <ProfessionalCV data={classicData} />,
    },
    {
      id: 'creative-pink-cute',
      label: 'Pink Cute',
      description: 'Soft pink editorial style',
      folder: 'Creative',
      render: () => <PinkCuteCV data={pinkCuteData} />,
    },
    {
      id: 'creative-memphis-retro-2',
      label: 'Memphis Retro 2',
      description: 'Bold retro browser cards',
      folder: 'Creative',
      render: () => <MemphisRetro2 data={memphisRetro2Data} />,
    },
    {
      id: 'creative-retro-playful',
      label: 'Retro Creative',
      description: 'Playful pastel layout',
      folder: 'Creative',
      render: () => <RetroCreativeCV data={retroCreativeData} />,
    },
    {
      id: 'minimalist-lines',
      label: 'Minimalist 1',
      description: 'White & blue linework',
      folder: 'Minimal',
      render: () => <MinimalistCV1 data={minimalistData} />,
    },
    {
      id: 'minimalist-lines-2',
      label: 'Minimalist 2',
      description: 'Clean White, Spaced-Caps Headings',
      folder: 'Minimal',
      render: () => <MinimalistCV2 data={minimalistCV2Data} />,
    },
    {
      id: 'minimal-gray-red',
      label: 'Gray Red Minimal',
      description: 'Gray & red minimalist',
      folder: 'Minimal',
      render: () => <GrayRedMinimalistCV data={grayRedMinimalistData} />,
    },
    {
      id: 'blue-gray',
      label: 'Blue & Gray',
      description: 'Simple professional design',
      folder: 'Minimal',
      render: () => <BlueGrayTemplate {...templateProps} />,
    },
    {
      id: 'modern-black-blue',
      label: 'Black Blue Modern',
      description: 'Dark modern with purple accents',
      folder: 'Modern',
      render: () => <BlackBlueModernCV data={blackBlueModernData} />,
    },
    {
      id: 'classic-black-grey',
      label: 'Black Grey Classic',
      description: 'Minimal classic in charcoal',
      folder: 'Classic',
      render: () => <BlackGreyClassicCV data={blackGreyClassicData} />,
    },
    {
      id: 'retro-memphis',
      label: 'Retro Memphis',
      description: 'Memphis-inspired layout',
      folder: 'Creative',
      render: () => <MemphisCV data={memphisData} />,
    },
  ];
  const earlyCareerTemplates = [
    {
      id: 'student-minimalist-1',
      label: 'Minimalist Student 1',
      description: 'White & blue lines',
      folder: 'Early Career',
      render: () => <MinimalistStudentCV1 data={minimalistStudentCV1Data} />,
    },
    {
      id: 'student-minimalist-2',
      label: 'Minimalist Student 2',
      description: 'Circle timeline layout',
      folder: 'Early Career',
      render: () => <MinimalistStudentCV2 data={minimalistStudentCV2Data} />,
    },
    {
      id: 'student-blue-gray',
      label: 'Blue Gray Student',
      description: 'Timeline icons layout',
      folder: 'Early Career',
      render: () => <BlueGrayStudentCV data={minimalistStudentCV2Data} />,
    },
    {
      id: 'student-gray-red',
      label: 'Gray Red Student',
      description: 'Split panel, bold badges',
      folder: 'Early Career',
      render: () => <GrayRedStudentCV data={minimalistStudentCV2Data} />,
    },
    {
      id: 'student-modern',
      label: 'Modern Student',
      description: 'Photo circle, italic headings',
      folder: 'Early Career',
      render: () => <ModernStudentCV data={minimalistStudentCV2Data} />,
    },
  ];
  const folders = [...new Set(templateRegistry.map((template) => template.folder))];
  const experienceSections = [
    { level: 'student', label: 'Student PDF Templates', templates: earlyCareerTemplates },
    { level: 'internship', label: 'Intern PDF Templates', templates: earlyCareerTemplates },
    { level: 'entry-level', label: 'Entry-Level PDF Templates', templates: earlyCareerTemplates },
  ];
  const isExperienceLevel = ['student', 'internship', 'entry-level'].includes(experienceLevel);
  const visibleExperienceSections = isExperienceLevel
    ? experienceSections.filter((section) => section.level === experienceLevel)
    : [];
  const specialTemplates = visibleExperienceSections[0]?.templates || [];
  const currentTemplates = isExperienceLevel
    ? specialTemplates
    : templateRegistry.filter((template) => template.folder === selectedFolder);
  const activeTemplate =
    currentTemplates.find((template) => template.id === selectedTemplate) || currentTemplates[0];

  const handleSelectFolder = (folder, templateId) => {
    if (isExperienceLevel) {
      if (templateId) setSelectedTemplate(templateId);
      return;
    }
    setSelectedFolder(folder);
    if (templateId) {
      const matchedTemplate = templateRegistry.find(
        (template) => template.id === templateId && template.folder === folder
      );
      if (matchedTemplate) {
        setSelectedTemplate(matchedTemplate.id);
        return;
      }
    }
    const firstTemplate = templateRegistry.find((template) => template.folder === folder);
    if (firstTemplate) setSelectedTemplate(firstTemplate.id);
  };

  const renderTemplate = () => activeTemplate?.render?.();

  useEffect(() => {
    setSupportsZoom(typeof CSS !== 'undefined' && CSS.supports && CSS.supports('zoom', '1'));
  }, []);

  useEffect(() => {
    if (!templatePreviewRef.current) return;
    const baseWidth = 720;

    const updateScale = () => {
      const containerWidth = templatePreviewRef.current?.clientWidth || baseWidth;
      const available = Math.max(containerWidth - 16, 260);
      const nextScale = Math.min(1, available / baseWidth);
      setTemplateScale(Number(nextScale.toFixed(3)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(templatePreviewRef.current);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [viewMode, selectedTemplate, selectedFolder]);

  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Your CV is ready!</h1>
      <p className="subtitle">Review your CV below and download as PDF.</p>

      {/* View Mode Toggle */}
      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setViewMode('text')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'text' ? colors.accent : colors.card,
            color: viewMode === 'text' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          📄 Text Preview
        </button>
        <button
          onClick={() => setViewMode('template')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'template' ? colors.accent : colors.card,
            color: viewMode === 'template' ? 'white' : colors.text,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          🎨 Styled Template
        </button>
      </div>

      {viewMode === 'text' ? (
        <div style={{ marginTop: 24 }}>
          <div className="preview-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
          {/* CV Preview */}
          <div
            id="cv-preview"
            className="cv-page"
            style={{
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
              fontFamily: "Georgia, serif",
              fontSize: 13,
              lineHeight: 1.6,
              color: colors.text,
              overflow: "auto",
              maxHeight: "600px",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 16, borderBottom: `2px solid ${colors.accent}`, paddingBottom: 16 }}>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Profile"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    marginBottom: 12,
                    border: `2px solid ${colors.accent}`,
                  }}
                />
              )}
              <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>{name || "Your Name"}</div>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 4 }}>
                {jobTitle || "Job Title"} {company ? `at ${company}` : ""}
              </div>
              <div style={{ fontSize: 11, color: colors.muted }}>
                {email && <div>{email}</div>}
                {phone && <div>{phone}</div>}
                {address && <div>{address}</div>}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Professional Summary
                </div>
                <div style={{ marginBottom: 16, fontSize: 12, whiteSpace: "pre-wrap" }}>{summary}</div>
              </>
            )}

            {careerInterests && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Interests & Career Goals
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{careerInterests}</div>
              </>
            )}

            {/* Languages */}
            {languages && languages.some((lang) => lang.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Languages
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {languages
                    .filter((lang) => lang.name)
                    .map((lang) => `${lang.name}${lang.level ? ` — ${lang.level}` : ""}`)
                    .join(", ")}
                </div>
              </>
            )}

            {/* Skills */}
            {(allSkills.length > 0 || (enhancedCVData?.recommendedSkills?.length > 0)) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Skills
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {enhancedCVData?.recommendedSkills?.length > 0 
                    ? enhancedCVData.recommendedSkills.join(", ")
                    : allSkills.join(", ")}
                </div>
              </>
            )}

            {projects && projects.some((project) => project.name || project.description) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Projects / School Work
                </div>
                {projects
                  .filter((project) => project.name || project.description)
                  .map((project, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{project.name || "Project"}</div>
                      <div style={{ fontSize: 11, color: colors.muted }}>
                        {[project.role, project.tools].filter(Boolean).join(" • ")}
                      </div>
                      {projectBullets?.[idx]?.length ? (
                        <ul style={{ marginLeft: 16, marginTop: 4, fontSize: 11 }}>
                          {projectBullets[idx].map((bullet, b) => (
                            <li key={b}>{bullet}</li>
                          ))}
                        </ul>
                      ) : project.description ? (
                        <div style={{ fontSize: 11, marginTop: 4, whiteSpace: "pre-wrap" }}>
                          {project.description}
                        </div>
                      ) : null}
                    </div>
                  ))}
              </>
            )}

            {/* Key Strengths (from enhanced analysis) */}
            {enhancedCVData?.keyStrengths?.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Key Strengths
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {enhancedCVData.keyStrengths.join(" • ")}
                </div>
              </>
            )}

            {/* Experience */}
            {displayExperiences.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Experience
                </div>
                {displayExperiences.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: "bold", fontSize: 12 }}>{exp.position}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>{exp.company}</div>
                    {displayExperienceBullets[idx] && displayExperienceBullets[idx].length > 0 ? (
                      <ul style={{ marginLeft: 16, marginTop: 4, fontSize: 11 }}>
                        {displayExperienceBullets[idx].map((bullet, b) => (
                          <li key={b}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Education
                </div>
                {educations.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: "bold", fontSize: 12 }}>{edu.degree}</div>
                    <div style={{ fontSize: 11, color: colors.muted }}>
                      {edu.school} {edu.graduationYear && `— ${edu.graduationYear}`}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Certifications */}
            {certifications && certifications.some((cert) => cert.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Certifications
                </div>
                {certifications
                  .filter((cert) => cert.name)
                  .map((cert, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{cert.name}</div>
                      <div style={{ fontSize: 11, color: colors.muted }}>
                        {[cert.issuer, cert.year].filter(Boolean).join(" — ")}
                      </div>
                    </div>
                  ))}
              </>
            )}

            {awards && awards.some((award) => award.title) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Awards & Achievements
                </div>
                {awards
                  .filter((award) => award.title)
                  .map((award, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{award.title}</div>
                      <div style={{ fontSize: 11, color: colors.muted }}>
                        {[award.issuer, award.year].filter(Boolean).join(" — ")}
                      </div>
                    </div>
                  ))}
              </>
            )}

            {activities && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Activities & Hobbies
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{activities}</div>
              </>
            )}

            {extraDetails && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  Extra Details
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{extraDetails}</div>
              </>
            )}

            {/* References */}
            {references && references.some((ref) => ref.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.accent }}>
                  References
                </div>
                {references
                  .filter((ref) => ref.name)
                  .map((ref, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{ref.name}</div>
                      <div style={{ fontSize: 11, color: colors.muted }}>
                        {[ref.title, ref.company].filter(Boolean).join(" — ")}
                      </div>
                      <div style={{ fontSize: 11, color: colors.muted }}>
                        {[ref.email, ref.phone].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Controls & Enhanced Insights */}
          <div>
            {loadingEnhancedCV && (
              <div style={{ backgroundColor: colors.accentLight, padding: 20, borderRadius: 8, marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
                  🤖 AI Analysis in Progress...
                </div>
                <div style={{ fontSize: 11, color: colors.muted }}>
                  Analyzing your skills and experience for enhanced recommendations.
                </div>
              </div>
            )}

            {enhancedCVData && (
              <div style={{ backgroundColor: colors.accentLight, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 12 }}>
                  ✨ AI-Enhanced Insights
                </div>
                
                {enhancedCVData.keyStrengths && enhancedCVData.keyStrengths.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: colors.muted, marginBottom: 4 }}>
                      KEY STRENGTHS
                    </div>
                    <div style={{ fontSize: 11, color: colors.text }}>
                      {enhancedCVData.keyStrengths.map((s, i) => (
                        <div key={i}>• {s}</div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedCVData.experienceEnhancements?.keyThemes && enhancedCVData.experienceEnhancements.keyThemes.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: colors.muted, marginBottom: 4 }}>
                      KEY THEMES
                    </div>
                    <div style={{ fontSize: 11, color: colors.text }}>
                      {enhancedCVData.experienceEnhancements.keyThemes.map((t, i) => (
                        <div key={i}>• {t}</div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedCVData.experienceEnhancements?.advice && (
                  <div style={{ fontSize: 10, color: colors.muted, fontStyle: "italic", lineHeight: 1.5 }}>
                    💡 {enhancedCVData.experienceEnhancements.advice}
                  </div>
                )}
              </div>
            )}

            {!enhancedCVData && !loadingEnhancedCV && (
              <div style={{ backgroundColor: colors.accentLight, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: colors.text, marginBottom: 8 }}>
                  <strong>CV Ready!</strong> Your CV has been generated with AI-powered content and professional formatting.
                </div>
                <div style={{ fontSize: 11, color: colors.muted }}>
                  Review the preview on the left, make any edits, then download as PDF.
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: 12, opacity: loadingPDF ? 0.6 : 1 }}
              onClick={generatePDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? "Generating PDF..." : "📥 Download as PDF"}
            </button>
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={back}>
              ← Back to Edit
            </button>
          </div>
        </div>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {fallbackUsed && (
            <div style={{
              backgroundColor: colors.accentLight,
              border: `1px solid ${colors.border}`,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 12,
              color: colors.text,
              marginBottom: 12,
            }}>
              AI fallback key used due to rate-limit or quota limits.
            </div>
          )}
          {/* Template Selector */}
          <TemplateSelector
            experienceSections={visibleExperienceSections}
            hideRegularSelectors={isExperienceLevel}
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={handleSelectFolder}
            templates={currentTemplates}
            selectedTemplate={activeTemplate?.id}
            onSelectTemplate={setSelectedTemplate}
          />

          {/* Template Preview */}
          {isExperienceLevel && currentTemplates.length === 0 ? (
            <div
              className="template-preview"
              style={{
                border: `1px dashed ${colors.border}`,
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                color: colors.muted,
              }}
            >
              No templates yet for this section. Add new templates to see a preview here.
            </div>
          ) : (
            <div className="template-preview" ref={templatePreviewRef}>
              <div
                className="template-scale"
                style={
                  supportsZoom
                    ? { zoom: templateScale }
                    : { transform: `scale(${templateScale})`, transformOrigin: 'top center' }
                }
              >
                <div id="cv-preview" className="cv-page">
                  {renderTemplate()}
                </div>
              </div>
            </div>
          )}

          {/* Download and Back Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ opacity: loadingPDF ? 0.6 : 1 }}
              onClick={generatePDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? "Generating PDF..." : "📥 Download as PDF"}
            </button>
            <button className="btn btn-ghost" onClick={back}>
              ← Back to Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

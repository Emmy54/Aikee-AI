// MinimalistStudentCV1.jsx
// White & Blue Lines Minimalist Resume — Student/Entry-Level Extended
// Includes: Projects, Certification, Award, Reference sections
// Usage: <MinimalistStudentCV1 data={cvData} />

import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "RICHARD",
  lastName: "SANCHEZ",
  title: "M A R K E T I N G   M A N A G E R",
  address: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  email: "hello@reallygreatsite.com",
  profile:
    "I'm a passionate and results-oriented digital marketing strategist with a proven track record of unlocking growth and amplifying brand awareness for small businesses. My diverse skillset spans across multiple marketing disciplines, with a particular expertise in search engine marketing (SEM) and event marketing.",
  education: [
    {
      years: "2029 - 2030",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Master of Business Management"],
    },
    {
      years: "2025 - 2029",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Bachelor of Business - Business Management"],
    },
  ],
  skills: [
    "Project Management", "Public Relations", "Teamwork",
    "Time Management", "Leadership", "Effective Communication",
    "Critical Thinking", "Coaching",
  ],
  languages: [
    "English (Fluent)", "French (Fluent)",
    "German (Basics)", "Spanish (Intermediate)",
  ],
  experience: [
    {
      company: "Borcelle Studio",
      role: "Marketing Manager & Specialist",
      years: "2030 - PRESENT",
      bullets: [
        "Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.",
        "Lead, mentor, and manage a high-performing marketing team, fostering a collaborative and results-driven work environment.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
  ],
  projects: [
    {
      company: "Fauget Studio",
      role: "Marketing Manager & Specialist",
      years: "2029",
      bullets: [
        "Create and manage the marketing budget, ensuring efficient allocation of resources and optimizing ROI.",
        "Oversee market research to identify emerging trends, customer needs, and competitor strategies.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
  ],
  certifications: [
    { company: "Fauget Studio", role: "Marketing Manager & Specialist", years: "2029" },
  ],
  awards: [
    { company: "Fauget Studio", years: "2029" },
  ],
  references: [
    { name: "Estelle Darcy", company: "Wardiere Inc. / CTO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harper Richard", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const NAVY  = "#1e2d4a";
const DARK  = "#1a1a1a";
const MID   = "#555";
const LIGHT = "#888";
const RULE  = NAVY;

// ── Section heading with long horizontal rule ─────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800, fontSize: 14,
          letterSpacing: 3, color: NAVY,
          margin: 0, textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {children}
        </h3>
        <div style={{ flex: 1, height: 2, background: NAVY }} />
      </div>
    </div>
  );
}

// ── Sidebar section heading (short underline) ─────────────
function SideHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800, fontSize: 13,
        letterSpacing: 2.5, color: NAVY,
        margin: "0 0 5px", textTransform: "uppercase",
      }}>
        {children}
      </h3>
      <div style={{ width: 32, height: 2.5, background: NAVY }} />
    </div>
  );
}

// ── Bullet list ───────────────────────────────────────────
function BulletList({ items }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex", alignItems: "flex-start",
          gap: 8, fontSize: 12, color: MID,
          lineHeight: 1.6, marginBottom: 5,
        }}>
          <span style={{ color: NAVY, flexShrink: 0, marginTop: 2 }}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Experience / Project entry ────────────────────────────
function Entry({ company, role, years, bullets }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{company}</span>
        <span style={{ fontSize: 11.5, color: LIGHT }}>{years}</span>
      </div>
      {role && <div style={{ fontSize: 12, color: MID, fontStyle: "italic", marginBottom: 6 }}>{role}</div>}
      {bullets && <BulletList items={bullets} />}
    </div>
  );
}

// ── Simple entry (cert / award — no bullets) ──────────────
function SimpleEntry({ company, role, years }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{company}</span>
        <span style={{ fontSize: 11.5, color: LIGHT }}>{years}</span>
      </div>
      {role && <div style={{ fontSize: 12, color: MID, fontStyle: "italic" }}>{role}</div>}
    </div>
  );
}

export function MinimalistStudentCV1({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    address, website, email,
    profile, education, skills, languages,
    experience, projects, certifications, awards, references,
  } = data;

  const contactItems = [
    { icon: "📍", text: address },
    { icon: "🌐", text: website },
    { icon: "✉", text: email },
  ].filter((item) => item.text);

  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.school || edu.degree || edu.years || (edu.bullets || []).some(Boolean)))
    : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(Boolean) : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeProjects = Array.isArray(projects)
    ? projects.filter((proj) => proj && (proj.company || proj.role || proj.years || (proj.bullets || []).some(Boolean)))
    : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.filter((cert) => cert && (cert.company || cert.role || cert.years))
    : [];
  const safeAwards = Array.isArray(awards)
    ? awards.filter((award) => award && (award.company || award.role || award.years))
    : [];
  const safeReferences = Array.isArray(references)
    ? references.filter((ref) => ref && (ref.name || ref.company || ref.phone || ref.email))
    : [];

  const { sidebar, main, present } = useDynamicSections(
    {
      summary: profile,
      education: safeEducation,
      skills: safeSkills,
      languages: safeLanguages,
      experience: safeExperience,
      projects: safeProjects,
      certifications: safeCertifications,
      awards: safeAwards,
      references: safeReferences,
      address,
      website,
      email,
    },
    {
      sidebar: ["education", "skills", "languages"],
      main: ["experience", "projects", "certifications", "awards", "references"],
      minMain: 1,
    }
  );

  const sectionBlocks = {
    education: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Education</SideHeading>
        <div style={{ marginTop: 12 }}>
          {safeEducation.map((edu, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: MID, marginBottom: 1 }}>{edu.years}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, color: NAVY, marginBottom: 4 }}>{edu.school}</div>
              <BulletList items={edu.bullets || []} />
            </div>
          ))}
        </div>
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Skills</SideHeading>
        <div style={{ marginTop: 10 }}>
          <BulletList items={safeSkills} />
        </div>
      </div>
    ),
    languages: (
      <div>
        <SideHeading>Languages</SideHeading>
        <div style={{ marginTop: 10 }}>
          <BulletList items={safeLanguages} />
        </div>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 20 }}>
        <SectionHeading>Work Experience</SectionHeading>
        {safeExperience.map((exp, i) => <Entry key={i} {...exp} />)}
      </div>
    ),
    projects: (
      <div style={{ marginBottom: 20 }}>
        <SectionHeading>Projects</SectionHeading>
        {safeProjects.map((p, i) => <Entry key={i} {...p} />)}
      </div>
    ),
    certifications: (
      <div style={{ marginBottom: 20 }}>
        <SectionHeading>Certification</SectionHeading>
        {safeCertifications.map((c, i) => <SimpleEntry key={i} {...c} />)}
      </div>
    ),
    awards: (
      <div style={{ marginBottom: 20 }}>
        <SectionHeading>Award</SectionHeading>
        {safeAwards.map((a, i) => <SimpleEntry key={i} {...a} />)}
      </div>
    ),
    references: (
      <div>
        <SectionHeading>Reference</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
          {safeReferences.map((ref, i) => (
            <div key={i} className="pdf-avoid-break">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: NAVY, marginBottom: 2 }}>{ref.name}</div>
              <div style={{ fontSize: 12, color: MID, marginBottom: 5 }}>{ref.company}</div>
              {ref.phone && <div style={{ fontSize: 12, color: DARK, marginBottom: 2 }}><strong>Phone: </strong>{ref.phone}</div>}
              {ref.email && <div style={{ fontSize: 12, color: DARK }}><strong>Email : </strong>{ref.email}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
        .msc1-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="msc1-cv" style={{
        width: 720, minHeight: 1060,
        background: "#fff",
        fontFamily: "'Barlow', sans-serif", color: DARK,
      }}>

        {/* ── HEADER ────────────────────────────────── */}
        <div style={{ background: "#f4f6f9", padding: "32px 48px 22px", textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800, fontSize: 44,
            color: NAVY, margin: "0 0 6px",
            letterSpacing: 2, lineHeight: 1,
          }}>
            {firstName} {lastName}
          </h1>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 400, fontSize: 13,
            color: "#777", letterSpacing: 5, margin: 0,
          }}>{title}</p>
        </div>

        {/* ── CONTACT BAR ───────────────────────────── */}
        <Section show={present.contact}>
          <div style={{
            border: "1.5px solid #c8d0dc",
            margin: "16px 48px",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            padding: "9px 20px",
          }}>
            {contactItems.map((item, i) => (
              <div key={item.icon} className="pdf-avoid-break" style={{
                flex: 1,
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 11.5, color: MID,
                borderLeft: i > 0 ? "1px solid #c8d0dc" : "none",
                paddingLeft: i > 0 ? 18 : 0,
              }}>
                <span style={{ fontSize: 12, color: NAVY }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── PROFILE INFO — full width ──────────────── */}
        <Section show={present.summary}>
          <div style={{ padding: "0 48px 20px" }}>
            <SectionHeading>Profile Info</SectionHeading>
            <p style={{ fontSize: 12.5, color: MID, lineHeight: 1.75, margin: 0, textAlign: "justify" }}>{profile}</p>
          </div>
        </Section>

        {/* ── BODY: sidebar + main ───────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "0 48px 40px", gap: 28 }}>

          {/* LEFT SIDEBAR */}
          <div style={{ borderRight: "1.5px solid #d0d8e4", paddingRight: 22 }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* RIGHT MAIN */}
          <div>
            {main.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

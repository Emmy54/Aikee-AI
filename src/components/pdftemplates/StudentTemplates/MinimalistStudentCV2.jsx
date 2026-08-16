// MinimalistStudentCV2.jsx
// Minimalist CV — Student / Intern / Entry-Level
// Circle + bracket timeline, spaced-caps headings
// Includes: Projects, Certifications, Awards, Reference
// Usage: <MinimalistStudentCV2 data={cvData} />

import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "LAYA",
  lastName: "ABDELRAHMAN",
  title: "Accounting student",
  email: "hello@reallygreatsite.com",
  website: "www.reallygreatsite.com",
  phone: "+123-456-7890",
  address: "123 Anywhere St., Any City",
  summary:
    "Highly motivated and detail-oriented Accounting Professional with strong experience in financial reporting, bookkeeping, and data analysis. Skilled in preparing financial statements, managing accounts payable/receivable, and performing reconciliations with a high level of accuracy. Known for strong analytical thinking, problem-solving abilities, and maintaining compliance with accounting standards.",
  education: [
    { degree: "Bachelor of Business Management", school: "Wardiere University", years: "2016 - 2020" },
    { degree: "Bachelor of Business Management", school: "Wardiere University", years: "2020 - 2023" },
  ],
  skills: [
    "Client Acquisition", "B2B Sales", "Negotiation",
    "Relationship Management", "Market Analysis", "Sales Strategies",
    "Negotiation Skills", "Problem-Solving", "Time Management",
    "Presentation Skills", "Networking", "Market Research",
  ],
  experience: [
    {
      role: "Accounting Executive",
      company: "Timmerman Industries",
      years: "Jan 2024 - Present",
      bullets: [
        "Implemented cost-control measures resulting in a 15% reduction in operational expenses.",
        "Streamlined financial reporting processes, enhancing overall efficiency by 20%.",
      ],
    },
  ],
  projects: [
    {
      role: "Accountant",
      company: "Borcelle Industries",
      years: "Jun 2022 - Jan 2024",
      bullets: [
        "Managed month-end close processes, reducing closing time by 25%.",
        "Implemented a new financial forecasting system, improving accuracy by 18%.",
        "Spearheaded automation, decreasing manual workload by 30%.",
      ],
    },
  ],
  certifications: [
    { role: "Bachelor of Business Management", company: "Wardiere University", years: "2020", bullets: [] },
  ],
  awards: [
    { role: "Bachelor of Business Management", company: "", years: "", bullets: [] },
  ],
  references: [
    { name: "Harumi Kobayashi", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Bailey Dupont", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const DARK  = "#1a1a1a";
const MID   = "#555";
const LIGHT = "#aaa";
const RULE  = "#ddd";

// ── Spaced-caps heading ───────────────────────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600, fontSize: 13,
        letterSpacing: 5, color: DARK,
        textTransform: "uppercase",
        margin: "0 0 6px",
      }}>{children}</h3>
      <div style={{ height: 1.5, background: RULE }} />
    </div>
  );
}

function SideHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600, fontSize: 12,
        letterSpacing: 4, color: DARK,
        textTransform: "uppercase",
        margin: "0 0 5px",
      }}>{children}</h3>
      <div style={{ height: 1.5, background: RULE }} />
    </div>
  );
}

// ── Circle + bracket timeline entry ──────────────────────
function TimelineEntry({ role, company, years, bullets, isLast }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: isLast ? 0 : 20 }}>
      {/* Circle + line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          border: "2px solid #aaa", background: "#fff",
          flexShrink: 0, zIndex: 1, marginTop: 2,
        }} />
        {!isLast && <div style={{ width: 1.5, flex: 1, background: "#ddd", minHeight: 24 }} />}
      </div>
      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Left-bracket block */}
        <div style={{ borderLeft: "2.5px solid #ccc", paddingLeft: 10, marginBottom: 7 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 1 }}>{role}</div>
          {company && <div style={{ fontSize: 12, color: MID }}>{company}</div>}
          {years && <div style={{ fontSize: 11.5, color: LIGHT, marginTop: 1 }}>{years}</div>}
        </div>
        {/* Bullets */}
        {bullets?.length > 0 && (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: MID, lineHeight: 1.65, marginBottom: 5 }}>
                <span style={{ color: DARK, flexShrink: 0, marginTop: 1 }}>•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Thin rule separator ───────────────────────────────────
function ThinRule() {
  return <div style={{ height: 1, background: "#eee", margin: "18px 0" }} />;
}

export function MinimalistStudentCV2({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    email, website, phone, address,
    summary, education, skills,
    experience, projects, certifications, awards, references,
  } = data;

  const contactItems = [
    { icon: "📞", text: phone },
    { icon: "✉", text: email },
    { icon: "🔗", text: website },
    { icon: "📍", text: address },
  ].filter((item) => item.text);

  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.school || edu.degree || edu.years))
    : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeProjects = Array.isArray(projects)
    ? projects.filter((proj) => proj && (proj.company || proj.role || proj.years || (proj.bullets || []).some(Boolean)))
    : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.filter((cert) => cert && (cert.company || cert.role || cert.years || (cert.bullets || []).some(Boolean)))
    : [];
  const safeAwards = Array.isArray(awards)
    ? awards.filter((award) => award && (award.company || award.role || award.years || (award.bullets || []).some(Boolean)))
    : [];
  const safeReferences = Array.isArray(references)
    ? references.filter((ref) => ref && (ref.name || ref.company || ref.phone || ref.email))
    : [];

  const { sidebar, main, present } = useDynamicSections(
    {
      summary,
      education: safeEducation,
      skills: safeSkills,
      experience: safeExperience,
      projects: safeProjects,
      certifications: safeCertifications,
      awards: safeAwards,
      references: safeReferences,
      phone,
      email,
      website,
      address,
    },
    {
      sidebar: ["contact", "education", "skills"],
      main: ["experience", "projects", "certifications", "awards", "references"],
      minMain: 1,
    }
  );

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Contact</SideHeading>
        {contactItems.map(({ icon, text }) => (
          <div key={`${icon} className="pdf-avoid-break"-${text}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 9 }}>
            <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span style={{ fontSize: 12, color: MID, lineHeight: 1.4 }}>{text}</span>
          </div>
        ))}
      </div>
    ),
    education: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Education</SideHeading>
        {safeEducation.map((edu, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 12.5, color: DARK, marginBottom: 1 }}>{edu.degree}</div>
            <div style={{ fontSize: 12, color: MID }}>{edu.school}</div>
            <div style={{ fontSize: 11.5, color: LIGHT, marginTop: 1 }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div>
        <SideHeading>Skills</SideHeading>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {safeSkills.map((s) => (
            <li key={s} style={{ display: "flex", gap: 8, fontSize: 12, color: MID, marginBottom: 6, lineHeight: 1.4 }}>
              <span style={{ color: DARK, fontSize: 14, flexShrink: 0, lineHeight: 1 }}>•</span>{s}
            </li>
          ))}
        </ul>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 22 }}>
        <SectionHeading>Work Experience</SectionHeading>
        {safeExperience.map((exp, i) => (
          <TimelineEntry key={i} {...exp} isLast={i === safeExperience.length - 1} />
        ))}
      </div>
    ),
    projects: (
      <div style={{ marginBottom: 22 }}>
        <SectionHeading>Projects</SectionHeading>
        {safeProjects.map((p, i) => (
          <TimelineEntry key={i} {...p} isLast={i === safeProjects.length - 1} />
        ))}
      </div>
    ),
    certifications: (
      <div style={{ marginBottom: 22 }}>
        <SectionHeading>Certifications</SectionHeading>
        {safeCertifications.map((c, i) => (
          <TimelineEntry key={i} {...c} isLast={i === safeCertifications.length - 1} />
        ))}
      </div>
    ),
    awards: (
      <div style={{ marginBottom: 22 }}>
        <SectionHeading>Awards</SectionHeading>
        {safeAwards.map((a, i) => (
          <TimelineEntry key={i} {...a} isLast={i === safeAwards.length - 1} />
        ))}
      </div>
    ),
    references: (
      <div>
        <SectionHeading>Reference</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 6 }}>
          {safeReferences.map((ref, i) => (
            <div key={i} className="pdf-avoid-break">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: DARK, marginBottom: 2 }}>{ref.name}</div>
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .msc2-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="msc2-cv" style={{
        width: 700, minHeight: 1080,
        background: "#fff",
        fontFamily: "'Jost', sans-serif", color: DARK,
        padding: "44px 48px 48px",
      }}>

        {/* ── NAME HEADER ───────────────────────────── */}
        <div style={{ marginBottom: 4 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700, fontSize: 40,
            color: DARK, margin: "0 0 4px",
            letterSpacing: 4, lineHeight: 1,
          }}>
            {firstName} {lastName}
          </h1>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 14, color: MID, letterSpacing: 2 }}>{title}</div>
        </div>

        {/* Double rule */}
        <div style={{ margin: "14px 0 22px" }}>
          <div style={{ height: 2.5, background: DARK, marginBottom: 3 }} />
          <div style={{ height: 1, background: DARK }} />
        </div>

        {/* ── CAREER SUMMARY — full width ───────────── */}
        <Section show={present.summary}>
          <div style={{ marginBottom: 24 }}>
            <SectionHeading>Career Summary</SectionHeading>
            <p style={{ fontSize: 12.5, color: MID, lineHeight: 1.75, margin: 0, textAlign: "justify" }}>{summary}</p>
          </div>
        </Section>

        {present.summary && <ThinRule />}

        {/* ── BODY: sidebar + main ───────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 36 }}>

          {/* LEFT SIDEBAR */}
          <div>
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

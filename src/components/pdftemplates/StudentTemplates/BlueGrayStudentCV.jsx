// BlueGrayStudentCV.jsx
// Blue & Gray Simple Student Resume
// Timeline icons + Projects, Certification sections
// Usage: <BlueGrayStudentCV data={cvData} />

import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "AHMDD",
  lastName: "SAAH",
  title: "MARKETING MANAGER",
  phone: "+124-4236-7894",
  email: "hello@ahmedd saaahh.com",
  address: "123fdfdgdg., Any City",
  website: "www.ahmedd saaahh.com",
  profile:
    '"Neimo ensiont est atem Aham ipsum, finifam imbo sido. Intum lumina parco regia Aham extra mola idis. Commodo Aham antepor yumo finiam carius, domus serim lacur Aham. Mauris solitudo Aham in albaidis, ceras vita Aham elit exidio leo, adipisci sector elit."',
  skills: [
    "Strategic Planning", "Problem Solving", "Crisis Management",
    "Creative Thinking", "Data Analysis", "Brand Development",
    "Negotiation", "Customer Orientation", "Adaptability to Change",
  ],
  languages: ["English (Fluent)"],
  references: [
    { name: "Estelle Darcy", company: "Wardiere Inc. / CTO", phone: "+124-4236-7894", email: "hello@ahmedd saaahh.com" },
    { name: "Estelle Darcy", company: "Wardiere Inc. / CTO", phone: "+124-4236-7894", email: "hello@ahmedd saaahh.com" },
  ],
  experience: [
    {
      company: "Borcelle Studio",
      role: "Marketing Manager & Specialist",
      years: "2030 - PRESENT",
      bullets: [
        "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives.",
        "Guide, inspire, and oversee a dynamic marketing team, promoting a collaborative and performance-oriented culture.",
        "Ensure uniformity of the brand across all marketing platforms and materials.",
      ],
    },
  ],
  projects: [
    {
      company: "Studio Shodwe",
      role: "Marketing Manager & Specialist",
      years: "2024 - 2025",
      bullets: [
        "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives.",
        "Guide, inspire, and oversee a dynamic marketing team, promoting a collaborative and performance-oriented culture.",
        "Ensure uniformity of the brand across all marketing platforms and materials.",
      ],
    },
  ],
  education: [
    { degree: "Master of Business Management", school: "School of business | Wardiere University", years: "2029 - 2031" },
  ],
  certifications: [
    { degree: "Master of Business Management", school: "School of business | Wardiere University", years: "2029 - 2031" },
  ],
};

const NAVY  = "#1a2e4a";
const DARK  = "#111";
const MID   = "#555";
const LIGHT = "#888";
const WHITE = "#fff";

// ── Sidebar section heading ───────────────────────────────
function SideHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Raleway', sans-serif", fontWeight: 800,
        fontSize: 13, letterSpacing: 2, color: NAVY,
        textTransform: "uppercase", margin: "0 0 5px",
      }}>{children}</h3>
      <div style={{ height: 1.5, background: NAVY }} />
    </div>
  );
}

// ── Main section heading with long rule ───────────────────
function MainHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{
        fontFamily: "'Raleway', sans-serif", fontWeight: 800,
        fontSize: 14, letterSpacing: 2.5, color: DARK,
        textTransform: "uppercase", margin: "0 0 6px",
      }}>{children}</h3>
      <div style={{ height: 1.5, background: "#ddd" }} />
    </div>
  );
}

// ── Timeline icon node ────────────────────────────────────
function TimelineIcon({ icon }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%",
      background: NAVY, display: "flex",
      alignItems: "center", justifyContent: "center",
      color: WHITE, fontSize: 15, flexShrink: 0, zIndex: 2,
    }}>{icon}</div>
  );
}

// ── Entry with bullets ────────────────────────────────────
function Entry({ company, role, years, bullets }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{company}</span>
        <span style={{ fontSize: 11.5, color: LIGHT }}>{years}</span>
      </div>
      {role && <div style={{ fontSize: 12, color: MID, fontStyle: "italic", marginBottom: 6 }}>{role}</div>}
      {bullets?.map((b, i) => (
        <div key={i} className="pdf-avoid-break" style={{ display: "flex", gap: 7, fontSize: 12, color: MID, lineHeight: 1.6, marginBottom: 4 }}>
          <span style={{ color: NAVY, flexShrink: 0 }}>•</span><span>{b}</span>
        </div>
      ))}
    </div>
  );
}

// ── Education / Cert simple entry ─────────────────────────
function EduEntry({ degree, school, years }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{degree}</span>
        <span style={{ fontSize: 11.5, color: LIGHT }}>{years}</span>
      </div>
      <div style={{ fontSize: 12, color: MID }}>{school}</div>
    </div>
  );
}

export function BlueGrayStudentCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    phone, email, address, website,
    profile, skills, languages, references,
    experience, projects, education, certifications,
  } = data;

  const contactItems = [
    { icon: "📞", text: phone },
    { icon: "✉", text: email },
    { icon: "📍", text: address },
    { icon: "🌐", text: website },
  ].filter((item) => item.text);

  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(Boolean) : [];
  const safeReferences = Array.isArray(references)
    ? references.filter((ref) => ref && (ref.name || ref.company || ref.phone || ref.email))
    : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeProjects = Array.isArray(projects)
    ? projects.filter((proj) => proj && (proj.company || proj.role || proj.years || (proj.bullets || []).some(Boolean)))
    : [];
  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.degree || edu.school || edu.years))
    : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.filter((cert) => cert && (cert.degree || cert.school || cert.years))
    : [];

  const { sidebar, main, present } = useDynamicSections(
    {
      summary: profile,
      contact: contactItems,
      skills: safeSkills,
      languages: safeLanguages,
      references: safeReferences,
      experience: safeExperience,
      projects: safeProjects,
      education: safeEducation,
      certifications: safeCertifications,
    },
    {
      sidebar: ["contact", "skills", "languages", "references"],
      main: ["summary", "experience", "projects", "education", "certifications"],
      minMain: 1,
      checks: {
        contact: () => contactItems.length > 0,
      },
    }
  );

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Contact</SideHeading>
        <div style={{ marginTop: 12 }}>
          {contactItems.map(({ icon, text }) => (
            <div key={`${icon} className="pdf-avoid-break"-${text}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: NAVY, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <span style={{ fontSize: 12, color: MID, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Skills</SideHeading>
        <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
          {safeSkills.map((s) => (
            <li key={s} style={{ display: "flex", gap: 7, fontSize: 12, color: MID, marginBottom: 6, lineHeight: 1.4 }}>
              <span style={{ color: NAVY }}>•</span>{s}
            </li>
          ))}
        </ul>
      </div>
    ),
    languages: (
      <div style={{ marginBottom: 24 }}>
        <SideHeading>Languages</SideHeading>
        <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
          {safeLanguages.map((l) => (
            <li key={l} style={{ display: "flex", gap: 7, fontSize: 12, color: MID, marginBottom: 6 }}>
              <span style={{ color: NAVY }}>•</span>{l}
            </li>
          ))}
        </ul>
      </div>
    ),
    references: (
      <div>
        <SideHeading>Reference</SideHeading>
        <div style={{ marginTop: 10 }}>
          {safeReferences.map((ref, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{ref.name}</div>
              <div style={{ fontSize: 12, color: MID, marginBottom: 4 }}>{ref.company}</div>
              {ref.phone && <div style={{ fontSize: 11.5, color: DARK }}><strong>Phone:</strong> {ref.phone}</div>}
              {ref.email && <div style={{ fontSize: 11.5, color: DARK }}><strong>Email :</strong> {ref.email}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    summary: (
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <TimelineIcon icon="👤" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <MainHeading>Profile</MainHeading>
          <p style={{ fontSize: 12.5, color: MID, lineHeight: 1.7, margin: 0 }}>{profile}</p>
        </div>
      </div>
    ),
    experience: (
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <TimelineIcon icon="💼" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <MainHeading>Work Experience</MainHeading>
          {safeExperience.map((exp, i) => <Entry key={i} {...exp} />)}
        </div>
      </div>
    ),
    projects: (
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <TimelineIcon icon="🗂️" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <MainHeading>Projects</MainHeading>
          {safeProjects.map((p, i) => <Entry key={i} {...p} />)}
        </div>
      </div>
    ),
    education: (
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <TimelineIcon icon="🎓" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <MainHeading>Education</MainHeading>
          {safeEducation.map((e, i) => <EduEntry key={i} {...e} />)}
        </div>
      </div>
    ),
    certifications: (
      <div style={{ display: "flex", gap: 20, marginBottom: 0 }}>
        <TimelineIcon icon="📜" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <MainHeading>Certification</MainHeading>
          {safeCertifications.map((c, i) => <EduEntry key={i} {...c} />)}
        </div>
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        .bgsc-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="bgsc-cv" style={{ width: 720, minHeight: 1060, background: WHITE, fontFamily: "'Lato', sans-serif", color: DARK }}>

        {/* ── HEADER ──────────────────────────────────── */}
        <div style={{ padding: "36px 48px 20px" }}>
          <h1 style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 800, fontSize: 40, color: NAVY, margin: "0 0 4px", letterSpacing: 0.5, lineHeight: 1 }}>
            {firstName} {lastName}
          </h1>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500, fontSize: 13, color: MID, letterSpacing: 3, margin: "0 0 14px" }}>{title}</p>
          <div style={{ height: 3, background: NAVY, marginBottom: 2 }} />
          <div style={{ height: 1, background: "#b0bec5" }} />
        </div>

        {/* ── BODY ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "0 0 40px" }}>

          {/* LEFT SIDEBAR */}
          <div style={{ padding: "20px 24px 0 48px" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* RIGHT MAIN with timeline */}
          <div style={{ padding: "20px 44px 0 0" }}>

            {/* Timeline container */}
            <div style={{ position: "relative" }}>
              {/* Vertical connector line */}
              <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 2, background: "#dde3ed", zIndex: 0 }} />

              {main.map((key) => (
                <Section key={key} show>
                  {sectionBlocks[key]}
                </Section>
              ))}

              {/* Bottom timeline dot */}
              {main.length > 0 && (
                <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "center", width: 34 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#dde3ed", border: "2px solid #b0bec5" }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

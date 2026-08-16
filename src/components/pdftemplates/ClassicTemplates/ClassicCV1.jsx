// ClassicCV1.jsx
// Blue & Gray Simple Professional CV Template
// Faithfully recreated from uploaded PDF design
// Usage: <ClassicCV1 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

// ── Default sample data (mirrors the PDF) ─────────────────
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
    "Strategic Planning",
    "Problem Solving",
    "Crisis Management",
    "Creative Thinking",
    "Data Analysis",
    "Brand Development",
    "Negotiation",
    "Customer Orientation",
    "Adaptability to Change",
  ],
  languages: ["English (Fluent)"],
  reference: [
    {
      name: "Estelle Darcy",
      company: "Wardiere Inc. / CTO",
      phone: "+124-4236-7894",
      email: "hello@ahmedd saaahh.com",
    },
    {
      name: "Estelle Darcy",
      company: "Wardiere Inc. / CTO",
      phone: "+124-4236-7894",
      email: "hello@ahmedd saaahh.com",
    }
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
    {
      company: "Fauget Studio",
      role: "Marketing Manager & Specialist",
      years: "2025 - 2029",
      bullets: [
        '"Neimo ensiont est atem Aham ipsum, finifam imbo sido. Intum lumina parco regia Aham extra mola idis. Commodo Aham antepor yumo finiam carius, domus serim lacur Aham. Mauris solitudo Aham in albaidis, ceras vita Aham elit exidio leo, adipisci sector elit."',
      ],
    },
    {
      company: "Studio Shodwe",
      role: "Marketing Manager & Specialist",
      years: "2024 - 2025",
      bullets: [
        "Formulate and implement detailed marketing strategies and initiatives that support the company's mission and objectives. Guide, inspire, and oversee a dynamic marketing team, promoting a collaborative and performance-oriented culture. Ensure uniformity of the brand across all marketing platforms and materials.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Business Management",
      school: "School of business | Wardiere University",
      years: "2029 - 2031",
    },
  ],
};

// ── Timeline node icons ───────────────────────────────────
function TimelineIcon({ icon }) {
  return (
    <div style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#1a2e4a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 16,
      flexShrink: 0,
      zIndex: 2,
      position: "relative",
    }}>
      {icon}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: 3,
        color: "#1a2e4a",
        margin: "0 0 6px 0",
        textTransform: "uppercase",
      }}>
        {children}
      </h3>
      <div style={{ height: 2, background: "#1a2e4a", width: "100%" }} />
    </div>
  );
}

// ── Sidebar section heading ────────────────────────────────
function SidebarHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: 2.5,
        color: "#1a2e4a",
        margin: "0 0 5px 0",
        textTransform: "uppercase",
      }}>
        {children}
      </h3>
      <div style={{ height: 1.5, background: "#1a2e4a", width: "100%" }} />
    </div>
  );
}

// ── Contact row ───────────────────────────────────────────
function ContactItem({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: "#1a2e4a", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 12, color: "#333", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function ProfessionalCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    phone, email, address, website,
    profile, skills, languages, reference = {},
    experience, education,
  } = data;
  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(Boolean) : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.school || edu.degree || edu.years || (edu.bullets || []).some(Boolean)))
    : [];
  const hasReference = !!(reference.name || reference.company || reference.phone || reference.email);

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 24 }}>
        <SidebarHeading>Contact</SidebarHeading>
        <div style={{ marginTop: 12 }}>
          <ContactItem icon="📞" text={phone} />
          <ContactItem icon="✉" text={email} />
          <ContactItem icon="📍" text={address} />
          <ContactItem icon="🌐" text={website} />
        </div>
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 24 }}>
        <SidebarHeading>Skills</SidebarHeading>
        <ul style={{ marginTop: 10 }}>
          {safeSkills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    ),
    languages: (
      <div style={{ marginBottom: 24 }}>
        <SidebarHeading>Languages</SidebarHeading>
        <ul style={{ marginTop: 10 }}>
          {safeLanguages.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    ),
    reference: (
      <div style={{ marginBottom: 24 }}>
        <SidebarHeading>Reference</SidebarHeading>
        <div style={{ marginTop: 10 }}>
          {reference.name && (
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a2e4a", marginBottom: 2 }}>
              {reference.name}
            </div>
          )}
          {reference.company && (
            <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
              {reference.company}
            </div>
          )}
          {reference.phone && (
            <div style={{ fontSize: 12, color: "#333", marginBottom: 2 }}>
              <strong>Phone: </strong>{reference.phone}
            </div>
          )}
          {reference.email && (
            <div style={{ fontSize: 12, color: "#333" }}>
              <strong>Email : </strong>{reference.email}
            </div>
          )}
        </div>
      </div>
    ),
    profile: (
      <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
        <TimelineIcon icon="👤" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <SectionHeading>Profile</SectionHeading>
          <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.7, margin: 0 }}>
            {profile}
          </p>
        </div>
      </div>
    ),
    experience: (
      <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
        <TimelineIcon icon="💼" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <SectionHeading>Work Experience</SectionHeading>
          {safeExperience.map((exp, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: i < safeExperience.length - 1 ? 18 : 0 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 2,
              }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#1a2e4a",
                }}>
                  {exp.company}
                </span>
                <span style={{
                  fontSize: 11.5,
                  color: "#888",
                  fontWeight: 400,
                  letterSpacing: 0.3,
                }}>
                  {exp.years}
                </span>
              </div>
              <div style={{
                fontSize: 12,
                color: "#555",
                fontStyle: "italic",
                marginBottom: 7,
              }}>
                {exp.role}
              </div>
              <ul>
                {(exp.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
    education: (
      <div style={{ display: "flex", gap: 20 }}>
        <TimelineIcon icon="🎓" />
        <div style={{ flex: 1, paddingTop: 4 }}>
          <SectionHeading>Education</SectionHeading>
          {safeEducation.map((edu, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: 12 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 2,
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#1a2e4a" }}>
                  {edu.school}
                </span>
                <span style={{ fontSize: 11.5, color: "#888", letterSpacing: 0.3 }}>
                  {edu.years}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 5 }}>
                {edu.degree}
              </div>
              <ul>
                {(edu.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar = [], main = [] } = useDynamicSections(
    {
      phone,
      email,
      address,
      website,
      skills: safeSkills,
      languages: safeLanguages,
      reference,
      profile,
      experience: safeExperience,
      education: safeEducation,
    },
    {
      sidebar: ["contact", "skills", "languages", "reference"],
      main: ["profile", "experience", "education"],
      minMain: 2,
      checks: { reference: () => hasReference },
    }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap');
        .pro-cv * { box-sizing: border-box; }
        .pro-cv ul { margin: 0; padding: 0; list-style: none; }
        .pro-cv li::before { content: "•"; margin-right: 8px; color: #1a2e4a; }
        .pro-cv li { display: flex; align-items: flex-start; font-size: 12px; color: #333; line-height: 1.55; margin-bottom: 5px; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div
        className="pro-cv"
        style={{
          width: 720,
          minHeight: 1020,
          background: "#fff",
          fontFamily: "'Lato', sans-serif",
          color: "#222",
        }}
      >
        {/* ── TOP HEADER ─────────────────────────────────── */}
        <div style={{ padding: "36px 48px 20px" }}>
          <h1 style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 800,
            fontSize: 42,
            color: "#1a2e4a",
            margin: "0 0 4px 0",
            letterSpacing: 1,
            lineHeight: 1,
          }}>
            {firstName} {lastName}
          </h1>
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            color: "#555",
            letterSpacing: 3,
            margin: "0 0 14px 0",
          }}>
            {title}
          </p>
          {/* Thick rule under header */}
          <div style={{ height: 3, background: "#1a2e4a", marginBottom: 2 }} />
          <div style={{ height: 1, background: "#b0bec5", marginBottom: 0 }} />
        </div>

        {/* ── BODY: sidebar + main ───────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", padding: "0 0 40px" }}>

          {/* ── LEFT SIDEBAR ─────────────────────────────── */}
          <div style={{ padding: "24px 24px 0 48px", borderRight: "none" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT MAIN CONTENT ──────────────────────── */}
          <div style={{ padding: "24px 44px 0 0" }}>

            {/* Timeline vertical line container */}
            <div style={{ position: "relative" }}>

              {/* Continuous vertical line */}
              <div style={{
                position: "absolute",
                left: 17,
                top: 0,
                bottom: 0,
                width: 2,
                background: "#d0d7e0",
                zIndex: 0,
              }} />

              {/* ── PROFILE ─────────────────────────── */}
              {main.map((key) => (
                <Section key={key} show>
                  {sectionBlocks[key]}
                </Section>
              ))}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Demo wrapper ──────────────────────────────────────────
export default function App() {
  const [zoom, setZoom] = useState(0.85);

  return (
    <div style={{
      background: "#e8edf3",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 20px",
      gap: 20,
    }}>
      {/* Zoom controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#666", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            style={{
              background: zoom === z ? "#1a2e4a" : "#fff",
              color: zoom === z ? "#fff" : "#555",
              border: "1px solid #ccd4de",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>

      {/* CV preview */}
      <div style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        marginBottom: zoom < 1 ? -(1020 * (1 - zoom)) : 0,
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        <ClassicCV1 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

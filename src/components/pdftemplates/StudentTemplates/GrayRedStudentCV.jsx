// GrayRedStudentCV.jsx
// Gray & Red Minimalist Student CV — with Project section
// Usage: <GrayRedStudentCV data={cvData} />

import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "JAMIE",
  lastName: "CHASTAIN",
  title: "MARKETING MANAGER",
  photo: null,
  phone: "123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  profile:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ultricies sagittis diam eget vulputate. Proin vitae iaculis augue. Nam in mi sit amet felis auctor iaculis sed in mauris. Nulla egestas justo vel urna gravida.",
  skills: [
    "Project Management Skills", "Digital Marketing", "Negotiation",
    "Critical Thinking", "Active Listening", "Communication Skills",
  ],
  education: [
    { level: "SECONDARY SCHOOL", school: "Really Great High School", years: "2013 - 2017" },
    { level: "BACHELOR OF TECHNOLOGY", school: "Really Great University", years: "2017 - 2019" },
  ],
  experience: [
    {
      role: "MARKETING MANAGER",
      company: "Warner Company",
      years: "2021 - Present",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Mauris ultricies sagittis diam eget vulputate. Proin vitae iaculis augue.",
        "Nam in mi sit amet felis auctor iaculis sed in mauris.",
      ],
    },
  ],
  projects: [
    {
      role: "SOCIAL MEDIA MARKETING",
      company: "Borcelle Company",
      years: "2019 - 2021",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Mauris ultricies sagittis diam eget vulputate. Proin vitae iaculis augue.",
        "Nam in mi sit amet felis auctor iaculis sed in mauris.",
      ],
    },
  ],
};

const RED   = "#d62828";
const GRAY  = "#e8e5e0";
const LGRAY = "#f2efeb";
const DARK  = "#1a1a1a";
const MID   = "#555";
const WHITE = "#fff";

// ── Red pill badge section heading ────────────────────────
function RedBadge({ children }) {
  return (
    <div style={{
      background: RED, color: WHITE,
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 700, fontSize: 13,
      letterSpacing: 1.5,
      padding: "7px 18px",
      borderRadius: "4px 4px 4px 0",
      marginBottom: 14,
      display: "inline-block",
    }}>
      {children}
    </div>
  );
}

// ── Bullet entry ──────────────────────────────────────────
function Entry({ role, company, years, bullets }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: DARK, letterSpacing: 0.3, marginBottom: 1 }}>{role}</div>
      <div style={{ fontSize: 12, color: MID }}>{company}</div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 7 }}>{years}</div>
      {bullets?.map((b, i) => (
        <div key={i} className="pdf-avoid-break" style={{ display: "flex", gap: 8, fontSize: 12, color: MID, lineHeight: 1.6, marginBottom: 4 }}>
          <span style={{ color: RED, flexShrink: 0 }}>•</span><span>{b}</span>
        </div>
      ))}
    </div>
  );
}

export function GrayRedStudentCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, email, address,
    profile, skills, education,
    experience, projects,
  } = data;

  const contactItems = [
    { icon: "📞", text: phone },
    { icon: "✉", text: email },
    { icon: "📍", text: address },
  ].filter((item) => item.text);

  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.level || edu.school || edu.years))
    : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeProjects = Array.isArray(projects)
    ? projects.filter((proj) => proj && (proj.company || proj.role || proj.years || (proj.bullets || []).some(Boolean)))
    : [];

  const { sidebar, main, present } = useDynamicSections(
    {
      summary: profile,
      contact: contactItems,
      skills: safeSkills,
      education: safeEducation,
      experience: safeExperience,
      projects: safeProjects,
    },
    {
      sidebar: ["summary", "skills", "education"],
      main: ["contact", "experience", "projects"],
      minMain: 1,
      checks: {
        contact: () => contactItems.length > 0,
      },
    }
  );

  const sectionBlocks = {
    summary: (
      <div style={{ marginBottom: 20 }}>
        <RedBadge>PROFILE</RedBadge>
        <p style={{ fontSize: 12, color: MID, lineHeight: 1.7, margin: 0 }}>{profile}</p>
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 20 }}>
        <RedBadge>SKILLS</RedBadge>
        {safeSkills.map((s) => (
          <div key={s} className="pdf-avoid-break" style={{ fontSize: 12.5, color: DARK, marginBottom: 7, paddingLeft: 2 }}>{s}</div>
        ))}
      </div>
    ),
    education: (
      <div>
        <RedBadge>EDUCATION</RedBadge>
        {safeEducation.map((e, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: DARK }}>{e.level}</div>
            <div style={{ fontSize: 12, color: MID }}>{e.school}</div>
            <div style={{ fontSize: 11.5, color: "#999" }}>{e.years}</div>
          </div>
        ))}
      </div>
    ),
    contact: (
      <div style={{ marginBottom: 20 }}>
        <RedBadge>CONTACT</RedBadge>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {contactItems.map(({ icon, text }) => (
            <div key={`${icon} className="pdf-avoid-break"-${text}`} style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 12.5, color: DARK }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 20 }}>
        <RedBadge>EXPERIENCE</RedBadge>
        {safeExperience.map((exp, i) => <Entry key={i} {...exp} />)}
      </div>
    ),
    projects: (
      <div>
        <RedBadge>PROJECT</RedBadge>
        {safeProjects.map((p, i) => <Entry key={i} {...p} />)}
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
        .grsc-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="grsc-cv" style={{ width: 680, minHeight: 980, background: GRAY, fontFamily: "'Barlow', sans-serif", color: DARK }}>

        {/* ── HEADER ──────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 220 }}>
          {/* Photo square */}
          <div style={{ background: "#bbb", overflow: "hidden" }}>
            {photo ? (
              <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <div style={{ width: "100%", height: 220, background: "linear-gradient(160deg,#a8a8a8,#888)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="70" height="70" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.4)" /><ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.4)" /></svg>
              </div>
            )}
          </div>
          {/* Name */}
          <div style={{ background: WHITE, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 50, color: DARK, margin: "0 0 6px", lineHeight: 0.95, letterSpacing: 1 }}>
              {firstName}<br />{lastName}
            </h1>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 14, letterSpacing: 4, color: "#777" }}>{title}</div>
          </div>
        </div>

        {/* ── BODY ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 720 }}>

          {/* LEFT SIDEBAR */}
          <div style={{ background: LGRAY, padding: "24px 20px 28px" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* RIGHT MAIN */}
          <div style={{ background: WHITE, padding: "24px 28px" }}>
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

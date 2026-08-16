// GrayRedMinimalistCV.jsx
// Gray & Red Minimalist Professional Marketing Manager CV Template
// Usage: <GrayRedMinimalistCV data={cvData} />

import { useState } from "react";
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
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ultricies sagittis diam eget vulputate. Proin vitae iaculis augue. Nam in mi sit amet felis auctor iaculis sed in mauris. Nulla egestas justo vel urna gravida.",
  skills: ["Project Management Skills", "Digital Marketing", "Negotiation", "Critical Thinking", "Active Listening", "Communication Skills"],
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
    {
      role: "SOCIAL MEDIA MARKETING",
      company: "Borcelle Company",
      years: "2019 - 2021",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Mauris ultricies sagittis diam eget vulputate. Proin vitae iaculis augue.",
        "Nam in mi sit amet felis auctor iaculis sed in mauris.",
        "Nulla egestas justo vel urna gravida sagittis.",
        "Nam tincidunt tortor quis ante feugiat aliquam.",
      ],
    },
  ],
};

const RED    = "#d62828";
const GRAY   = "#e8e5e0";
const DARK   = "#1a1a1a";
const WHITE  = "#fff";
const LGRAY  = "#f2efeb";

function RedBadge({ children }) {
  return (
    <div style={{ background: RED, color: WHITE, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1.5, padding: "7px 18px", borderRadius: "4px 4px 4px 0", marginBottom: 14, display: "inline-block" }}>
      {children}
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <RedBadge>{title}</RedBadge>
      {children}
    </div>
  );
}

export function GrayRedMinimalistCV({ data = DEFAULT_DATA }) {
  const { firstName, lastName, title, photo, phone, email, address, profile, skills, education, experience } = data;

  const sectionBlocks = {
    profile: (
      <SideSection title="PROFILE">
        <p style={{ fontSize: 12, color: "#444", lineHeight: 1.7, margin: 0 }}>{profile}</p>
      </SideSection>
    ),
    skills: (
      <SideSection title="SKILLS">
        {skills.map(s => <div key={s} className="pdf-avoid-break" style={{ fontSize: 12.5, color: DARK, marginBottom: 7, paddingLeft: 2 }}>{s}</div>)}
      </SideSection>
    ),
    education: (
      <SideSection title="EDUCATION">
        {education.map((e, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: DARK }}>{e.level}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{e.school}</div>
            <div style={{ fontSize: 11.5, color: "#999" }}>{e.years}</div>
          </div>
        ))}
      </SideSection>
    ),
    contact: (
      <div style={{ marginBottom: 20 }}>
        <RedBadge>CONTACT</RedBadge>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[{ icon: "📞", t: phone }, { icon: "✉", t: email }, { icon: "📍", t: address }].filter(({ t }) => t).map(({ icon, t }) => (
            <div key={t} className="pdf-avoid-break" style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 12.5, color: DARK }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{icon}</div>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    experience: (
      <>
        <RedBadge>EXPERIENCE</RedBadge>
        {experience.map((exp, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: DARK, letterSpacing: 0.5, marginBottom: 1 }}>{exp.role}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 7 }}>{exp.company}<br />{exp.years}</div>
            {exp.bullets.map((b, j) => (
              <div key={j} className="pdf-avoid-break" style={{ display: "flex", gap: 8, fontSize: 12, color: "#333", lineHeight: 1.6, marginBottom: 4 }}>
                <span style={{ color: RED, flexShrink: 0 }}>•</span><span>{b}</span>
              </div>
            ))}
          </div>
        ))}
      </>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { profile, skills, education, phone, email, address, experience },
    { sidebar: ["profile", "skills", "education"], main: ["contact", "experience"], minMain: 1 }
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap'); .grm-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>
      <div className="grm-cv" style={{ width: 680, minHeight: 980, background: GRAY, fontFamily: "'Barlow', sans-serif", color: DARK }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 220 }}>
          {/* Photo square */}
          <div style={{ background: "#ccc", overflow: "hidden" }}>
            {photo ? (
              <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <div style={{ width: "100%", height: 220, background: "linear-gradient(160deg,#aaa,#888)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="70" height="70" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.4)" /><ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.4)" /></svg>
              </div>
            )}
          </div>
          {/* Name area */}
          <div style={{ background: WHITE, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 50, color: DARK, margin: "0 0 6px", lineHeight: 0.95, letterSpacing: 1 }}>
              {firstName}<br />{lastName}
            </h1>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 14, letterSpacing: 4, color: "#777" }}>{title}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 700 }}>
          {/* Sidebar */}
          <div style={{ background: LGRAY, padding: "24px 20px 28px" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* Main */}
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

export default function App() {
  const [zoom, setZoom] = useState(0.85);
  return (
    <div style={{ background: "#d8d4ce", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.75, 0.85, 1].map(z => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? RED : WHITE, color: zoom === z ? WHITE : DARK, border: "1px solid #bbb", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(980 * (1 - zoom)) : 0, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <GrayRedMinimalistCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

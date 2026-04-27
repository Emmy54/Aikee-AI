// BlackGreyClassicCV.jsx
// Black Grey Simple Minimal Classic Professional CV Template
// Usage: <BlackGreyClassicCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "Jamie",
  lastName: "CHASTAIN",
  firstNameScript: "Jamie",
  title: "P R O J E C T   M A N A G E R",
  photo: null,
  phone: "123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  profile: "I am a qualified and professional web developer with five years of experience in database administration and website design. Strong creative and analytical skills. Team player with an eye for detail.",
  skills: ["Web Design", "Design Thinking", "Wireframe Creation", "Front End Coding", "Problem-Solving", "Computer Literacy", "Project Management Tools", "Strong Communication"],
  languages: ["English", "Spanish"],
  education: [
    { level: "SECONDARY SCHOOL", school: "Really Great High School", years: "2010 - 2014" },
    { level: "BACHELOR OF TECHNOLOGY", school: "Really Great University", years: "2014 - 2016" },
  ],
  experience: [
    {
      role: "APPLICATIONS DEVELOPER",
      company: "Really Great Company",
      years: "2016 - Present",
      bullets: ["Database administration and website design", "Built the logic for a streamlined ad-serving platform that scaled", "Educational institutions and online classroom management"],
    },
    {
      role: "WEB CONTENT MANAGER",
      company: "Really Great Company",
      years: "2014 - 2016",
      bullets: ["Database administration and website design", "Built the logic for a streamlined ad-serving platform that scaled", "Educational institutions and online classroom management"],
    },
    {
      role: "ANALYSIS CONTENT",
      company: "Really Great Company",
      years: "2010 - 2014",
      bullets: ["Database administration and website design", "Built the logic for a streamlined ad-serving platform that scaled", "Educational institutions and online classroom management"],
    },
    {
      role: "WEB CONTENT MANAGER",
      company: "Really Great Company",
      years: "2004 - 2010",
      bullets: ["Database administration and website design", "Built the logic for a streamlined ad-serving platform that scaled", "Educational institutions and online classroom management"],
    },
  ],
};

const CHARCOAL = "#2a2a2a";
const MID      = "#3d3d3d";
const LIGHT    = "#b0b0b0";
const WHITE    = "#fff";
const OFFWHITE = "#e8e8e8";

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 13, letterSpacing: 4, color: LIGHT, textTransform: "uppercase", margin: "0 0 10px 0" }}>{title}</h3>
      <div style={{ height: 1, background: "#444", marginBottom: 12 }} />
      {children}
    </div>
  );
}

function MainSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 13, letterSpacing: 4, color: LIGHT, textTransform: "uppercase", margin: "0 0 10px 0" }}>{title}</h3>
      <div style={{ height: 1, background: "#444", marginBottom: 16 }} />
      {children}
    </div>
  );
}

export function BlackGreyClassicCV({ data = DEFAULT_DATA }) {
  const { firstName, lastName, firstNameScript, title, photo, phone, email, address, profile, skills, languages, education, experience } = data;

  const sectionBlocks = {
    contact: (
      <SideSection title="Contact">
        {[{ icon: "📞", t: phone }, { icon: "✉", t: email }, { icon: "📍", t: address }].filter(({ t }) => t).map(({ icon, t }) => (
          <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: LIGHT, flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 12, color: LIGHT, lineHeight: 1.4 }}>{t}</span>
          </div>
        ))}
      </SideSection>
    ),
    skills: (
      <SideSection title="Skills">
        {skills.map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: OFFWHITE, marginBottom: 7 }}>
            <span style={{ color: LIGHT, fontSize: 14 }}>•</span>{s}
          </div>
        ))}
      </SideSection>
    ),
    education: (
      <SideSection title="Education">
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: WHITE, letterSpacing: 0.5 }}>{e.level}</div>
            <div style={{ fontSize: 12, color: LIGHT }}>{e.school}</div>
            <div style={{ fontSize: 11.5, color: "#777" }}>{e.years}</div>
          </div>
        ))}
      </SideSection>
    ),
    languages: (
      <SideSection title="Language">
        {languages.map(l => <div key={l} style={{ fontSize: 12.5, color: OFFWHITE, marginBottom: 5 }}>{l}</div>)}
      </SideSection>
    ),
    experience: (
      <div style={{ padding: "28px 32px" }}>
        <MainSection title="Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: WHITE, letterSpacing: 1, marginBottom: 2 }}>{exp.role}</div>
              <div style={{ fontSize: 12.5, color: LIGHT, marginBottom: 2 }}>{exp.company}</div>
              <div style={{ fontSize: 11.5, color: "#666", marginBottom: 7 }}>{exp.years}</div>
              {exp.bullets.map((b, j) => (
                <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, color: OFFWHITE, lineHeight: 1.6, marginBottom: 4 }}>
                  <span style={{ color: LIGHT, flexShrink: 0 }}>•</span><span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </MainSection>
      </div>
    ),
  };

  const { sidebar, main, present } = useDynamicSections(
    { phone, email, address, skills, education, languages, experience, profile },
    { sidebar: ["contact", "skills", "education", "languages"], main: ["experience"], minMain: 1 }
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Great+Vibes&family=Barlow:wght@300;400;600;700&display=swap'); .bgc-cv * { box-sizing: border-box; }`}</style>
      <div className="bgc-cv" style={{ width: 720, minHeight: 1020, background: CHARCOAL, fontFamily: "'Barlow', sans-serif", color: WHITE, display: "grid", gridTemplateColumns: "300px 1fr" }}>

        {/* LEFT — full height photo column */}
        <div style={{ position: "relative", background: "#111", minHeight: 400 }}>
          {photo ? (
            <img src={photo} alt="profile" style={{ width: "100%", height: "420px", objectFit: "cover", objectPosition: "top center", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: 420, background: "linear-gradient(180deg, #1a1a1a, #2a2a2a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="22" fill="rgba(255,255,255,0.15)" /><ellipse cx="40" cy="68" rx="32" ry="20" fill="rgba(255,255,255,0.15)" /></svg>
            </div>
          )}
          {/* Contact + skills below photo */}
          <div style={{ padding: "24px 22px" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>
        </div>

        {/* RIGHT — name header + experience */}
        <div style={{ background: CHARCOAL }}>
          {/* Name area */}
          <div style={{ padding: "36px 32px 28px", borderBottom: "1px solid #3a3a3a" }}>
            {/* Script firstname over bold lastname */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 38, color: LIGHT, position: "absolute", top: -14, left: -4, opacity: 0.9 }}>{firstNameScript}</div>
              <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700, fontSize: 48, color: WHITE, margin: "18px 0 0", letterSpacing: 2, lineHeight: 1 }}>{lastName}</h1>
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, letterSpacing: 5, color: LIGHT, marginBottom: 18 }}>{title}</div>
            <Section show={present.profile}>
              <p style={{ fontSize: 12.5, color: LIGHT, lineHeight: 1.7, margin: 0 }}>{profile}</p>
            </Section>
          </div>

          {/* Experience */}
          {main.map((key) => (
            <Section key={key} show>
              {sectionBlocks[key]}
            </Section>
          ))}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [zoom, setZoom] = useState(0.78);
  return (
    <div style={{ background: "#111", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.78, 0.9, 1].map(z => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? "#555" : "#222", color: WHITE, border: "1px solid #444", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(1020 * (1 - zoom)) : 0, boxShadow: "0 12px 48px rgba(0,0,0,0.7)" }}>
        <BlackGreyClassicCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

// BlackBlueModernCV.jsx
// Black & Blue Modern Marketing Manager CV Template
// Usage: <BlackBlueModernCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "Jamie",
  lastName: "Chastain",
  title: "Marketing Manager",
  photo: null,
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  summary:
    "Results-driven Marketing Manager with over 8 years of experience in developing and executing strategic marketing initiatives. Adept at leading cross-functional teams, driving brand awareness, and increasing market share. Proven track record of delivering revenue growth through digital marketing, customer segmentation, and targeted campaigns. Strong expertise in market research, analytics, and consumer behavior.",
  skills: ["Strategic Planning", "Digital Marketing", "Market Research & Analysis", "Team Leadership & Collaboration"],
  education: [{ school: "University of New York", degree: "Bachelor of Science in Marketing", graduated: "May 2013" }],
  certifications: ["Digital Marketing Certification", "Content Marketing Certification", "Inbound Marketing Certification"],
  languages: ["English (Fluent)", "Russian (Fluent)", "Spanish (Intermediate)", "Germany (Intermediate)"],
  experience: [
    {
      role: "Marketing Manager",
      company: "Rimberio Corporation",
      location: "New York, NY",
      years: "2019 – Present",
      bullets: ["Lead a team of 5 marketing professionals to create and implement comprehensive marketing strategies that resulted in a 25% increase in annual revenue."],
    },
    {
      role: "Assistant Marketing Manager",
      company: "Rimberio Enterprises",
      location: "New York, NY",
      years: "2015 – 2019",
      bullets: ["Assisted in the creation and execution of marketing campaigns that increased customer acquisition by 20%."],
    },
    {
      role: "Marketing Coordinator",
      company: "Larana Solutions",
      location: "New York, NY",
      years: "2013 – 2015",
      bullets: ["Managed email lists and segmented audiences for targeted campaigns, resulting in a 15% increase in click-through rates."],
    },
  ],
};

const PURPLE = "#3a0ca3";
const DARK   = "#1a1a1a";
const WHITE  = "#fff";
const LGRAY  = "#2d2d2d";

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 2, color: WHITE, textTransform: "uppercase", margin: "0 0 6px 0" }}>{children}</h3>
      <div style={{ height: 2, background: PURPLE, width: "100%" }} />
    </div>
  );
}

function MainSectionTitle({ children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 2, color: WHITE, textTransform: "uppercase", margin: "0 0 6px 0" }}>{children}</h3>
      <div style={{ height: 2, background: PURPLE }} />
    </div>
  );
}

export function BlackBlueModernCV({ data = DEFAULT_DATA }) {
  const { firstName, lastName, title, photo, phone, email, address, summary, skills, education, certifications, languages, experience } = data;

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 24 }}>
        <SectionTitle>Contact</SectionTitle>
        {[{ icon: "📞", t: phone }, { icon: "✉", t: email }, { icon: "📍", t: address }].filter(({ t }) => t).map(({ icon, t }) => (
          <div key={t} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1, color: PURPLE }}>{icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>{t}</span>
          </div>
        ))}
      </div>
    ),
    education: (
      <div style={{ marginBottom: 24 }}>
        <SectionTitle>Education</SectionTitle>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: WHITE }}>{e.school}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{e.degree}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>Graduated: {e.graduated}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div>
        <SectionTitle>Skills</SectionTitle>
        {skills.map(s => <div key={s} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>{s}</div>)}
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 24 }}>
        <MainSectionTitle>Professional Experience</MainSectionTitle>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
              <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", fontWeight: 400 }}>{exp.role}</span>
              <span style={{ fontSize: 11.5, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>{exp.years}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: WHITE, marginBottom: 7 }}>{exp.company} | {exp.location}</div>
            {exp.bullets.map((b, j) => (
              <div key={j} style={{ display: "flex", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 4 }}>
                <span style={{ color: PURPLE, flexShrink: 0 }}>•</span><span>{b}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    certifications: (
      <div style={{ padding: "20px 28px 28px 22px", borderRight: `1px solid ${LGRAY}` }}>
        <MainSectionTitle>Certification</MainSectionTitle>
        {certifications.map(c => (
          <div key={c} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
            <span style={{ color: PURPLE }}>•</span><span>{c}</span>
          </div>
        ))}
      </div>
    ),
    languages: (
      <div style={{ padding: "20px 24px 28px" }}>
        <MainSectionTitle>Language</MainSectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
          {languages.map(l => (
            <div key={l} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
              <span style={{ color: PURPLE }}>•</span><span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar, main, present } = useDynamicSections(
    { phone, email, address, education, skills, experience, certifications, languages },
    { sidebar: ["contact", "education", "skills"], main: ["experience"], minMain: 1 }
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&display=swap'); .bbm-cv * { box-sizing: border-box; }`}</style>
      <div className="bbm-cv" style={{ width: 700, minHeight: 980, background: DARK, fontFamily: "'Barlow', sans-serif", color: WHITE }}>

        {/* Header: split purple-left / dark-right */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }}>
          {/* Left — purple bg, name + summary */}
          <div style={{ background: PURPLE, padding: "36px 28px 28px" }}>
            <h1 style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 800, fontSize: 44, color: WHITE, lineHeight: 1.0, margin: "0 0 14px", letterSpacing: -0.5 }}>
              {firstName}<br />{lastName}
            </h1>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0 }}>{summary}</p>
          </div>
          {/* Right — dark bg, title + photo */}
          <div style={{ background: "#111", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 15, fontStyle: "italic", color: "rgba(255,255,255,0.7)", letterSpacing: 0.5 }}>{title}</div>
            <div style={{ flex: 1, background: "#222", borderRadius: 4, overflow: "hidden", minHeight: 200 }}>
              {photo ? (
                <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", minHeight: 200, background: "linear-gradient(160deg,#2a2a3a,#111)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="60" height="60" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.2)" /><ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.2)" /></svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr" }}>
          {/* Sidebar */}
          <div style={{ background: "#141414", padding: "28px 22px" }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* Main */}
          <div style={{ padding: "28px 28px" }}>
            {main.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>
        </div>

        {/* Footer: Certification + Language */}
        {(present.certifications || present.languages) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `2px solid ${LGRAY}` }}>
            <Section show={present.certifications}>{sectionBlocks.certifications}</Section>
            <Section show={present.languages}>{sectionBlocks.languages}</Section>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  const [zoom, setZoom] = useState(0.82);
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.75, 0.82, 1].map(z => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? PURPLE : "#222", color: WHITE, border: "1px solid #444", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(980 * (1 - zoom)) : 0, boxShadow: "0 12px 48px rgba(0,0,0,0.6)" }}>
        <BlackBlueModernCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

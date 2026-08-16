// PinkCuteCV.jsx
// Pink Cute Modern CV Template
// Faithfully recreated from uploaded PDF design
// Usage: <PinkCuteCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "SABRINA",
  lastName: "WOLES",
  title: "Brand Strategist",
  photo: null,
  phone: "+123 456 7890",
  address: "123 Anywhere St., Any City",
  email: "hello@reallygreatsite.com",
  profile:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet rutrum est, non consectetur lorem. Morbi maximus massa quis ante efficitur, sit amet hendrerit felis sodales. In et pharetra turpis. Maecena sinterdum arcu vitae consequat scelerisque. Quisque ullamcorper mauris sit amet.",
  education: [
    { school: "Sepertinya University", degree: "Bachelor of Accounting", years: "2011 - 2014" },
    { school: "Apapun University", degree: "Master of Business Management", years: "2014 - 2016" },
  ],
  skills: [
    "Copywriting",
    "Visual Storytelling",
    "Social Media Marketing",
    "Calculations",
    "Marketing Strategy",
  ],
  experience: [
    { role: "Accountant", company: "Sebelum Agency", years: "2016-2019" },
    { role: "Social Media Marketing", company: "Studio Itukan", years: "2019 - 2021" },
    { role: "Brand Strategist", company: "The Oalah Co.", years: "2021 - Present" },
  ],
  certifications: [
    {
      title: "Speaker of Digital Marketing and Branding Fest",
      year: "2019",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipising elit. Proin sem tortor, consequat eget venenatis at, luctus a velit.",
    },
    {
      title: "Speaker of Business Marketing in Digital Era",
      year: "2021",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipising elit. Proin sem tortor, consequat eget venenatis at, luctus a velit.",
    },
  ],
};

const PINK = "#f4a0a8";
const PINK_TEXT = "#e07880";
const DARK = "#111";

function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: 20,
      color: PINK_TEXT,
      margin: "0 0 14px 0",
      letterSpacing: 0.2,
    }}>
      {children}
    </h3>
  );
}

function HRule() {
  return <div style={{ height: 1, background: "#e8e8e8", margin: "20px 0" }} />;
}

export function PinkCuteCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, address, email,
    profile, education, skills,
    experience, certifications,
  } = data;

  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.school || edu.degree || edu.years))
    : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.role || exp.company || exp.years))
    : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.filter((cert) => cert && (cert.title || cert.year || cert.description))
    : [];

  const sectionBlocks = {
    education: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Education</SectionHeading>
        {safeEducation.map((edu, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 1 }}>{edu.school}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{edu.degree}</div>
            <div style={{ fontWeight: 700, fontSize: 12, color: DARK, marginTop: 2 }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    experience: (
      <div>
        <SectionHeading>Experience</SectionHeading>
        {safeExperience.map((exp, i) => (
          <div key={i} className="pdf-avoid-break" style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, marginTop: 2 }}>
              <div style={{
                width: 14, height: 14,
                background: PINK,
                borderRadius: 2,
                flexShrink: 0,
              }} />
              {i < safeExperience.length - 1 && (
                <div style={{ width: 2, flex: 1, background: "#f0d0d4", minHeight: 28, marginTop: 3 }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{exp.role}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{exp.company}</div>
              <div style={{ fontSize: 12, color: PINK_TEXT, fontWeight: 600, marginTop: 1 }}>{exp.years}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Skills</SectionHeading>
        {safeSkills.map((skill) => (
          <div key={skill} className="pdf-avoid-break" style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 9,
          }}>
            <div style={{
              width: 13, height: 13,
              background: PINK,
              borderRadius: 2,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 13, color: DARK }}>{skill}</span>
          </div>
        ))}
      </div>
    ),
    certifications: (
      <div>
        <SectionHeading>Certifications</SectionHeading>
        {safeCertifications.map((cert, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 16 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
              marginBottom: 5,
            }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: DARK, lineHeight: 1.3 }}>{cert.title}</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: PINK_TEXT, flexShrink: 0 }}>{cert.year}</span>
            </div>
            <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: 0 }}>{cert.description}</p>
          </div>
        ))}
      </div>
    ),
  };

  const { sidebar = [], main = [] } = useDynamicSections(
    { education: safeEducation, experience: safeExperience, skills: safeSkills, certifications: safeCertifications },
    { sidebar: ["education", "experience"], main: ["skills", "certifications"], minMain: 1 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Mulish:wght@300;400;600;700&display=swap');
        .pink-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="pink-cv" style={{
        width: 680,
        minHeight: 960,
        background: "#fff",
        fontFamily: "'Mulish', sans-serif",
        color: DARK,
      }}>

        {/* ── HEADER ─────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          alignItems: "flex-end",
          padding: "40px 40px 0",
          gap: 20,
        }}>
          {/* Name + title */}
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 54,
              color: DARK,
              margin: "0 0 12px 0",
              lineHeight: 0.95,
              letterSpacing: -1,
            }}>
              {firstName}<br />{lastName}
            </h1>
            {/* Pink pill badge */}
            <div style={{
              display: "inline-block",
              background: PINK,
              padding: "8px 20px",
              borderRadius: 4,
            }}>
              <span style={{
                fontFamily: "'Mulish', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                letterSpacing: 0.3,
              }}>
                {title}
              </span>
            </div>
            {/* Short rule */}
            <div style={{ height: 1.5, background: "#ddd", marginTop: 20, width: "75%" }} />
          </div>

          {/* Photo — right aligned, square with slight bottom crop */}
          <div style={{
            width: 220,
            height: 230,
            overflow: "hidden",
            borderRadius: 4,
            background: "#f9d4d8",
            flexShrink: 0,
          }}>
            {photo ? (
              <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(160deg, #f9d4d8, #f4a0a8)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.5)" />
                  <ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.5)" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ── PROFILE ────────────────────────────────── */}
        <div style={{ padding: "24px 40px 0" }}>
          <SectionHeading>Personal Profile</SectionHeading>
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: 0 }}>{profile}</p>
          <HRule />
        </div>

        {/* ── CONTACT BAR ────────────────────────────── */}
        <div style={{
          display: "flex",
          gap: 32,
          padding: "0 40px 20px",
          alignItems: "center",
        }}>
          {[
            { icon: "📞", text: phone },
            { icon: "📍", text: address },
            { icon: "✉", text: email },
          ].map(({ icon, text }) => (
            <div key={text} className="pdf-avoid-break" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#333" }}>
              <span style={{ fontSize: 14, color: PINK_TEXT }}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <HRule style={{ margin: "0 40px" }} />

        {/* ── BODY: two columns ──────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          gap: 0,
          padding: "8px 40px 0",
        }}>

          {/* LEFT: Education + Experience */}
          <div style={{ paddingRight: 28 }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* Vertical divider */}
          <div style={{ background: "#ebebeb", width: 1 }} />

          {/* RIGHT: Skills + Certifications */}
          <div style={{ paddingLeft: 28 }}>
            {main.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ height: 32 }} />
      </div>
    </>
  );
}

export default function App() {
  const [zoom, setZoom] = useState(0.85);
  return (
    <div style={{ background: "#fce8ec", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#a06070", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? PINK_TEXT : "#fff", color: zoom === z ? "#fff" : "#555", border: `1px solid ${PINK}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(960 * (1 - zoom)) : 0, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
        <PinkCuteCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

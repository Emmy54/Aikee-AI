// ProfessionalModernCV.jsx
// Professional Modern CV Template — Gray Header, Arch Photo, Circle Timeline
// Faithfully recreated from uploaded PDF design
// Usage: <ProfessionalModernCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "JONATHAN",
  lastName: "PATTERSON",
  title: "Art Director",
  photo: null,
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  profile:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.",
  education: [
    {
      years: "2014 - 2017",
      degree: "BACHELOR OF DESIGN",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Graduated in Web Designing."],
    },
    {
      years: "2012 - 2015",
      degree: "BACHELOR OF DESIGN",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Graduated in Web Designing."],
    },
  ],
  skills: [
    "Management Skills",
    "Creativity",
    "Digital Marketing",
    "Negotiation",
    "Critical Thinking",
    "Leadership",
  ],
  languages: ["English", "German (basic)", "Spanish (basic)"],
  contact: [
    { icon: "📞", text: "+123-456-7890" },
    { icon: "✉", text: "hello@reallygreatsite.com" },
    { icon: "📍", text: "123 Anywhere St., Any City" },
    { icon: "🌐", text: "www.reallygreatsite.com" },
  ],
  experience: [
    {
      role: "SENIOR GRAPHIC DESIGNER",
      company: "STUDIO SHODWE",
      years: "2020 - 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      role: "SENIOR GRAPHIC DESIGNER",
      company: "INGOUDE COMPANY",
      years: "2018 - 2020",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      role: "SENIOR GRAPHIC DESIGNER",
      company: "KEITHSTON AND PARTNERS",
      years: "2018 - 2020",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ],
  references: [
    { name: "Estelle Darcy", company: "Wardiere Inc. / CTO", phone: "+123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harper Richard", company: "Wardiere Inc. / CEO", phone: "+123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const GRAY_DARK = "#5a5f6a";
const GRAY_BG   = "#e8e9ec";
const DARK      = "#1a1a1a";

// ── Section heading with short rule ──────────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 2,
          color: DARK,
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {children}
        </h3>
        <div style={{ flex: 1, height: 1.5, background: "#ccc" }} />
      </div>
    </div>
  );
}

// ── Experience circle timeline item ──────────────────────
function ExpItem({ exp, isLast }) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: isLast ? 0 : 20, position: "relative" }}>
      {/* Circle + vertical connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 22, height: 22,
          borderRadius: "50%",
          border: `2.5px solid #bbb`,
          background: "#fff",
          flexShrink: 0,
          zIndex: 1,
        }} />
        {!isLast && (
          <div style={{ width: 2, flex: 1, background: "#ddd", minHeight: 24 }} />
        )}
      </div>
      {/* Content */}
      <div style={{ paddingTop: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 2,
        }}>
          <div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: DARK, letterSpacing: 0.5 }}>
              {exp.role}
            </span>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, color: GRAY_DARK, letterSpacing: 0.3 }}>
              {exp.company}
            </div>
          </div>
          <span style={{ fontSize: 11.5, color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>{exp.years}</span>
        </div>
        <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6, margin: 0 }}>{exp.description}</p>
      </div>
    </div>
  );
}

export function ProfessionalModernCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    profile, education, skills,
    languages, contact, experience, references,
  } = data;

  const sectionBlocks = {
    education: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Education</SectionHeading>
        {education.map((edu, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, color: "#777", marginBottom: 1 }}>{edu.years}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: DARK }}>{edu.degree}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, color: GRAY_DARK, marginBottom: 4 }}>{edu.school}</div>
            <ul>
              {edu.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Skills</SectionHeading>
        <ul style={{ marginTop: 8 }}>
          {skills.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </div>
    ),
    languages: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Languages</SectionHeading>
        <ul style={{ marginTop: 8 }}>
          {languages.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </div>
    ),
    contact: (
      <div>
        <SectionHeading>Contact</SectionHeading>
        <div style={{ marginTop: 8 }}>
          {contact.map(({ icon, text }) => (
            <div key={text} className="pdf-avoid-break" style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <span style={{ fontSize: 12, color: "#333", lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    profile: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Profile Info</SectionHeading>
        <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.75, margin: 0, textAlign: "justify" }}>
          {profile}
        </p>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Experience</SectionHeading>
        <div style={{ marginTop: 8 }}>
          {experience.map((exp, i) => (
            <ExpItem key={i} exp={exp} isLast={i === experience.length - 1} />
          ))}
        </div>
      </div>
    ),
    references: (
      <div>
        <SectionHeading>Reference</SectionHeading>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 8,
        }}>
          {references.map((ref, i) => (
            <div key={i} className="pdf-avoid-break">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: DARK, marginBottom: 2 }}>{ref.name}</div>
              <div style={{ fontSize: 12, color: GRAY_DARK, marginBottom: 5 }}>{ref.company}</div>
              <div style={{ fontSize: 12, color: "#333", marginBottom: 2 }}>
                <strong style={{ fontWeight: 600 }}>Phone: </strong>{ref.phone}
              </div>
              <div style={{ fontSize: 12, color: "#333" }}>
                <strong style={{ fontWeight: 600 }}>Email: </strong>{ref.email}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { profile, education, skills, languages, contact, experience, references },
    {
      sidebar: ["education", "skills", "languages", "contact"],
      main: ["profile", "experience", "references"],
      minMain: 2,
    }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
        .promod-cv * { box-sizing: border-box; }
        .promod-cv ul { margin: 0; padding: 0; list-style: none; }
        .promod-cv li { display: flex; align-items: flex-start; gap: 7px; font-size: 12px; color: #333; line-height: 1.5; margin-bottom: 5px; }
        .promod-cv li::before { content: "•"; color: ${DARK}; flex-shrink: 0; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="promod-cv" style={{
        width: 680,
        minHeight: 960,
        background: "#fff",
        fontFamily: "'Barlow', sans-serif",
        color: DARK,
      }}>

        {/* ── HEADER — gray band ──────────────────────── */}
        <div style={{
          background: GRAY_BG,
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          minHeight: 200,
        }}>
          {/* Photo with arch cutout */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 0,
            position: "relative",
          }}>
            {/* Arch shape behind photo */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 160,
              height: 180,
              background: GRAY_DARK,
              borderRadius: "80px 80px 0 0",
            }} />
            {/* Photo circle */}
            <div style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #fff",
              background: "#c8cacf",
              position: "relative",
              zIndex: 2,
              marginBottom: 8,
            }}>
              {photo ? (
                <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#b0b4bc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.4)" />
                    <ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.4)" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Name + title — right side of header */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "28px 32px 28px 12px",
          }}>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 300,
              fontSize: 44,
              color: "#fff",
              margin: "0 0 4px 0",
              lineHeight: 1,
              letterSpacing: 1,
            }}>
              {firstName}
            </h1>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 44,
              color: "#fff",
              margin: "0 0 10px 0",
              lineHeight: 1,
              letterSpacing: 1,
            }}>
              {lastName}
            </h1>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: 0.5,
            }}>
              {title}
            </div>
          </div>
        </div>

        {/* ── BODY: two columns ──────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          minHeight: 720,
        }}>

          {/* ── LEFT SIDEBAR ──────────────────────────── */}
          <div style={{
            background: "#f5f5f5",
            padding: "28px 20px 28px 24px",
            borderRight: "none",
          }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT MAIN ─────────────────────────────── */}
          <div style={{ padding: "28px 28px 28px 24px" }}>
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
    <div style={{ background: "#d0d2d8", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#555", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? GRAY_DARK : "#fff", color: zoom === z ? "#fff" : "#555", border: "1px solid #bbb", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(960 * (1 - zoom)) : 0, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        <ProfessionalModernCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

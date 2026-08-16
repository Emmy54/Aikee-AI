// ModernCV1.jsx
// Modern CV Template with Geometric Header & Red/Navy Accents
// Faithfully recreated from uploaded PDF design
// Usage: <ModernCV1 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "HENRIETTA",
  lastName: "MITCHELL",
  title: "Sales Representative",
  photo: null,
  phone: "123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  education: [
    {
      degree: "Bachelor of Marketing",
      school: "Wardiere University",
      years: "2016 - 2020",
    },
    {
      degree: "BA Sales and Commerce",
      school: "Wardiere University",
      years: "2020 - 2023",
    },
  ],
  skills: [
    "Sales Strategies",
    "Negotiation Skills",
    "Problem-Solving",
    "Time Management",
    "Presentation Skills",
    "Networking",
    "Market Research",
  ],
  experience: [
    {
      role: "Inside Sales Representative",
      company: "Arowwai Industries | 123 Anywhere St., Any City",
      yearStart: "2020",
      yearEnd: "2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non elit mauris. Cras euismod, metus ac finibus finibus, felis dui suscipit purus, a maximus leo ligula at dolor. Morbi et malesuada purus. Phasellus a lacus sit amet urna tempor sollicitudin.",
    },
    {
      role: "Inside Sales Representative",
      company: "Arowwai Industries | 123 Anywhere St., Any City",
      yearStart: "2019",
      yearEnd: "2021",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non elit mauris. Cras euismod, metus ac finibus finibus, felis dui suscipit purus, a maximus leo ligula at dolor. Morbi et malesuada purus. Phasellus a lacus sit amet urna tempor sollicitudin. Cras pretium tempor elit blandit egestas. Donec sed dignissim augue. Suspendisse ac vulputate leo. Cras aliquet nunc ac velit cursus viverra. In hac habitasse platea dictumst.",
    },
    {
      role: "Sales Associate",
      company: "Arowwai Industries | 123 Anywhere St., Any City",
      yearStart: "2017",
      yearEnd: "2019",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non elit mauris. Cras euismod, metus ac finibus finibus, felis dui suscipit purus, a maximus leo ligula at dolor. Morbi et malesuada purus. Phasellus a lacus sit amet urna tempor sollicitudin. Cras pretium tempor elit blandit egestas. Donec sed dignissim augue. Suspendisse ac vulputate leo. Cras aliquet nunc ac velit cursus viverra. In hac habitasse platea dictumst.",
    },
  ],
};

const RED  = "#b0202a";
const NAVY = "#1a2235";

// ── Geometric header background ───────────────────────────
function GeometricHeader({ photo, firstName, lastName, title }) {
  return (
    <div style={{ position: "relative", height: 210, overflow: "hidden", background: "#f0f0f0" }}>
      {/* Navy triangle — top right */}
      <svg
        style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%" }}
        viewBox="0 0 720 210"
        preserveAspectRatio="none"
      >
        {/* Dark navy right block */}
        <polygon points="420,0 720,0 720,210" fill={NAVY} />
        {/* Red triangle overlapping */}
        <polygon points="310,0 520,0 310,160" fill={RED} />
        {/* Small navy left bottom corner */}
        <polygon points="0,210 90,210 0,140" fill={NAVY} />
      </svg>

      {/* Photo circle — left side */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 30,
        width: 160,
        height: 160,
        borderRadius: "50%",
        overflow: "hidden",
        border: "4px solid #fff",
        background: "#ccc",
        zIndex: 3,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}>
        {photo ? (
          <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "#d5c8bc",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="28" r="18" fill="#aaa" />
              <ellipse cx="40" cy="66" rx="28" ry="18" fill="#aaa" />
            </svg>
          </div>
        )}
      </div>

      {/* Name + title — right of photo */}
      <div style={{
        position: "absolute",
        top: 28,
        left: 215,
        zIndex: 4,
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          fontSize: 40,
          color: NAVY,
          lineHeight: 1.05,
          letterSpacing: 1,
        }}>
          {firstName}<br />{lastName}
        </div>
        <div style={{
          fontFamily: "'Lato', sans-serif",
          fontWeight: 400,
          fontSize: 15,
          color: "#444",
          marginTop: 8,
          letterSpacing: 0.5,
        }}>
          {title}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar section heading (red, bold, large) ─────────────
function SidebarHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Oswald', sans-serif",
      fontWeight: 600,
      fontSize: 20,
      color: RED,
      margin: "0 0 10px 0",
      letterSpacing: 0.3,
    }}>
      {children}
    </h3>
  );
}

// ── Main section heading ───────────────────────────────────
function MainHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Oswald', sans-serif",
      fontWeight: 600,
      fontSize: 22,
      color: NAVY,
      margin: "0 0 18px 0",
      letterSpacing: 0.3,
    }}>
      {children}
    </h3>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function ModernCV1({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, email, address,
    education, skills, experience,
  } = data;

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 28 }}>
        <SidebarHeading>Contact</SidebarHeading>
        {[
          { label: "Phone", value: phone },
          { label: "Email", value: email },
          { label: "Address", value: address },
        ].filter(({ value }) => value).map(({ label, value }) => (
          <div key={label} className="pdf-avoid-break" style={{ marginBottom: 12 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#111",
              marginBottom: 2,
            }}>{label}</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>{value}</div>
          </div>
        ))}
      </div>
    ),
    education: (
      <div style={{ marginBottom: 28 }}>
        <SidebarHeading>Education</SidebarHeading>
        {education.map((edu, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 14 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#111",
              marginBottom: 2,
            }}>{edu.degree}</div>
            <div style={{ fontSize: 12, color: "#555" }}>{edu.school}</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 1 }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div>
        <SidebarHeading>Skills</SidebarHeading>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {skills.map((s) => (
            <li key={s} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              color: "#333",
              marginBottom: 7,
            }}>
              <span style={{
                width: 6, height: 6,
                borderRadius: "50%",
                background: RED,
                flexShrink: 0,
              }} />
              {s}
            </li>
          ))}
        </ul>
      </div>
    ),
    experience: (
      <>
        <MainHeading>Professional Experience</MainHeading>
        {experience.map((exp, i) => (
          <div key={i} className="pdf-avoid-break" style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr",
            gap: 16,
            marginBottom: i < experience.length - 1 ? 24 : 0,
            paddingBottom: i < experience.length - 1 ? 24 : 0,
            borderBottom: i < experience.length - 1 ? "1px solid #ebebeb" : "none",
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: NAVY,
              lineHeight: 1.5,
              paddingTop: 2,
              textAlign: "right",
              borderRight: "2px solid #e0e0e0",
              paddingRight: 14,
            }}>
              {exp.yearStart}<br />
              <span style={{ fontWeight: 400, fontSize: 12, color: "#999" }}>–</span><br />
              {exp.yearEnd}
            </div>
            <div>
              <div style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: NAVY,
                marginBottom: 3,
              }}>
                {exp.role}
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: RED,
                marginBottom: 6,
              }}>
                {exp.company}
              </div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                {exp.description}
              </div>
            </div>
          </div>
        ))}
      </>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { phone, email, address, education, skills, experience },
    { sidebar: ["contact", "education", "skills"], main: ["experience"], minMain: 1 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');
        .mod1-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="mod1-cv" style={{
        width: 720,
        minHeight: 1020,
        background: "#fff",
        fontFamily: "'Lato', sans-serif",
        color: "#222",
        position: "relative",
      }}>

        {/* ── GEOMETRIC HEADER ─────────────────────────── */}
        <GeometricHeader
          photo={photo}
          firstName={firstName}
          lastName={lastName}
          title={title}
        />

        {/* ── BODY ─────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          minHeight: 780,
        }}>

          {/* ── LEFT SIDEBAR ─────────────────────────── */}
          <div style={{
            padding: "28px 24px 28px 28px",
            borderRight: "1.5px solid #e0e0e0",
          }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT MAIN CONTENT ──────────────────── */}
          <div style={{ padding: "28px 32px 28px 28px" }}>
            {main.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>
        </div>

        {/* ── BOTTOM GEOMETRIC FOOTER ───────────────────── */}
        <div style={{ position: "relative", height: 36, overflow: "hidden" }}>
          <svg
            style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}
            viewBox="0 0 720 36"
            preserveAspectRatio="none"
          >
            <polygon points="0,36 160,36 0,0" fill={NAVY} />
            <polygon points="560,36 720,36 720,0" fill={RED} />
          </svg>
        </div>
      </div>
    </>
  );
}

// ── Demo wrapper ──────────────────────────────────────────
export default function App() {
  const [zoom, setZoom] = useState(0.82);

  return (
    <div style={{
      background: "#2a2a2a",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 20px",
      gap: 20,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#aaa", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.82, 1].map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            style={{
              background: zoom === z ? RED : "#3a3a3a",
              color: "#fff",
              border: "1px solid #555",
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

      <div style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        marginBottom: zoom < 1 ? -(1020 * (1 - zoom)) : 0,
        boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
      }}>
        <ModernCV1 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

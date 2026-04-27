// MinimalistCV1.jsx
// White & Blue Lines Minimalist Professional CV Template
// Faithfully recreated from uploaded PDF design
// Usage: <MinimalistCV1 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

// ── Default sample data (mirrors the PDF) ─────────────────
const DEFAULT_DATA = {
  firstName: "RICHARD",
  lastName: "SANCHEZ",
  title: "M A R K E T I N G   M A N A G E R",
  address: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  email: "hello@reallygreatsite.com",
  profile:
    "I'm a passionate and results-oriented digital marketing strategist with a proven track record of unlocking growth and amplifying brand awareness for small businesses. My diverse skillset spans across multiple marketing disciplines, with a particular expertise in search engine marketing (SEM) and event marketing.",
  education: [
    {
      years: "2029 - 2030",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Master of Business Management"],
    },
    {
      years: "2025 - 2029",
      school: "WARDIERE UNIVERSITY",
      bullets: ["Bachelor of Business", "GPA: 3.8 / 4.0"],
    },
  ],
  skills: [
    "Project Management",
    "Public Relations",
    "Teamwork",
    "Time Management",
    "Leadership",
    "Effective Communication",
    "Critical Thinking",
    "Coaching",
  ],
  languages: [
    "English (Fluent)",
    "French (Fluent)",
    "German (Basics)",
    "Spanish (Intermediate)",
  ],
  experience: [
    {
      company: "Borcelle Studio",
      role: "Marketing Manager & Specialist",
      years: "2030 - PRESENT",
      bullets: [
        "Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.",
        "Lead, mentor, and manage a high-performing marketing team, fostering a collaborative and results-driven work environment.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
    {
      company: "Fauget Studio",
      role: "Marketing Manager & Specialist",
      years: "2025 - 2029",
      bullets: [
        "Create and manage the marketing budget, ensuring efficient allocation of resources and optimizing ROI.",
        "Oversee market research to identify emerging trends, customer needs, and competitor strategies.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
    {
      company: "Studio Shodwe",
      role: "Marketing Manager & Specialist",
      years: "2024 - 2025",
      bullets: [
        "Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.",
        "Monitor and maintain brand consistency across all marketing channels and materials.",
      ],
    },
  ],
  references: [
    {
      name: "Estelle Darcy",
      company: "Wardiere Inc. / CTO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
    {
      name: "Harper Richard",
      company: "Wardiere Inc. / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
  ],
};

// ── Shared colors ─────────────────────────────────────────
const NAVY = "#1e2d4a";
const RULE = "#1e2d4a";

// ── Section heading with long rule ───────────────────────
function SectionHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: 2.5,
          color: NAVY,
          margin: 0,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {children}
        </h3>
        <div style={{ flex: 1, height: 1.5, background: RULE }} />
      </div>
    </div>
  );
}

// ── Sidebar section heading (short rule) ─────────────────
function SidebarHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 2.5,
        color: NAVY,
        margin: "0 0 5px 0",
        textTransform: "uppercase",
      }}>
        {children}
      </h3>
      <div style={{ width: 36, height: 2.5, background: NAVY }} />
    </div>
  );
}

// ── Bullet list ───────────────────────────────────────────
function BulletList({ items, size = 12 }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 7,
          fontSize: size,
          color: "#333",
          lineHeight: 1.55,
          marginBottom: 5,
        }}>
          <span style={{ color: NAVY, flexShrink: 0, marginTop: 1 }}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function MinimalistCV1({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    address, website, email,
    profile, education, skills,
    languages, experience, references,
  } = data;

  const sectionBlocks = {
    contact: (
      <div style={{
        border: "1.5px solid #c8d0dc",
        margin: "18px 48px",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        padding: "10px 24px",
        gap: 0,
      }}>
        {[
          { icon: "📍", text: address },
          { icon: "🌐", text: website },
          { icon: "✉", text: email },
        ].filter((item) => item.text).map((item, i) => (
          <div key={item.icon} style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "#333",
            borderLeft: i > 0 ? "1px solid #c8d0dc" : "none",
            paddingLeft: i > 0 ? 20 : 0,
          }}>
            <span style={{ fontSize: 13, color: NAVY }}>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    ),
    profile: (
      <div style={{ marginBottom: 24 }}>
        <SectionHeading>Profile</SectionHeading>
        <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.7, margin: 0 }}>{profile}</p>
      </div>
    ),
    education: (
      <div style={{ marginBottom: 28 }}>
        <SidebarHeading>Education</SidebarHeading>
        {education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: NAVY }}>{edu.school}</div>
            <div style={{ fontSize: 12, color: "#555" }}>{edu.degree}</div>
            <div style={{ fontSize: 11.5, color: "#888", marginTop: 1 }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 28 }}>
        <SidebarHeading>Skills</SidebarHeading>
        <div style={{ marginTop: 12 }}>
          <BulletList items={skills} size={12} />
        </div>
      </div>
    ),
    languages: (
      <div>
        <SidebarHeading>Languages</SidebarHeading>
        <div style={{ marginTop: 12 }}>
          <BulletList items={languages} size={12} />
        </div>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Work Experience</SectionHeading>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? 18 : 0 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 1,
            }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: NAVY,
              }}>
                {exp.company}
              </span>
              <span style={{
                fontSize: 11.5,
                color: "#888",
                letterSpacing: 0.3,
              }}>
                {exp.years}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{exp.role}</div>
            <BulletList items={exp.bullets} size={12} />
          </div>
        ))}
      </div>
    ),
    references: (
      <div>
        <SectionHeading>Reference</SectionHeading>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 6,
        }}>
          {references.map((ref, i) => (
            <div key={i}>
              <div style={{
                fontWeight: 600,
                fontSize: 13.5,
                color: NAVY,
                marginBottom: 2,
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                {ref.name}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{ref.company}</div>
              <div style={{ fontSize: 12, color: "#333" }}>{ref.phone}</div>
              <div style={{ fontSize: 12, color: "#333" }}>{ref.email}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar, main, present } = useDynamicSections(
    { address, website, email, profile, education, skills, languages, experience, references },
    { sidebar: ["education", "skills", "languages"], main: ["profile", "experience", "references"], minMain: 2 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
        .min1-cv * { box-sizing: border-box; }
      `}</style>

      <div
        className="min1-cv"
        style={{
          width: 720,
          minHeight: 1020,
          background: "#fff",
          fontFamily: "'Barlow', sans-serif",
          color: "#222",
        }}
      >
        {/* ── TOP HEADER ─────────────────────────────────── */}
        <div style={{
          background: "#f4f6f9",
          padding: "36px 48px 24px",
          textAlign: "center",
        }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 46,
            color: NAVY,
            margin: "0 0 6px 0",
            letterSpacing: 2,
            lineHeight: 1,
          }}>
            {firstName} {lastName}
          </h1>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#666",
            letterSpacing: 5,
            margin: 0,
          }}>
            {title}
          </p>
        </div>

        {/* ── CONTACT BAR ────────────────────────────────── */}
        <Section show={present.contact}>
          {sectionBlocks.contact}
        </Section>

        {/* ── PROFILE INFO ───────────────────────────────── */}
        <Section show={present.profile}>
          <div style={{ padding: "0 48px 24px" }}>
            <SectionHeading>Profile Info</SectionHeading>
            <p style={{
              fontSize: 12.5,
              color: "#333",
              lineHeight: 1.75,
              margin: 0,
              textAlign: "justify",
            }}>
              {profile}
            </p>
          </div>
        </Section>

        {/* ── BODY: two columns ──────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          padding: "0 48px 40px",
          gap: 32,
        }}>

          {/* ── LEFT COLUMN ────────────────────────────── */}
          <div style={{ borderRight: "1.5px solid #c8d0dc", paddingRight: 24 }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────── */}
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

// ── Demo wrapper ──────────────────────────────────────────
export default function App() {
  const [zoom, setZoom] = useState(0.85);

  return (
    <div style={{
      background: "#dde3ec",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 20px",
      gap: 20,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#555", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            style={{
              background: zoom === z ? NAVY : "#fff",
              color: zoom === z ? "#fff" : "#555",
              border: "1px solid #b0bac8",
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
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
      }}>
        <MinimalistCV1 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

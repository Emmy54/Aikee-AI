// MemphisRetro2.jsx
// Memphis Retro 2 CV Template — Browser Window Cards, Bold Retro UI
// Faithfully recreated from uploaded PDF design
// Usage: <MemphisRetro2 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "SAMIRA",
  lastName: "HADID",
  title: "GRAPHIC DESIGNER",
  photo: null,
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  profile:
    "Creative and detail-oriented Graphic Designer focused on branding and visual communication, with strong skills in layout, color, and modern typography design.",
  skills: ["Graphic Design", "Photo Editing", "Social Media"],
  experience: [
    {
      company: "STUDIO SHODWE",
      years: "2021-2022",
      role: "GRAPHIC DESIGNER INTERN",
      description:
        "Designed social media content, posters, and promotional visuals while supporting branding needs.",
    },
    {
      company: "SELF-IMPLOYEED",
      years: "2022-2025",
      role: "FREELANCE DESIGNER",
      description:
        "Create social media designs, posters, flyers, and digital assets based on client briefs.",
    },
  ],
  education: [
    { school: "RIMBERIO UNIVERSITY", field: "MULTIMEDIA", years: "2019-2022" },
  ],
};

const ORANGE  = "#e8401a";
const TEAL    = "#2bbfaa";
const YELLOW  = "#f5c518";
const CREAM   = "#fdf6ec";
const DARK    = "#111";

// ── Traffic light dots ────────────────────────────────────
function TrafficDots({ size = 10 }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {[ORANGE, YELLOW, TEAL].map((c, i) => (
        <div key={i} className="pdf-avoid-break" style={{
          width: size, height: size, borderRadius: "50%",
          background: c, border: `1.5px solid rgba(0,0,0,0.15)`,
        }} />
      ))}
    </div>
  );
}

// ── Browser window card wrapper ───────────────────────────
function BrowserCard({ children, accentColor = TEAL, style = {} }) {
  return (
    <div style={{
      border: `2.5px solid ${DARK}`,
      borderRadius: 12,
      overflow: "hidden",
      background: CREAM,
      boxShadow: `4px 4px 0 ${DARK}`,
      ...style,
    }}>
      {/* Browser bar */}
      <div style={{
        background: accentColor,
        borderBottom: `2px solid ${DARK}`,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}>
        <TrafficDots size={9} />
      </div>
      {children}
    </div>
  );
}

// ── Name card (browser style with search bar) ─────────────
function NameCard({ firstName, lastName }) {
  return (
    <div style={{
      border: `2.5px solid ${DARK}`,
      borderRadius: 12,
      overflow: "hidden",
      background: CREAM,
      boxShadow: `4px 4px 0 ${DARK}`,
    }}>
      {/* Top bar with + tab and dots */}
      <div style={{
        background: YELLOW,
        borderBottom: `2px solid ${DARK}`,
        padding: "5px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: DARK }}>+</span>
        <TrafficDots size={9} />
      </div>
      {/* Search bar row */}
      <div style={{
        background: CREAM,
        borderBottom: `2px solid ${DARK}`,
        padding: "5px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          border: `2px solid ${DARK}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, flexShrink: 0,
        }}>🔍</div>
        <div style={{
          flex: 1, height: 22,
          border: `2px solid ${DARK}`,
          borderRadius: 4, background: "#fff",
        }} />
      </div>
      {/* Name */}
      <div style={{ padding: "16px 18px 18px" }}>
        <div style={{
          fontFamily: "'Black Han Sans', sans-serif",
          fontSize: 58,
          fontWeight: 900,
          color: ORANGE,
          lineHeight: 0.9,
          letterSpacing: -1,
        }}>
          {firstName}<br />{lastName}
        </div>
        {/* Cursor icon */}
        <div style={{ textAlign: "right", fontSize: 18, marginTop: 4 }}>↖</div>
      </div>
    </div>
  );
}

// ── Section badge (orange pill) ───────────────────────────
function SectionBadge({ children, color = ORANGE }) {
  return (
    <div style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      fontFamily: "'Black Han Sans', sans-serif",
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: 1,
      padding: "5px 14px",
      borderRadius: 6,
      border: `2px solid ${DARK}`,
      boxShadow: `2px 2px 0 ${DARK}`,
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

// ── Skill pill ────────────────────────────────────────────
function SkillPill({ children, color = TEAL }) {
  return (
    <span style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 700,
      fontSize: 12,
      padding: "4px 12px",
      borderRadius: 20,
      border: `1.5px solid ${DARK}`,
      margin: "3px 4px 3px 0",
    }}>
      {children}
    </span>
  );
}

// ── Decorative star/sparkle ───────────────────────────────
function Star({ size = 20, color = YELLOW, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z"
        fill={color} stroke={DARK} strokeWidth="1.5" />
    </svg>
  );
}

// ── Dot grid decoration ────────────────────────────────────
function DotGrid({ rows = 3, cols = 3, color = ORANGE, style = {} }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 6px)`, gap: 4, ...style }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="pdf-avoid-break" style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
      ))}
    </div>
  );
}

// ── Toggle switch (decorative) ────────────────────────────
function Toggle({ on = true }) {
  return (
    <div style={{
      width: 32, height: 18,
      borderRadius: 9,
      background: on ? TEAL : "#ccc",
      border: `1.5px solid ${DARK}`,
      position: "relative",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute",
        top: 1,
        left: on ? 14 : 1,
        width: 14, height: 14,
        borderRadius: "50%",
        background: "#fff",
        border: `1px solid ${DARK}`,
        transition: "left 0.2s",
      }} />
    </div>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function MemphisRetro2({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, email, profile,
    skills, experience, education,
  } = data;

  const sectionBlocks = {
    profile: (
      <BrowserCard accentColor={YELLOW} style={{ position: "relative" }}>
        <Star size={22} color={YELLOW} style={{ position: "absolute", left: -10, top: "40%", zIndex: 2 }} />
        <div style={{ padding: "10px 16px 14px" }}>
          <SectionBadge color={ORANGE}>PROFILE</SectionBadge>
          <p style={{ fontSize: 12.5, color: DARK, lineHeight: 1.7, margin: 0, textAlign: "justify" }}>
            {profile}
          </p>
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <Star size={18} color={YELLOW} />
          </div>
        </div>
      </BrowserCard>
    ),
    experience: (
      <BrowserCard accentColor={TEAL}>
        <div style={{ padding: "10px 16px 14px" }}>
          <SectionBadge color={ORANGE}>WORK EXPERIENCE</SectionBadge>
          {experience.map((exp, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: i < experience.length - 1 ? 16 : 0 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span style={{
                  background: YELLOW,
                  color: DARK,
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: `2px solid ${DARK}`,
                  boxShadow: `2px 2px 0 ${DARK}`,
                  letterSpacing: 0.5,
                }}>
                  {exp.company}
                </span>
                <span style={{
                  background: CREAM,
                  color: DARK,
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: `2px solid ${DARK}`,
                  boxShadow: `2px 2px 0 ${DARK}`,
                }}>
                  {exp.years}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span style={{ fontSize: 16, color: ORANGE }}>✳</span>
                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: DARK,
                }}>
                  {exp.role}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6, margin: 0 }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </BrowserCard>
    ),
    skills: (
      <BrowserCard accentColor={CREAM}>
        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <SectionBadge color={ORANGE}>SKILL</SectionBadge>
          </div>
          <div>
            {skills.map((s, i) => (
              <SkillPill key={i} color={i % 2 === 0 ? TEAL : ORANGE}>{s}</SkillPill>
            ))}
          </div>
          <DotGrid rows={3} cols={4} color={ORANGE} style={{ float: "right", marginTop: 8 }} />
        </div>
      </BrowserCard>
    ),
    education: (
      <BrowserCard accentColor={CREAM}>
        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <SectionBadge color={ORANGE}>EDUCATION</SectionBadge>
          </div>
          {education.map((edu, i) => (
            <div key={i} className="pdf-avoid-break" style={{ marginBottom: 10 }}>
              <span style={{
                display: "inline-block",
                background: ORANGE,
                color: "#fff",
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: 11,
                padding: "4px 12px",
                borderRadius: 6,
                border: `2px solid ${DARK}`,
                boxShadow: `2px 2px 0 ${DARK}`,
                marginBottom: 7,
              }}>
                {edu.school}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 14, color: ORANGE }}>✳</span>
                <span style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: 13,
                  color: DARK,
                  letterSpacing: 0.5,
                }}>
                  {edu.field}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 40, height: 1.5, background: DARK }} />
                <span style={{
                  background: CREAM,
                  border: `1.5px solid ${DARK}`,
                  borderRadius: 12,
                  padding: "2px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: DARK,
                }}>
                  {edu.years}
                </span>
              </div>
            </div>
          ))}
        </div>
      </BrowserCard>
    ),
    contact: (
      <BrowserCard accentColor={ORANGE}>
        <div style={{ padding: "10px 16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <SectionBadge color={ORANGE}>CONTACT</SectionBadge>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12.5, color: DARK, fontWeight: 600 }}>{phone}</span>
            <Toggle on={true} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: DARK, fontWeight: 600, wordBreak: "break-all" }}>{email}</span>
            <Toggle on={false} />
          </div>
        </div>
      </BrowserCard>
    ),
  };

  const { main, present } = useDynamicSections(
    { profile, experience, skills, education, phone, email },
    { sidebar: [], main: ["profile", "experience", "skills", "education", "contact"], minMain: 2 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nunito:wght@400;600;700;800;900&display=swap');
        .mr2-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="mr2-cv" style={{
        width: 660,
        minHeight: 900,
        background: ORANGE,
        padding: 16,
        borderRadius: 20,
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
      }}>

        {/* ── TOP BAR ──────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "0 4px",
        }}>
          <TrafficDots size={12} />
          {/* Centre pill */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: CREAM,
            border: `2.5px solid ${DARK}`,
            borderRadius: 24,
            padding: "5px 16px",
            boxShadow: `3px 3px 0 ${DARK}`,
          }}>
            <div style={{
              width: 24, height: 24,
              border: `2px solid ${DARK}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
            }}>🔍</div>
            <span style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: 13,
              letterSpacing: 2,
              color: DARK,
            }}>
              {title}
            </span>
          </div>
          <span style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: 13,
            letterSpacing: 2,
            color: CREAM,
          }}>
            RESUME
          </span>
        </div>

        {/* ── MAIN GRID ────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          alignItems: "start",
        }}>

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Name card */}
            <div style={{ position: "relative" }}>
              <DotGrid rows={4} cols={2} color={CREAM} style={{ position: "absolute", top: -8, left: -8, zIndex: 0 }} />
              <NameCard firstName={firstName} lastName={lastName} />
            </div>

            {/* Profile card */}
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
    <div style={{ background: "#c43010", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? DARK : CREAM, color: zoom === z ? CREAM : DARK, border: `2px solid ${DARK}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace", fontWeight: 700 }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(900 * (1 - zoom)) : 0 }}>
        <MemphisRetro2 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

// RetroCreativeCV.jsx
// Cream Retro Colorful Creative Designer CV Template
// Faithfully recreated from uploaded PDF design
// Usage: <RetroCreativeCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "Hanna",
  lastName: "Morales",
  title: "Creative designer",
  photo: null,
  phone: "123 - 456 - 7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, Ut enim ad minim veniam.",
  skills: [
    { name: "Motion Design:", green: 65, yellow: 20 },
    { name: "Graphic Design:", green: 55, yellow: 25 },
    { name: "Digital Arts:", green: 60, yellow: 15 },
  ],
  languages: [
    { name: "English:", green: 70, yellow: 20 },
    { name: "Japanese:", green: 45, yellow: 25 },
    { name: "Indonesian:", green: 55, yellow: 15 },
  ],
  education: [
    { years: "2014 – 2017", degree: "Bachelor degree" },
    { years: "2017 – 2019", degree: "Master degree" },
  ],
  experience: [
    {
      company: "Giggling Platypus Co.",
      role: "Creative Designer",
      years: "2019 – 2021",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
    {
      company: "Liceria & Co.",
      role: "Designer Staff",
      years: "2021 – 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    },
  ],
};

const CREAM   = "#f5ede0";
const GREEN   = "#1d6b4f";
const PINK    = "#f4a7b8";
const PINK2   = "#e8809a";
const YELLOW  = "#f5c842";
const ORANGE  = "#e8622a";
const DARK    = "#1a1a1a";
const WHITE   = "#fff";

// ── Two-tone progress bar (green + yellow) ────────────────
function TwoToneBar({ green, yellow }) {
  return (
    <div style={{
      display: "flex",
      height: 11,
      borderRadius: 6,
      overflow: "hidden",
      background: "#e0d4c4",
      marginBottom: 12,
      width: "100%",
    }}>
      <div style={{ width: `${green}%`, background: GREEN, borderRadius: "6px 0 0 6px" }} />
      <div style={{ width: `${yellow}%`, background: YELLOW }} />
    </div>
  );
}

// ── Retro section heading ─────────────────────────────────
function RetroHeading({ children, color = GREEN }) {
  return (
    <div style={{
      fontFamily: "'Fredoka One', cursive",
      fontSize: 20,
      color,
      marginBottom: 10,
      letterSpacing: 0.3,
    }}>
      {children}
    </div>
  );
}

// ── Rainbow decoration SVG ────────────────────────────────
function Rainbow({ style = {} }) {
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" style={style}>
      <path d="M4,28 Q4,4 24,4 Q44,4 44,28" fill="none" stroke="#e84040" strokeWidth="4" strokeLinecap="round" />
      <path d="M8,28 Q8,9 24,9 Q40,9 40,28" fill="none" stroke="#f5a623" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12,28 Q12,14 24,14 Q36,14 36,28" fill="none" stroke="#f5d020" strokeWidth="3" strokeLinecap="round" />
      <path d="M16,28 Q16,18 24,18 Q32,18 32,28" fill="none" stroke="#4ecba8" strokeWidth="3" strokeLinecap="round" />
      {/* Cloud puffs */}
      <circle cx="36" cy="28" r="4" fill={WHITE} />
      <circle cx="40" cy="28" r="5" fill={WHITE} />
      <circle cx="44" cy="28" r="4" fill={WHITE} />
    </svg>
  );
}

// ── Smiley sun decoration ─────────────────────────────────
function SmileySun({ style = {} }) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" style={style}>
      {/* Rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 24 + 18 * Math.cos(angle);
        const y1 = 24 + 18 * Math.sin(angle);
        const x2 = 24 + 23 * Math.cos(angle);
        const y2 = 24 + 23 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <circle cx="24" cy="24" r="15" fill={YELLOW} stroke={ORANGE} strokeWidth="2" />
      {/* Eyes */}
      <circle cx="19" cy="21" r="2" fill={DARK} />
      <circle cx="29" cy="21" r="2" fill={DARK} />
      {/* Smile */}
      <path d="M17,27 Q24,33 31,27" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Globe badge (top-left) ────────────────────────────────
function GlobeBadge() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 0,
      background: YELLOW,
      border: `2px solid ${DARK}`,
      borderRadius: 20,
      padding: "4px 10px",
      boxShadow: `2px 2px 0 ${DARK}`,
    }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: DARK, fontFamily: "monospace" }}>20</span>
      <span style={{ fontSize: 16 }}>🌐</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: DARK, fontFamily: "monospace" }}>23</span>
    </div>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function RetroCreativeCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, email, address,
    about, skills, languages,
    education, experience,
  } = data;

  const sectionBlocks = {
    about: (
      <div>
        <div style={{
          display: "inline-block",
          background: CREAM,
          border: `2px solid ${GREEN}`,
          borderRadius: 20,
          padding: "4px 14px",
          fontFamily: "'Fredoka One', cursive",
          fontSize: 14,
          color: GREEN,
          marginBottom: 10,
        }}>
          About me
        </div>
        <p style={{
          fontSize: 12.5,
          color: "#333",
          lineHeight: 1.7,
          margin: 0,
          textAlign: "justify",
        }}>
          {about}
        </p>
      </div>
    ),
    skillsLanguages: (
      <div style={{
        border: `2px solid ${GREEN}`,
        borderRadius: 16,
        padding: "16px 16px 12px",
        background: CREAM,
        position: "relative",
        marginBottom: 16,
      }}>
        <Rainbow style={{ position: "absolute", top: -16, right: -8 }} />
        <RetroHeading>Skills</RetroHeading>
        {skills.map((s, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, color: DARK, marginBottom: 4, fontWeight: 600 }}>{s.name}</div>
            <TwoToneBar green={s.green} yellow={s.yellow} />
          </div>
        ))}

        <div style={{ height: 1, background: "#d4c8b8", margin: "12px 0" }} />

        <RetroHeading>Language</RetroHeading>
        {languages.map((l, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, color: DARK, marginBottom: 4, fontWeight: 600 }}>{l.name}</div>
            <TwoToneBar green={l.green} yellow={l.yellow} />
          </div>
        ))}

        <div style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 22,
          color: PINK2,
          WebkitTextStroke: `1.5px ${DARK}`,
          marginTop: 8,
          display: "inline-block",
          transform: "rotate(-6deg)",
        }}>
          Cool!
        </div>
      </div>
    ),
    education: (
      <div style={{ marginBottom: 18 }}>
        <RetroHeading>Education</RetroHeading>
        {education.map((edu, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            fontSize: 13,
            color: DARK,
          }}>
            <span style={{ fontWeight: 700, color: DARK, whiteSpace: "nowrap" }}>{edu.years}</span>
            <div style={{
              flex: 0,
              width: 40,
              borderTop: `2px dashed ${GREEN}`,
              flexShrink: 0,
            }} />
            <span style={{ fontWeight: 600 }}>{edu.degree}</span>
          </div>
        ))}
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 18 }}>
        <RetroHeading>Experience</RetroHeading>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? 14 : 0 }}>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: DARK, marginBottom: 3 }}>
              {exp.company}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "#555",
              marginBottom: 5,
            }}>
              <span>{exp.role}</span>
              <div style={{ width: 36, borderTop: `2px dashed ${GREEN}`, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, color: DARK }}>{exp.years}</span>
            </div>
            <p style={{
              fontSize: 12,
              color: "#444",
              lineHeight: 1.65,
              margin: 0,
              textAlign: "justify",
            }}>
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    ),
    contact: (
      <div>
        <RetroHeading>Contact</RetroHeading>
        {[
          { icon: "📞", text: phone },
          { icon: "✉", text: email },
          { icon: "📍", text: address },
        ].filter(({ text }) => text).map(({ icon, text }) => (
          <div key={text} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12.5,
            color: DARK,
            marginBottom: 8,
          }}>
            <div style={{
              width: 26, height: 26,
              borderRadius: "50%",
              background: CREAM,
              border: `2px solid ${GREEN}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, flexShrink: 0,
            }}>
              {icon}
            </div>
            <span style={{ fontWeight: 600 }}>{text}</span>
          </div>
        ))}
      </div>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { about, skills, languages, education, experience, phone, email, address },
    { sidebar: ["skillsLanguages"], main: ["education", "experience", "contact"], minMain: 2 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
        .retro-cv * { box-sizing: border-box; }
      `}</style>

      <div className="retro-cv" style={{
        width: 660,
        minHeight: 940,
        background: CREAM,
        fontFamily: "'Nunito', sans-serif",
        color: DARK,
        padding: "20px 24px 32px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Pink blob bottom-left decoration */}
        <div style={{
          position: "absolute",
          bottom: -40, left: -40,
          width: 180, height: 130,
          background: PINK,
          borderRadius: "60% 40% 50% 50% / 50% 40% 60% 50%",
          zIndex: 0,
          opacity: 0.7,
        }} />

        {/* ── TOP BAR ─────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          position: "relative", zIndex: 1,
        }}>
          <GlobeBadge />
          {/* Long horizontal line */}
          <div style={{ flex: 1, height: 1.5, background: GREEN, margin: "0 14px" }} />
          {/* Title pill */}
          <div style={{
            background: CREAM,
            border: `2px solid ${GREEN}`,
            borderRadius: 20,
            padding: "5px 16px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: GREEN,
          }}>
            {title}
          </div>
        </div>

        {/* ── HEADER: photo + name ─────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "210px 1fr",
          gap: 20,
          marginBottom: 20,
          position: "relative", zIndex: 1,
        }}>

          {/* Photo + Hell-o badge */}
          <div style={{ position: "relative" }}>
            {/* Oval photo */}
            <div style={{
              width: 190,
              height: 210,
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${DARK}`,
              background: "#2a2a2a",
            }}>
              {photo ? (
                <img src={photo} alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(160deg, #3a3a3a, #1a1a1a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="70" height="70" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.3)" />
                    <ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.3)" />
                  </svg>
                </div>
              )}
            </div>

            {/* Hell-o badge over photo bottom */}
            <div style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: ORANGE,
              border: `2px solid ${DARK}`,
              borderRadius: 14,
              padding: "6px 20px",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 18,
              color: WHITE,
              boxShadow: `3px 3px 0 ${DARK}`,
              whiteSpace: "nowrap",
              zIndex: 3,
            }}>
              Hell-o
            </div>
          </div>

          {/* Name + About */}
          <div style={{ paddingTop: 8 }}>
            {/* Pink blob behind name */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{
                position: "absolute",
                top: 10, left: -10,
                width: "100%", height: 70,
                background: PINK,
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                zIndex: 0,
              }} />
              <h1 style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: 56,
                color: GREEN,
                lineHeight: 0.95,
                margin: 0,
                letterSpacing: -1,
                position: "relative", zIndex: 1,
              }}>
                {firstName}<br />{lastName}
              </h1>
            </div>

            {/* About me section */}
            {sectionBlocks.about}
          </div>
        </div>

        {/* ── BODY: two columns ──────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 16,
          position: "relative", zIndex: 1,
        }}>

          {/* ── LEFT SIDEBAR ──────────────────────────── */}
          <div>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT COLUMN ────────────────────────── */}
          <div style={{
            border: `2px solid ${GREEN}`,
            borderRadius: 16,
            padding: "16px 18px",
            background: CREAM,
          }}>

            {/* Education */}
            {main.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}

            {/* Smiley sun bottom-right */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <SmileySun />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Demo wrapper ──────────────────────────────────────────
export default function App() {
  const [zoom, setZoom] = useState(0.88);
  return (
    <div style={{
      background: "#e8ddd0",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 20px",
      gap: 20,
    }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.75, 0.88, 1].map((z) => (
          <button key={z} onClick={() => setZoom(z)} style={{
            background: zoom === z ? GREEN : WHITE,
            color: zoom === z ? WHITE : DARK,
            border: `2px solid ${GREEN}`,
            borderRadius: 6, padding: "4px 12px",
            fontSize: 12, cursor: "pointer",
            fontFamily: "monospace", fontWeight: 700,
          }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        marginBottom: zoom < 1 ? -(940 * (1 - zoom)) : 0,
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
      }}>
        <RetroCreativeCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

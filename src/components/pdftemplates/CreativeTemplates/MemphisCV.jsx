// MemphisCV.jsx
// Colorful Memphis Retro CV Template
// Faithfully recreated from uploaded PDF design
// Usage: <MemphisCV data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

// ── Default sample data (mirrors the PDF) ─────────────────
const DEFAULT_DATA = {
  firstName: "Isabel",
  lastName: "Mercado",
  title: "GRAPHIC DESIGNER",
  photo: null, // pass a URL string or null
  profile:
    "Praesent ultricies, erat a consectetur pellentesque, est nisl ornare ante, id molestie leo mi ac urna. Duis cursus fringilla dignissim. Phasellus imperdiet velit in fermentum aliquet.",
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  website: "reallygreatsite.com",
  address: "123 Anywhere St., Any City, ST 12345",
  skills: [
    { name: "Creative", rating: 5 },
    { name: "Teamwork", rating: 4 },
    { name: "Attitude", rating: 4 },
  ],
  education: [
    { school: "Rimberio School", degree: "Bachelor of Graphic Designer", years: "2011 - 2014" },
    { school: "Borcelle University", degree: "Master of Graphic Designer", years: "2014 - 2018" },
  ],
  experience: [
    {
      company: "Studio Shodwe",
      location: "Sydney - Australia",
      years: "2018 - 2020",
      description:
        "Morbi vitae tincidunt est. Cras arcu ante, ornare ut auctor eu, varius vehicula massa.",
    },
    {
      company: "Ingoude Company",
      location: "Canberra - Australia",
      years: "2020 - 2022",
      description:
        "Morbi vitae tincidunt est. Cras arcu ante, ornare ut auctor eu, varius vehicula massa.",
    },
    {
      company: "Salford & Co.",
      location: "Adelaide - Australia",
      years: "2023 - Present",
      description:
        "Morbi vitae tincidunt est. Cras arcu ante, ornare ut auctor eu, varius vehicula massa.",
    },
  ],
};

// ── Dot rating component ───────────────────────────────────
function DotRating({ rating, max = 5 }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i} className="pdf-avoid-break"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: i < rating ? "#111" : "transparent",
            border: "2.5px solid #111",
          }}
        />
      ))}
    </div>
  );
}

// ── Section badge (pill with shadow offset) ───────────────
function SectionBadge({ label, color }) {
  const colors = {
    pink:   { bg: "#e8588a", text: "#fff" },
    green:  { bg: "#2d9e6b", text: "#fff" },
    orange: { bg: "#f5a623", text: "#fff" },
  };
  const c = colors[color] || colors.pink;
  return (
    <div
      style={{
        display: "inline-block",
        background: c.bg,
        color: c.text,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: 1,
        padding: "7px 22px",
        borderRadius: 40,
        border: "2.5px solid #111",
        boxShadow: "3px 3px 0 #111",
        marginBottom: 14,
      }}
    >
      {label}
    </div>
  );
}

// ── Bordered box (used for Education & Experience cards) ──
function BorderBox({ children }) {
  return (
    <div
      style={{
        border: "2.5px solid #111",
        borderRadius: 14,
        padding: "16px 18px",
        background: "#fff",
        boxShadow: "4px 4px 0 #111",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

// ── Bullet dot ────────────────────────────────────────────
function BulletDot({ color = "#2d9e6b" }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: color,
        border: "2.5px solid #111",
        flexShrink: 0,
        marginTop: 3,
      }}
    />
  );
}

// ── Photo placeholder ─────────────────────────────────────
function PhotoBox({ src }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 16,
        border: "3px solid #111",
        overflow: "hidden",
        background: "#e0d5c8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        position: "relative",
      }}
    >
      {src ? (
        <img src={src} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="30" r="18" fill="#aaa" />
          <ellipse cx="40" cy="68" rx="28" ry="18" fill="#aaa" />
        </svg>
      )}
    </div>
  );
}

// ── Contact row ───────────────────────────────────────────
function ContactRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#f5a623",
          border: "2px solid #111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 11.5, color: "#111", lineHeight: 1.4, paddingTop: 4 }}>{text}</span>
    </div>
  );
}

// ── Decorative Memphis shapes ─────────────────────────────
function SunBurst({ style }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" style={style}>
      <polygon points="32,2 36,22 54,8 38,26 58,32 38,38 54,56 36,42 32,62 28,42 10,56 26,38 6,32 26,26 10,8 28,22" fill="#f5a623" stroke="#111" strokeWidth="2" />
    </svg>
  );
}

function ZigZag({ style }) {
  return (
    <svg width="56" height="28" viewBox="0 0 56 28" style={style}>
      <polyline points="0,20 14,8 28,20 42,8 56,20" fill="none" stroke="#2d9e6b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function MemphisCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo, profile,
    phone, email, website, address,
    skills, education, experience,
  } = data;

  const sectionBlocks = {
    profile: (
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#f5a623",
              border: "2.5px solid #111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            👤
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "#111" }}>
            My Profile
          </span>
        </div>
        <p style={{ fontSize: 11.5, color: "#333", lineHeight: 1.65, margin: 0 }}>{profile}</p>
      </div>
    ),
    skills: (
      <BorderBox>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div
            style={{
              display: "inline-block",
              background: "#2d9e6b",
              color: "#fff",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 0.5,
              padding: "6px 20px",
              borderRadius: 40,
              border: "2.5px solid #111",
              boxShadow: "3px 3px 0 #111",
            }}
          >
            Personal Skills
          </div>
        </div>
        {skills.map((skill) => (
          <div
            key={skill.name} className="pdf-avoid-break"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#111" }}>
              {skill.name}
            </span>
            <DotRating rating={skill.rating} />
          </div>
        ))}
      </BorderBox>
    ),
    contact: (
      <div style={{ marginTop: 8 }}>
        <ContactRow icon="📞" text={phone} />
        <ContactRow icon="✉️" text={email} />
        <ContactRow icon="🌐" text={website} />
        <ContactRow icon="📍" text={address} />
      </div>
    ),
    education: (
      <div style={{ marginBottom: 20 }}>
        <SectionBadge label="Education" color="pink" />
        <BorderBox>
          {education.map((edu, i) => (
            <div
              key={i} className="pdf-avoid-break"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: i < education.length - 1 ? 14 : 0,
              }}
            >
              <BulletDot color="#2d9e6b" />
              <div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#111", marginBottom: 1 }}>
                  {edu.school}
                </div>
                <div style={{ fontSize: 12, color: "#555" }}>{edu.degree}</div>
                <div style={{ fontSize: 11.5, color: "#888" }}>{edu.years}</div>
              </div>
            </div>
          ))}
        </BorderBox>
      </div>
    ),
    experience: (
      <div>
        <SectionBadge label="Work Experience" color="orange" />
        <BorderBox>
          {experience.map((exp, i) => (
            <div
              key={i} className="pdf-avoid-break"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: i < experience.length - 1 ? 16 : 0,
              }}
            >
              <BulletDot color={i % 2 === 0 ? "#2d9e6b" : "#e8588a"} />
              <div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#111", marginBottom: 1 }}>
                  {exp.company}
                </div>
                <div style={{ fontSize: 11.5, color: "#888", marginBottom: 4 }}>
                  {exp.location}, {exp.years}
                </div>
                <div style={{ fontSize: 11.5, color: "#444", lineHeight: 1.6 }}>
                  {exp.description}
                </div>
              </div>
            </div>
          ))}
        </BorderBox>
      </div>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { profile, skills, phone, email, website, address, education, experience },
    { sidebar: ["profile", "skills", "contact"], main: ["education", "experience"], minMain: 1 }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap');
        .memphis-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      {/* Page wrapper — A4 proportions */}
      <div
        className="memphis-cv"
        style={{
          width: 680,
          minHeight: 960,
          background: "#f5c6d8",  /* hot pink background */
          fontFamily: "'Nunito Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
          border: "3px solid #111",
          borderRadius: 4,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#f5c6d8",
            borderBottom: "3px solid #111",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Traffic light dots */}
          <div style={{ display: "flex", gap: 7 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
              <div key={i} className="pdf-avoid-break" style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: "2px solid #111" }} />
            ))}
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 2, color: "#111" }}>
            CURRICULUM VITAE
          </span>
        </div>

        {/* Body — cream inner card */}
        <div
          style={{
            margin: "16px",
            background: "#f7f2eb",
            borderRadius: 12,
            border: "3px solid #111",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            minHeight: 880,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div
            style={{
              background: "#fdf5e6",
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
              position: "relative",
            }}
          >
            {/* Sun decoration */}
            <SunBurst style={{ position: "absolute", top: -10, left: -10, zIndex: 2 }} />

            {/* Photo */}
            <div style={{ marginTop: 36 }}>
              <PhotoBox src={photo} />
            </div>

            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────── */}
          <div style={{ padding: "28px 26px", position: "relative" }}>
            {/* Zigzag decoration */}
            <ZigZag style={{ position: "absolute", top: 12, right: 16 }} />

            {/* Name */}
            <div style={{ marginBottom: 16, paddingRight: 60 }}>
              <h1
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 48,
                  color: "#111",
                  lineHeight: 1.05,
                  margin: "0 0 12px 0",
                  letterSpacing: -1,
                }}
              >
                {firstName}
                <br />
                {lastName}
              </h1>

              {/* Title pill */}
              <div
                style={{
                  display: "inline-block",
                  background: "#2d9e6b",
                  color: "#fff",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: 2.5,
                  padding: "7px 20px",
                  borderRadius: 40,
                  border: "2.5px solid #111",
                  boxShadow: "3px 3px 0 #111",
                }}
              >
                {title}
              </div>
            </div>

            {/* Education */}
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

// ── Demo wrapper (for preview) ────────────────────────────
export default function App() {
  const [zoom, setZoom] = useState(0.85);

  return (
    <div
      style={{
        background: "#1a1a2e",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 20px",
        gap: 20,
      }}
    >
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ color: "#888", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            style={{
              background: zoom === z ? "#c8a96e" : "#1e2535",
              color: zoom === z ? "#111" : "#aaa",
              border: "1px solid #2d3748",
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

      {/* CV preview */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          marginBottom: zoom < 1 ? -(680 * (1 - zoom)) : 0,
        }}
      >
        <MemphisCV data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

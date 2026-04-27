// MinimalistCV2.jsx
// Minimalist CV Template — Clean White, Spaced-Caps Headings, Circle Timeline
// Faithfully recreated from uploaded PDF design
// Usage: <MinimalistCV2 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "LAYA",
  lastName: "ABDELRAHMAN",
  title: "Accounting Executive",
  email: "hello@reallygreatsite.com",
  website: "www.reallygreatsite.com",
  phone: "+123-456-7890",
  address: "123 Anywhere St., Any City",
  profile:
    "Highly motivated and detail-oriented Accounting Professional with strong experience in financial reporting, bookkeeping, and data analysis. Skilled in preparing financial statements, managing accounts payable/receivable, and performing reconciliations with a high level of accuracy. Known for strong analytical thinking, problem-solving abilities, and maintaining compliance with accounting standards.",
  education: [
    { degree: "Bachelor of Business Management", school: "Wardiere University", years: "2016 - 2020" },
    { degree: "Bachelor of Business Management", school: "Wardiere University", years: "2020 - 2023" },
  ],
  skills: [
    "Client Acquisition",
    "B2B Sales",
    "Negotiation",
    "Relationship Management",
    "Market Analysis",
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
      role: "Accounting Executive",
      company: "Timmerman Industries",
      years: "Jan 2024 - Present",
      bullets: [
        "Implemented cost-control measures resulting in a 15% reduction in operational expenses.",
        "Streamlined financial reporting processes, enhancing overall efficiency by 20%.",
      ],
    },
    {
      role: "Accountant",
      company: "Borcelle Industries",
      years: "Jun 2022 - Jan 2024",
      bullets: [
        "Managed month-end close processes, reducing closing time by 25%.",
        "Implemented a new financial forecasting system, improving accuracy by 18%.",
        "Spearheaded automation, decreasing manual workload by 30%.",
      ],
    },
    {
      role: "Junior Accountant",
      company: "Timmerman Industries",
      years: "Jan 2020 - Jun 2022",
      bullets: [
        "Managed month-end close processes, reducing closing time by 25%.",
        "Implemented a new financial forecasting system improving accuracy by 18%.",
        "Collaborated with cross-functional teams to develop and implement financial strategies, resulting in a 10% increase in revenue.",
      ],
    },
  ],
  references: [
    { name: "Harumi Kobayashi", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Bailey Dupont", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const DARK = "#1a1a1a";

// ── Spaced-caps section heading ────────────────────────────
function SectionHeading({ children }) {
  return (
    <h3 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: 5,
      color: DARK,
      textTransform: "uppercase",
      margin: "0 0 14px 0",
    }}>
      {children}
    </h3>
  );
}

// ── Full-width double rule (under name header) ─────────────
function DoubleRule() {
  return (
    <div style={{ margin: "14px 0 20px" }}>
      <div style={{ height: 2.5, background: DARK, marginBottom: 3 }} />
      <div style={{ height: 1, background: DARK }} />
    </div>
  );
}

// ── Single thin rule (between sections) ───────────────────
function ThinRule() {
  return <div style={{ height: 1, background: "#ddd", margin: "20px 0" }} />;
}

// ── Experience circle + bracket timeline item ──────────────
function ExpItem({ exp, isLast }) {
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: isLast ? 0 : 24 }}>
      {/* Circle + vertical bracket line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 16, height: 16,
          borderRadius: "50%",
          border: "2px solid #aaa",
          background: "#fff",
          flexShrink: 0,
          zIndex: 1,
          marginTop: 2,
        }} />
        {!isLast && (
          <div style={{ width: 1.5, flex: 1, background: "#ccc", minHeight: 30, marginTop: 3 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Role + company + years */}
        <div style={{
          borderLeft: "2.5px solid #ccc",
          paddingLeft: 12,
          marginBottom: 10,
        }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: DARK, marginBottom: 1 }}>
            {exp.role}
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>{exp.company}</div>
          <div style={{ fontSize: 11.5, color: "#888", marginTop: 1 }}>{exp.years}</div>
        </div>

        {/* Bullets */}
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {exp.bullets.map((b, i) => (
            <li key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 12,
              color: "#333",
              lineHeight: 1.65,
              marginBottom: 5,
            }}>
              <span style={{ color: DARK, flexShrink: 0, marginTop: 1 }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Main CV Component ─────────────────────────────────────
export function MinimalistCV2({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title,
    email, website, phone, address, profile,
    education, skills,
    experience, references,
  } = data;

  const sectionBlocks = {
    summary: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Career Summary</SectionHeading>
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
    ),
    contact: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Contact</SectionHeading>
        {[
          { icon: "📞", text: phone },
          { icon: "✉", text: email },
          { icon: "📍", text: address },
        ].filter(({ text }) => text).map(({ icon, text }) => (
          <div key={text} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            marginBottom: 9,
          }}>
            <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span style={{ fontSize: 12, color: "#444", lineHeight: 1.4 }}>{text}</span>
          </div>
        ))}
      </div>
    ),
    education: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Education</SectionHeading>
        {education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 12.5, color: DARK, marginBottom: 1 }}>
              {edu.degree}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>{edu.school}</div>
            <div style={{ fontSize: 11.5, color: "#999", marginTop: 2 }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div>
        <SectionHeading>Skills</SectionHeading>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {skills.map((s) => (
            <li key={s} style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "#333",
              marginBottom: 6,
              lineHeight: 1.4,
            }}>
              <span style={{ color: DARK, fontSize: 14, flexShrink: 0, lineHeight: 1 }}>•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 28 }}>
        <SectionHeading>Work Experience</SectionHeading>
        {experience.map((exp, i) => (
          <ExpItem key={i} exp={exp} isLast={i === experience.length - 1} />
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
                color: DARK,
                marginBottom: 2,
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                {ref.name}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{ref.company}</div>
              <div style={{ fontSize: 12, color: "#333", marginBottom: 2 }}>
                <strong style={{ fontWeight: 600 }}>Phone: </strong>{ref.phone}
              </div>
              <div style={{ fontSize: 12, color: "#333" }}>
                <strong style={{ fontWeight: 600 }}>Email : </strong>{ref.email}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar, main, present } = useDynamicSections(
    { profile, phone, email, address, education, skills, experience, references },
    {
      sidebar: ["contact", "education", "skills"],
      main: ["experience", "references"],
      minMain: 1,
      checks: { summary: (d) => Boolean(d.profile && d.profile.trim()) },
    }
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');
        .min2-cv * { box-sizing: border-box; }
      `}</style>

      <div className="min2-cv" style={{
        width: 700,
        minHeight: 1020,
        background: "#fff",
        fontFamily: "'Jost', sans-serif",
        color: DARK,
        padding: "48px 52px",
      }}>

        {/* ── NAME HEADER ─────────────────────────────── */}
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: 42,
            color: DARK,
            margin: "0 0 4px 0",
            letterSpacing: 4,
            lineHeight: 1,
          }}>
            {firstName} {lastName}
          </h1>
          <div style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: 14,
            color: "#555",
            letterSpacing: 3,
          }}>
            {title}
          </div>
        </div>

        <DoubleRule />

        {/* ── CAREER SUMMARY — full width ─────────────── */}
        <Section show={present.summary}>
          {sectionBlocks.summary}
        </Section>

        <ThinRule />

        {/* ── BODY: two columns ──────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: 40,
        }}>

          {/* ── LEFT SIDEBAR ───────────────────────── */}
          <div>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* ── RIGHT MAIN ─────────────────────────── */}
          <div>
            {main.map((key, idx) => (
              <Section key={key} show>
                {sectionBlocks[key]}
                {key !== main[main.length - 1] && <ThinRule />}
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
      background: "#f0ede8",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 20px",
      gap: 20,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "#666", fontSize: 13, fontFamily: "monospace" }}>Zoom:</span>
        {[0.6, 0.75, 0.85, 1].map((z) => (
          <button
            key={z}
            onClick={() => setZoom(z)}
            style={{
              background: zoom === z ? DARK : "#fff",
              color: zoom === z ? "#fff" : "#555",
              border: "1px solid #bbb",
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
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
      }}>
        <MinimalistCV2 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

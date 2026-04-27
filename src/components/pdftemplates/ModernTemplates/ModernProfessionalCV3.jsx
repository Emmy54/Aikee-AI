// ModernProfessionalCV3.jsx
// Modern Professional CV 3 — Circle Photo, Mixed-Weight Name, Clean Two-Column
// Usage: <ModernProfessionalCV3 data={cvData} />

import { useState } from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

const DEFAULT_DATA = {
  firstName: "OLIVIA",
  lastName: "SANCHEZ",
  title: "Product Designer",
  photo: null,
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  address: "123 Anywhere St., Any City",
  about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat.",
  education: [
    { years: "2020 - 2023", school: "Borcelle University", degree: "Bachelor of Business Management" },
    { years: "2016 - 2020", school: "Borcelle University", degree: "Bachelor of Business Management" },
    { years: "2014 - 2018", school: "Borcelle University", degree: "Bachelor of Business Management" },
  ],
  skills: ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"],
  languages: ["English", "Germany (basic)"],
  experience: [
    {
      company: "Arowwai Industries",
      location: "Sydney - Australia",
      years: "2020 - 2022",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat.",
    },
    {
      company: "Wardiere Inc.",
      location: "Sydney - Australia",
      years: "2016 - 2020",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat.",
    },
    {
      company: "Studio Showde",
      location: "Sydney - Australia",
      years: "2010 - 2015",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat.",
    },
  ],
  references: [
    { name: "Bailey Dupont", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harumi Kobayashi", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const DARK   = "#1a1a1a";
const GRAY   = "#f0eeec";
const WHITE  = "#fff";
const MID    = "#888";
const RULE   = "#d8d4d0";

function SideHeading({ children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 18, color: DARK, margin: "0 0 6px", fontStyle: "italic" }}>{children}</h3>
      <div style={{ height: 1, background: RULE }} />
    </div>
  );
}

function MainHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 20, color: DARK, margin: "0 0 7px", fontStyle: "italic" }}>{children}</h3>
      <div style={{ height: 1, background: RULE }} />
    </div>
  );
}

export function ModernProfessionalCV3({ data = DEFAULT_DATA }) {
  const { firstName, lastName, title, photo, phone, email, address, about, education, skills, languages, experience, references } = data;

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Contact</SideHeading>
        <div style={{ fontSize: 12.5, color: "#333", marginBottom: 5 }}>{phone}</div>
        <div style={{ fontSize: 12.5, color: "#333", marginBottom: 5 }}>{email}</div>
        <div style={{ fontSize: 12.5, color: "#333", marginBottom: 5 }}>{address}</div>
      </div>
    ),
    education: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Education</SideHeading>
        {education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "#333" }}>{edu.school}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{edu.degree}</div>
            <div style={{ fontSize: 11.5, color: "#999" }}>{edu.years}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Skills</SideHeading>
        {skills.map(s => <div key={s} style={{ fontSize: 12.5, color: "#333", marginBottom: 5 }}>{s}</div>)}
      </div>
    ),
    languages: (
      <div>
        <SideHeading>Language</SideHeading>
        {languages.map(l => <div key={l} style={{ fontSize: 12.5, color: "#333", marginBottom: 5 }}>{l}</div>)}
      </div>
    ),
    about: (
      <div style={{ marginBottom: 24 }}>
        <MainHeading>About Me</MainHeading>
        <p style={{ fontSize: 12.5, color: "#333", lineHeight: 1.75, margin: 0 }}>{about}</p>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 24 }}>
        <MainHeading>Experience</MainHeading>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? 18 : 0, paddingBottom: i < experience.length - 1 ? 18 : 0, borderBottom: i < experience.length - 1 ? `1px solid ${RULE}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: DARK }}>{exp.company}</span>
              <span style={{ fontSize: 12, color: MID }}>{exp.years}</span>
            </div>
            <div style={{ fontSize: 12, color: MID, marginBottom: 7 }}>{exp.location}</div>
            <p style={{ fontSize: 12, color: "#444", lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
          </div>
        ))}
      </div>
    ),
    references: (
      <div>
        <MainHeading>References</MainHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {references.map((ref, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: DARK, marginBottom: 2 }}>{ref.name}</div>
              <div style={{ fontSize: 12, color: MID, marginBottom: 5 }}>{ref.company}</div>
              <div style={{ fontSize: 12, color: "#333", marginBottom: 2 }}><strong>Phone: </strong>{ref.phone}</div>
              <div style={{ fontSize: 12, color: "#333" }}><strong>Email : </strong>{ref.email}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const { sidebar, main } = useDynamicSections(
    { phone, email, address, about, education, skills, languages, experience, references },
    {
      sidebar: ["contact", "education", "skills", "languages"],
      main: ["about", "experience", "references"],
      minMain: 2,
    }
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lato:wght@300;400;700&display=swap'); .mp3-cv * { box-sizing: border-box; }`}</style>
      <div className="mp3-cv" style={{ width: 700, minHeight: 1020, background: WHITE, fontFamily: "'Lato', sans-serif", color: DARK }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", background: GRAY, padding: "36px 36px 28px 32px", gap: 24, alignItems: "center" }}>
          {/* Circle photo */}
          <div style={{ width: 160, height: 160, borderRadius: "50%", overflow: "hidden", border: "3px solid #ccc", background: "#ddd", flexShrink: 0 }}>
            {photo ? (
              <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#c8c8c8,#a8a8a8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="28" r="18" fill="rgba(255,255,255,0.5)" /><ellipse cx="40" cy="66" rx="28" ry="18" fill="rgba(255,255,255,0.5)" /></svg>
              </div>
            )}
          </div>
          {/* Name */}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", margin: "0 0 6px", lineHeight: 1.0 }}>
              <span style={{ fontWeight: 400, fontSize: 38, color: DARK, letterSpacing: 1 }}>{firstName} </span>
              <span style={{ fontWeight: 900, fontSize: 38, color: DARK, letterSpacing: 1 }}>{lastName}</span>
            </h1>
            <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 14, color: MID, letterSpacing: 1 }}>{title}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 800 }}>
          <div style={{ padding: "24px 20px 28px 24px", borderRight: `1px solid ${RULE}` }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          <div style={{ padding: "24px 28px" }}>
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
    <div style={{ background: "#e8e4e0", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: 20 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0.6, 0.75, 0.85, 1].map(z => (
          <button key={z} onClick={() => setZoom(z)} style={{ background: zoom === z ? DARK : WHITE, color: zoom === z ? WHITE : DARK, border: "1px solid #bbb", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "monospace" }}>
            {Math.round(z * 100)}%
          </button>
        ))}
      </div>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", marginBottom: zoom < 1 ? -(1020 * (1 - zoom)) : 0, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
        <ModernProfessionalCV3 data={DEFAULT_DATA} />
      </div>
    </div>
  );
}

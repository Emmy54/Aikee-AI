// ModernStudentCV.jsx
// Modern Student CV — Circle Photo, Beige Year Pills, Italic Section Headings
// Includes: Experience, Project, Certifications, References
// Usage: <ModernStudentCV data={cvData} />

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
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est tempor, quis tempus arcu elementum. In elementum elit at dui tristique feugiat.",
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
      role: "UI/UX Designer",
      years: "2020 - 2022",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet.",
        "Donec hendrerit libero eget est tempor, quis tempus arcu elementum.",
        "In elementum elit at dui tristique feugiat.",
      ],
    },
  ],
  projects: [
    {
      company: "Wardiere Inc.",
      role: "Intern",
      years: "2016 - 2020",
      bullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet.",
        "Donec hendrerit libero eget est tempor, quis tempus arcu elementum.",
        "In elementum elit at dui tristique feugiat.",
      ],
    },
  ],
  certifications: [
    { name: "Google UX design", issuer: "Google", years: "2020" },
  ],
  references: [
    { name: "Bailey Dupont", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harumi Kobayashi", company: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ],
};

const DARK  = "#1a1a1a";
const MID   = "#666";
const LIGHT = "#aaa";
const RULE  = "#e0dbd6";
const PILL  = "#e8d8c8";
const WHITE = "#fff";
const GRAY  = "#f0eeec";

// ── Italic section heading (Playfair) with rule ───────────
function MainHeading({ children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 400, fontSize: 20,
        color: DARK, margin: "0 0 7px",
        fontStyle: "italic",
      }}>{children}</h3>
      <div style={{ height: 1, background: RULE }} />
    </div>
  );
}

function SideHeading({ children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 400, fontSize: 18,
        color: DARK, margin: "0 0 6px",
        fontStyle: "italic",
      }}>{children}</h3>
      <div style={{ height: 1, background: RULE }} />
    </div>
  );
}

// ── Experience / Project entry with bullets ───────────────
function Entry({ company, role, years, bullets }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
        <span style={{ fontWeight: 400, fontSize: 13, color: DARK }}>{company}</span>
        <span style={{ fontSize: 11.5, color: LIGHT }}>{years}</span>
      </div>
      {role && <div style={{ fontSize: 12, color: MID, fontStyle: "italic", marginBottom: 6 }}>{role}</div>}
      {bullets?.map((b, i) => (
        <div key={i} className="pdf-avoid-break" style={{ display: "flex", gap: 8, fontSize: 12, color: MID, lineHeight: 1.6, marginBottom: 5 }}>
          <span style={{ color: DARK, flexShrink: 0 }}>•</span><span>{b}</span>
        </div>
      ))}
    </div>
  );
}

export function ModernStudentCV({ data = DEFAULT_DATA }) {
  const {
    firstName, lastName, title, photo,
    phone, email, address,
    about, education, skills, languages,
    experience, projects, certifications, references,
  } = data;

  const contactItems = [
    { icon: "📞", text: phone },
    { icon: "✉", text: email },
    { icon: "📍", text: address },
  ].filter((item) => item.text);

  const safeEducation = Array.isArray(education)
    ? education.filter((edu) => edu && (edu.school || edu.degree || edu.years))
    : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(Boolean) : [];
  const safeExperience = Array.isArray(experience)
    ? experience.filter((exp) => exp && (exp.company || exp.role || exp.years || (exp.bullets || []).some(Boolean)))
    : [];
  const safeProjects = Array.isArray(projects)
    ? projects.filter((proj) => proj && (proj.company || proj.role || proj.years || (proj.bullets || []).some(Boolean)))
    : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.filter((cert) => cert && (cert.name || cert.issuer || cert.years))
    : [];
  const safeReferences = Array.isArray(references)
    ? references.filter((ref) => ref && (ref.name || ref.company || ref.phone || ref.email))
    : [];

  const { sidebar, main, present } = useDynamicSections(
    {
      summary: about,
      contact: contactItems,
      education: safeEducation,
      skills: safeSkills,
      languages: safeLanguages,
      experience: safeExperience,
      projects: safeProjects,
      certifications: safeCertifications,
      references: safeReferences,
    },
    {
      sidebar: ["contact", "education", "skills", "languages"],
      main: ["summary", "experience", "projects", "certifications", "references"],
      minMain: 1,
      checks: {
        contact: () => contactItems.length > 0,
      },
    }
  );

  const sectionBlocks = {
    contact: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Contact</SideHeading>
        {contactItems.map(({ icon, text }) => (
          <div key={`${icon} className="pdf-avoid-break"-${text}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 9 }}>
            <span style={{ fontSize: 13, color: MID, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span style={{ fontSize: 12, color: MID, lineHeight: 1.4 }}>{text}</span>
          </div>
        ))}
      </div>
    ),
    education: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Education</SideHeading>
        {safeEducation.map((e, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 12 }}>
            <div style={{ display: "inline-block", background: PILL, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: DARK, marginBottom: 3 }}>{e.years}</div>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: DARK }}>{e.school}</div>
            <div style={{ fontSize: 11.5, color: MID }}>{e.degree}</div>
          </div>
        ))}
      </div>
    ),
    skills: (
      <div style={{ marginBottom: 22 }}>
        <SideHeading>Skills</SideHeading>
        {safeSkills.map((s) => <div key={s} className="pdf-avoid-break" style={{ fontSize: 12.5, color: MID, marginBottom: 6 }}>{s}</div>)}
      </div>
    ),
    languages: (
      <div>
        <SideHeading>Language</SideHeading>
        {safeLanguages.map((l) => <div key={l} className="pdf-avoid-break" style={{ fontSize: 12.5, color: MID, marginBottom: 5 }}>{l}</div>)}
      </div>
    ),
    summary: (
      <div style={{ marginBottom: 22 }}>
        <MainHeading>About Me</MainHeading>
        <p style={{ fontSize: 12.5, color: MID, lineHeight: 1.75, margin: 0 }}>{about}</p>
      </div>
    ),
    experience: (
      <div style={{ marginBottom: 22 }}>
        <MainHeading>Experience</MainHeading>
        {safeExperience.map((exp, i) => <Entry key={i} {...exp} />)}
      </div>
    ),
    projects: (
      <div style={{ marginBottom: 22 }}>
        <MainHeading>Project</MainHeading>
        {safeProjects.map((p, i) => <Entry key={i} {...p} />)}
      </div>
    ),
    certifications: (
      <div style={{ marginBottom: 22 }}>
        <MainHeading>Certifications</MainHeading>
        {safeCertifications.map((c, i) => (
          <div key={i} className="pdf-avoid-break" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 400, fontSize: 13, color: DARK }}>{c.name}</span>
              <span style={{ fontSize: 11.5, color: LIGHT }}>{c.years}</span>
            </div>
            <div style={{ fontSize: 12, color: MID, fontStyle: "italic" }}>{c.issuer}</div>
          </div>
        ))}
      </div>
    ),
    references: (
      <div>
        <MainHeading>References</MainHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {safeReferences.map((ref, i) => (
            <div key={i} className="pdf-avoid-break">
              <div style={{ fontWeight: 700, fontSize: 13.5, color: DARK, marginBottom: 2 }}>{ref.name}</div>
              <div style={{ fontSize: 12, color: MID, marginBottom: 5 }}>{ref.company}</div>
              {ref.phone && <div style={{ fontSize: 12, color: DARK, marginBottom: 2 }}><strong>Phone: </strong>{ref.phone}</div>}
              {ref.email && <div style={{ fontSize: 12, color: DARK }}><strong>Email : </strong>{ref.email}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lato:wght@300;400;700&display=swap');
        .msc-cv * { box-sizing: border-box; }
        .pdf-avoid-break { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      <div className="msc-cv" style={{ width: 700, minHeight: 1060, background: WHITE, fontFamily: "'Lato', sans-serif", color: DARK }}>

        {/* ── HEADER ──────────────────────────────────── */}
        <div style={{ background: GRAY, display: "grid", gridTemplateColumns: "220px 1fr", alignItems: "center", padding: "32px 32px 28px", gap: 24 }}>
          {/* Circle photo */}
          <div style={{ width: 155, height: 155, borderRadius: "50%", overflow: "hidden", border: "3px solid #ccc", background: "#ddd", flexShrink: 0 }}>
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
              <span style={{ fontWeight: 400, fontSize: 36, color: DARK, letterSpacing: 1 }}>{firstName} </span>
              <span style={{ fontWeight: 900, fontSize: 36, color: DARK, letterSpacing: 1 }}>{lastName}</span>
            </h1>
            <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: 14, color: MID, letterSpacing: 1 }}>{title}</div>
          </div>
        </div>

        {/* ── BODY ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 860 }}>

          {/* LEFT SIDEBAR */}
          <div style={{ padding: "24px 20px 28px 24px", borderRight: `1px solid ${RULE}` }}>
            {sidebar.map((key) => (
              <Section key={key} show>
                {sectionBlocks[key]}
              </Section>
            ))}
          </div>

          {/* RIGHT MAIN */}
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

import React from "react";
import Section from "../../common/Section";
import { useDynamicSections } from "../../../utils/sectioning";

// Blue and Gray Simple Professional CV Template
function BlueGrayTemplate({ name, jobTitle, summary, phone, email, website, address, profileImage, skills, educations, experiences }) {
  const primaryColor = "#0066cc"; // Professional blue
  const accentColor = "#666666"; // Gray
  const lightGray = "#f5f5f5";

  const sectionBlocks = {
    summary: (
      <section style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: primaryColor,
            textTransform: "uppercase",
            marginBottom: 8,
            letterSpacing: "0.5px",
          }}
        >
          Professional Summary
        </h3>
        <p
          style={{
            fontSize: 11,
            color: accentColor,
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {summary}
        </p>
      </section>
    ),
    experience: (
      <section style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: primaryColor,
            textTransform: "uppercase",
            marginBottom: 8,
            letterSpacing: "0.5px",
          }}
        >
          Experience
        </h3>
        {experiences.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#000",
                  margin: 0,
                }}
              >
                {exp.company}
              </h4>
              {exp.location && (
                <span
                  style={{
                    fontSize: 10,
                    color: accentColor,
                  }}
                >
                  {/* {exp.location} */}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 10,
                color: accentColor,
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              {exp.description}
            </p>
          </div>
        ))}
      </section>
    ),
    education: (
      <section style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: primaryColor,
            textTransform: "uppercase",
            marginBottom: 8,
            letterSpacing: "0.5px",
          }}
        >
          Education
        </h3>
        {educations.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#000",
                  margin: 0,
                }}
              >
                {edu.school}
              </h4>
              {edu.years && (
                <span
                  style={{
                    fontSize: 10,
                    color: accentColor,
                  }}
                >
                  {edu.years}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 10,
                color: accentColor,
                margin: "4px 0 0 0",
              }}
            >
              {edu.degree}
            </p>
          </div>
        ))}
      </section>
    ),
    skills: (
      <section>
        <h3
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: primaryColor,
            textTransform: "uppercase",
            marginBottom: 8,
            letterSpacing: "0.5px",
          }}
        >
          Skills
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ fontSize: 10, color: accentColor }}>
              • {skill.name}
            </div>
          ))}
        </div>
      </section>
    ),
  };

  const { main, present } = useDynamicSections(
    { summary, experiences, educations, skills },
    { sidebar: [], main: ["summary", "experience", "education", "skills"], minMain: 2 }
  );

  return (
    <div className="flex overflow-hidden flex-col justify-center items-center bg-white h-[842px] w-[596px]">
      <div className="relative h-[845px] w-[596px] bg-white">
        {/* Top Blue Bar */}
        <div style={{ background: primaryColor, height: "4px" }} />

        <div style={{ padding: "40px 48px" }}>
          {/* Header Section */}
          <header style={{ marginBottom: 32, borderBottom: `2px solid ${lightGray}`, paddingBottom: 24 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: primaryColor,
                margin: 0,
                marginBottom: 4,
              }}
            >
              {name || "Your Name"}
            </h1>

            {jobTitle && (
              <h2
                style={{
                  fontSize: 16,
                  color: accentColor,
                  margin: 0,
                  marginBottom: 12,
                  fontWeight: "500",
                }}
              >
                {jobTitle}
              </h2>
            )}

            <div
              style={{
                display: "flex",
                gap: 16,
                fontSize: 11,
                color: accentColor,
                flexWrap: "wrap",
              }}
            >
              {email && <span>{email}</span>}
              {phone && <span>•</span>}
              {phone && <span>{phone}</span>}
              {address && <span>•</span>}
              {address && <span>{address}</span>}
              {website && <span>•</span>}
              {website && <span style={{ color: primaryColor }}>{website}</span>}
            </div>
          </header>

          {main.map((key) => (
            <Section key={key} show={present[key]}>
              {sectionBlocks[key]}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlueGrayTemplate;

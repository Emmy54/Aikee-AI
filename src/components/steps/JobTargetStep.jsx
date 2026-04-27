import { colors } from '../../constants/theme';

export default function JobTargetStep({
  stepNumber,
  stepTitle,
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  experienceLevel,
  setExperienceLevel,
  internshipDuration,
  setInternshipDuration,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>What role are you targeting?</h1>
      <p className="subtitle">Tell us about the position and company so our AI can tailor every section of your CV perfectly.</p>
      
      <div className="field" style={{ marginBottom: 28 }}>
        <label>What type of resume are you creating?</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <button
            className="btn"
            style={{
              flex: 1,
              background: experienceLevel === "regular" ? colors.primaryContainer : colors.surfaceContainerLow,
              color: experienceLevel === "regular" ? colors.onPrimary : colors.onSurface,
              border: "none",
              marginTop: 0,
              fontSize: "0.8125rem",
            }}
            onClick={() => setExperienceLevel("regular")}
          >
            💼 Regular CV
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: experienceLevel === "student" ? colors.primaryContainer : colors.surfaceContainerLow,
              color: experienceLevel === "student" ? colors.onPrimary : colors.onSurface,
              border: "none",
              marginTop: 0,
              fontSize: "0.8125rem",
            }}
            onClick={() => setExperienceLevel("student")}
          >
            📚 Student
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: experienceLevel === "entry-level" ? colors.primaryContainer : colors.surfaceContainerLow,
              color: experienceLevel === "entry-level" ? colors.onPrimary : colors.onSurface,
              border: "none",
              marginTop: 0,
              fontSize: "0.8125rem",
            }}
            onClick={() => setExperienceLevel("entry-level")}
          >
            🚀 Entry-Level
          </button>
          <button
            className="btn"
            style={{
              flex: 1,
              background: experienceLevel === "internship" ? colors.primaryContainer : colors.surfaceContainerLow,
              color: experienceLevel === "internship" ? colors.onPrimary : colors.onSurface,
              border: "none",
              marginTop: 0,
              fontSize: "0.8125rem",
            }}
            onClick={() => setExperienceLevel("internship")}
          >
            🎓 Internship
          </button>
        </div>
      </div>

      <div className="field">
        <label>Position / Role Title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Product Manager, Software Engineer, UX Designer"
        />
      </div>
      
      <div className="field">
        <label>Company Name</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Paystack, Google, Interswitch"
        />
      </div>
      
      {experienceLevel === "internship" && (
        <>
          <div className="field">
            <label>Internship Duration</label>
            <input
              value={internshipDuration}
              onChange={(e) => setInternshipDuration(e.target.value)}
              placeholder="e.g. 3 months (Summer 2024)"
            />
          </div>
          <div className="ai-bubble" style={{ fontSize: 13, padding: "12px 16px" }}>
            We'll ask you specific questions about your internship projects and contributions to highlight your learning and impact.
          </div>
        </>
      )}
      
      {experienceLevel === "entry-level" && (
        <div className="ai-bubble" style={{ fontSize: 13, padding: "12px 16px" }}>
          We'll focus on academic projects, certifications, and foundational skills to position you as a strong early-career candidate.
        </div>
      )}

      {experienceLevel === "student" && (
        <div className="ai-bubble" style={{ fontSize: 13, padding: "12px 16px" }}>
          We'll highlight coursework, projects, awards, and activities to showcase your potential.
        </div>
      )}

      <button className="btn btn-primary" onClick={next} disabled={!jobTitle}>
        Continue →
      </button>
      {back && (
        <button className="btn btn-ghost" onClick={back}>← Back</button>
      )}
    </div>
  );
}

import { colors } from '../../constants/theme';

export default function ExperienceStep({
  stepNumber,
  stepTitle,
  experiences,
  updateExp,
  removeExp,
  addExperience,
  experienceBullets,
  generateAIExperience,
  loadingExperience,
  geminiAvailable,
  aiEnabled,
  jobTitle,
  experienceLevel,
  onGoToProjects,
  next,
  back,
}) {
  const showNoExperienceLink = experienceLevel === "student";

  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Tell us about your work experience</h1>
      <p className="subtitle">Highlight achievements and projects that are relevant to a <strong style={{ color: colors.primary }}>{jobTitle}</strong> role.</p>

      <div className="ai-bubble">
        For each experience, write a brief description. I'll help you turn it into powerful, achievement-focused bullet points using AI.
      </div>

      {showNoExperienceLink && (
        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={onGoToProjects}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: colors.primary,
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            No experience yet? Add projects instead.
          </button>
        </div>
      )}

      {experiences.map((exp, idx) => (
        <div key={idx} style={{ marginBottom: 24 }}>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Company {idx + 1}</label>
              <input
                value={exp.company}
                onChange={(e) => updateExp(idx, "company", e.target.value)}
                placeholder="e.g. Tesla"
              />
            </div>
            <div className="field">
              <label>Position</label>
              <input
                value={exp.position}
                onChange={(e) => updateExp(idx, "position", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Start Date</label>
              <input
                value={exp.startDate}
                onChange={(e) => updateExp(idx, "startDate", e.target.value)}
                placeholder="e.g. Jun 2023"
              />
            </div>
            <div className="field">
              <label>End Date</label>
              <input
                value={exp.endDate}
                onChange={(e) => updateExp(idx, "endDate", e.target.value)}
                placeholder="e.g. Present"
              />
            </div>
          </div>
          <div className="field">
            <label>What did you accomplish here? (describe briefly)</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExp(idx, "description", e.target.value)}
              placeholder="I led the development of... I improved... I managed..."
              rows={4}
            />
          </div>

          {exp.description.length > 20 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div className="step-tag" style={{ marginBottom: 0 }}>AI Bullet Points</div>
                {/* {geminiAvailable && (
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "auto",
                      padding: "8px 16px",
                      fontSize: 12,
                      marginTop: 0,
                      opacity: 0.6,
                    }}
                    onClick={() => generateAIExperience(idx)}
                    disabled
                  >
                    Use Generate CV 
                  </button>
                )} */}
              </div>
              {experienceBullets[idx]?.length ? (
                <ul style={{ marginLeft: 20, marginBottom: 16 }}>
                  {experienceBullets[idx].map((bullet, b) => (
                    <li key={b}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {experiences.length > 1 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginBottom: "1rem", color: colors.onSurfaceVariant }}
              onClick={() => removeExp(idx)}
            >
              ✕ Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addExperience}>
        + Add Another Experience
      </button>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

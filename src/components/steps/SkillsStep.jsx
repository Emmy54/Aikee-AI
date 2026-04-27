import QuestionBlock from '../shared/QuestionBlock';
import { colors } from '../../constants/theme';

export default function SkillsStep({
  stepNumber,
  stepTitle,
  jobTitle,
  questions,
  skillAnswers,
  setSkillAnswers,
  selectedSkills,
  setSelectedSkills,
  toggleSkill,
  customSkill,
  setCustomSkill,
  geminiAvailable,
  loadingSkills,
  suggestedSkills,
  generateAISkills,
  aiEnabled,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Let's discover your skills</h1>
      <p className="subtitle">Our AI will ask you a few questions to surface the right skills for a <strong style={{ color: colors.primary }}>{jobTitle}</strong> role.</p>

      <div className="ai-bubble">
        I'll ask you {questions.length} quick questions about your background. Based on your answers, I'll automatically suggest the most relevant professional skills.
      </div>

      {questions.map((q, i) => (
        <QuestionBlock
          key={i}
          index={i}
          question={q}
          value={skillAnswers[i]}
          onChange={(idx, val) => setSkillAnswers((prev) => ({ ...prev, [idx]: val }))}
        />
      ))}

      {Object.keys(skillAnswers).length >= 2 && (
        <>
          <div style={{ marginTop: 28, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div className="step-tag">Suggested Skills — click to select</div>
              {geminiAvailable && (
                <button
                  className="btn btn-primary"
                  style={{
                    width: "auto",
                    padding: "8px 16px",
                    fontSize: 12,
                    marginTop: 0,
                    opacity: 0.6,
                  }}
                  onClick={generateAISkills}
                  disabled
                >
                  Use Generate CV (skills, experience, projects)
                </button>
              )}
            </div>
            <div>
              {suggestedSkills.map((skill) => (
                <span
                  key={skill}
                  className={`skill-tag ${selectedSkills.includes(skill) ? "selected" : ""}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="field" style={{ marginTop: 16 }}>
            <label>Add a custom skill</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="e.g. Adobe Photoshop"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customSkill.trim()) {
                    setSelectedSkills((p) => [...p, customSkill.trim()]);
                    setCustomSkill("");
                  }
                }}
              />
              <button
                className="btn btn-primary"
                style={{ width: "auto", padding: "14px 20px", marginTop: 0 }}
                onClick={() => {
                  if (customSkill.trim()) {
                    setSelectedSkills((p) => [...p, customSkill.trim()]);
                    setCustomSkill("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}

      <button className="btn btn-primary" onClick={next} style={{ marginTop: 24 }}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

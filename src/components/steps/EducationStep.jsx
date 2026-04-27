import { colors } from '../../constants/theme';

export default function EducationStep({
  stepNumber,
  stepTitle,
  educations,
  updateEdu,
  removeEdu,
  addEducation,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Your education & certifications</h1>
      <p className="subtitle">List your degrees, certifications, and relevant training.</p>

      {educations.map((edu, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <div className="field">
            <label>School / University {idx + 1}</label>
            <input
              value={edu.school}
              onChange={(e) => updateEdu(idx, "school", e.target.value)}
              placeholder="e.g. Stanford University"
            />
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Degree</label>
              <input
                value={edu.degree}
                onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                placeholder="e.g. Bachelor of Science"
              />
            </div>
            <div className="field">
              <label>Field of Study</label>
              <input
                value={edu.field}
                onChange={(e) => updateEdu(idx, "field", e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>
          <div className="field">
            <label>Graduation Year</label>
            <input
              value={edu.graduationYear}
              onChange={(e) => updateEdu(idx, "graduationYear", e.target.value)}
              placeholder="e.g. 2024"
            />
          </div>

          {educations.length > 1 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginBottom: "1rem", color: colors.onSurfaceVariant }}
              onClick={() => removeEdu(idx)}
            >
              ✕ Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addEducation}>
        + Add Another Education
      </button>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

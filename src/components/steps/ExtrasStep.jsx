import { colors } from '../../constants/theme';

const LANGUAGE_LEVELS = [
  "Basic",
  "Conversational",
  "Professional",
  "Fluent",
  "Native",
];

export default function ExtrasStep({
  stepNumber,
  stepTitle,
  languages,
  updateLanguage,
  addLanguage,
  removeLanguage,
  references,
  updateReference,
  addReference,
  removeReference,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>

      <div style={{ marginTop: 28 }}>
        <div className="step-tag">Languages</div>
        {languages.map((lang, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <div className="two-col">
              <div className="field">
                <label>Language</label>
                <input
                  value={lang.name}
                  onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                  placeholder="e.g. English"
                />
              </div>
              <div className="field">
                <label>Proficiency</label>
                <select
                  value={lang.level}
                  onChange={(e) => updateLanguage(idx, "level", e.target.value)}
                >
                  <option value="">Select level</option>
                  {LANGUAGE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {languages.length > 1 && (
              <button
                className="btn btn-ghost"
                style={{ width: "100%", marginTop: "0.625rem", color: colors.onSurfaceVariant }}
                onClick={() => removeLanguage(idx)}
              >
                ✕ Remove Language
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addLanguage}>
          + Add Another Language
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="step-tag">References</div>
        {references.map((ref, idx) => (
          <div key={idx} style={{ marginBottom: 18 }}>
            <div className="field">
              <label>Reference Name</label>
              <input
                value={ref.name}
                onChange={(e) => updateReference(idx, "name", e.target.value)}
                placeholder="e.g. Jane Doe"
              />
            </div>
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="field">
                <label>Title / Role</label>
                <input
                  value={ref.title}
                  onChange={(e) => updateReference(idx, "title", e.target.value)}
                  placeholder="e.g. Engineering Manager"
                />
              </div>
              <div className="field">
                <label>Company</label>
                <input
                  value={ref.company}
                  onChange={(e) => updateReference(idx, "company", e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>
            <div className="two-col">
              <div className="field">
                <label>Email</label>
                <input
                  value={ref.email}
                  onChange={(e) => updateReference(idx, "email", e.target.value)}
                  placeholder="e.g. jane@company.com"
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  value={ref.phone}
                  onChange={(e) => updateReference(idx, "phone", e.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                />
              </div>
            </div>
            {references.length > 1 && (
              <button
                className="btn btn-ghost"
                style={{ width: "100%", marginTop: "0.625rem", color: colors.onSurfaceVariant }}
                onClick={() => removeReference(idx)}
              >
                ✕ Remove Reference
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addReference}>
          + Add Another Reference
        </button>
      </div>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

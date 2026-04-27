import { colors } from '../../constants/theme';

export default function AwardsStep({
  stepNumber,
  stepTitle,
  awards,
  updateAward,
  addAward,
  removeAward,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Awards & achievements</h1>
      <p className="subtitle">Showcase academic awards, scholarships, or notable recognitions.</p>

      {awards.map((award, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <div className="field">
            <label>Award {idx + 1}</label>
            <input
              value={award.title}
              onChange={(e) => updateAward(idx, "title", e.target.value)}
              placeholder="e.g. Dean's List"
            />
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Issuer</label>
              <input
                value={award.issuer}
                onChange={(e) => updateAward(idx, "issuer", e.target.value)}
                placeholder="e.g. University of Lagos"
              />
            </div>
            <div className="field">
              <label>Year</label>
              <input
                value={award.year}
                onChange={(e) => updateAward(idx, "year", e.target.value)}
                placeholder="e.g. 2025"
              />
            </div>
          </div>

          {awards.length > 1 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginBottom: "1rem", color: colors.onSurfaceVariant }}
              onClick={() => removeAward(idx)}
            >
              ✕ Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addAward}>
        + Add Another Award
      </button>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

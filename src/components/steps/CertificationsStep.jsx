import { colors } from '../../constants/theme';

export default function CertificationsStep({
  stepNumber,
  stepTitle,
  certifications,
  updateCertification,
  removeCertification,
  addCertification,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Certifications (Optional)</h1>
      <p className="subtitle">Add any certifications or licenses you want to showcase.</p>

      {certifications.map((cert, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          <div className="field">
            <label>Certification {idx + 1}</label>
            <input
              value={cert.name}
              onChange={(e) => updateCertification(idx, "name", e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect"
            />
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Issuing Organization</label>
              <input
                value={cert.issuer}
                onChange={(e) => updateCertification(idx, "issuer", e.target.value)}
                placeholder="e.g. Amazon Web Services"
              />
            </div>
            <div className="field">
              <label>Year</label>
              <input
                value={cert.year}
                onChange={(e) => updateCertification(idx, "year", e.target.value)}
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          {certifications.length > 1 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginBottom: "1rem", color: colors.onSurfaceVariant }}
              onClick={() => removeCertification(idx)}
            >
              ✕ Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addCertification}>
        + Add Another Certification
      </button>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

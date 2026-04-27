export default function ExtraStep({
  stepNumber,
  stepTitle,
  extraDetails,
  setExtraDetails,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Extra details</h1>
      <p className="subtitle">Add anything else you'd like recruiters to know.</p>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Additional Information</label>
        <textarea
          rows={6}
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          placeholder="e.g. Open to relocation, available for internships, volunteer experience, etc."
        />
      </div>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

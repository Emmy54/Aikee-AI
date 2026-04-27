export default function InterestsStep({
  stepNumber,
  stepTitle,
  careerInterests,
  setCareerInterests,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Interests & career goals</h1>
      <p className="subtitle">Share the areas you're excited about and where you'd like to grow.</p>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Interests / Career Goals</label>
        <textarea
          rows={6}
          value={careerInterests}
          onChange={(e) => setCareerInterests(e.target.value)}
          placeholder="e.g. Interested in product design, eager to learn user research and accessibility best practices."
        />
      </div>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

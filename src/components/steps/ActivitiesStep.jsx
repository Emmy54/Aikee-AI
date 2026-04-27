export default function ActivitiesStep({
  stepNumber,
  stepTitle,
  activities,
  setActivities,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Activities & hobbies</h1>
      <p className="subtitle">Include clubs, volunteering, or hobbies that show leadership and teamwork.</p>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Activities / Hobbies</label>
        <textarea
          rows={6}
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          placeholder="e.g. Tech club lead, volunteer tutor, chess, soccer."
        />
      </div>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

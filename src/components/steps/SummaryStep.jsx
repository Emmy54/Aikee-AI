import { colors } from '../../constants/theme';

export default function SummaryStep({
  stepNumber,
  stepTitle,
  professionalSummary,
  setProfessionalSummary,
  geminiAvailable,
  aiEnabled,
  onMakeCasual,
  onMakeProfessional,
  onGenerateFullAI,
  loadingTone,
  loadingFullAI,
  fullAIError,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <p className="subtitle">Write a short summary that highlights your strengths and goals.</p>

      <div className="field" style={{ marginTop: 16 }}>
        <label>Professional Summary / About Me</label>
        <textarea
          rows={6}
          value={professionalSummary}
          onChange={(e) => setProfessionalSummary(e.target.value)}
          placeholder="Write a concise 2-4 sentence summary that highlights your strengths and goals."
        />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="btn btn-primary"
          style={{ width: "auto", padding: "12px 18px", marginTop: 0, opacity: loadingFullAI ? 0.6 : 1 }}
          onClick={onGenerateFullAI}
          disabled={!geminiAvailable || loadingFullAI}
        >
          {loadingFullAI ? "Generating CV..." : "Click here to Generate CV"}
        </button>
        {/* <button
          className="btn btn-ghost"
          style={{ width: "auto", padding: "12px 18px", marginTop: 0, opacity: 0.6 }}
          onClick={onMakeCasual}
          disabled
        >
          Tone AI disabled
        </button> */}
        {/* <button
          className="btn btn-ghost"
          style={{ width: "auto", padding: "12px 18px", marginTop: 0, opacity: 0.6 }}
          onClick={onMakeProfessional}
          disabled
        >
          Tone AI disabled
        </button> */}
      </div>

      {fullAIError && (
        <div
          role="alert"
          style={{
            marginTop: 12,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #f2c6c6",
            background: "#fdecec",
            color: "#8a1f1f",
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          {fullAIError}
        </div>
      )}
      
      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

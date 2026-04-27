import { colors } from '../../constants/theme';

export default function ProjectsStep({
  stepNumber,
  stepTitle,
  projects,
  updateProject,
  addProject,
  removeProject,
  projectBullets,
  next,
  back,
}) {
  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Projects & school work</h1>
      <p className="subtitle">Highlight academic, personal, or group projects that show relevant skills.</p>

      {projects.map((project, idx) => (
        <div key={idx} style={{ marginBottom: 24 }}>
          <div className="field">
            <label>Project Name {idx + 1}</label>
            <input
              value={project.name}
              onChange={(e) => updateProject(idx, "name", e.target.value)}
              placeholder="e.g. Inventory Tracker Web App"
            />
          </div>
          <div className="two-col" style={{ marginBottom: 16 }}>
            <div className="field">
              <label>Role / Context</label>
              <input
                value={project.role}
                onChange={(e) => updateProject(idx, "role", e.target.value)}
                placeholder="e.g. Team Lead, Capstone Project"
              />
            </div>
            <div className="field">
              <label>Tools / Tech</label>
              <input
                value={project.tools}
                onChange={(e) => updateProject(idx, "tools", e.target.value)}
                placeholder="e.g. React, Node, Figma"
              />
            </div>
          </div>
          <div className="field">
            <label>What did you build or learn?</label>
            <textarea
              rows={4}
              value={project.description}
              onChange={(e) => updateProject(idx, "description", e.target.value)}
              placeholder="Describe the project scope, your contribution, and outcomes."
            />
          </div>

          {projectBullets?.[idx]?.length ? (
            <div>
              <div className="step-tag" style={{ marginBottom: 12 }}>AI Bullet Points</div>
              <ul style={{ marginLeft: 20, marginBottom: 16 }}>
                {projectBullets[idx].map((bullet, b) => (
                  <li key={b}>{bullet}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {projects.length > 1 && (
            <button
              className="btn btn-ghost"
              style={{ width: "100%", marginBottom: "1rem", color: colors.onSurfaceVariant }}
              onClick={() => removeProject(idx)}
            >
              ✕ Remove
            </button>
          )}
        </div>
      ))}

      <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 16 }} onClick={addProject}>
        + Add Another Project
      </button>

      <button className="btn btn-primary" onClick={next}>Continue →</button>
      <button className="btn btn-ghost" onClick={back}>← Back</button>
    </div>
  );
}

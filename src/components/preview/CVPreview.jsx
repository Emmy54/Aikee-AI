import { useMemo, useState } from 'react';
import { colors } from '../../constants/theme';
import TemplateSelector from './TemplateSelector';
import { useCVTemplates, resolveFolderSelection } from './cvTemplateEngine';
import useTemplateScale from './useTemplateScale';

export default function CVPreview({
  stepNumber,
  stepTitle,
  experienceLevel,
  name,
  jobTitle,
  company,
  email,
  phone,
  address,
  photoPreview,
  summary,
  allSkills,
  experiences,
  educations,
  certifications,
  languages,
  references,
  projects,
  projectBullets,
  careerInterests,
  extraDetails,
  awards,
  activities,
  experienceBullets,
  enhancedCVData,
  loadingEnhancedCV,
  fallbackUsed,
  generateSummary,
  generatePDF,
  loadingPDF,
  next,
  back,
  // Template selection is owned by BuilderApp so the choice made in the live
  // preview pane carries through to this final step.
  selectedFolder,
  selectedTemplate,
  onSelectFolder,
  onSelectTemplate,
}) {
  const [viewMode, setViewMode] = useState('text'); // 'text' or 'template'

  const cv = useMemo(
    () => ({
      name,
      jobTitle,
      email,
      phone,
      address,
      photoPreview,
      summary,
      allSkills,
      experiences,
      educations,
      certifications,
      languages,
      references,
      projects,
      projectBullets,
      awards,
      experienceBullets,
    }),
    [
      name, jobTitle, email, phone, address, photoPreview, summary, allSkills,
      experiences, educations, certifications, languages, references, projects,
      projectBullets, awards, experienceBullets,
    ]
  );

  const {
    data,
    templateRegistry,
    folders,
    isExperienceLevel,
    visibleExperienceSections,
    currentTemplates,
    activeTemplate,
    renderTemplate,
  } = useCVTemplates({ cv, experienceLevel, selectedFolder, selectedTemplate });

  const { displayExperiences, displayExperienceBullets } = data;

  const { ref: templatePreviewRef, scaleStyle } = useTemplateScale({
    enabled: viewMode === 'template',
    deps: [viewMode, activeTemplate?.id, selectedFolder],
  });

  const handleSelectFolder = (folder, templateId) => {
    const nextSelection = resolveFolderSelection({
      registry: templateRegistry,
      isExperienceLevel,
      folder,
      templateId,
    });
    if (nextSelection.folder) onSelectFolder(nextSelection.folder);
    if (nextSelection.templateId) onSelectTemplate(nextSelection.templateId);
  };

  return (
    <div className="card">
      <div className="step-tag">Step {stepNumber} — {stepTitle}</div>
      <h1>Your CV is ready!</h1>
      <p className="subtitle">Review your CV below and download as PDF.</p>

      {/* View Mode Toggle */}
      <div style={{ marginTop: 16, marginBottom: 16, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setViewMode('text')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'text' ? colors.primary : colors.surfaceContainerLow,
            color: viewMode === 'text' ? colors.onPrimary : colors.onSurface,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          📄 Text Preview
        </button>
        <button
          onClick={() => setViewMode('template')}
          style={{
            padding: '8px 16px',
            backgroundColor: viewMode === 'template' ? colors.primary : colors.surfaceContainerLow,
            color: viewMode === 'template' ? colors.onPrimary : colors.onSurface,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          🎨 Styled Template
        </button>
      </div>

      {viewMode === 'text' ? (
        <div style={{ marginTop: 24 }}>
          <div className="preview-grid">
          {/* CV Preview */}
          <div
            id="cv-preview"
            className="cv-page"
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              border: `1px solid ${colors.outlineVariant}`,
              borderRadius: 12,
              padding: 24,
              fontFamily: "Georgia, serif",
              fontSize: 13,
              lineHeight: 1.6,
              color: colors.onSurface,
              overflow: "auto",
              maxHeight: "600px",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 16, borderBottom: `2px solid ${colors.primary}`, paddingBottom: 16 }}>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Profile"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    marginBottom: 12,
                    border: `2px solid ${colors.primary}`,
                  }}
                />
              )}
              <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>{name || "Your Name"}</div>
              <div style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 4 }}>
                {jobTitle || "Job Title"} {company ? `at ${company}` : ""}
              </div>
              <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                {email && <div>{email}</div>}
                {phone && <div>{phone}</div>}
                {address && <div>{address}</div>}
              </div>
            </div>

            {/* Summary */}
            {summary && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Professional Summary
                </div>
                <div style={{ marginBottom: 16, fontSize: 12, whiteSpace: "pre-wrap" }}>{summary}</div>
              </>
            )}

            {careerInterests && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Interests & Career Goals
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{careerInterests}</div>
              </>
            )}

            {/* Languages */}
            {languages && languages.some((lang) => lang.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Languages
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {languages
                    .filter((lang) => lang.name)
                    .map((lang) => `${lang.name}${lang.level ? ` — ${lang.level}` : ""}`)
                    .join(", ")}
                </div>
              </>
            )}

            {/* Skills */}
            {(allSkills.length > 0 || (enhancedCVData?.recommendedSkills?.length > 0)) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Skills
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {enhancedCVData?.recommendedSkills?.length > 0
                    ? enhancedCVData.recommendedSkills.join(", ")
                    : allSkills.join(", ")}
                </div>
              </>
            )}

            {projects && projects.some((project) => project.name || project.description) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Projects / School Work
                </div>
                {projects
                  .filter((project) => project.name || project.description)
                  .map((project, idx) => (
                    <div key={idx} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{project.name || "Project"}</div>
                      <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                        {[project.role, project.tools].filter(Boolean).join(" • ")}
                      </div>
                      {projectBullets?.[idx]?.length ? (
                        <ul style={{ marginLeft: 16, marginTop: 4, fontSize: 11 }}>
                          {projectBullets[idx].map((bullet, b) => (
                            <li key={b}>{bullet}</li>
                          ))}
                        </ul>
                      ) : project.description ? (
                        <div style={{ fontSize: 11, marginTop: 4, whiteSpace: "pre-wrap" }}>
                          {project.description}
                        </div>
                      ) : null}
                    </div>
                  ))}
              </>
            )}

            {/* Key Strengths (from enhanced analysis) */}
            {enhancedCVData?.keyStrengths?.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Key Strengths
                </div>
                <div style={{ marginBottom: 16, fontSize: 11 }}>
                  {enhancedCVData.keyStrengths.join(" • ")}
                </div>
              </>
            )}

            {/* Experience */}
            {displayExperiences.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Experience
                </div>
                {displayExperiences.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: "bold", fontSize: 12 }}>{exp.position}</div>
                    <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>{exp.company}</div>
                    {displayExperienceBullets[idx] && displayExperienceBullets[idx].length > 0 ? (
                      <ul style={{ marginLeft: 16, marginTop: 4, fontSize: 11 }}>
                        {displayExperienceBullets[idx].map((bullet, b) => (
                          <li key={b}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Education
                </div>
                {educations.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: "bold", fontSize: 12 }}>{edu.degree}</div>
                    <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                      {edu.school} {edu.graduationYear && `— ${edu.graduationYear}`}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Certifications */}
            {certifications && certifications.some((cert) => cert.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Certifications
                </div>
                {certifications
                  .filter((cert) => cert.name)
                  .map((cert, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{cert.name}</div>
                      <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                        {[cert.issuer, cert.year].filter(Boolean).join(" — ")}
                      </div>
                    </div>
                  ))}
              </>
            )}

            {awards && awards.some((award) => award.title) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Awards & Achievements
                </div>
                {awards
                  .filter((award) => award.title)
                  .map((award, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{award.title}</div>
                      <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                        {[award.issuer, award.year].filter(Boolean).join(" — ")}
                      </div>
                    </div>
                  ))}
              </>
            )}

            {activities && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Activities & Hobbies
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{activities}</div>
              </>
            )}

            {extraDetails && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  Extra Details
                </div>
                <div style={{ marginBottom: 16, fontSize: 11, whiteSpace: "pre-wrap" }}>{extraDetails}</div>
              </>
            )}

            {/* References */}
            {references && references.some((ref) => ref.name) && (
              <>
                <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, textTransform: "uppercase", color: colors.primary }}>
                  References
                </div>
                {references
                  .filter((ref) => ref.name)
                  .map((ref, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: "bold", fontSize: 12 }}>{ref.name}</div>
                      <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                        {[ref.title, ref.company].filter(Boolean).join(" — ")}
                      </div>
                      <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                        {[ref.email, ref.phone].filter(Boolean).join(" • ")}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Controls & Enhanced Insights */}
          <div>
            {loadingEnhancedCV && (
              <div style={{ backgroundColor: colors.surfaceContainerLow, padding: 20, borderRadius: 8, marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: colors.onSurface, marginBottom: 8 }}>
                  🤖 AI Analysis in Progress...
                </div>
                <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                  Analyzing your skills and experience for enhanced recommendations.
                </div>
              </div>
            )}

            {enhancedCVData && (
              <div style={{ backgroundColor: colors.surfaceContainerLow, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.onSurface, marginBottom: 12 }}>
                  ✨ AI-Enhanced Insights
                </div>

                {enhancedCVData.keyStrengths && enhancedCVData.keyStrengths.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: colors.onSurfaceVariant, marginBottom: 4 }}>
                      KEY STRENGTHS
                    </div>
                    <div style={{ fontSize: 11, color: colors.onSurface }}>
                      {enhancedCVData.keyStrengths.map((s, i) => (
                        <div key={i}>• {s}</div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedCVData.experienceEnhancements?.keyThemes && enhancedCVData.experienceEnhancements.keyThemes.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: colors.onSurfaceVariant, marginBottom: 4 }}>
                      KEY THEMES
                    </div>
                    <div style={{ fontSize: 11, color: colors.onSurface }}>
                      {enhancedCVData.experienceEnhancements.keyThemes.map((t, i) => (
                        <div key={i}>• {t}</div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedCVData.experienceEnhancements?.advice && (
                  <div style={{ fontSize: 10, color: colors.onSurfaceVariant, fontStyle: "italic", lineHeight: 1.5 }}>
                    💡 {enhancedCVData.experienceEnhancements.advice}
                  </div>
                )}
              </div>
            )}

            {!enhancedCVData && !loadingEnhancedCV && (
              <div style={{ backgroundColor: colors.surfaceContainerLow, padding: 16, borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: colors.onSurface, marginBottom: 8 }}>
                  <strong>CV Ready!</strong> Your CV has been generated with AI-powered content and professional formatting.
                </div>
                <div style={{ fontSize: 11, color: colors.onSurfaceVariant }}>
                  Review the preview on the left, make any edits, then download as PDF.
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: 12, opacity: loadingPDF ? 0.6 : 1 }}
              onClick={generatePDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? "Generating PDF..." : "📥 Download as PDF"}
            </button>
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={back}>
              ← Back to Edit
            </button>
          </div>
        </div>
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {fallbackUsed && (
            <div style={{
              backgroundColor: colors.surfaceContainerLow,
              border: `1px solid ${colors.outlineVariant}`,
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 12,
              color: colors.onSurface,
              marginBottom: 12,
            }}>
              AI fallback key used due to rate-limit or quota limits.
            </div>
          )}
          {/* Template Selector */}
          <TemplateSelector
            experienceSections={visibleExperienceSections}
            hideRegularSelectors={isExperienceLevel}
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={handleSelectFolder}
            templates={currentTemplates}
            selectedTemplate={activeTemplate?.id}
            onSelectTemplate={onSelectTemplate}
          />

          {/* Template Preview */}
          {isExperienceLevel && currentTemplates.length === 0 ? (
            <div
              className="template-preview"
              style={{
                border: `1px dashed ${colors.outlineVariant}`,
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                color: colors.onSurfaceVariant,
              }}
            >
              No templates yet for this section. Add new templates to see a preview here.
            </div>
          ) : (
            <div className="template-preview" ref={templatePreviewRef}>
              <div className="template-scale" style={scaleStyle}>
                <div id="cv-preview" className="cv-page">
                  {renderTemplate()}
                </div>
              </div>
            </div>
          )}

          {/* Download and Back Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              style={{ opacity: loadingPDF ? 0.6 : 1 }}
              onClick={generatePDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? "Generating PDF..." : "📥 Download as PDF"}
            </button>
            <button className="btn btn-ghost" onClick={back}>
              ← Back to Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

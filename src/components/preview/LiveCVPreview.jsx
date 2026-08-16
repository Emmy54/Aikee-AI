// LiveCVPreview.jsx
// Always-visible right-hand pane: renders the selected CV template live as the user fills
// in the question steps.
//
// NOTE: this pane uses id="live-cv-preview", NOT "cv-preview". generatePDF() in BuilderApp
// resolves its export target with document.getElementById("cv-preview"), which returns the
// FIRST match in document order — reusing that id here would silently export the wrong node.

import { colors } from '../../constants/theme';
import { useCVTemplates } from './cvTemplateEngine';
import useTemplateScale from './useTemplateScale';

export default function LiveCVPreview({
  cv,
  experienceLevel,
  selectedFolder,
  selectedTemplate,
  onSelectTemplate,
  active = true,
}) {
  const {
    isExperienceLevel,
    currentTemplates,
    activeTemplate,
    renderTemplate,
    templateRegistry,
  } = useCVTemplates({ cv, experienceLevel, selectedFolder, selectedTemplate });

  const { ref, scaleStyle } = useTemplateScale({
    enabled: active,
    deps: [activeTemplate?.id, isExperienceLevel],
  });

  // Early-career levels get one flat list; regular levels are grouped by folder.
  const pickerGroups = isExperienceLevel
    ? [{ folder: 'Early Career', templates: currentTemplates }]
    : [...new Set(templateRegistry.map((t) => t.folder))].map((folder) => ({
        folder,
        templates: templateRegistry.filter((t) => t.folder === folder),
      }));

  const hasTemplates = currentTemplates.length > 0;

  // Report the folder alongside the id. Without this, choosing a template from a
  // different folder here would be reverted by the final step, which filters the
  // registry by selectedFolder.
  const handleChange = (templateId) => {
    const picked = templateRegistry.find((t) => t.id === templateId);
    onSelectTemplate(templateId, picked?.folder);
  };

  return (
    <div className="live-preview">
      <div className="live-preview-bar">
        <span className="live-preview-label">Live Preview</span>
        <select
          className="live-preview-select"
          value={activeTemplate?.id || ''}
          onChange={(e) => handleChange(e.target.value)}
          aria-label="Choose CV template"
        >
          {pickerGroups.map((group) => (
            <optgroup key={group.folder} label={group.folder}>
              {group.templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {hasTemplates ? (
        <div className="live-preview-stage" ref={ref}>
          <div className="live-preview-scale" style={scaleStyle}>
            {/* Deliberately NOT id="cv-preview" — see file header. */}
            <div id="live-cv-preview" className="cv-page">
              {renderTemplate()}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="live-preview-stage"
          style={{
            border: `1px dashed ${colors.outlineVariant}`,
            color: colors.onSurfaceVariant,
            fontSize: 13,
            textAlign: 'center',
            padding: 24,
          }}
        >
          No templates available for this resume type yet.
        </div>
      )}
    </div>
  );
}

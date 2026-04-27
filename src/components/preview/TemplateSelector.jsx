import React from "react";

export default function TemplateSelector({
  experienceSections = [],
  hideRegularSelectors = false,
  folders,
  selectedFolder,
  onSelectFolder,
  templates,
  selectedTemplate,
  onSelectTemplate,
}) {
  const renderTemplateGrid = (templateList, useFolderSelection = false) => {
    if (!templateList || templateList.length === 0) {
      return (
        <div style={{ padding: "12px 14px", border: "1px dashed #2a2a34", borderRadius: 8, color: "#888899", fontSize: 12 }}>
          No templates yet. Add new templates to this section.
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {templateList.map((template) => (
          <div
            key={template.id}
            onClick={() => {
              if (useFolderSelection && typeof onSelectFolder === "function") {
                onSelectFolder(template.folder, template.id);
                return;
              }
              onSelectTemplate(template.id);
            }}
            style={{
              padding: 16,
              backgroundColor: selectedTemplate === template.id ? "#c8a96e" : "#13131a",
              border: selectedTemplate === template.id ? "2px solid #e8c98e" : "1px solid #1e1e2e",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              if (selectedTemplate !== template.id) {
                e.currentTarget.style.borderColor = "#c8a96e";
                e.currentTarget.style.backgroundColor = "#1a1a24";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTemplate !== template.id) {
                e.currentTarget.style.backgroundColor = "#13131a";
                e.currentTarget.style.borderColor = "#1e1e2e";
              }
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: selectedTemplate === template.id ? "#0a0a0f" : "#e8e8f0", marginBottom: 4 }}>
              {template.label}
            </div>
            <div style={{ fontSize: 11, color: selectedTemplate === template.id ? "#333" : "#888899" }}>
              {template.description}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {experienceSections.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {experienceSections.map((section) => (
            <div key={section.level} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#e8e8f0" }}>
                {section.label}
              </div>
              {renderTemplateGrid(section.templates, true)}
            </div>
          ))}
        </div>
      )}

      {hideRegularSelectors ? null : (
        <>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#e8e8f0" }}>
        Select Template Folder
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => onSelectFolder(folder)}
            style={{
              padding: "8px 14px",
              backgroundColor: selectedFolder === folder ? "#c8a96e" : "#13131a",
              color: selectedFolder === folder ? "#0a0a0f" : "#e8e8f0",
              border: selectedFolder === folder ? "2px solid #e8c98e" : "1px solid #1e1e2e",
              borderRadius: 999,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.3,
            }}
          >
            {folder}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#e8e8f0" }}>
        Select CV Template
      </div>
      {renderTemplateGrid(templates)}
        </>
      )}
    </div>
  );
}

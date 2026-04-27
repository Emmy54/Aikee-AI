import { useState } from "react";
import { colors } from "../../constants/theme";

export default function SaveCVModal({
  isOpen,
  onClose,
  onSave,
  currentTitle = "",
  currentTargetRole = "",
  isSaving = false,
}) {
  const [title, setTitle] = useState(currentTitle);
  const [targetRole, setTargetRole] = useState(currentTargetRole);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!title.trim()) {
      setError("CV title is required");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        targetRole: targetRole.trim(),
      });
      setTitle("");
      setTargetRole("");
    } catch (err) {
      const errorMsg = err.message || "Failed to save CV";
      setError(errorMsg);
      console.error("Save error details:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: colors.surfaceContainerLowest,
          borderRadius: "1rem",
          boxShadow: "0 0.5rem 2rem rgba(0, 23, 75, 0.12)",
          maxWidth: "25rem",
          width: "90%",
          padding: "2rem",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", color: colors.primary, fontSize: "1.25rem", fontFamily: "'Manrope', sans-serif" }}>
          Save CV
        </h2>
        <p style={{ margin: "0 0 1.25rem 0", color: colors.onSurfaceVariant, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
          Save your CV to retrieve it later
        </p>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "none",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.8125rem",
              marginBottom: "1rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: "600",
              color: colors.onSurface,
              marginBottom: "0.375rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            CV Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Software Engineer CV - Google"
            style={{
              width: "100%",
              padding: "0.625rem 0.75rem",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxSizing: "border-box",
              fontFamily: "inherit",
              background: colors.surfaceContainerLow,
              color: colors.onSurface,
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: "600",
              color: colors.onSurface,
              marginBottom: "0.375rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Target Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            style={{
              width: "100%",
              padding: "0.625rem 0.75rem",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxSizing: "border-box",
              fontFamily: "inherit",
              background: colors.surfaceContainerLow,
              color: colors.onSurface,
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              padding: "0.625rem 1rem",
              background: colors.surfaceContainerLow,
              border: "none",
              borderRadius: "0.75rem",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: colors.onSurface,
              transition: "all 0.2s",
              opacity: isSaving ? 0.5 : 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: "0.625rem 1rem",
              background: colors.primary,
              border: "none",
              borderRadius: "0.75rem",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: colors.onPrimary,
              transition: "all 0.2s",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Saving..." : "Save CV"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

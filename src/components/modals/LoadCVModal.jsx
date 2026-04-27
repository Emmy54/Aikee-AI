import { useState, useEffect } from "react";
import { colors } from "../../constants/theme";

export default function LoadCVModal({
  isOpen,
  onClose,
  onLoad,
  isLoading = false,
  savedCVs = [],
}) {
  const [selectedCVId, setSelectedCVId] = useState(null);
  const [error, setError] = useState("");

  const handleLoad = async () => {
    setError("");

    if (!selectedCVId) {
      setError("Please select a CV");
      return;
    }

    try {
      await onLoad(selectedCVId);
      setSelectedCVId(null);
    } catch (err) {
      setError(err.message || "Failed to load CV");
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
          maxWidth: "31.25rem",
          width: "90%",
          maxHeight: "70vh",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 0.5rem 0", color: colors.primary, fontSize: "1.25rem", fontFamily: "'Manrope', sans-serif" }}>
          Load CV
        </h2>
        <p style={{ margin: "0 0 1.25rem 0", color: colors.onSurfaceVariant, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
          Select a saved CV to continue editing
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

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  border: `3px solid ${colors.surfaceContainerHigh}`,
                  borderTop: `3px solid ${colors.primary}`,
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                  margin: "0 auto 0.75rem",
                }}
              />
              <p style={{ margin: 0, color: colors.onSurfaceVariant, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Loading CVs...
              </p>
            </div>
          </div>
        ) : savedCVs.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: colors.onSurfaceVariant,
              fontSize: "0.875rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <p style={{ margin: 0 }}>No saved CVs yet</p>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "1.25rem",
              paddingRight: "0.5rem",
            }}
          >
            {savedCVs.map((cv) => (
              <div
                key={cv.id}
                onClick={() => setSelectedCVId(cv.id)}
                style={{
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  border: "none",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background:
                    selectedCVId === cv.id ? colors.primaryContainer : colors.surfaceContainerLow,
                  color: selectedCVId === cv.id ? colors.onPrimary : colors.onSurface,
                }}
                onMouseEnter={(e) => {
                  if (selectedCVId !== cv.id) {
                    e.currentTarget.style.background = colors.surfaceContainerHigh;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCVId !== cv.id) {
                    e.currentTarget.style.background = colors.surfaceContainerLow;
                  }
                }}
              >
                <div style={{ marginBottom: "0.25rem" }}>
                  <h4
                    style={{
                      margin: 0,
                      color: "inherit",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {cv.title}
                  </h4>
                </div>
                {cv.target_role && (
                  <p
                    style={{
                      margin: "0.25rem 0",
                      color: "inherit",
                      opacity: 0.8,
                      fontSize: "0.75rem",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Target: {cv.target_role}
                  </p>
                )}
                <p
                  style={{
                    margin: "0.25rem 0 0 0",
                    color: "inherit",
                    fontSize: "0.6875rem",
                    opacity: 0.7,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Last updated:{" "}
                  {new Date(cv.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: "0.625rem 1rem",
              background: colors.surfaceContainerLow,
              border: "none",
              borderRadius: "0.75rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: colors.onSurface,
              transition: "all 0.2s",
              opacity: isLoading ? 0.5 : 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={isLoading || !selectedCVId}
            style={{
              padding: "0.625rem 1rem",
              background: colors.primary,
              border: "none",
              borderRadius: "0.75rem",
              cursor:
                isLoading || !selectedCVId ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: colors.onPrimary,
              transition: "all 0.2s",
              opacity: isLoading || !selectedCVId ? 0.5 : 1,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {isLoading ? "Loading..." : "Load CV"}
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

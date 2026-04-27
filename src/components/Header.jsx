import { colors } from '../constants/theme';
import { useState } from 'react';

export default function Header({
  step,
  steps,
  onHeadshotGenerator,
  showHeadshotButton = true,
  geminiStatus,
  stabilityStatus,
  user,
  onSignOut,
  onSaveCV,
  onLoadCV,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const geminiLabel = geminiStatus?.valid
    ? "Gemini: OK"
    : geminiStatus?.configured
      ? "Gemini: Error"
      : "Gemini: Off";
  const stabilityLabel = stabilityStatus?.valid
    ? "Headshots: OK"
    : stabilityStatus?.configured
      ? "Headshots: Error"
      : "Headshots: Off";
  const geminiColor = geminiStatus?.valid
    ? colors.primary
    : geminiStatus?.configured
      ? "#dc2626"
      : colors.onSurfaceVariant;
  const stabilityColor = stabilityStatus?.valid
    ? colors.primary
    : stabilityStatus?.configured
      ? "#dc2626"
      : colors.onSurfaceVariant;

  const handleSignOut = async () => {
    setShowUserMenu(false);
    if (onSignOut) {
      await onSignOut();
    }
  };

  return (
    <header className="header">
      <div className="logo">Nex<span>Hire</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {(geminiStatus || stabilityStatus) && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                fontSize: "0.6875rem",
                color: geminiColor,
                fontWeight: 600,
                fontFamily: "'Manrope', sans-serif",
                background: geminiColor === colors.primary ? colors.surfaceContainerLow : "transparent",
              }}
            >
              {geminiLabel}
            </span>
            <span
              style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "9999px",
                fontSize: "0.6875rem",
                color: stabilityColor,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                background: stabilityColor === colors.primary ? colors.surfaceContainerLow : "transparent",
              }}
            >
              {stabilityLabel}
            </span>
          </div>
        )}
        {showHeadshotButton && (
          <button
            onClick={onHeadshotGenerator}
            style={{
              background: colors.surfaceContainerLow,
              border: "none",
              color: colors.primary,
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.surfaceContainerHigh;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = colors.surfaceContainerLow;
            }}
          >
            ✨ Headshot Generator
          </button>
        )}

        {/* Save/Load CV Buttons */}
        {user && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={onSaveCV}
              title="Save your CV"
              style={{
                background: colors.surfaceContainerLow,
                border: "none",
                color: colors.primary,
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = colors.surfaceContainerHigh;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = colors.surfaceContainerLow;
              }}
            >
              💾 Save
            </button>
            <button
              onClick={onLoadCV}
              title="Load a saved CV"
              style={{
                background: colors.surfaceContainerLow,
                border: "none",
                color: colors.primary,
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = colors.surfaceContainerHigh;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = colors.surfaceContainerLow;
              }}
            >
              📂 Load
            </button>
          </div>
        )}
        
        {/* User Menu */}
        {user && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: colors.surfaceContainerLow,
                border: "none",
                color: colors.primary,
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.surfaceContainerHigh;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.surfaceContainerLow;
              }}
            >
              <span>👤</span>
              <span style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </span>
            </button>
            
            {showUserMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  background: colors.surfaceContainerLowest,
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 0.25rem 0.75rem rgba(0, 23, 75, 0.1)",
                  zIndex: 1000,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom: `1px solid ${colors.surfaceContainerHigh}`,
                    fontSize: "0.75rem",
                    color: colors.onSurfaceVariant,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.surfaceContainerLow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
        
        <span className="step-counter">{step + 1} / {steps.length}</span>
        <div className="step-bar">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../constants/theme';

// Status pill copy/colour for the optional AI service indicators.
function statusPill(status, okLabel, errLabel, offLabel) {
  if (status?.valid) return { label: okLabel, color: colors.primary, filled: true };
  if (status?.configured) return { label: errLabel, color: '#dc2626', filled: false };
  return { label: offLabel, color: colors.onSurfaceVariant, filled: false };
}

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
  const menuRef = useRef(null);
  const firstMenuItemRef = useRef(null);

  // Close the dropdown on outside click or Escape. Focus the first menu item
  // when opening for better keyboard accessibility.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (showUserMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowUserMenu(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    if (showUserMenu && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showUserMenu]);

  const gemini = statusPill(geminiStatus, 'Gemini: OK', 'Gemini: Error', 'Gemini: Off');
  const stability = statusPill(stabilityStatus, 'Headshots: OK', 'Headshots: Error', 'Headshots: Off');

  const handleSignOut = async () => {
    setShowUserMenu(false);
    if (onSignOut) await onSignOut();
  };

  // Prefer a real name when the profile lookup supplied one.
  const displayName = user?.firstName || user?.email || '';

  const srOnly = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  return (
    <header className="header">
      <div className="hdr-left">
        <Link to="/" className="logo" aria-label="Aikee AI — go to home page">
          Aikee<span> AI</span>
        </Link>
        {user && (
          <Link to="/dashboard" className="hdr-btn" title="Back to your dashboard">
            ← Dashboard
          </Link>
        )}
      </div>

      <div className="hdr-right" aria-live="polite">
        {(geminiStatus || stabilityStatus) && (
          <ul className="hdr-pill-list" style={{ display: 'flex', gap: '0.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {[gemini, stability].map((pill) => (
              <li key={pill.label}>
                <span
                  className="hdr-pill"
                  role="status"
                  aria-label={pill.label}
                  style={{
                    color: pill.color,
                    background: pill.filled ? colors.surfaceContainerLow : 'transparent',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    display: 'inline-block',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={srOnly}>{pill.filled ? 'Active: ' : ''}</span>
                  {pill.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showHeadshotButton && (
            <button type="button" className="hdr-btn" onClick={onHeadshotGenerator} title="Open headshot generator">
              ✨ Headshot
            </button>
          )}

          {user && (
            <>
              <button type="button" className="hdr-btn" onClick={onSaveCV} title="Save your CV">
                💾 Save
              </button>
              <button type="button" className="hdr-btn" onClick={onLoadCV} title="Load a saved CV">
                📂 Load
              </button>

              <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                  type="button"
                  className="hdr-btn hdr-user-btn"
                  onClick={() => setShowUserMenu((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                  aria-label={`User menu for ${displayName || user.email}`}
                >
                  <span aria-hidden="true">👤</span>
                  <span className="hdr-user-label">{displayName}</span>
                </button>

                {showUserMenu && (
                  <div className="hdr-menu" role="menu" aria-label="User menu" style={{ minWidth: 180 }}>
                    <div className="hdr-menu-header">{user.email}</div>
                    <Link
                      to="/dashboard"
                      className="hdr-menu-item"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                      ref={firstMenuItemRef}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/"
                      className="hdr-menu-item"
                      role="menuitem"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Home
                    </Link>
                    <button
                      type="button"
                      className="hdr-menu-item danger"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="step-counter" aria-hidden>
              {step + 1} / {steps.length}
            </span>
            <div className="step-bar" aria-hidden>
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

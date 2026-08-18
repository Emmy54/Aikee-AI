import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

// ── Inline icons ────────────────────────────────────────────────────────────
// Small stroke icons (Lucide-style) that inherit `currentColor`, so they take
// on the button's text colour automatically. They replace the emoji the header
// used to lean on (✨/💾/📂/👤), which rendered inconsistently across platforms.
const iconBase = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const IconCamera = (props) => (
  <svg {...iconBase} {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const IconSave = (props) => (
  <svg {...iconBase} {...props}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
);

const IconFolder = (props) => (
  <svg {...iconBase} {...props}>
    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
  </svg>
);

const IconChevronDown = (props) => (
  <svg {...iconBase} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconAlert = (props) => (
  <svg {...iconBase} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

export default function Header({
  step,
  steps = [],
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

  const handleSignOut = async () => {
    setShowUserMenu(false);
    if (onSignOut) await onSignOut();
  };

  // AI status: stay quiet when everything is healthy. Only surface a compact
  // warning when a configured service reports it is NOT valid — the old header
  // showed "Gemini: OK / Headshots: OK" pills at all times, which was noise.
  const aiIssues = [];
  if (geminiStatus && !geminiStatus.valid) aiIssues.push('AI writing');
  if (stabilityStatus && !stabilityStatus.valid) aiIssues.push('Headshots');
  const aiWarning = aiIssues.length ? `${aiIssues.join(' & ')} offline` : '';

  // Prefer a real name when the profile lookup supplied one.
  const displayName = user?.firstName || user?.email || '';
  const initial = (user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const totalSteps = steps.length;
  const currentStep = totalSteps ? Math.min(step + 1, totalSteps) : 0;

  return (
    <header className="header">
      <div className="hdr-left">
        <Link to="/" className="logo" aria-label="Aikee AI — go to home page">
          <BrandLogo height={28} alt="" />
        </Link>
      </div>

      <div className="hdr-right">
        {totalSteps > 0 && (
          <div className="hdr-progress">
            <span className="step-counter">
              Step {currentStep} of {totalSteps}
            </span>
            <div
              className="step-bar"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-valuenow={currentStep}
              aria-label={`Step ${currentStep} of ${totalSteps}`}
            >
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
                />
              ))}
            </div>
          </div>
        )}

        {aiWarning && (
          <span
            className="hdr-status-warn"
            role="status"
            title="Some AI services are temporarily unavailable"
          >
            <IconAlert />
            {aiWarning}
          </span>
        )}

        {user && (
          <div className="hdr-usermenu" ref={menuRef}>
            <button
              type="button"
              className="hdr-btn hdr-user-btn"
              onClick={() => setShowUserMenu((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={showUserMenu}
              aria-label={`Account menu for ${displayName || user.email}`}
            >
              <span className="hdr-avatar" aria-hidden="true">
                {initial}
              </span>
              <IconChevronDown
                width={14}
                height={14}
                style={{ transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>

            {showUserMenu && (
              <div className="hdr-menu" role="menu" aria-label="Account menu">
                <div className="hdr-menu-header">{user.email}</div>
                {showHeadshotButton && (
                  <button
                    type="button"
                    className="hdr-menu-item"
                    role="menuitem"
                    onClick={() => { setShowUserMenu(false); if (onHeadshotGenerator) onHeadshotGenerator(); }}
                  >
                    <IconCamera />
                    Headshot
                  </button>
                )}
                <button
                  type="button"
                  className="hdr-menu-item"
                  role="menuitem"
                  onClick={() => { setShowUserMenu(false); if (onSaveCV) onSaveCV(); }}
                >
                  <IconSave />
                  Save CV
                </button>
                <button
                  type="button"
                  className="hdr-menu-item"
                  role="menuitem"
                  onClick={() => { setShowUserMenu(false); if (onLoadCV) onLoadCV(); }}
                >
                  <IconFolder />
                  Load CV
                </button>
                <div className="hdr-menu-sep" role="separator" />
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
        )}
      </div>
    </header>
  );
}

// NexHireLanding.jsx (Updated as main landing page)
// CV Builder AI landing page - converted from original design

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Design tokens ─────────────────────────────────────────
const BLUE     = "#1a4bdb";
const BLUE_LT  = "#2563eb";
const BLUE_BG  = "#eef2ff";
const GRAY_BG  = "#f0f2f8";
const DARK     = "#0f1117";
const MID      = "#4b5563";
const LIGHT    = "#9ca3af";
const WHITE    = "#ffffff";
const BORDER   = "#e5e7eb";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Manrope', sans-serif;
    background: ${WHITE};
    color: ${DARK};
    -webkit-font-smoothing: antialiased;
  }

  .nx-page { min-height: 100vh; }

  /* ── Navbar ── */
  .nx-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 60px;
    background: ${WHITE};
    border-bottom: 1px solid ${BORDER};
    position: sticky; top: 0; z-index: 100;
  }
  .nx-logo {
    font-size: 18px; font-weight: 800; color: ${DARK};
    letter-spacing: -0.5px;
  }
  .nx-nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }
  .nx-nav-links a {
    font-size: 14px; font-weight: 500; color: ${MID};
    text-decoration: none; transition: color 0.2s;
  }
  .nx-nav-links a.active {
    color: ${DARK}; border-bottom: 2px solid ${BLUE};
    padding-bottom: 2px;
  }
  .nx-nav-links a:hover { color: ${DARK}; }
  .nx-nav-right {
    display: flex; align-items: center; gap: 16px;
  }
  .nx-menu-btn {
    display: none;
    width: 38px; height: 38px;
    border-radius: 10px;
    border: 1px solid ${BORDER};
    background: ${WHITE};
    cursor: pointer;
    align-items: center; justify-content: center;
    transition: border-color 0.2s, transform 0.15s;
  }
  .nx-menu-btn:hover { border-color: #c6c9d6; transform: translateY(-1px); }
  .nx-menu-icon {
    width: 18px; height: 2px; background: ${DARK};
    position: relative; border-radius: 2px;
  }
  .nx-menu-icon::before,
  .nx-menu-icon::after {
    content: "";
    position: absolute; left: 0; right: 0;
    height: 2px; background: ${DARK}; border-radius: 2px;
  }
  .nx-menu-icon::before { top: -6px; }
  .nx-menu-icon::after { top: 6px; }
  .nx-mobile-menu {
    display: none;
    position: absolute; top: 60px; left: 0; right: 0;
    background: ${WHITE}; border-bottom: 1px solid ${BORDER};
    padding: 12px 16px 16px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  }
  .nx-mobile-links {
    list-style: none; display: flex; flex-direction: column; gap: 10px;
    margin-bottom: 12px;
  }
  .nx-mobile-links a {
    text-decoration: none; color: ${DARK};
    font-size: 14px; font-weight: 600;
    padding: 8px 10px; border-radius: 8px;
    background: ${GRAY_BG};
    display: block;
  }
  .nx-mobile-actions {
    display: flex; flex-direction: column; gap: 8px;
  }
  .nx-btn-ghost {
    font-family: 'Manrope', sans-serif;
    font-size: 14px; font-weight: 600; color: ${DARK};
    background: none; border: none; cursor: pointer;
    padding: 8px 12px; border-radius: 8px;
    transition: background 0.2s;
  }
  .nx-btn-ghost:hover { background: ${GRAY_BG}; }
  .nx-btn-primary {
    font-family: 'Manrope', sans-serif;
    font-size: 14px; font-weight: 600; color: ${WHITE};
    background: ${BLUE}; border: none; cursor: pointer;
    padding: 9px 20px; border-radius: 8px;
    transition: background 0.2s, transform 0.15s;
  }
  .nx-btn-primary:hover { background: ${BLUE_LT}; transform: translateY(-1px); }

  /* ── Hero ── */
  .nx-hero {
    background: linear-gradient(160deg, #f8f9ff 0%, #eef1fb 60%, #e8eeff 100%);
    padding: 80px 48px 100px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 48px;
    min-height: 520px;
  }
  .nx-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${WHITE}; border: 1px solid ${BORDER};
    border-radius: 20px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; color: ${MID};
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 24px;
  }
  .nx-hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: ${BLUE};
  }
  .nx-hero-h1 {
    font-size: 48px; font-weight: 900; line-height: 1.08;
    letter-spacing: -1.5px; color: ${DARK};
    margin-bottom: 6px;
  }
  .nx-hero-h1-blue { color: ${BLUE}; display: block; }
  .nx-hero-sub {
    font-size: 15px; font-weight: 400; color: ${MID};
    line-height: 1.7; max-width: 400px; margin-bottom: 36px;
  }
  .nx-hero-btns { display: flex; gap: 14px; align-items: center; }
  .nx-btn-hero-primary {
    font-family: 'Manrope', sans-serif;
    font-size: 15px; font-weight: 700; color: ${WHITE};
    background: ${BLUE}; border: none; cursor: pointer;
    padding: 13px 28px; border-radius: 10px;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 4px 16px rgba(26,75,219,0.25);
  }
  .nx-btn-hero-primary:hover { background: ${BLUE_LT}; transform: translateY(-2px); }
  .nx-btn-hero-outline {
    font-family: 'Manrope', sans-serif;
    font-size: 15px; font-weight: 600; color: ${DARK};
    background: ${WHITE}; border: 1.5px solid ${BORDER};
    cursor: pointer; padding: 12px 26px; border-radius: 10px;
    transition: border-color 0.2s, transform 0.15s;
  }
  .nx-btn-hero-outline:hover { border-color: #aab; transform: translateY(-1px); }

  /* Hero visual */
  .nx-hero-visual { position: relative; }
  .nx-hero-img-wrap {
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.12);
    border: 1px solid rgba(255,255,255,0.6);
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, #2a3a5a, #1a2540);
    display: flex; align-items: center; justify-content: center;
  }
  .nx-hero-img-placeholder {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 10px; opacity: 0.5;
  }
  .nx-pase-card {
    position: absolute; bottom: -16px; left: -24px;
    background: ${WHITE}; border-radius: 14px;
    padding: 12px 18px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex; align-items: center; gap: 12px;
    min-width: 200px;
    border: 1px solid ${BORDER};
  }
  .nx-pase-icon {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .nx-pase-title { font-size: 12px; font-weight: 700; color: ${DARK}; }
  .nx-pase-sub { font-size: 11px; color: ${LIGHT}; margin-bottom: 6px; }
  .nx-pase-bar-wrap {
    display: flex; flex-direction: column; gap: 4px;
  }
  .nx-pase-bar {
    height: 4px; border-radius: 2px; background: ${BORDER};
    overflow: hidden;
  }
  .nx-pase-bar-fill {
    height: 100%; border-radius: 2px;
  }

  /* ── Features section ── */
  .nx-features-section {
    padding: 96px 48px 80px;
    background: ${GRAY_BG};
  }
  .nx-section-header { text-align: center; margin-bottom: 56px; }
  .nx-section-h2 {
    font-size: 30px; font-weight: 800; color: ${DARK};
    letter-spacing: -0.5px; margin-bottom: 10px;
  }
  .nx-section-sub {
    font-size: 15px; color: ${MID}; font-weight: 400;
  }

  /* Feature cards grid */
  .nx-features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 16px;
    max-width: 900px; margin: 0 auto;
  }

  /* Card base */
  .nx-card {
    background: ${WHITE};
    border-radius: 20px;
    border: 1px solid ${BORDER};
    padding: 32px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .nx-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  }

  /* Guided builder card — spans left full height */
  .nx-card-builder {
    grid-row: 1 / 3;
    display: flex; flex-direction: column;
    justify-content: space-between;
    min-height: 300px;
  }
  .nx-card-icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; margin-bottom: 16px;
  }
  .nx-card-icon-blue { background: #eff6ff; }
  .nx-card-icon-orange { background: #fff7ed; }
  .nx-card-h3 {
    font-size: 18px; font-weight: 700; color: ${DARK};
    margin-bottom: 10px; letter-spacing: -0.3px;
  }
  .nx-card-p {
    font-size: 13.5px; color: ${MID}; line-height: 1.65;
    font-weight: 400; margin-bottom: 20px;
  }

  /* Skill tags */
  .nx-skill-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .nx-skill-tag {
    font-size: 11px; font-weight: 600;
    padding: 5px 12px; border-radius: 20px;
    border: 1px solid ${BORDER};
    color: ${MID};
    background: ${WHITE};
  }

  /* Mock lines in builder card */
  .nx-mock-lines {
    display: flex; flex-direction: column; gap: 8px;
    margin: 20px 0;
  }
  .nx-mock-line {
    height: 8px; border-radius: 4px;
    background: ${GRAY_BG};
  }

  /* Export card — blue */
  .nx-card-export {
    background: ${BLUE};
    border-color: ${BLUE};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    min-height: 200px;
  }
  .nx-card-export .nx-card-icon {
    background: rgba(255,255,255,0.15);
    margin: 0 auto 16px;
  }
  .nx-card-export .nx-card-h3 { color: ${WHITE}; font-size: 20px; }
  .nx-card-export .nx-card-p { color: rgba(255,255,255,0.75); margin-bottom: 24px; }
  .nx-btn-download {
    font-family: 'Manrope', sans-serif;
    font-size: 14px; font-weight: 700; color: ${BLUE};
    background: ${WHITE}; border: none; cursor: pointer;
    padding: 11px 28px; border-radius: 8px;
    transition: transform 0.15s, opacity 0.2s;
    width: 100%;
  }
  .nx-btn-download:hover { transform: translateY(-1px); opacity: 0.92; }

  /* Bottom row cards */
  .nx-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    max-width: 900px;
    margin: 16px auto 0;
  }

  /* Reach score card */
  .nx-card-score {
    display: flex; align-items: center; justify-content: center;
    min-height: 160px;
  }
  .nx-score-ring {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: 6px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column;
    position: relative;
  }
  .nx-score-ring::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 6px solid transparent;
    border-top-color: ${BLUE};
    border-right-color: ${BLUE};
    transform: rotate(-20deg);
  }
  .nx-score-grade {
    font-size: 22px; font-weight: 900; color: ${DARK};
    letter-spacing: -1px;
  }
  .nx-score-label {
    font-size: 9px; font-weight: 700; color: ${LIGHT};
    letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── CTA section ── */
  .nx-cta-section {
    padding: 100px 48px;
    background: ${WHITE};
    text-align: center;
  }
  .nx-cta-h2 {
    font-size: 38px; font-weight: 900; color: ${DARK};
    letter-spacing: -1px; margin-bottom: 10px;
    line-height: 1.15;
  }
  .nx-cta-sub {
    font-size: 15px; color: ${MID}; margin-bottom: 36px;
  }
  .nx-btn-cta {
    font-family: 'Manrope', sans-serif;
    font-size: 16px; font-weight: 700; color: ${WHITE};
    background: ${BLUE}; border: none; cursor: pointer;
    padding: 16px 40px; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(26,75,219,0.28);
    transition: background 0.2s, transform 0.15s;
  }
  .nx-btn-cta:hover { background: ${BLUE_LT}; transform: translateY(-2px); }

  /* ── Footer ── */
  .nx-footer {
    padding: 36px 48px;
    border-top: 1px solid ${BORDER};
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .nx-footer-logo {
    font-size: 17px; font-weight: 800; color: ${DARK};
    margin-bottom: 6px;
  }
  .nx-footer-copy {
    font-size: 12px; color: ${LIGHT}; font-weight: 400;
    max-width: 260px; line-height: 1.5;
  }
  .nx-footer-links {
    display: flex; gap: 28px; align-items: center;
  }
  .nx-footer-links a {
    font-size: 12.5px; color: ${LIGHT}; text-decoration: none;
    font-weight: 500; transition: color 0.2s;
  }
  .nx-footer-links a:hover { color: ${MID}; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nx-hero-left  { animation: fadeUp 0.6s ease both; }
  .nx-hero-right { animation: fadeUp 0.6s ease 0.15s both; }
  .nx-features-section .nx-card { animation: fadeUp 0.5s ease both; }

  /* ── Mobile & Tablet Responsive ── */
  @media (max-width: 1024px) {
    .nx-nav { padding: 0 36px; }
    .nx-hero-section { padding: 60px 48px; gap: 32px; }
    .nx-hero-left h1 { font-size: 42px; line-height: 1.3; }
    .nx-hero-btns { gap: 12px; flex-wrap: wrap; }
    .nx-features-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
    .nx-card-builder { grid-row: span 2; }
    .nx-card { padding: 28px 24px; }
    .nx-section-h2 { font-size: 36px; }
    .nx-cta-section { padding: 48px 36px; }
  }

  @media (max-width: 768px) {
    .nx-nav { padding: 0 24px; }
    .nx-nav-links { display: none; }
    .nx-nav-link-signin { display: none; }
    .nx-logo { font-size: 18px; }
    .nx-menu-btn { display: inline-flex; }
    .nx-mobile-menu { display: block; }
    .nx-nav-right { gap: 10px; }
    .nx-hero {
      padding: 40px 24px;
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .nx-hero-h1 {
      font-size: 32px;
      line-height: 1.3;
    }
    .nx-hero-sub {
      font-size: 15px;
    }
    .nx-hero-btns {
      flex-direction: column;
    }
    .nx-btn-hero-primary, .nx-btn-hero-outline {
      width: 100%;
      padding: 14px 32px;
      font-size: 15px;
    }
    .nx-hero-right { display: none; }
    .nx-features-section { padding: 48px 24px; }
    .nx-section-header { margin-bottom: 32px; }
    .nx-section-h2 {
      font-size: 28px;
      line-height: 1.4;
    }
    .nx-section-sub {
      font-size: 14px;
    }
    .nx-features-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .nx-card-builder {
      grid-row: span 1;
      grid-column: span 1;
    }
    .nx-card {
      padding: 20px 18px;
    }
    .nx-card-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    .nx-card-h3 { font-size: 16px; }
    .nx-card-p {
      font-size: 13.5px;
      line-height: 1.5;
    }
    .nx-skill-tags {
      gap: 6px;
      flex-wrap: wrap;
    }
    .nx-skill-tag {
      font-size: 11px;
      padding: 4px 10px;
    }
    .nx-bottom-section h2 {
      font-size: 28px;
    }
    .nx-bottom-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .nx-bottom-card {
      padding: 20px 18px;
    }
    .nx-bottom-card-icon {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }
    .nx-cta-section {
      padding: 36px 24px;
    }
    .nx-cta-h2 {
      font-size: 28px;
    }
    .nx-btn-cta {
      padding: 14px 32px;
      font-size: 15px;
    }
    .nx-footer {
      padding: 28px 24px;
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }
    .nx-footer-logo { font-size: 16px; }
    .nx-footer-links {
      flex-wrap: wrap;
      gap: 16px;
    }
    .nx-footer-links a {
      font-size: 12px;
    }
  }

  @media (max-width: 640px) {
    .nx-nav {
      padding: 0 16px;
      height: 56px;
    }
    .nx-mobile-menu { top: 56px; padding: 12px 12px 14px; }
    .nx-logo { font-size: 16px; }
    .nx-hero-section {
      padding: 28px 16px;
      gap: 20px;
    }
    .nx-hero-left h1 {
      font-size: 24px;
      line-height: 1.3;
    }
    .nx-hero-sub {
      font-size: 14px;
      line-height: 1.5;
    }
    .nx-hero-btns {
      gap: 8px;
    }
    .nx-btn-hero-primary, .nx-btn-hero-outline {
      padding: 12px 24px;
      font-size: 14px;
    }
    .nx-features-section { padding: 32px 16px; }
    .nx-section-h2 {
      font-size: 22px;
    }
    .nx-section-sub {
      font-size: 13.5px;
    }
    .nx-card {
      padding: 16px 14px;
    }
    .nx-card-icon {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }
    .nx-card-h3 { font-size: 15px; }
    .nx-card-p {
      font-size: 12.5px;
    }
    .nx-skill-tag {
      font-size: 10px;
      padding: 3px 8px;
    }
    .nx-bottom-section h2 {
      font-size: 22px;
    }
    .nx-bottom-card {
      padding: 16px 14px;
    }
    .nx-bottom-card-icon {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
    .nx-bottom-card h3 { font-size: 14px; }
    .nx-bottom-card p {
      font-size: 12px;
    }
    .nx-cta-section {
      padding: 28px 16px;
    }
    .nx-cta-h2 {
      font-size: 22px;
    }
    .nx-btn-cta {
      padding: 12px 24px;
      font-size: 14px;
    }
    .nx-footer {
      padding: 20px 16px;
    }
    .nx-footer-logo { font-size: 15px; }
    .nx-footer-copy {
      font-size: 11px;
    }
    .nx-footer-links a {
      font-size: 11px;
    }
  }
`;

// ── Sub-components ────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="nx-nav">
      <div className="nx-logo">NexHire</div>
      <ul className="nx-nav-links">
        <li><a href="#features" className="active">Features</a></li>
        <li><a href="#templates">Templates</a></li>
      </ul>
      <div className="nx-nav-right">
        <button className="nx-btn-ghost" onClick={() => navigate("/signin")}>Sign In</button>
        <button className="nx-btn-primary" onClick={() => navigate("/signin")}>Build Resume</button>
        <button
          className="nx-menu-btn"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="nx-menu-icon" />
        </button>
      </div>
      {menuOpen && (
        <div className="nx-mobile-menu">
          <ul className="nx-mobile-links">
            <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
            <li><a href="#templates" onClick={() => setMenuOpen(false)}>Templates</a></li>
          </ul>
          <div className="nx-mobile-actions">
            <button className="nx-btn-ghost" onClick={() => { setMenuOpen(false); navigate("/signin"); }}>Sign In</button>
            <button className="nx-btn-primary" onClick={() => { setMenuOpen(false); navigate("/signin"); }}>Build Resume</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroVisual() {
  return (
    <div className="nx-hero-visual">
      {/* Main image area */}
      <div className="nx-hero-img-wrap">
        <div className="nx-hero-img-placeholder">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="8" y="12" width="40" height="32" rx="4" fill="rgba(255,255,255,0.15)" />
            <rect x="12" y="16" width="14" height="14" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x="30" y="16" width="14" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
            <rect x="30" y="22" width="10" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
            <rect x="12" y="34" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
            <rect x="12" y="39" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
          </svg>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>CV PREVIEW</span>
        </div>
      </div>

      {/* PASE Score floating card */}
      <div className="nx-pase-card">
        <div className="nx-pase-icon">🎯</div>
        <div style={{ flex: 1 }}>
          <div className="nx-pase-title">PASE Score</div>
          <div className="nx-pase-sub">Energy Distributors</div>
          <div className="nx-pase-bar-wrap">
            <div className="nx-pase-bar">
              <div className="nx-pase-bar-fill" style={{ width: "75%", background: BLUE }} />
            </div>
            <div className="nx-pase-bar">
              <div className="nx-pase-bar-fill" style={{ width: "45%", background: "#f59e0b" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <section className="nx-hero">
      <div className="nx-hero-left">
        <div className="nx-hero-badge">
          <span className="nx-hero-badge-dot" />
          Built for students &amp; job seekers
        </div>
        <h1 className="nx-hero-h1">
          Build a Resume
          <span className="nx-hero-h1-blue">That Opens Doors</span>
        </h1>
        <p className="nx-hero-sub">
          Writing a resume shouldn't stop you from getting opportunities.
          Whether you're a student, a first-time applicant, or switching
          careers — we guide you step-by-step to create a resume you can
          be proud of.
        </p>
        <div className="nx-hero-btns">
          <button className="nx-btn-hero-primary" onClick={() => navigate("/signin")}>Get started</button>
          <button className="nx-btn-hero-outline" onClick={() => navigate("/signin")}>View Templates</button>
        </div>
      </div>
      <HeroVisual />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="nx-features-section" id="features">
      <div className="nx-section-header">
        <h2 className="nx-section-h2">Everything You Need to Get Started — In One Place</h2>
        <p className="nx-section-sub">We simplify the entire process so you can focus on getting hired, not stressing over formatting.</p>
      </div>

      <div className="nx-features-grid">
        {/* Left spanning card — Guided Resume Builder */}
        <div className="nx-card nx-card-builder">
          <div>
            <div className="nx-card-icon nx-card-icon-blue">✦</div>
            <h3 className="nx-card-h3">Guided Resume Builder</h3>
            <p className="nx-card-p">
              No guesswork. We walk you through each section step-by-step,
              helping you write clearly and confidently — even if you're
              starting from scratch.
            </p>
            <div className="nx-mock-lines">
              <div className="nx-mock-line" style={{ width: "80%" }} />
              <div className="nx-mock-line" style={{ width: "65%" }} />
              <div className="nx-mock-line" style={{ width: "72%" }} />
            </div>
          </div>
          <div className="nx-skill-tags">
            <span className="nx-skill-tag">Strategic Leadership</span>
            <span className="nx-skill-tag">Product Velocity</span>
            <span className="nx-skill-tag">Precision Architecture</span>
          </div>
        </div>

        {/* Right top — Instant Export */}
        <div className="nx-card nx-card-export">
          <div className="nx-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="nx-card-h3">Instant Export</h3>
          <p className="nx-card-p">Download your resume in high-fidelity PDF, editable DOCX.</p>
          <button className="nx-btn-download">Download Now</button>
        </div>
      </div>

      {/* Bottom 3-column row */}
      <div className="nx-bottom-grid">
        {/* Smart Suggestions */}
        <div className="nx-card">
          <div className="nx-card-icon nx-card-icon-orange" style={{ background: "#fff7ed" }}>🎯</div>
          <h3 className="nx-card-h3">Smart Suggestions</h3>
          <p className="nx-card-p">
            Get real-time tips on what to write, how to structure your
            experience, and how to make your resume stronger — instantly.
          </p>
        </div>

        {/* Simple Customization */}
        <div className="nx-card">
          <h3 className="nx-card-h3">Simple Customization</h3>
          <p className="nx-card-p">
            Choose clean, professional templates and adjust them easily
            to fit any job you're applying for.
          </p>
        </div>

        {/* Reach Score */}
        <div className="nx-card nx-card-score">
          <div className="nx-score-ring">
            <span className="nx-score-grade">A+</span>
            <span className="nx-score-label">Reach Score</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();
  
  return (
    <section className="nx-cta-section">
      <h2 className="nx-cta-h2">Your Next Opportunity Starts Here</h2>
      <p className="nx-cta-sub">Stop overthinking your resume. Start building one that works.</p>
      <button className="nx-btn-cta" onClick={() => navigate("/signin")}>Create My Resume</button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="nx-footer">
      <div>
        <div className="nx-footer-logo">NexHire</div>
        <p className="nx-footer-copy">
          © 2024 CV Builder AI. Crafted for your success.
          Built for students and professionals.
        </p>
      </div>
      <div className="nx-footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
        <a href="#">Contact Us</a>
      </div>
    </footer>
  );
}

// ── Main Page Component ───────────────────────────────────
export default function NexHireLanding() {
  return (
    <>
      <style>{css}</style>
      <div className="nx-page">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}

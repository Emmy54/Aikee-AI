import { useState } from "react";
import { useNavigate } from "react-router-dom";
import resumePreviewImage from "../../assets/resume-preview.svg";
import CVimage from "../../assets/steptodown.com773133.jpg";

// Design tokens
const T = {
  primary: "#0029c0",
  primaryContainer: "#2142e7",
  onPrimary: "#ffffff",
  surface: "#f9f9ff",
  surfaceAlt: "#F9FAFB",
  surfaceContainerLow: "#f1f3ff",
  surfaceContainerHigh: "#e1e8fd",
  onSurface: "#141b2b",
  onSurfaceVariant: "#444656",
  borderSubtle: "#E5E7EB",
  secondary: "#006687",
  secondaryContainer: "#ffbb00",
  error: "#ba1a1a",
  outline: "#757687",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: ${T.primary};
    --primary-container: ${T.primaryContainer};
    --on-primary: ${T.onPrimary};
    --surface: ${T.surface};
    --surface-alt: ${T.surfaceAlt};
    --surface-container-low: ${T.surfaceContainerLow};
    --surface-container-high: ${T.surfaceContainerHigh};
    --on-surface: ${T.onSurface};
    --on-surface-variant: ${T.onSurfaceVariant};
    --border-subtle: ${T.borderSubtle};
    --secondary-container: ${T.secondaryContainer};
    --error: ${T.error};
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--surface);
    color: var(--on-surface);
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
    line-height: 1;
    vertical-align: middle;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

  .glass-card {
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.3);
  }

  .nx-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    background: rgba(249,249,255,0.70);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-subtle);
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  }
  .nx-header-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 64px; padding: 0 20px;
    max-width: 1200px; margin: 0 auto;
  }
  .nx-logo {
    font-size: 22px; font-weight: 800; color: var(--primary);
    letter-spacing: -0.5px; flex-shrink: 0;
  }
  .nx-desktop-nav {
    display: none;
    align-items: center; gap: 32px;
    list-style: none;
  }
  .nx-desktop-nav a {
    font-size: 14px; font-weight: 500; color: var(--on-surface-variant);
    text-decoration: none; transition: color 0.2s;
    position: relative; padding-bottom: 2px;
  }
  .nx-desktop-nav a:hover { color: var(--on-surface); }
  .nx-desktop-nav a.active { color: var(--on-surface); font-weight: 600; }
  .nx-desktop-nav a.active::after {
    content: '';
    position: absolute; bottom: -4px; left: 0; right: 0;
    height: 2px; border-radius: 2px;
    background: var(--primary);
  }
  .nx-desktop-actions {
    display: none;
    align-items: center; gap: 12px; flex-shrink: 0;
  }
  .nx-btn-ghost {
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--on-surface-variant);
    padding: 8px 14px; border-radius: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .nx-btn-ghost:hover { background: var(--surface-container-low); color: var(--on-surface); }
  .nx-btn-nav-primary {
    background: var(--primary); color: var(--on-primary);
    border: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600;
    padding: 9px 20px; border-radius: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .nx-btn-nav-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .nx-menu-btn {
    background: none; border: none; cursor: pointer;
    padding: 8px; color: var(--on-surface-variant);
    transition: color 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .nx-menu-btn:hover { color: var(--primary); }

  @media (min-width: 768px) {
    .nx-header-inner { padding: 0 48px; }
    .nx-desktop-nav { display: flex; }
    .nx-desktop-actions { display: flex; }
    .nx-menu-btn { display: none; }
  }

  .nx-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: #ffffff;
    display: flex; flex-direction: column;
    padding: 32px 20px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  .nx-overlay.open { transform: translateX(0); }
  .nx-overlay-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 48px;
  }
  .nx-overlay-nav {
    display: flex; flex-direction: column; gap: 32px;
    margin-bottom: auto; list-style: none;
  }
  .nx-overlay-nav a {
    font-size: 24px; font-weight: 600; text-decoration: none;
    color: var(--on-surface-variant);
    transition: color 0.2s;
  }
  .nx-overlay-nav a.active { color: var(--primary); }
  .nx-overlay-actions {
    display: flex; flex-direction: column; gap: 16px; margin-top: 40px;
  }
  .nx-btn-outline-full {
    width: 100%; padding: 16px;
    background: var(--surface-container-low);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--on-surface-variant);
    cursor: pointer; transition: transform 0.15s;
  }
  .nx-btn-outline-full:active { transform: scale(0.97); }
  .nx-btn-primary-full {
    width: 100%; padding: 16px;
    background: var(--primary); color: var(--on-primary);
    border: none; border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: transform 0.15s;
    box-shadow: 0 4px 16px rgba(0,41,192,0.25);
  }
  .nx-btn-primary-full:active { transform: scale(0.97); }

  .nx-hero {
    padding: 96px 20px 96px;
    text-align: center;
    background:
      radial-gradient(circle at top right, rgba(33,66,231,0.05), transparent 50%),
      radial-gradient(circle at bottom left, rgba(3,181,237,0.05), transparent 50%),
      var(--surface);
  }
  .nx-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 4px 12px;
    background: rgba(33,66,231,0.08);
    color: var(--primary);
    border-radius: 9999px;
    margin-bottom: 24px;
    font-size: 11px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .nx-hero h1 {
    font-size: 36px; font-weight: 700; line-height: 1.2;
    color: var(--on-surface);
    margin-bottom: 24px; letter-spacing: -0.02em;
  }
  .nx-hero h1 .accent { color: var(--primary); }
  .nx-hero p {
    font-size: 18px; font-weight: 400; line-height: 1.7;
    color: var(--on-surface-variant);
    margin-bottom: 40px;
    max-width: 700px; margin-left: auto; margin-right: auto;
  }
  .nx-hero-btns {
    display: flex; flex-direction: column; gap: 16px;
    max-width: 420px; margin: 0 auto;
  }
  .nx-btn-hero-primary {
    width: 100%; padding: 20px;
    background: var(--primary); color: var(--on-primary);
    border: none; border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 700; cursor: pointer;
    box-shadow: 0 20px 50px rgba(33,66,231,0.2);
    transition: transform 0.15s, box-shadow 0.2s;
  }
  .nx-btn-hero-primary:hover { transform: translateY(-1px); box-shadow: 0 24px 56px rgba(33,66,231,0.26); }
  .nx-btn-hero-primary:active { transform: scale(0.97); }
  .nx-btn-hero-secondary {
    width: 100%; padding: 19px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 500; color: var(--on-surface);
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: transform 0.15s, border-color 0.2s;
  }
  .nx-btn-hero-secondary:hover { border-color: #c0c4d4; }
  .nx-btn-hero-secondary:active { transform: scale(0.97); }
  .nx-browser-frame {
    margin: 64px auto 0;
    max-width: 75vw;
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
    background: #ffffff;
    box-shadow: 0 24px 64px rgba(15,23,42,0.16);
    overflow: hidden;
  }
  .nx-browser-bar {
    height: 32px;
    background: var(--surface-container-low);
    border-bottom: 1px solid var(--border-subtle);
    display: flex; align-items: center; gap: 6px; padding: 0 16px;
  }
  .nx-browser-dot {
    width: 10px; height: 10px; border-radius: 50%;
  }
  .nx-browser-image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  .nx-resume-preview-lines { width: 100%; }
  .nx-resume-line {
    height: 8px; border-radius: 4px;
    background: rgba(0,41,192,0.12); margin-bottom: 10px;
  }
  .nx-resume-line.short { width: 55%; }
  .nx-resume-line.medium { width: 75%; }

  .nx-features {
    padding: 96px 20px;
    background: var(--surface-alt);
  }
  .nx-features-header {
    text-align: center; margin-bottom: 64px;
  }
  .nx-features-header h2 {
    font-size: 32px; font-weight: 600; line-height: 1.25;
    letter-spacing: -0.01em; color: var(--on-surface);
    margin-bottom: 16px;
  }
  .nx-underline-bar {
    width: 48px; height: 4px;
    background: var(--primary);
    border-radius: 9999px;
    margin: 0 auto;
  }
  .nx-features-list {
    display: flex; flex-direction: column; gap: 24px;
    max-width: 640px; margin: 0 auto;
  }
  .nx-feature-card {
    padding: 32px; border-radius: 16px;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow: 0 4px 16px rgba(15,23,42,0.04);
  }
  .nx-feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(0,41,192,0.08);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary); font-size: 24px;
    margin-bottom: 24px;
  }
  .nx-feature-card h3 {
    font-size: 24px; font-weight: 600; line-height: 1.33;
    color: var(--on-surface); margin-bottom: 12px;
  }
  .nx-feature-card p {
    font-size: 16px; line-height: 1.6;
    color: var(--on-surface-variant);
  }
  .nx-templates {
    padding: 96px 20px;
    overflow: hidden;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .nx-templates-header { margin-bottom: 48px; }
  .nx-templates-header h2 {
    font-size: 32px; font-weight: 600; line-height: 1.25;
    letter-spacing: -0.01em; color: var(--on-surface);
    margin-bottom: 8px;
  }
  .nx-templates-header p {
    font-size: 16px; color: var(--on-surface-variant);
  }
  .nx-templates-scroll {
    display: flex; gap: 24px;
    overflow-x: auto; padding-bottom: 32px;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none; scrollbar-width: none;
  }
  .nx-templates-scroll::-webkit-scrollbar { display: none; }
  .nx-template-item {
    min-width: 280px; scroll-snap-align: center;
    flex-shrink: 0;
  }
  .nx-template-thumb {
    border-radius: 12px; overflow: hidden;
    border: 1px solid var(--border-subtle);
    box-shadow: 0 10px 30px rgba(15,17,23,0.08);
    margin-bottom: 16px;
    aspect-ratio: 3/4;
    background: linear-gradient(160deg, #eef2ff, #e0e7ff);
    display: flex; flex-direction: column;
    padding: 20px; gap: 10px;
    justify-content: flex-end;
  }
  .nx-template-thumb img {
    width: 100%; height: 100%; object-fit: cover;
    display: flex;
  }
  .nx-template-item h4 {
    font-size: 24px; font-weight: 600; line-height: 1.33;
    color: var(--on-surface); margin-bottom: 4px;
  }
  .nx-template-item p {
    font-size: 14px; font-weight: 500; line-height: 1.43;
    color: var(--on-surface-variant);
  }
  .tpl-line {
    height: 8px; border-radius: 9999px;
    background: rgba(255,255,255,0.5);
  }
  .tpl-line.short { width: 60%; }
  .tpl-line.xshort { width: 40%; }

  .nx-testimonials {
    padding: 96px 20px;
    background: var(--primary);
    color: var(--on-primary);
  }
  .nx-testimonials h2 {
    font-size: 32px; font-weight: 600; line-height: 1.25;
    letter-spacing: -0.01em;
    text-align: center; margin-bottom: 48px;
  }
  .nx-testimonials-list {
    display: flex; flex-direction: column; gap: 24px;
    max-width: 640px; margin: 0 auto;
  }
  .nx-testimonial-card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 32px;
  }
  .nx-stars {
    display: flex; gap: 4px;
    color: var(--secondary-container);
    margin-bottom: 16px;
  }
  .nx-testimonial-card blockquote {
    font-size: 18px; font-weight: 400;
    line-height: 1.7; font-style: italic;
    margin-bottom: 24px;
  }
  .nx-author {
    display: flex; align-items: center; gap: 16px;
  }
  .nx-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--surface-container-high);
    overflow: hidden; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 13px;
    color: var(--primary);
  }
  .nx-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .nx-author-name { font-size: 14px; font-weight: 700; line-height: 1.43; }
  .nx-author-role { font-size: 14px; font-weight: 400; opacity: 0.7; line-height: 1.43; }

  .nx-cta {
    padding: 96px 20px;
    background: var(--surface);
    text-align: center;
  }
  .nx-cta h2 {
    font-size: 32px; font-weight: 600; line-height: 1.25;
    letter-spacing: -0.01em; color: var(--on-surface);
    margin-bottom: 16px;
  }
  .nx-cta p {
    font-size: 16px; color: var(--on-surface-variant);
    margin-bottom: 40px;
  }
  .nx-cta-actions {
    display: flex; flex-direction: column; gap: 16px;
    max-width: 400px; margin: 0 auto;
  }
  .nx-btn-cta {
    width: 100%; padding: 20px;
    background: var(--primary); color: var(--on-primary);
    border: none; border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 700; cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,41,192,0.22);
    transition: transform 0.15s;
  }
  .nx-btn-cta:active { transform: scale(0.97); }
  .nx-cta-note {
    font-size: 14px; font-weight: 500;
    color: var(--on-surface-variant);
    letter-spacing: 0.02em;
  }

  .nx-footer {
    background: var(--surface-container-low);
    padding: 60px 20px;
    border-top: 1px solid var(--border-subtle);
  }
  .nx-footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; flex-direction: column; gap: 16px;
  }
  .nx-footer-top {
    display: flex; flex-direction: column; gap: 32px;
    padding-bottom: 48px;
  }
  .nx-footer-logo {
    font-size: 24px; font-weight: 800; color: var(--on-surface);
    letter-spacing: -0.5px;
  }
  .nx-footer-links-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  }
  .nx-footer-col { display: flex; flex-direction: column; gap: 16px; }
  .nx-footer-col-heading {
    font-size: 14px; font-weight: 700;
    color: var(--primary);
    text-transform: uppercase; letter-spacing: 0.1em;
  }
  .nx-footer-col a {
    font-size: 14px; font-weight: 400; line-height: 1.43;
    color: var(--on-surface-variant);
    text-decoration: none; transition: color 0.2s;
  }
  .nx-footer-col a:hover { color: var(--primary); }
  .nx-footer-bottom {
    border-top: 1px solid var(--border-subtle);
    padding-top: 24px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .nx-footer-legal {
    display: flex; flex-wrap: wrap; gap: 16px 24px;
  }
  .nx-footer-legal a {
    font-size: 14px; color: var(--on-surface-variant);
    text-decoration: none; transition: color 0.2s;
  }
  .nx-footer-legal a:hover { color: var(--primary); }
  .nx-footer-copy {
    font-size: 14px; color: var(--on-surface-variant); opacity: 0.7;
  }

  @media (min-width: 768px) {
    .nx-hero { padding: 120px 48px 120px; }
    .nx-hero h1 { font-size: 48px; }
    .nx-hero-badge { font-size: 12px; }

    .nx-features { padding: 120px 48px; }
    .nx-features-header h2 { font-size: 36px; }
    .nx-features-list { flex-direction: row; flex-wrap: wrap; max-width: 1100px; }
    .nx-feature-card { flex: 1 1 calc(33% - 16px); }

    .nx-templates { padding: 120px 48px; }
    .nx-templates-header h2 { font-size: 36px; }

    .nx-testimonials { padding: 120px 48px; }
    .nx-testimonials h2 { font-size: 36px; }
    .nx-testimonials-list { flex-direction: row; max-width: 1100px; }
    .nx-testimonial-card { flex: 1; }

    .nx-cta { padding: 120px 48px; }
    .nx-cta h2 { font-size: 38px; }

    .nx-footer { padding: 80px 48px; }
    .nx-footer-top { flex-direction: row; justify-content: space-between; }
    .nx-footer-links-grid { grid-template-columns: repeat(2, 140px); }
    .nx-footer-bottom { flex-direction: row; justify-content: space-between; align-items: center; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s ease 0.1s both; }
  .fade-up-3 { animation: fadeUp 0.6s ease 0.2s both; }
`;

function Icon({ name, filled = false, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined${filled ? " icon-filled" : ""}`}
      style={style}
    >
      {name}
    </span>
  );
}

function Stars() {
  return (
    <div className="nx-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" filled />
      ))}
    </div>
  );
}

function Navbar({ onNav }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="nx-header">
        <div className="nx-header-inner">
          <span className="nx-logo">Aikee AI</span>
          <ul className="nx-desktop-nav">
            <li><a href="#features" className="active">Features</a></li>
            <li><a href="#templates">Templates</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#resources">Resources</a></li>
          </ul>
          <div className="nx-desktop-actions">
            <button className="nx-btn-ghost" onClick={() => onNav?.("signin")}>Log In</button>
            <button className="nx-btn-nav-primary" onClick={() => onNav?.("signin")}>Get Started</button>
          </div>
          <button className="nx-menu-btn" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            <Icon name="menu" />
          </button>
        </div>
      </header>

      <div className={`nx-overlay${open ? " open" : ""}`}>
        <div className="nx-overlay-head">
          <span className="nx-logo">Aikee AI</span>
          <button className="nx-menu-btn" onClick={close} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <ul className="nx-overlay-nav">
          <li><a href="#features" className="active" onClick={close}>Features</a></li>
          <li><a href="#templates" onClick={close}>Templates</a></li>
          <li><a href="#pricing" onClick={close}>Pricing</a></li>
          <li><a href="#resources" onClick={close}>Resources</a></li>
        </ul>
        <div className="nx-overlay-actions">
          <button className="nx-btn-outline-full" onClick={() => { close(); onNav?.("signin"); }}>Log In</button>
          <button className="nx-btn-primary-full" onClick={() => { close(); onNav?.("signin"); }}>Get Started</button>
        </div>
      </div>
    </>
  );
}

function HeroSection({ onNav, heroImage = CVimage }) {
  return (
    <section className="nx-hero">
      <div className="nx-hero-badge fade-up">
        <Icon name="auto_awesome" filled style={{ fontSize: 14 }} />
        Built for students &amp; job-seekers
      </div>
      <h1 className="fade-up-2">
        Build a Resume That <span className="accent">Opens Doors</span>
      </h1>
      <p className="fade-up-2">
        The Premium AI resume builder designed for students and modern job seekers. Turn your experiences into compelling stories that get you noticed — without the hassle of formatting or writer's block.
      </p>
      <div className="nx-hero-btns fade-up-3">
        <button className="nx-btn-hero-primary" onClick={() => onNav?.("signin")}>Build My Resume Now</button>
        <button className="nx-btn-hero-secondary" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
          <Icon name="play_circle" />
          Watch How It Works
        </button>
      </div>
      <div className="nx-browser-frame fade-up-3">
        <div className="nx-browser-bar">
          <div className="nx-browser-dot" style={{ background: "rgba(186,26,26,0.2)" }} />
          <div className="nx-browser-dot" style={{ background: "rgba(52,198,255,0.2)" }} />
          <div className="nx-browser-dot" style={{ background: "rgba(33,66,231,0.2)" }} />
        </div>
        <img
          src={heroImage}
          alt="Resume preview dashboard"
          className="nx-browser-image"
        />
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: "psychology",
    title: "AI Suggestions",
    body: "Our neural network suggests powerful bullet points and action verbs tailored to your specific industry.",
  },
  {
    icon: "grid_view",
    title: "Real-time Formatting",
    body: "Changes update instantly. No more wrestling with margins, spacing, or page breaks in standard word processors.",
  },
  {
    icon: "key",
    title: "Keyword Optimization",
    body: "Analyze job descriptions automatically and ensure your resume includes the exact terms recruiters are looking for.",
  },
];

function FeaturesSection() {
  return (
    <section className="nx-features" id="features">
      <div className="nx-features-header">
        <h2>Everything You Need to Get Started — In One Place</h2>
        <div className="nx-underline-bar" />
      </div>
      <div className="nx-features-list">
        {FEATURES.map((f) => (
          <div className="nx-feature-card" key={f.title}>
            <div className="nx-feature-icon">
              <Icon name={f.icon} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TEMPLATES = [
  {
    title: "The Modernist",
    subtitle: "Clean, minimal, effective.",
    gradient: "linear-gradient(160deg, #eef2ff 0%, #c7d2fe 100%)",
  },
  {
    title: "Executive Gold",
    subtitle: "For leadership roles.",
    gradient: "linear-gradient(160deg, #1e3a5f 0%, #1d4ed8 100%)",
    dark: true,
  },
  {
    title: "Design Forward",
    subtitle: "Stand out from the crowd.",
    gradient: "linear-gradient(160deg, #312e81 0%, #4f46e5 55%, #22d3ee 100%)",
    dark: true,
  },
];

function TemplatesSection() {
  return (
    <section className="nx-templates" id="templates">
      <div className="nx-templates-header">
        <h2>Crafted for Every Career Path</h2>
        <p>Designed for maximum impact and readability.</p>
      </div>
      <div className="nx-templates-scroll">
        {TEMPLATES.map((t) => (
          <div className="nx-template-item" key={t.title}>
            <div className="nx-template-thumb" style={{ background: t.gradient }}>
              <div className="tpl-line" style={{ width: "80%", opacity: t.dark ? 0.5 : 0.4 }} />
              <div className="tpl-line short" style={{ opacity: t.dark ? 0.4 : 0.3 }} />
              <div className="tpl-line" style={{ width: "70%", opacity: t.dark ? 0.45 : 0.35 }} />
            </div>
            <h4>{t.title}</h4>
            <p>{t.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote: "Aikee AI completely transformed how I present my experience. I went from 0 callbacks to 3 interviews in a single week.",
    name: "Sarah Jenkins",
    role: "Software Engineer at Meta",
    initials: "SJ",
  },
  {
    quote: "The AI suggestions are scary good. It found ways to quantify my achievements that I never would have thought of myself.",
    name: "Marcus Chen",
    role: "Marketing Director",
    initials: "MC",
  },
];

function TestimonialsSection() {
  return (
    <section className="nx-testimonials" id="testimonials">
      <h2>Join 50,000+ hired professionals</h2>
      <div className="nx-testimonials-list">
        {TESTIMONIALS.map((t) => (
          <div className="nx-testimonial-card" key={t.name}>
            <Stars />
            <blockquote>"{t.quote}"</blockquote>
            <div className="nx-author">
              <div className="nx-avatar">{t.initials}</div>
              <div>
                <div className="nx-author-name">{t.name}</div>
                <div className="nx-author-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ onNav }) {
  return (
    <section className="nx-cta">
      <h2>Stop overthinking. Start building.</h2>
      <p>Your dream job is waiting. Take the first step today.</p>
      <div className="nx-cta-actions">
        <button className="nx-btn-cta" onClick={() => onNav?.("signin")}>Create Free Account</button>
        <span className="nx-cta-note">No credit card required. Cancel anytime.</span>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="nx-footer">
      <div className="nx-footer-inner">
        <div className="nx-footer-top">
          <div className="nx-footer-logo">Aikee AI</div>
          <div className="nx-footer-links-grid">
            <div className="nx-footer-col">
              <span className="nx-footer-col-heading">Product</span>
              <a href="#features">Features</a>
              <a href="#templates">Templates</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="nx-footer-col">
              <span className="nx-footer-col-heading">Company</span>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
        <div className="nx-footer-bottom">
          <div className="nx-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <p className="nx-footer-copy">© 2026 Aikee AI. Precision-engineered for your career.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage({ heroImage }) {
  const navigate = useNavigate();

  const handleNav = (route) => {
    if (route === "signin") return navigate("/signin");
    return navigate(`/${route}`);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ paddingTop: 64 }}>
        <Navbar onNav={handleNav} />
        <HeroSection onNav={handleNav} heroImage={heroImage} />
        <FeaturesSection />
        <TemplatesSection />
        <TestimonialsSection />
        <CTASection onNav={handleNav} />
        <Footer />
      </div>
    </>
  );
}

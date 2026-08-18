// Dashboard.jsx — Redesigned to exactly match Stitch design (desktop + mobile)
// Preserves all original logic: Supabase, cvOperations, props, navigation

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { cvOperations, getUserStats } from "../../utils/databaseHelpers";
import BrandLogo from "../BrandLogo";

// ─── Design Tokens (DESIGN.md exact values) ──────────────────────────────────
const T = {
  primary:        "#2142e7",
  primaryDark:    "#0029c0",
  primaryBg:      "rgba(33,66,231,0.08)",
  accentPurple:   "#4F46E5",
  surface:        "#f9f9ff",
  surfaceLow:     "#f1f3ff",
  surfaceHigh:    "#e1e8fd",
  surfaceVar:     "#dce2f7",
  surfaceHighest: "#dce2f7",
  white:          "#ffffff",
  onSurface:      "#141b2b",
  onSurfaceV:     "#444656",
  outline:        "#757687",
  outlineV:       "#c5c5d9",
  border:         "#E5E7EB",
  secondary:      "#006687",
  secondaryBg:    "rgba(0,102,135,0.08)",
  tertiary:       "#2927ba",
  tertiaryBg:     "rgba(41,39,186,0.08)",
  green:          "#16a34a",
  greenBg:        "#f0fdf4",
  error:          "#ba1a1a",
  errorBg:        "#ffdad6",
  glassFill:      "rgba(255,255,255,0.7)",
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: ${T.primary};
    --primary-dark: ${T.primaryDark};
    --surface: ${T.surface};
    --surface-low: ${T.surfaceLow};
    --surface-high: ${T.surfaceHigh};
    --surface-var: ${T.surfaceVar};
    --white: ${T.white};
    --on-surface: ${T.onSurface};
    --on-surface-v: ${T.onSurfaceV};
    --outline: ${T.outline};
    --outline-v: ${T.outlineV};
    --border: ${T.border};
    --error: ${T.error};
    --green: ${T.green};
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--surface);
    color: var(--on-surface);
    -webkit-font-smoothing: antialiased;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
    font-style: normal;
    line-height: 1;
    display: inline-block;
    vertical-align: middle;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

  /* ── Glass card ── */
  .glass-card {
    background: ${T.glassFill};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.3);
  }

  /* ── Shell ── */
  .db-shell {
    display: flex;
    min-height: 100vh;
  }

  /* ══════════════════════════════
     DESKTOP SIDEBAR
  ══════════════════════════════ */
  .db-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--white);
    border-right: 1px solid var(--outline-v);
    position: fixed;
    top: 0; left: 0; bottom: 0;
    display: flex; flex-direction: column;
    padding: 16px;
    gap: 8px;
    z-index: 50;
    overflow-y: auto;
  }

  /* Logo block */
  .db-logo {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 8px 24px;
    margin-bottom: 0;
  }
  .db-logo-icon {
    width: 40px; height: 40px;
    background: var(--primary);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: ${T.white};
    flex-shrink: 0;
  }
  .db-logo-name {
    font-size: 20px; font-weight: 800;
    color: var(--primary);
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  .db-logo-sub {
    font-size: 11px; color: var(--on-surface-v);
    font-weight: 400;
  }

  /* Nav links */
  .db-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .db-nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 500;
    color: var(--on-surface-v);
    text-decoration: none; cursor: pointer;
    transition: background 0.15s, color 0.15s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
  }
  .db-nav-link:hover {
    background: var(--surface-low);
    color: var(--on-surface);
  }
  .db-nav-link.active {
    background: var(--primary);
    color: ${T.white};
    font-weight: 600;
    transform: translateX(4px);
  }
  .db-nav-link.active .material-symbols-outlined { color: ${T.white}; }

  /* Sidebar bottom */
  .db-sidebar-bottom {
    border-top: 1px solid var(--outline-v);
    padding-top: 16px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .db-sidebar-cta {
    width: 100%; padding: 12px;
    background: var(--primary); color: ${T.white};
    border: none; border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(33,66,231,0.25);
    margin-bottom: 8px;
  }
  .db-sidebar-cta:hover { background: var(--primary-dark); box-shadow: 0 6px 20px rgba(33,66,231,0.35); }
  .db-signout-link {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 500;
    color: var(--on-surface-v);
    cursor: pointer; border: none; background: none;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, color 0.15s;
    width: 100%; text-align: left;
  }
  .db-signout-link:hover { background: var(--surface-low); color: var(--on-surface); }

  /* ══════════════════════════════
     MAIN CONTENT
  ══════════════════════════════ */
  .db-main {
    margin-left: 240px;
    flex: 1; min-width: 0;
    display: flex; flex-direction: column;
    min-height: 100vh;
  }

  /* ── Page body ── */
  .db-body { padding: 32px; flex: 1; }

  /* ── Page header ── */
  .db-page-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px;
  }
  .db-page-header h2 {
    font-size: 32px; font-weight: 600;
    letter-spacing: -0.01em; line-height: 1.25;
    color: var(--on-surface);
  }
  .db-page-date {
    font-size: 14px; font-weight: 500;
    color: var(--on-surface-v);
    margin-top: 4px;
  }
  .db-header-actions {
    display: flex; gap: 12px; align-items: center;
  }
  .db-notif-btn {
    width: 48px; height: 48px; border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.3);
    background: ${T.glassFill};
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--on-surface-v);
    transition: background 0.15s;
  }
  .db-notif-btn:hover { background: var(--surface-low); }
  .db-user-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(33,66,231,0.15);
    cursor: pointer; flex-shrink: 0;
  }
  .db-user-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .db-user-avatar-fallback {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), ${T.accentPurple});
    display: flex; align-items: center; justify-content: center;
    color: ${T.white}; font-size: 16px; font-weight: 700;
    border: 2px solid rgba(33,66,231,0.15);
    cursor: pointer;
  }

  /* ══════════════════════════════
     STAT CARDS
  ══════════════════════════════ */
  .db-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 48px;
  }
  .db-stat-card {
    padding: 24px; border-radius: 12px;
    transition: transform 0.3s;
  }
  .db-stat-card:hover { transform: scale(1.02); }
  .db-stat-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 16px;
  }
  .db-stat-icon {
    width: 40px; height: 40px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .db-stat-badge {
    font-size: 11px; font-weight: 700;
    padding: 3px 8px; border-radius: 9999px;
  }
  .db-stat-badge.green { color: ${T.green}; background: ${T.greenBg}; }
  .db-stat-badge.neutral { color: var(--on-surface-v); }
  .db-stat-label {
    font-size: 12px; font-weight: 500;
    color: var(--on-surface-v);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: 4px;
  }
  .db-stat-value {
    font-size: 32px; font-weight: 600;
    color: var(--on-surface);
    letter-spacing: -0.01em; line-height: 1.2;
  }

  /* ══════════════════════════════
     MY CVS SECTION
  ══════════════════════════════ */
  .db-cvs-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 32px;
  }
  .db-cvs-title {
    font-size: 24px; font-weight: 600;
    color: var(--on-surface); letter-spacing: -0.01em;
  }
  .db-view-archive {
    display: flex; align-items: center; gap: 4px;
    font-size: 14px; font-weight: 600;
    color: var(--primary); text-decoration: none; cursor: pointer;
    border: none; background: none; font-family: 'Inter', sans-serif;
    transition: gap 0.2s;
  }
  .db-view-archive:hover { gap: 8px; }

  /* CV grid */
  .db-cv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  /* ── Create New CV dashed card ── */
  .db-new-card {
    height: 320px;
    border: 2px dashed var(--outline-v);
    border-radius: 16px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; cursor: pointer;
    background: transparent;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .db-new-card:hover {
    border-color: var(--primary);
    background: ${T.primaryBg};
  }
  .db-new-card:hover .db-new-icon {
    background: var(--primary);
    color: ${T.white};
  }
  .db-new-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--surface-high);
    display: flex; align-items: center; justify-content: center;
    color: var(--on-surface-v);
    transition: background 0.2s, color 0.2s;
  }
  .db-new-label {
    font-size: 18px; font-weight: 700;
    color: var(--on-surface);
  }
  .db-new-sub {
    font-size: 14px; color: var(--on-surface-v);
  }

  /* ── CV Resume card ── */
  .db-cv-card {
    border-radius: 16px; overflow: hidden;
    display: flex; flex-direction: column;
    height: 320px;
    transition: box-shadow 0.5s, transform 0.3s;
  }
  .db-cv-card:hover {
    box-shadow: 0 24px 60px rgba(17,24,39,0.15);
    transform: translateY(-2px);
  }

  /* Preview area */
  .db-cv-preview {
    flex: 1;
    background: rgba(220,226,247,0.3);
    padding: 16px; position: relative;
    min-height: 0;
  }
  .db-cv-preview-inner {
    width: 100%; height: 100%;
    background: ${T.white};
    border-radius: 6px;
    border: 1px solid rgba(197,197,217,0.3);
    overflow: hidden;
    position: relative;
  }
  .db-cv-preview-content {
    padding: 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .db-cv-skeleton-line {
    border-radius: 4px;
    background: var(--surface-var);
  }
  .db-cv-skeleton-line.sm { height: 8px; width: 33%; }
  .db-cv-skeleton-line.accent { height: 16px; width: 100%; background: ${T.primaryBg}; }
  .db-cv-skeleton-line.xs { height: 4px; background: var(--outline-v); }
  .db-cv-skeleton-line.xs-short { height: 4px; width: 66%; background: var(--outline-v); }

  /* Hover overlay */
  .db-cv-hover {
    position: absolute; inset: 0;
    background: rgba(33,66,231,0.6);
    opacity: 0; transition: opacity 0.3s;
    display: flex; align-items: center; justify-content: center;
    gap: 12px; border-radius: 6px;
  }
  .db-cv-card:hover .db-cv-hover { opacity: 1; }
  .db-hover-btn {
    width: 44px; height: 44px; border-radius: 50%;
    background: ${T.white}; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--primary);
    transition: transform 0.15s;
  }
  .db-hover-btn:hover { transform: scale(1.1); }

  /* ATS badge */
  .db-ats-badge {
    position: absolute; top: 24px; right: 24px;
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(33,66,231,0.2);
    border-radius: 9999px;
    padding: 4px 10px;
    box-shadow: 0 2px 8px rgba(17,24,39,0.1);
    z-index: 2;
  }
  .db-ats-label {
    font-size: 10px; font-weight: 700;
    color: var(--primary);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .db-ats-value {
    font-size: 14px; font-weight: 700;
    color: var(--on-surface);
  }

  /* Card footer */
  .db-cv-footer {
    padding: 20px; background: ${T.white};
    flex-shrink: 0;
  }
  .db-cv-footer-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 16px;
  }
  .db-cv-name {
    font-size: 18px; font-weight: 700;
    color: var(--on-surface); margin-bottom: 2px;
  }
  .db-cv-updated {
    font-size: 12px; color: var(--on-surface-v);
  }
  .db-delete-btn {
    border: none; background: none; cursor: pointer;
    color: var(--on-surface-v); padding: 4px;
    border-radius: 6px; display: flex; align-items: center;
    transition: color 0.15s;
  }
  .db-delete-btn:hover { color: var(--error); }
  .db-cv-actions {
    display: flex; gap: 8px;
  }
  .db-cv-btn {
    flex: 1; padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--outline-v);
    background: ${T.white};
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    color: var(--on-surface);
    cursor: pointer;
    transition: background 0.15s;
  }
  .db-cv-btn:hover { background: var(--surface-low); }

  /* ══════════════════════════════
     AI UPSELL BANNER
  ══════════════════════════════ */
  .db-upsell {
    margin-top: 48px;
    background: linear-gradient(135deg, var(--primary) 0%, ${T.accentPurple} 100%);
    border-radius: 16px;
    padding: 32px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 24px;
    box-shadow: 0 20px 60px rgba(33,66,231,0.2);
  }
  .db-upsell-left {
    display: flex; align-items: center; gap: 24px;
  }
  .db-upsell-icon {
    width: 64px; height: 64px;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: ${T.white}; flex-shrink: 0;
  }
  .db-upsell-h4 {
    font-size: 20px; font-weight: 600;
    color: ${T.white}; margin-bottom: 4px;
  }
  .db-upsell-p {
    font-size: 14px; color: rgba(255,255,255,0.8);
    max-width: 440px; line-height: 1.6;
  }
  .db-upsell-btn {
    background: ${T.white}; color: var(--primary);
    padding: 12px 32px; border-radius: 12px;
    border: none; font-family: 'Inter', sans-serif;
    font-size: 15px; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .db-upsell-btn:hover { background: var(--surface); transform: scale(0.98); }
  .db-upsell-btn:active { transform: scale(0.95); }

  /* ══════════════════════════════
     MOBILE HEADER
  ══════════════════════════════ */
  .db-mobile-header {
    display: none;
    align-items: center; justify-content: space-between;
    padding: 0 20px; height: 56px;
    background: rgba(249,249,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 60;
  }
  .db-mobile-menu-btn {
    padding: 6px; border: none; background: none; cursor: pointer;
    color: var(--on-surface-v); border-radius: 8px;
    display: flex; align-items: center;
    transition: background 0.15s;
  }
  .db-mobile-menu-btn:hover { background: var(--surface-low); }
  .db-mobile-logo {
    font-size: 20px; font-weight: 800;
    color: var(--primary); letter-spacing: -0.5px;
  }
  .db-mobile-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    overflow: hidden; cursor: pointer;
  }
  .db-mobile-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .db-mobile-avatar-fallback {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), ${T.accentPurple});
    display: flex; align-items: center; justify-content: center;
    color: ${T.white}; font-size: 13px; font-weight: 700; cursor: pointer;
  }

  /* Mobile overlay */
  .db-mobile-overlay {
    display: none; position: fixed; inset: 0;
    background: ${T.white}; z-index: 70;
    flex-direction: column; padding: 20px;
  }
  .db-mobile-overlay.open { display: flex; }
  .db-overlay-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 32px;
  }
  .db-overlay-close {
    padding: 6px; border: none; background: none; cursor: pointer;
    color: var(--on-surface-v); border-radius: 8px; display: flex;
  }
  .db-overlay-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .db-overlay-link {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; border-radius: 10px;
    font-size: 15px; font-weight: 600;
    color: var(--on-surface); text-decoration: none;
    cursor: pointer; border: none; background: none;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .db-overlay-link:hover { background: var(--surface-low); }
  .db-overlay-link.active { color: var(--primary); background: ${T.primaryBg}; }
  .db-overlay-footer {
    border-top: 1px solid var(--border); padding-top: 16px;
  }

  /* ══════════════════════════════
     MOBILE CONTENT LAYOUT
  ══════════════════════════════ */
  .db-mobile-body {
    display: none;
    flex-direction: column; gap: 0;
    padding: 20px 16px 80px;
  }

  /* Mobile welcome */
  .db-m-welcome { margin-bottom: 20px; }
  .db-m-welcome h2 {
    font-size: 26px; font-weight: 800;
    color: var(--on-surface); letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .db-m-welcome p {
    font-size: 14px; color: var(--on-surface-v);
    margin-top: 4px;
  }

  /* Mobile create new CV banner */
  .db-m-create-banner {
    background: var(--primary);
    border-radius: 16px;
    padding: 20px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; cursor: pointer; margin-bottom: 24px;
    transition: background 0.2s;
    border: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
  }
  .db-m-create-banner:hover { background: var(--primary-dark); }
  .db-m-create-left { display: flex; align-items: center; gap: 14px; }
  .db-m-create-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    color: ${T.white}; flex-shrink: 0;
  }
  .db-m-create-title {
    font-size: 18px; font-weight: 700; color: ${T.white};
    display: block;
  }
  .db-m-create-sub {
    font-size: 13px; color: rgba(255,255,255,0.75);
    display: block; margin-top: 2px;
  }
  .db-m-create-arrow { color: rgba(255,255,255,0.7); }

  /* Mobile stats 2x2 grid */
  .db-m-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 28px;
  }
  .db-m-stat {
    background: ${T.white};
    border: 1px solid var(--border);
    border-radius: 16px; padding: 16px;
  }
  .db-m-stat-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 12px;
  }
  .db-m-stat-icon {
    width: 36px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
  }
  .db-m-stat-delta {
    font-size: 11px; font-weight: 700;
    padding: 2px 7px; border-radius: 9999px;
  }
  .db-m-stat-delta.green { color: ${T.green}; background: ${T.greenBg}; }
  .db-m-stat-delta.neutral { color: var(--on-surface-v); }
  .db-m-stat-value {
    font-size: 28px; font-weight: 800;
    color: var(--on-surface); letter-spacing: -1px;
    line-height: 1;
  }
  .db-m-stat-label {
    font-size: 13px; color: var(--on-surface-v);
    margin-top: 4px;
  }

  /* Mobile CV section */
  .db-m-cvs-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .db-m-cvs-title {
    font-size: 20px; font-weight: 700; color: var(--on-surface);
  }
  .db-m-view-all {
    font-size: 14px; font-weight: 600; color: var(--primary);
    border: none; background: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
  }

  /* Mobile CV card (horizontal list layout) */
  .db-m-cv-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
  .db-m-cv-card {
    background: ${T.white};
    border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .db-m-cv-preview {
    height: 100px; position: relative;
    background: var(--surface-low);
    display: flex; align-items: center; justify-content: center;
  }
  .db-m-cv-preview-inner {
    width: 70px; background: ${T.white};
    border-radius: 4px; padding: 6px;
    box-shadow: 0 2px 8px rgba(17,24,39,0.1);
  }
  .db-m-cv-mini-line {
    height: 3px; border-radius: 2px;
    background: var(--outline-v); margin-bottom: 3px;
  }
  .db-m-cv-mini-line.accent { background: var(--primary); opacity: 0.3; width: 60%; }
  .db-m-cv-mini-line.short { width: 50%; }
  .db-m-ats-badge {
    position: absolute; top: 10px; right: 10px;
    background: ${T.white}; border: 1px solid var(--border);
    border-radius: 9999px; padding: 3px 8px;
    display: flex; align-items: center; gap: 3px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .db-m-ats-score { font-size: 12px; font-weight: 700; }
  .db-m-ats-score.high { color: ${T.green}; }
  .db-m-ats-score.mid { color: ${T.primary}; }
  .db-m-ats-score.low { color: #d97706; }
  .db-m-cv-info {
    padding: 12px 14px;
  }
  .db-m-cv-info-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .db-m-cv-name { font-size: 15px; font-weight: 700; color: var(--on-surface); }
  .db-m-cv-updated { font-size: 12px; color: var(--on-surface-v); margin-top: 1px; }
  .db-m-cv-btns { display: flex; gap: 8px; }
  .db-m-cv-btn {
    flex: 1; padding: 9px;
    border-radius: 8px; border: 1px solid var(--outline-v);
    background: ${T.white}; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--on-surface);
    cursor: pointer; transition: background 0.15s;
  }
  .db-m-cv-btn:hover { background: var(--surface-low); }
  .db-m-cv-btn.primary { background: var(--primary); color: ${T.white}; border-color: var(--primary); }
  .db-m-cv-btn.primary:hover { background: var(--primary-dark); }

  /* Mobile upsell */
  .db-m-upsell {
    background: linear-gradient(135deg, var(--primary) 30%, ${T.accentPurple} 100%);
    border-radius: 16px; padding: 24px; position: relative; overflow: hidden;
    margin-top: 8px;
  }
  .db-m-upsell-stars {
    position: absolute; right: 20px; top: 20px;
    opacity: 0.3;
  }
  .db-m-upsell-h4 {
    font-size: 18px; font-weight: 700;
    color: ${T.white}; margin-bottom: 8px; line-height: 1.3;
  }
  .db-m-upsell-p {
    font-size: 13px; color: rgba(255,255,255,0.8);
    line-height: 1.6; margin-bottom: 16px;
  }
  .db-m-upsell-btn {
    background: ${T.white}; color: var(--primary);
    padding: 11px 24px; border-radius: 9999px;
    border: none; font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; display: inline-block;
    transition: background 0.2s;
  }
  .db-m-upsell-btn:hover { background: var(--surface-low); }

  /* ══════════════════════════════
     MOBILE BOTTOM NAV
  ══════════════════════════════ */
  .db-bottom-nav {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: ${T.white};
    border-top: 1px solid var(--border);
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    z-index: 60;
  }
  .db-bottom-nav-inner { display: flex; justify-content: space-around; }
  .db-bottom-nav-item {
    display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 4px 16px; border-radius: 12px;
    border: none; background: none; cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 500; color: var(--on-surface-v);
    transition: color 0.15s;
  }
  .db-bottom-nav-item.active {
    color: var(--primary);
    background: rgba(33,66,231,0.07);
    border-radius: 12px;
  }
  .db-bottom-nav-item.active .material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  }

  /* ══════════════════════════════
     DELETE MODAL
  ══════════════════════════════ */
  .db-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .db-modal {
    background: ${T.white}; border-radius: 20px;
    padding: 36px 32px; max-width: 400px; width: 90%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    animation: scaleIn 0.2s ease;
  }
  .db-modal-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: ${T.errorBg}; display: flex;
    align-items: center; justify-content: center;
    margin-bottom: 20px;
  }
  .db-modal-title { font-size: 18px; font-weight: 700; color: var(--on-surface); margin-bottom: 8px; }
  .db-modal-sub { font-size: 14px; color: var(--on-surface-v); line-height: 1.6; margin-bottom: 28px; }
  .db-modal-btns { display: flex; gap: 12px; }
  .db-modal-cancel {
    flex: 1; padding: 12px; border-radius: 10px;
    border: 1.5px solid var(--outline-v);
    background: ${T.white};
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    color: var(--on-surface-v); cursor: pointer;
    transition: border-color 0.15s;
  }
  .db-modal-cancel:hover { border-color: var(--outline); color: var(--on-surface); }
  .db-modal-delete {
    flex: 1; padding: 12px; border-radius: 10px;
    border: none; background: var(--error);
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700;
    color: ${T.white}; cursor: pointer;
    transition: background 0.15s;
  }
  .db-modal-delete:hover { background: #9b1010; }

  /* ══════════════════════════════
     EMPTY STATE
  ══════════════════════════════ */
  .db-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 64px 24px; text-align: center;
    color: var(--on-surface-v);
  }
  .db-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.35; }
  .db-empty-title { font-size: 16px; font-weight: 700; color: var(--on-surface-v); margin-bottom: 6px; }
  .db-empty-sub { font-size: 14px; color: var(--outline); }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }
  .db-cv-card, .db-m-cv-card {
    animation: fadeUp 0.45s ease both;
  }
  .db-cv-card:nth-child(1), .db-m-cv-card:nth-child(1) { animation-delay: 0.05s; }
  .db-cv-card:nth-child(2), .db-m-cv-card:nth-child(2) { animation-delay: 0.1s; }
  .db-cv-card:nth-child(3), .db-m-cv-card:nth-child(3) { animation-delay: 0.15s; }
  .db-cv-card:nth-child(4), .db-m-cv-card:nth-child(4) { animation-delay: 0.2s; }

  /* ══════════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════════ */
  @media (min-width: 1024px) {
    .db-sidebar       { display: flex; }
    .db-main          { display: flex; }
    .db-mobile-header { display: none; }
    .db-mobile-body   { display: none; }
    .db-bottom-nav    { display: none; }
  }

  @media (max-width: 1023px) {
    .db-sidebar       { display: none; }
    .db-main          { display: none; }
    .db-mobile-header { display: flex; }
    .db-mobile-body   { display: flex; }
    .db-bottom-nav    { display: flex; }
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .db-cv-grid    { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .db-body       { padding: 24px; }
  }
    
  @media (max-width: 768px) {
    .db-shell { display: none !important; }
  }
}
`;

// ─── Icon helper ──────────────────────────────────────────────────────────────
function Icon({ name, size = 20, filled = false, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined${filled ? " icon-filled" : ""}`}
      style={{ fontSize: size, ...style }}
    >
      {name}
    </span>
  );
}

// ─── ATS score colour helper ─────────────────────────────────────────────────
function atsColor(score) {
  const n = parseInt(score);
  if (n >= 85) return T.green;
  if (n >= 70) return T.primary;
  return "#d97706";
}
function atsMobileClass(score) {
  const n = parseInt(score);
  if (n >= 85) return "high";
  if (n >= 70) return "mid";
  return "low";
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
function DesktopSidebar({ user, onSignOut, navigate }) {
  return (
    <aside className="db-sidebar">
      {/* Logo */}
      <div className="db-logo">
        <BrandLogo height={30} />
      </div>

      {/* Nav */}
      <nav className="db-nav">
        <button className="db-nav-link active" onClick={() => navigate("/dashboard")}>
          <Icon name="dashboard" size={20} />
          Dashboard
        </button>
        <button className="db-nav-link" onClick={() => navigate("/builder")}>
          <Icon name="add_circle" size={20} />
          New CV
        </button>
        <button className="db-nav-link" onClick={() => navigate("/settings")}>
          <Icon name="settings" size={20} />
          Settings
        </button>
        <button className="db-nav-link" onClick={() => navigate("/profile")}>
          <Icon name="account_circle" size={20} />
          Profile
        </button>
      </nav>

      {/* Bottom */}
      <div className="db-sidebar-bottom">
        <button className="db-sidebar-cta" onClick={() => navigate("/builder")}>
          <Icon name="add" size={18} />
          Create New CV
        </button>
        <button className="db-signout-link" onClick={onSignOut}>
          <Icon name="logout" size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Desktop Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, iconColor, badge, badgeType, label, value }) {
  return (
    <div className="db-stat-card glass-card">
      <div className="db-stat-top">
        <div className="db-stat-icon" style={{ background: iconBg }}>
          <Icon name={icon} size={20} style={{ color: iconColor }} />
        </div>
        {badge && (
          <span className={`db-stat-badge ${badgeType}`}>{badge}</span>
        )}
      </div>
      <div className="db-stat-label">{label}</div>
      <div className="db-stat-value">{value}</div>
    </div>
  );
}

// ─── Desktop CV card (preview skeleton + ATS + footer) ───────────────────────
function DesktopCVCard({ cv, onDelete, onEdit, onPreview }) {
  return (
    <div className="db-cv-card glass-card">
      {/* Preview */}
      <div className="db-cv-preview">
        <div className="db-cv-preview-inner">
          <div className="db-cv-preview-content">
            <div className="db-cv-skeleton-line sm" />
            <div className="db-cv-skeleton-line accent" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
              <div className="db-cv-skeleton-line xs" />
              <div className="db-cv-skeleton-line xs" />
              <div className="db-cv-skeleton-line xs-short" />
            </div>
          </div>
          {/* Hover overlay */}
          <div className="db-cv-hover">
            <button className="db-hover-btn" onClick={e => { e.stopPropagation(); onPreview(cv); }} title="Preview">
              <Icon name="visibility" size={20} />
            </button>
            <button className="db-hover-btn" onClick={e => { e.stopPropagation(); onEdit(cv); }} title="Edit">
              <Icon name="edit" size={20} />
            </button>
          </div>
        </div>
        {/* ATS badge */}
        <div className="db-ats-badge">
          <span className="db-ats-label">ATS</span>
          <span className="db-ats-value" style={{ color: atsColor(cv.atsScore) }}>
            {cv.atsScore ?? "—"}
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="db-cv-footer">
        <div className="db-cv-footer-top">
          <div>
            <div className="db-cv-name">{cv.title}</div>
            <div className="db-cv-updated">Last edited: {cv.updatedAt}</div>
          </div>
          <button className="db-delete-btn" onClick={e => { e.stopPropagation(); onDelete(cv); }}>
            <Icon name="delete" size={20} />
          </button>
        </div>
        <div className="db-cv-actions">
          <button className="db-cv-btn" onClick={() => onEdit(cv)}>Edit</button>
          <button className="db-cv-btn" onClick={() => onPreview(cv)}>Preview</button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile CV card ───────────────────────────────────────────────────────────
function MobileCVCard({ cv, onDelete, onEdit, onPreview }) {
  return (
    <div className="db-m-cv-card">
      <div className="db-m-cv-preview">
        <div className="db-m-cv-preview-inner">
          <div className="db-m-cv-mini-line accent" />
          <div className="db-m-cv-mini-line" />
          <div className="db-m-cv-mini-line short" />
          <div style={{ marginTop: 4 }} />
          <div className="db-m-cv-mini-line" />
          <div className="db-m-cv-mini-line short" />
          <div className="db-m-cv-mini-line" />
        </div>
        <div className="db-m-ats-badge">
          <span className={`db-m-ats-score ${atsMobileClass(cv.atsScore)}`}>
            {cv.atsScore ?? "—"} ATS
          </span>
        </div>
      </div>
      <div className="db-m-cv-info">
        <div className="db-m-cv-info-top">
          <div>
            <div className="db-m-cv-name">{cv.title}</div>
            <div className="db-m-cv-updated">Last edited {cv.updatedAt}</div>
          </div>
        </div>
        <div className="db-m-cv-btns">
          <button className="db-m-cv-btn" onClick={() => onPreview(cv)}>Preview</button>
          <button className="db-m-cv-btn primary" onClick={() => onEdit(cv)}>Edit</button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ cv, onConfirm, onCancel, deleting }) {
  return (
    <div className="db-modal-overlay" onClick={onCancel}>
      <div className="db-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-icon">
          <Icon name="delete" size={24} style={{ color: T.error }} />
        </div>
        <div className="db-modal-title">Delete this CV?</div>
        <div className="db-modal-sub">
          <strong>"{cv.title}"</strong> will be permanently removed. This cannot be undone.
        </div>
        <div className="db-modal-btns">
          <button className="db-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="db-modal-delete" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ active, setActive, navigate }) {
  const items = [
    { id: "resumes",  icon: "description", label: "Resumes" },
    { id: "insights", icon: "bar_chart",   label: "Insights" },
    { id: "builder",  icon: "add_circle",  label: "Builder" },
    { id: "settings", icon: "settings",    label: "Settings" },
  ];
  return (
    <nav className="db-bottom-nav">
      <div className="db-bottom-nav-inner">
        {items.map(item => (
          <button
            key={item.id}
            className={`db-bottom-nav-item${active === item.id ? " active" : ""}`}
            onClick={() => {
              setActive(item.id);
              if (item.id === "builder") navigate("/builder");
              if (item.id === "settings") navigate("/settings");
            }}
          >
            <Icon name={item.icon} size={22} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Main Dashboard Export ────────────────────────────────────────────────────
export default function Dashboard({ user, onSignOut }) {
  const navigate = useNavigate();
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [deletingCV, setDeletingCV] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resumes");
  const [search, setSearch] = useState("");

  // Load CVs
  useEffect(() => {
    const loadCVs = async () => {
      try {
        setLoading(true);
        const result = await cvOperations.getAllCVs();
        if (result.success && result.data) setCVs(result.data);
      } catch (err) {
        console.error("Error loading CVs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCVs();
  }, []);

  // Load real account statistics (from the user_stats view)
  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await getUserStats();
        if (result.success && result.data) setStats(result.data);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };
    loadStats();
  }, []);

  const filtered = cvs.filter(cv =>
    !search || (cv.title && cv.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit    = (cv) => navigate(`/builder?cvId=${cv.id}`);
  const handlePreview = (cv) => navigate(`/builder?cvId=${cv.id}`);
  const handleDelete  = (cv) => setDeletingCV(cv);
  const confirmDelete = async () => {
    if (!deletingCV) return;
    try {
      setDeleting(true);
      const result = await cvOperations.deleteCV(deletingCV.id);
      if (result.success) {
        setCVs(prev => prev.filter(c => c.id !== deletingCV.id));
        setDeletingCV(null);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const firstName = user?.firstName || user?.email?.split("@")[0] || "there";
  const initials  = (firstName[0] || "U").toUpperCase();

  // Format the most recent activity timestamp into a short relative label
  const formatLastActive = (stats) => {
    const raw = stats?.last_cv_update || stats?.last_cache_use;
    if (!raw) return "—";
    const then = new Date(raw);
    const diffMs = Date.now() - then.getTime();
    const day = 24 * 60 * 60 * 1000;
    if (diffMs < 60 * 1000) return "Just now";
    if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))}m ago`;
    if (diffMs < day) return `${Math.floor(diffMs / (60 * 60 * 1000))}h ago`;
    if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // ── Stat data (all values are real, sourced from the user_stats view) ──
  const totalCVs       = stats?.total_cvs ?? cvs.length;
  const aiGenerations  = stats?.total_cache_entries ?? 0;
  const aiToolsUsed    = stats?.cache_types_used ?? 0;

  const statCards = [
    {
      icon: "description", iconBg: `${T.primaryBg}`, iconColor: T.primary,
      label: "CVs Created", value: totalCVs,
    },
    {
      icon: "auto_awesome", iconBg: "rgba(79,70,229,0.1)", iconColor: T.accentPurple,
      label: "AI Generations", value: aiGenerations,
    },
    {
      icon: "category", iconBg: T.secondaryBg, iconColor: T.secondary,
      label: "AI Tools Used", value: `${aiToolsUsed}/3`,
    },
    {
      icon: "schedule", iconBg: T.tertiaryBg, iconColor: T.tertiary,
      label: "Last Active", value: formatLastActive(stats),
    },
  ];

  return (
    <>
      <style>{css}</style>

      {/* ══ DESKTOP LAYOUT ══ */}
      <div className="db-shell">
        <DesktopSidebar user={user} onSignOut={onSignOut} navigate={navigate} />

        <main className="db-main">
          <div className="db-body">
            {/* Page header */}
            <header className="db-page-header">
              <div>
                <h2>Welcome back, {firstName}</h2>
                <p className="db-page-date">{today}</p>
              </div>
              <div className="db-header-actions">
                <button className="db-notif-btn" aria-label="Notifications">
                  <Icon name="notifications" size={22} />
                </button>
                <div className="db-user-avatar-fallback" title={user?.email}>
                  {initials}
                </div>
              </div>
            </header>

            {/* Stats */}
            <section className="db-stats-grid">
              {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </section>

            {/* My CVs */}
            <section>
              <div className="db-cvs-header">
                <h3 className="db-cvs-title">My CVs</h3>
                <button className="db-view-archive">
                  View Archive <Icon name="arrow_forward" size={16} />
                </button>
              </div>

              <div className="db-cv-grid">
                {/* Create New CV — always first */}
                <button className="db-new-card" onClick={() => navigate("/builder")}>
                  <div className="db-new-icon">
                    <Icon name="add" size={28} />
                  </div>
                  <span className="db-new-label">Create New CV</span>
                  <span className="db-new-sub">Takes only 5 minutes</span>
                </button>

                {loading ? (
                  <div style={{ color: T.onSurfaceV, padding: 32, gridColumn: "span 2" }}>
                    Loading your CVs…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="db-empty" style={{ gridColumn: "span 2" }}>
                    <div className="db-empty-icon">
                      <Icon name="description" size={48} />
                    </div>
                    <div className="db-empty-title">No CVs yet</div>
                    <div className="db-empty-sub">Create your first CV to get started.</div>
                  </div>
                ) : (
                  filtered.map(cv => (
                    <DesktopCVCard
                      key={cv.id}
                      cv={cv}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onPreview={handlePreview}
                    />
                  ))
                )}
              </div>
            </section>

            {/* AI Upsell Banner */}
            <div className="db-upsell">
              <div className="db-upsell-left">
                <div className="db-upsell-icon">
                  <Icon name="auto_awesome" size={28} filled />
                </div>
                <div>
                  <div className="db-upsell-h4">Boost your ATS score by 15%</div>
                  <p className="db-upsell-p">
                    Our AI analyzed your recent CV and found 3 key industry keywords missing for Senior Developer roles.
                  </p>
                </div>
              </div>
              <button className="db-upsell-btn">Auto-Optimize</button>
            </div>
          </div>
        </main>
      </div>

      {/* ══ MOBILE LAYOUT ══ */}
      {/* Mobile header */}
      <header className="db-mobile-header">
        <button className="db-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Menu">
          <Icon name="menu" size={24} />
        </button>
        <BrandLogo className="db-mobile-logo" height={24} />
        <div className="db-mobile-avatar-fallback" onClick={onSignOut} title="Sign out">
          {initials}
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={`db-mobile-overlay${mobileMenuOpen ? " open" : ""}`}>
        <div className="db-overlay-header">
          <BrandLogo className="db-mobile-logo" height={24} />
          <button className="db-overlay-close" onClick={() => setMobileMenuOpen(false)}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav className="db-overlay-nav">
          <button className="db-overlay-link active" onClick={() => { setMobileMenuOpen(false); navigate("/dashboard"); }}>
            <Icon name="dashboard" size={20} /> Dashboard
          </button>
          <button className="db-overlay-link" onClick={() => { setMobileMenuOpen(false); navigate("/builder"); }}>
            <Icon name="add_circle" size={20} /> New CV
          </button>
          <button className="db-overlay-link" onClick={() => { setMobileMenuOpen(false); navigate("/settings"); }}>
            <Icon name="settings" size={20} /> Settings
          </button>
          <button className="db-overlay-link" onClick={() => { setMobileMenuOpen(false); navigate("/profile"); }}>
            <Icon name="account_circle" size={20} /> Profile
          </button>
        </nav>
        <div className="db-overlay-footer">
          <button className="db-overlay-link" onClick={() => { setMobileMenuOpen(false); onSignOut(); }}>
            <Icon name="logout" size={20} /> Sign Out
          </button>
        </div>
      </div>

      {/* Mobile body */}
      <div className="db-mobile-body">
        {/* Welcome */}
        <div className="db-m-welcome">
          <h2>Welcome back,<br />{firstName}</h2>
          <p>{today}</p>
        </div>

        {/* Create New CV Banner */}
        <button className="db-m-create-banner" onClick={() => navigate("/builder")}>
          <div className="db-m-create-left">
            <div className="db-m-create-icon">
              <Icon name="add_circle" size={22} filled />
            </div>
            <div>
              <span className="db-m-create-title">Create New CV</span>
              <span className="db-m-create-sub">Start with a fresh template</span>
            </div>
          </div>
          <div className="db-m-create-arrow">
            <Icon name="chevron_right" size={22} />
          </div>
        </button>

        {/* Stats 2×2 */}
        <div className="db-m-stats">
          {statCards.map(s => (
            <div className="db-m-stat" key={s.label}>
              <div className="db-m-stat-top">
                <div className="db-m-stat-icon" style={{ background: s.iconBg }}>
                  <Icon name={s.icon} size={18} style={{ color: s.iconColor }} />
                </div>
              </div>
              <div className="db-m-stat-value">{s.value}</div>
              <div className="db-m-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* My CVs list */}
        <div className="db-m-cvs-header">
          <span className="db-m-cvs-title">My CVs</span>
          <button className="db-m-view-all">View All</button>
        </div>

        <div className="db-m-cv-list">
          {loading ? (
            <p style={{ color: T.onSurfaceV, fontSize: 14, padding: "8px 0" }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: T.outline, fontSize: 14 }}>No CVs yet. Tap "Create New CV" to start.</p>
          ) : (
            filtered.map(cv => (
              <MobileCVCard
                key={cv.id}
                cv={cv}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onPreview={handlePreview}
              />
            ))
          )}
        </div>

        {/* Upsell card */}
        <div className="db-m-upsell">
          <div className="db-m-upsell-stars">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path d="M30 5 L32 28 L55 30 L32 32 L30 55 L28 32 L5 30 L28 28 Z" fill="white" opacity="0.8"/>
              <path d="M50 10 L51 18 L59 19 L51 20 L50 28 L49 20 L41 19 L49 18 Z" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div className="db-m-upsell-h4">Boost your ATS score</div>
          <p className="db-m-upsell-p">
            Get expert AI feedback and land your dream role faster with our premium analysis tool.
          </p>
          <button className="db-m-upsell-btn">Upgrade Now</button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav active={activeTab} setActive={setActiveTab} navigate={navigate} />

      {/* Delete modal */}
      {deletingCV && (
        <DeleteModal
          cv={deletingCV}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCV(null)}
          deleting={deleting}
        />
      )}
    </>
  );
}

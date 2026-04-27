// Dashboard.jsx — User Dashboard with real CV management
// Integrates with Supabase CVs and existing BuilderApp

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import { cvOperations } from "../../utils/databaseHelpers";

// ── Colour palette ─────────────────────────────────────────
const C = {
  bg:       "#f5f6fa",
  sidebar:  "#0f1117",
  card:     "#ffffff",
  border:   "#e8eaf0",
  blue:     "#1a4bdb",
  blueL:    "#2563eb",
  blueBg:   "#eff6ff",
  dark:     "#0f1117",
  mid:      "#4b5563",
  light:    "#9ca3af",
  green:    "#059669",
  greenBg:  "#ecfdf5",
  red:      "#dc2626",
  redBg:    "#fef2f2",
  yellow:   "#d97706",
  yellowBg: "#fffbeb",
};

// ── Injected styles ────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; background: ${C.bg}; color: ${C.dark}; -webkit-font-smoothing: antialiased; }

  /* ── Layout ── */
  .db-shell { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .db-sidebar {
    width: 240px; flex-shrink: 0;
    background: ${C.sidebar};
    display: flex; flex-direction: column;
    padding: 0; position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 50;
  }
  .db-sidebar-logo {
    padding: 24px 24px 20px;
    font-size: 20px; font-weight: 900; color: #fff;
    letter-spacing: -0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .db-sidebar-logo span { color: ${C.blue}; }
  .db-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; }
  .db-nav-section {
    font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3);
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 12px 12px 6px;
  }
  .db-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 8px;
    font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.55);
    cursor: pointer; transition: all 0.15s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'Manrope', sans-serif;
  }
  .db-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
  .db-nav-item.active { background: rgba(26,75,219,0.2); color: #fff; }
  .db-nav-item.active .db-nav-icon { color: ${C.blue}; }
  .db-nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
  .db-nav-badge {
    margin-left: auto; background: ${C.blue};
    color: #fff; font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 10px;
  }
  .db-sidebar-user {
    padding: 16px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: background 0.15s;
    border-radius: 0;
  }
  .db-sidebar-user:hover { background: rgba(255,255,255,0.04); }
  .db-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, ${C.blue}, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .db-user-name { font-size: 13px; font-weight: 600; color: #fff; }
  .db-user-plan {
    font-size: 10px; font-weight: 700; color: ${C.blue};
    background: rgba(26,75,219,0.15);
    padding: 1px 6px; border-radius: 4px;
    display: inline-block; margin-top: 1px;
  }

  /* ── Main content ── */
  .db-main {
    margin-left: 240px;
    flex: 1; display: flex; flex-direction: column;
    min-height: 100vh;
    position: relative;
  }

  /* ── Topbar ── */
  .db-topbar {
    background: #fff; border-bottom: 1px solid ${C.border};
    padding: 0 32px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 40;
  }
  .db-topbar-left { display: flex; align-items: center; gap: 10px; }
  .db-menu-btn {
    display: none;
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1px solid ${C.border};
    background: #fff;
    cursor: pointer;
    align-items: center; justify-content: center;
    transition: border-color 0.2s, transform 0.15s;
  }
  .db-menu-btn:hover { border-color: #c6c9d6; transform: translateY(-1px); }
  .db-menu-icon {
    width: 18px; height: 2px; background: ${C.dark};
    position: relative; border-radius: 2px;
  }
  .db-menu-icon::before,
  .db-menu-icon::after {
    content: "";
    position: absolute; left: 0; right: 0;
    height: 2px; background: ${C.dark}; border-radius: 2px;
  }
  .db-menu-icon::before { top: -6px; }
  .db-menu-icon::after { top: 6px; }
  .db-mobile-menu {
    position: absolute; top: 60px; left: 0; right: 0;
    background: #fff; border-bottom: 1px solid ${C.border};
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
    padding: 12px 14px 16px;
    z-index: 45;
  }
  .db-mobile-menu h4 {
    font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
    color: ${C.light}; margin: 8px 8px 6px;
  }
  .db-mobile-links {
    display: flex; flex-direction: column; gap: 8px;
    list-style: none;
  }
  .db-mobile-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    background: ${C.bg}; color: ${C.dark};
    text-decoration: none; font-size: 13.5px; font-weight: 600;
  }
  .db-mobile-link .db-nav-icon { color: ${C.dark}; }
  .db-mobile-signout {
    margin-top: 10px;
    width: 100%;
    padding: 10px 12px; border-radius: 10px;
    border: 1px solid ${C.border};
    background: #fff; font-size: 13px; font-weight: 700;
    cursor: pointer;
  }
  .db-topbar-title { font-size: 17px; font-weight: 700; color: ${C.dark}; }
  .db-topbar-right { display: flex; align-items: center; gap: 12px; }
  .db-search {
    display: flex; align-items: center; gap: 8px;
    background: ${C.bg}; border: 1px solid ${C.border};
    border-radius: 8px; padding: 8px 14px;
    font-size: 13px; color: ${C.mid};
  }
  .db-search input {
    background: none; border: none; outline: none;
    font-size: 13px; color: ${C.dark};
    font-family: 'Manrope', sans-serif; width: 180px;
  }
  .db-search input::placeholder { color: ${C.light}; }
  .db-btn-new {
    display: flex; align-items: center; gap: 8px;
    background: ${C.blue}; color: #fff;
    font-family: 'Manrope', sans-serif;
    font-size: 13.5px; font-weight: 700;
    padding: 9px 18px; border-radius: 8px; border: none;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
    box-shadow: 0 2px 8px rgba(26,75,219,0.22);
  }
  .db-btn-new:hover { background: ${C.blueL}; transform: translateY(-1px); }

  /* ── Body ── */
  .db-body { padding: 28px 32px; flex: 1; }

  /* ── Welcome strip ── */
  .db-welcome {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }
  .db-welcome-greeting {
    font-size: 22px; font-weight: 800; color: ${C.dark};
    letter-spacing: -0.3px;
  }
  .db-welcome-sub { font-size: 14px; color: ${C.mid}; margin-top: 3px; }
  .db-welcome-date { font-size: 13px; color: ${C.light}; font-weight: 500; }

  /* ── Stats row ── */
  .db-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .db-stat-card {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 14px; padding: 20px 24px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .db-stat-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-bottom: 14px;
  }
  .db-stat-value { font-size: 28px; font-weight: 900; color: ${C.dark}; letter-spacing: -1px; }
  .db-stat-label { font-size: 12.5px; color: ${C.mid}; font-weight: 500; margin-top: 3px; }
  .db-stat-delta {
    font-size: 11.5px; font-weight: 600; margin-top: 8px;
    display: flex; align-items: center; gap: 4px;
  }
  .db-stat-delta.up { color: ${C.green}; }
  .db-stat-delta.neutral { color: ${C.light}; }

  /* ── Section header ── */
  .db-section-hd {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
  }
  .db-section-title { font-size: 15px; font-weight: 700; color: ${C.dark}; }
  .db-filter-tabs { display: flex; gap: 6px; }
  .db-filter-tab {
    font-family: 'Manrope', sans-serif;
    font-size: 12.5px; font-weight: 600;
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid ${C.border}; background: #fff;
    color: ${C.mid}; cursor: pointer; transition: all 0.15s;
  }
  .db-filter-tab.active { background: ${C.blue}; border-color: ${C.blue}; color: #fff; }
  .db-filter-tab:hover:not(.active) { border-color: #bbc; color: ${C.dark}; }

  /* ── CV Grid ── */
  .db-cv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }

  /* ── CV Card ── */
  .db-cv-card {
    background: ${C.card}; border: 1px solid ${C.border};
    border-radius: 16px; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    animation: fadeUp 0.4s ease both;
  }
  .db-cv-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.09);
  }
  .db-cv-card:hover .db-cv-actions { opacity: 1; transform: translateY(0); }

  /* Thumbnail */
  .db-cv-thumb {
    height: 160px; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .db-cv-thumb-bg {
    position: absolute; inset: 0;
    opacity: 0.08;
  }
  .db-cv-thumb-mock {
    position: relative; z-index: 1;
    width: 80px; background: #fff;
    border-radius: 6px; padding: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  .db-cv-mock-line {
    height: 4px; border-radius: 2px; background: #e5e7eb; margin-bottom: 5px;
  }
  .db-cv-mock-line.accent { background: currentColor; opacity: 0.5; width: 50%; }
  .db-cv-mock-line.short { width: 60%; }
  .db-cv-mock-line.shorter { width: 40%; }
  .db-cv-mock-head {
    height: 20px; border-radius: 3px; background: currentColor;
    opacity: 0.15; margin-bottom: 8px;
  }
  .db-cv-template-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(255,255,255,0.95);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 6px; padding: 3px 8px;
    font-size: 10px; font-weight: 700;
    color: ${C.mid}; z-index: 2;
  }

  /* Hover actions overlay */
  .db-cv-actions {
    position: absolute; inset: 0; z-index: 3;
    background: rgba(15,17,23,0.55);
    display: flex; align-items: center; justify-content: center;
    gap: 10px;
    opacity: 0; transition: opacity 0.2s;
  }
  .db-action-btn {
    font-family: 'Manrope', sans-serif;
    font-size: 12px; font-weight: 700;
    padding: 8px 16px; border-radius: 8px;
    border: none; cursor: pointer;
    transition: transform 0.15s;
  }
  .db-action-btn:hover { transform: scale(1.05); }
  .db-action-edit { background: #fff; color: ${C.dark}; }
  .db-action-preview { background: ${C.blue}; color: #fff; }
  .db-action-delete { background: rgba(255,255,255,0.12); color: #fff; font-size: 16px; padding: 8px 10px; }

  /* Card body */
  .db-cv-body { padding: 16px 18px; }
  .db-cv-title { font-size: 14px; font-weight: 700; color: ${C.dark}; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-cv-meta { display: flex; align-items: center; justify-content: space-between; }
  .db-cv-updated { font-size: 12px; color: ${C.light}; }
  .db-cv-downloads {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; color: ${C.light};
  }

  /* ── New CV card ── */
  .db-new-cv-card {
    background: ${C.card}; border: 2px dashed ${C.border};
    border-radius: 16px; height: 100%;
    min-height: 230px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    color: ${C.light};
  }
  .db-new-cv-card:hover { border-color: ${C.blue}; background: ${C.blueBg}; color: ${C.blue}; }
  .db-new-cv-icon {
    width: 44px; height: 44px; border-radius: 50%;
    border: 2px dashed currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 300;
    transition: background 0.2s;
  }
  .db-new-cv-label { font-size: 13px; font-weight: 700; }

  /* ── Empty state ── */
  .db-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 64px 24px; text-align: center;
    color: ${C.light};
  }
  .db-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .db-empty-title { font-size: 16px; font-weight: 700; color: ${C.mid}; margin-bottom: 6px; }
  .db-empty-sub { font-size: 13.5px; color: ${C.light}; }

  /* ── Delete modal ── */
  .db-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .db-modal {
    background: #fff; border-radius: 18px;
    padding: 36px 32px; max-width: 400px; width: 90%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    animation: scaleIn 0.2s ease;
  }
  .db-modal-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: ${C.redBg}; display: flex;
    align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 20px;
  }
  .db-modal-title { font-size: 18px; font-weight: 800; color: ${C.dark}; margin-bottom: 8px; }
  .db-modal-sub { font-size: 14px; color: ${C.mid}; line-height: 1.6; margin-bottom: 28px; }
  .db-modal-btns { display: flex; gap: 12px; }
  .db-modal-cancel {
    flex: 1; padding: 12px; border-radius: 10px;
    border: 1.5px solid ${C.border}; background: #fff;
    font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 600;
    color: ${C.mid}; cursor: pointer; transition: border-color 0.2s;
  }
  .db-modal-cancel:hover { border-color: #bbc; color: ${C.dark}; }
  .db-modal-delete {
    flex: 1; padding: 12px; border-radius: 10px;
    border: none; background: ${C.red};
    font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700;
    color: #fff; cursor: pointer; transition: background 0.2s;
  }
  .db-modal-delete:hover { background: #b91c1c; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Stagger CV cards */
  .db-cv-card:nth-child(1) { animation-delay: 0.05s; }
  .db-cv-card:nth-child(2) { animation-delay: 0.1s; }
  .db-cv-card:nth-child(3) { animation-delay: 0.15s; }
  .db-cv-card:nth-child(4) { animation-delay: 0.2s; }
  .db-cv-card:nth-child(5) { animation-delay: 0.25s; }

  /* ── Mobile & Tablet Responsive ── */
  @media (max-width: 1024px) {
    .db-body { padding: 24px 24px; }
    .db-welcome { gap: 12px; }
    .db-stats { grid-template-columns: repeat(2, 1fr); }
    .db-cv-grid { grid-template-columns: repeat(2, 1fr); }
    .db-topbar { padding: 16px 20px; }
    .db-btn-new { font-size: 13px; padding: 10px 18px; }
  }

  @media (max-width: 768px) {
    .db-shell { flex-direction: column; }
    .db-sidebar {
      position: static;
      width: 100%;
      flex-direction: row;
      max-height: 60px;
      padding: 0 16px;
    }
    .db-sidebar-logo {
      font-size: 18px;
      padding: 12px 12px 12px 0;
      flex: 1;
    }
    .db-nav {
      display: none;
    }
    .db-sidebar-user { display: none; }
    .db-main { margin-left: 0; }
    .db-body { padding: 16px 12px; }
    .db-topbar {
      padding: 16px 12px;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .db-topbar-title {
      font-size: 18px;
    }
    .db-menu-btn { display: inline-flex; }
    .db-mobile-menu { top: 56px; }
    .db-topbar-right { flex-wrap: wrap; gap: 10px; }
    .db-search { flex: 1; }
    .db-search input { width: 100%; }
    .db-welcome { flex-direction: column; align-items: flex-start; gap: 6px; }
    .db-stats { grid-template-columns: 1fr 1fr; gap: 12px; }
    .db-btn-new { font-size: 12px; padding: 8px 14px; }
    .db-cv-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

  @media (max-width: 640px) {
    .db-sidebar {
      height: auto;
      padding: 8px 12px;
    }
    .db-sidebar-logo {
      font-size: 16px;
      padding: 8px 8px 8px 0;
    }
    .db-body { padding: 12px 8px; }
    .db-topbar {
      padding: 12px 8px;
      gap: 8px;
      flex-direction: row;
      align-items: center;
    }
    .db-mobile-menu { top: 52px; padding: 10px 10px 12px; }
    .db-topbar-title {
      font-size: 16px;
    }
    .db-btn-new { font-size: 12px; padding: 8px 14px;}
    
    .db-topbar-right { flex-direction: column; align-items: stretch; }
    .db-search { display: none; }
    
    .db-stats { grid-template-columns: 1fr; }
    .db-cv-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .db-cv-card {
      height: auto;
      min-height: 260px;
    }
    .db-cv-actions {
      gap: 6px;
    }
    .db-action-btn {
      font-size: 11px;
      padding: 6px 12px;
    }
    .db-cv-body {
      padding: 12px 14px;
    }
    .db-cv-title { font-size: 13px; }
    .db-cv-updated, .db-cv-downloads { font-size: 11px; }
    .db-modal {
      padding: 24px 20px;
      width: 95%;
    }
    .db-modal-title { font-size: 16px; }
    .db-modal-sub { font-size: 13px; }
  }
`;

// ── User Display Name Component ───────────────────────────
function UserDisplayName({ user, fallback = "Name" }) {
  return (
    <span>{user?.firstName || fallback} {user?.lastName || ''}</span>

  );
}

// ── CV Thumbnail mock ─────────────────────────────────────
function CVThumb({ color, templateLabel }) {
  return (
    <div className="db-cv-thumb" style={{ background: color + "10" }}>
      <div className="db-cv-thumb-bg" style={{ background: color }} />
      <div className="db-cv-thumb-mock" style={{ color }}>
        <div className="db-cv-mock-head" />
        <div className="db-cv-mock-line accent" />
        <div style={{ height: 6 }} />
        <div className="db-cv-mock-line" />
        <div className="db-cv-mock-line short" />
        <div style={{ height: 6 }} />
        <div className="db-cv-mock-line" />
        <div className="db-cv-mock-line shorter" />
        <div className="db-cv-mock-line" />
      </div>
      <span className="db-cv-template-badge">{templateLabel}</span>
    </div>
  );
}

// ── CV Card ───────────────────────────────────────────────
function CVCard({ cv, onDelete, onPreview }) {
  return (
    <div className="db-cv-card">
      <CVThumb color={cv.color} templateLabel={cv.templateLabel} />

      {/* Hover action overlay */}
      <div className="db-cv-actions">
        <button className="db-action-btn db-action-edit" onClick={(e) => { e.stopPropagation(); onPreview(cv); }}>Edit</button>
        <button className="db-action-btn db-action-preview" onClick={(e) => { e.stopPropagation(); onPreview(cv); }}>Preview</button>
        <button className="db-action-btn db-action-delete" onClick={(e) => { e.stopPropagation(); onDelete(cv); }}>🗑</button>
      </div>

      <div className="db-cv-body">
        <div className="db-cv-title">{cv.title}</div>
        <div className="db-cv-meta">
          <span className="db-cv-updated">Updated {cv.updatedAt}</span>
          <span className="db-cv-downloads">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cv.downloads}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────
function DeleteModal({ cv, onConfirm, onCancel }) {
  return (
    <div className="db-modal-overlay" onClick={onCancel}>
      <div className="db-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-icon">🗑️</div>
        <div className="db-modal-title">Delete this CV?</div>
        <div className="db-modal-sub">
          <strong>"{cv.title}"</strong> will be permanently deleted.
          This action cannot be undone.
        </div>
        <div className="db-modal-btns">
          <button className="db-modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="db-modal-delete" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────
function Sidebar({ user, onSignOut, onNewCV }) {
  const navigate = useNavigate();
  
  return (
    <aside className="db-sidebar">
      <div className="db-sidebar-logo">
        NexHire
      </div>

      <nav className="db-nav">
        <div className="db-nav-section">Menu</div>
        <button className="db-nav-item active" onClick={() => navigate("/dashboard")}>
          <span className="db-nav-icon">⊞</span>
          Dashboard
        </button>
        <button className="db-nav-item" onClick={onNewCV}>
          <span className="db-nav-icon">✦</span>
          New CV
        </button>

        <div className="db-nav-section" style={{ marginTop: 12 }}>Account</div>
        <button className="db-nav-item" onClick={() => navigate("/settings")}>
          <span className="db-nav-icon">⚙</span>
          Settings
        </button>
      </nav>

      <div className="db-sidebar-user" onClick={onSignOut}>
        <div className="db-avatar">{user?.email?.charAt(0).toUpperCase() || "U"}</div>
        <div style={{ overflow: "hidden" }}>
          <div className="db-user-name">{user?.email || "User"}</div>
          <div className="db-user-name"><UserDisplayName user={user} /></div>
          <div className="db-user-plan">Sign Out</div>
        </div>
      </div>
    </aside>
  );
}

// ── Stats Bar ─────────────────────────────────────────────
function StatsBar({ cvCount }) {
  const stats = [
    { icon: "📄", iconBg: C.blueBg, value: cvCount, label: "CVs Created", delta: "+1 this week", up: true },
    { icon: "⬇", iconBg: C.greenBg, value: 11, label: "Total Downloads", delta: "+3 this week", up: true },
    { icon: "✦", iconBg: "#f5f3ff", value: "87%", label: "Avg. ATS Score", delta: "↑ from 74%", up: true },
    { icon: "⏱", iconBg: C.yellowBg, value: "4m", label: "Avg. Build Time", delta: "Industry avg: 45m", up: false },
  ];

  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <div className="db-stat-card" key={i}>
          <div className="db-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
          <div className="db-stat-value">{s.value}</div>
          <div className="db-stat-label">{s.label}</div>
          <div className={`db-stat-delta ${s.up ? "up" : "neutral"}`}>
            {s.up ? "↑" : "—"} {s.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function Dashboard({ user, onSignOut }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [cvs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCV, setDeletingCV] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const filters = ["All", "Recent"];
  const handleNewCV = () => navigate("/builder");

  // Load CVs from Supabase on mount
  useEffect(() => {
    const loadCVs = async () => {
      try {
        setLoading(true);
        const result = await cvOperations.getAllCVs();
        if (result.success && result.data) {
          setCVs(result.data);
        } else {
          console.error("Failed to load CVs:", result.error);
        }
      } catch (error) {
        console.error("Error loading CVs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, []);

  const filtered = cvs.filter(cv => {
    const matchesSearch = cv.title && cv.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (cv) => setDeletingCV(cv);
  const handlePreview = (cv) => {
    // Navigate to builder with the selected CV
    navigate(`/builder?cvId=${cv.id}`);
  };
  const confirmDelete = async () => {
    if (!deletingCV) return;
    try {
      setDeleting(true);
      const result = await cvOperations.deleteCV(deletingCV.id);
      if (result.success) {
        setCVs(prev => prev.filter(c => c.id !== deletingCV.id));
        setDeletingCV(null);
      } else {
        console.error("Failed to delete CV:", result.error);
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Get today's date nicely
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <style>{css}</style>

      <div className="db-shell">
        <Sidebar user={user} onSignOut={onSignOut} onNewCV={handleNewCV} />

        <div className="db-main">
          {/* Topbar */}
          <header className="db-topbar">
            <div className="db-topbar-left">
              <button
                className="db-menu-btn"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(v => !v)}
              >
                <span className="db-menu-icon" />
              </button>
              <span className="db-topbar-title">My Dashboard</span>
            </div>
            <div className="db-topbar-right">
              <div className="db-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke={C.light} strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" stroke={C.light} strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  placeholder="Search CVs…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="db-btn-new" onClick={handleNewCV}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
                New CV
              </button>
            </div>
          </header>
          {menuOpen && (
            <div className="db-mobile-menu">
              <h4>Menu</h4>
              <ul className="db-mobile-links">
                <li>
                  <button className="db-mobile-link" onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}>
                    <span className="db-nav-icon">⊞</span>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button className="db-mobile-link" onClick={() => { setMenuOpen(false); handleNewCV(); }}>
                    <span className="db-nav-icon">✦</span>
                    New CV
                  </button>
                </li>
              </ul>
              <h4>Account</h4>
              <ul className="db-mobile-links">
                <li>
                  <button className="db-mobile-link" onClick={() => { setMenuOpen(false); navigate("/settings"); }}>
                    <span className="db-nav-icon">⚙</span>
                    Settings
                  </button>
                </li>
              </ul>
              <button className="db-mobile-signout" onClick={() => { setMenuOpen(false); onSignOut(); }}>
                Sign Out
              </button>
            </div>
          )}

          {/* Body */}
          <main className="db-body">

            {/* Welcome */}
            <div className="db-welcome">
              <div>
                <div className="db-welcome-greeting">
                  Welcome back <UserDisplayName user={user?.firstName} /> 👋
                </div>
                <div className="db-welcome-sub">Here's what's happening with your CVs.</div>
              </div>
              <div className="db-welcome-date">{today}</div>
            </div>

            {/* Stats */}
            <StatsBar cvCount={cvs.length} />

            {/* CV Grid */}
            <div className="db-section-hd">
              <span className="db-section-title">
                My CVs
                <span style={{ color: C.light, fontWeight: 500, fontSize: 13, marginLeft: 8 }}>({filtered.length})</span>
              </span>
              <div className="db-filter-tabs">
                {filters.map(f => (
                  <button
                    key={f}
                    className={`db-filter-tab ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="db-cv-grid">
              {filtered.length === 0 && (
                <div className="db-empty">
                  <div className="db-empty-icon">📄</div>
                  <div className="db-empty-title">No CVs found</div>
                  <div className="db-empty-sub">
                    {search ? `No results for "${search}"` : "Create your first CV to get started."}
                  </div>
                </div>
              )}

              {filtered.map(cv => (
                <CVCard key={cv.id} cv={cv} onDelete={handleDelete} onPreview={handlePreview} />
              ))}

              {/* New CV card */}
              <div className="db-new-cv-card" onClick={() => navigate("/builder")}>
                <div className="db-new-cv-icon">+</div>
                <span className="db-new-cv-label">Create New CV</span>
                <span style={{ fontSize: 12, color: "inherit", opacity: 0.7 }}>Takes only 5 minutes</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deletingCV && (
        <DeleteModal
          cv={deletingCV}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCV(null)}
        />
      )}
    </>
  );
}

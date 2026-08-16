// SignIn.jsx
// Redesigned to match code.html target UI
// Keeps all existing Supabase auth logic intact.
// Stack: React + Vite | Font: Inter + Material Symbols

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { userProfileOperations } from "../../utils/databaseHelpers";

// ─── Design tokens (DESIGN.md) ───────────────────────────────────────────────
const C = {
  primary:                "#0029c0",
  primaryContainer:       "#2142e7",
  onPrimary:              "#ffffff",
  surface:                "#f9f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow:    "#f1f3ff",
  surfaceContainer:       "#e9edff",
  surfaceContainerHigh:   "#e1e8fd",
  onSurface:              "#141b2b",
  onSurfaceVariant:       "#444656",
  outlineVariant:         "#c5c5d9",
  outline:                "#757687",
  error:                  "#ba1a1a",
  secondaryContainer:     "#34c6ff",
};

// ─── Injected global CSS ──────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: max(884px, 100dvh);
    background: #f9f9ff;
    color: #141b2b;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
    line-height: 1;
    vertical-align: middle;
    user-select: none;
  }

  /* ── Sticky header ── */
  .si-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    height: 64px;
    background: rgba(255,255,255,0.70);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
    border-bottom: 1px solid #c5c5d9;
  }
  .si-header-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 100%; padding: 0 24px;
    max-width: 1200px; margin: 0 auto;
  }
  .si-logo {
    font-size: 20px; font-weight: 700; color: #0029c0;
    letter-spacing: -0.3px; text-decoration: none;
  }
  .si-help {
    font-size: 14px; font-weight: 700; color: #0029c0;
    text-decoration: none; letter-spacing: 0.02em;
    transition: opacity 0.2s;
  }
  .si-help:hover { opacity: 0.75; }

  /* ── Page wrapper ── */
  .si-page {
    display: flex; flex-direction: column; min-height: 100dvh;
  }
  .si-main {
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 96px 24px 48px;
  }

  /* ── Card ── */
  .si-card {
    width: 100%; max-width: 448px;
  }

  /* ── Card header ── */
  .si-card-header {
    text-align: center; margin-bottom: 32px;
  }
  .si-card-header h1 {
    font-size: 32px; font-weight: 600; line-height: 1.25;
    letter-spacing: -0.01em; color: #141b2b;
    margin-bottom: 8px;
  }
  .si-card-header p {
    font-size: 16px; font-weight: 400; line-height: 1.5;
    color: #444656;
  }

  /* ── Social buttons ── */
  .si-social-group {
    display: flex; flex-direction: column; gap: 16px;
    margin-bottom: 32px;
  }
  .si-social-btn {
    width: 100%; height: 48px;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    border: 1px solid #c5c5d9;
    background: #ffffff;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 500; letter-spacing: 0.05em;
    color: #141b2b;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .si-social-btn:hover { background: #e9edff; }
  .si-social-btn:active { transform: scale(0.98); }
  .si-social-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .si-social-btn img,
  .si-social-btn svg { width: 20px; height: 20px; flex-shrink: 0; }

  /* ── Divider ── */
  .si-divider {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 32px;
  }
  .si-divider-line {
    flex: 1; height: 1px; background: #c5c5d9;
  }
  .si-divider span {
    font-size: 14px; font-weight: 500; color: #757687;
    letter-spacing: 0.05em;
  }

  /* ── Form ── */
  .si-form {
    display: flex; flex-direction: column; gap: 16px;
  }
  .si-field {
    display: flex; flex-direction: column; gap: 8px;
  }
  .si-field-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-left: 4px;
  }
  .si-label {
    font-size: 14px; font-weight: 500; letter-spacing: 0.05em;
    color: #141b2b; margin-left: 4px;
    transition: color 0.2s;
  }
  .si-label.focused { color: #0029c0; }
  .si-forgot {
    font-size: 14px; font-weight: 600; color: #0029c0;
    text-decoration: none; letter-spacing: 0.02em;
    transition: opacity 0.2s;
  }
  .si-forgot:hover { opacity: 0.75; }

  /* Input wrapper — handles focus ring */
  .si-input-wrap {
    position: relative;
    border: 1px solid #c5c5d9;
    border-radius: 8px;
    background: #ffffff;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .si-input-wrap:focus-within {
    border-color: #2142e7;
    box-shadow: 0 0 0 4px rgba(33,66,231,0.10);
  }
  .si-input {
    width: 100%; height: 48px;
    padding: 0 48px 0 16px;
    background: transparent;
    border: none; outline: none;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 400; color: #141b2b;
  }
  .si-input::placeholder { color: #757687; }
  .si-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .si-input.no-toggle { padding-right: 16px; }

  /* Password toggle */
  .si-pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 4px;
    color: #c5c5d9;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .si-pw-toggle:hover { color: #757687; }

  /* Two-column name row */
  .si-name-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  @media (max-width: 420px) {
    .si-name-row { grid-template-columns: 1fr; }
  }

  /* ── Messages ── */
  .si-error {
    padding: 10px 14px;
    background: rgba(186,26,26,0.08);
    border-radius: 8px;
    font-size: 14px; color: #ba1a1a;
    line-height: 1.5;
  }
  .si-success {
    padding: 10px 14px;
    background: rgba(0,41,192,0.08);
    border-radius: 8px;
    font-size: 14px; color: #0029c0;
    line-height: 1.5;
  }

  /* ── Submit button ── */
  .si-submit {
    width: 100%; height: 48px; margin-top: 16px;
    background: #2142e7;
    color: #ffffff;
    border: none; border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 500; letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: opacity 0.2s, transform 0.15s;
  }
  .si-submit:hover { opacity: 0.92; }
  .si-submit:active { transform: scale(0.98); }
  .si-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── Toggle ── */
  .si-toggle {
    margin-top: 32px; text-align: center;
    font-size: 16px; font-weight: 400; color: #444656;
  }
  .si-toggle-btn {
    background: none; border: none; padding: 0;
    font-family: 'Inter', sans-serif;
    font-size: 16px; font-weight: 700; color: #0029c0;
    cursor: pointer; margin-left: 4px;
    transition: opacity 0.2s;
  }
  .si-toggle-btn:hover { opacity: 0.75; }
  .si-toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Background blobs ── */
  .si-blob-wrap {
    position: fixed; inset: 0; z-index: -1;
    overflow: hidden; pointer-events: none;
  }
  .si-blob {
    position: absolute; border-radius: 50%;
    filter: blur(80px);
  }
  .si-blob-1 {
    top: -10%; right: -10%;
    width: 500px; height: 500px;
    background: rgba(0,41,192,0.05);
  }
  .si-blob-2 {
    bottom: -10%; left: -10%;
    width: 400px; height: 400px;
    background: rgba(52,198,255,0.05);
  }

  /* ── Footer ── */
  .si-footer {
    border-top: 1px solid #c5c5d9;
    padding: 16px 24px;
  }
  .si-footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .si-footer-links {
    display: flex; gap: 16px;
  }
  .si-footer-links a {
    font-size: 14px; font-weight: 500; letter-spacing: 0.05em;
    color: #444656; text-decoration: none;
    transition: color 0.2s;
  }
  .si-footer-links a:hover { color: #0029c0; }
  .si-footer-copy {
    font-size: 14px; font-weight: 500; letter-spacing: 0.05em;
    color: #757687;
  }
`;

// ─── LinkedIn SVG ─────────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" style={{ color: "#0077b5", width: 20, height: 20 }}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

// ─── Reusable text field ──────────────────────────────────────────────────────
function TextField({ id, type = "text", label, value, onChange, placeholder, disabled, required = true }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="si-field">
      {label && (
        <label className={`si-label${focused ? " focused" : ""}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className="si-input-wrap">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="si-input no-toggle"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

// ─── Reusable password field ──────────────────────────────────────────────────
function PasswordField({ id, label, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputWrap = (
    <div className="si-input-wrap">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        minLength={6}
        disabled={disabled}
        className="si-input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="button"
        className="si-pw-toggle"
        onClick={() => setShow(s => !s)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );

  // When label is empty (""), skip the outer si-field wrapper — caller owns it
  if (!label) return inputWrap;

  return (
    <div className="si-field">
      <label className={`si-label${focused ? " focused" : ""}`} htmlFor={id}>
        {label}
      </label>
      {inputWrap}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SignIn({ onSignInSuccess }) {
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]        = useState("");
  const [isSignUp,        setIsSignUp]        = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [message,         setMessage]         = useState("");

  // Inject styles once
  useEffect(() => {
    const id = "si-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // ── Auth helpers ────────────────────────────────────────────────────────────
  const fail = (err) => { setError(err.message || "An error occurred. Please try again."); setMessage(""); };

  const clearForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword("");
    setFirstName(""); setLastName(""); setError(""); setMessage("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) fail(error);
      else if (data.user) {
        setMessage("Sign in successful! Redirecting…");
        onSignInSuccess?.(data.user);
      }
    } catch (err) { fail(err); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) fail(error);
      else if (data.user) {
        await userProfileOperations.saveUserProfile({
          firstName: firstName || email.split("@")[0],
          lastName:  lastName  || email.split("@")[0],
        });
        setMessage("Account created! Check your email to confirm.");
        setTimeout(() => { setIsSignUp(false); clearForm(); }, 2000);
      }
    } catch (err) { fail(err); }
    finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) fail(error);
    } catch (err) { fail(err); }
    finally { setLoading(false); }
  };

  const handleLinkedInSignIn = async () => {
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "linkedin_oidc" });
      if (error) fail(error);
    } catch (err) { fail(err); }
    finally { setLoading(false); }
  };

  const switchMode = () => { setIsSignUp(s => !s); clearForm(); };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="si-page">

      {/* Header */}
      <header className="si-header">
        <div className="si-header-inner">
          <span className="si-logo">Aikee AI</span>
          <a href="#" className="si-help">Help</a>
        </div>
      </header>

      {/* Background blobs */}
      <div className="si-blob-wrap" aria-hidden="true">
        <div className="si-blob si-blob-1" />
        <div className="si-blob si-blob-2" />
      </div>

      {/* Main */}
      <main className="si-main">
        <div className="si-card">

          {/* Heading */}
          <div className="si-card-header">
            <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p>
              {isSignUp
                ? "Start your profile in under two minutes."
                : "Enter your details to access your account"}
            </p>
          </div>

          {/* Social auth */}
          <div className="si-social-group">
            <button className="si-social-btn" onClick={handleGoogleSignIn} disabled={loading} type="button">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb5uCBUgvriLrbkDSSlwPVrmtoqw5cPRUEtM3xBgeCWfBITH64s8mvG6bypgUcodt3YZP269OK7MAkV308UpOv5ejhbW2fKcTHEMRKqe1PiBpuREpZLj423fNBsDGy9N5Sx-bZTtTz51x-X5wdjBNrBx7lIq3N9eCjE9pwwx9fYuDGVfYMsEDa1ybSsCbdj0LDWxp4I75ckCnB_zt8BHgxydDw3lzuurqlGIiStumRORaDhw_irZrDzViNNCdN_cVYk0AVsBINzjw"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
              <span>Continue with Google</span>
            </button>
            <button className="si-social-btn" onClick={handleLinkedInSignIn} disabled={loading} type="button">
              <LinkedInIcon />
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="si-divider">
            <div className="si-divider-line" />
            <span>OR</span>
            <div className="si-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="si-form">

            {/* Name row (sign up only) */}
            {isSignUp && (
              <div className="si-name-row">
                <TextField id="firstName" label="First name" value={firstName}
                  onChange={e => setFirstName(e.target.value)} placeholder="John" disabled={loading} />
                <TextField id="lastName" label="Last name" value={lastName}
                  onChange={e => setLastName(e.target.value)} placeholder="Doe" disabled={loading} />
              </div>
            )}

            {/* Email */}
            <TextField id="email" type="email" label="Email Address" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="name@company.com" disabled={loading} />

            {/* Password */}
            <div className="si-field">
              <div className="si-field-row">
                <label className="si-label" htmlFor="password">Password</label>
                {!isSignUp && <a href="#" className="si-forgot">Forgot password?</a>}
              </div>
              <PasswordField
                id="password"
                label=""
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Confirm password (sign up only) */}
            {isSignUp && (
              <PasswordField id="confirmPassword" label="Confirm password" value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
            )}

            {error   && <div className="si-error">{error}</div>}
            {message && <div className="si-success">{message}</div>}

            <button type="submit" className="si-submit" disabled={loading}>
              {loading ? "Loading…" : isSignUp ? "Create account" : "Sign In"}
            </button>
          </form>

          {/* Toggle sign in / sign up */}
          <div className="si-toggle">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button type="button" className="si-toggle-btn" onClick={switchMode} disabled={loading}>
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="si-footer">
        <div className="si-footer-inner">
          <div className="si-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <p className="si-footer-copy">© 2026 Aikee AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

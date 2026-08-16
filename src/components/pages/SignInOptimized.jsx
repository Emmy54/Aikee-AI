import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

const C = {
  primary: "#0029c0",
  primaryContainer: "#2142e7",
  onPrimary: "#ffffff",
  surface: "#f9f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f1f3ff",
  surfaceContainer: "#e9edff",
  surfaceContainerHigh: "#e1e8fd",
  onSurface: "#141b2b",
  onSurfaceVariant: "#444656",
  outlineVariant: "#c5c5d9",
  outline: "#757687",
  error: "#ba1a1a",
  secondaryContainer: "#34c6ff",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
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

  .si-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    height: 64px;
    background: rgba(255,255,255,0.70);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
    border-bottom: 1px solid #c5c5d9;
  }
  .si-header-inner { display: flex; align-items: center; justify-content: space-between; height: 100%; padding: 0 24px; max-width: 1200px; margin: 0 auto; }
  .si-logo { font-size: 20px; font-weight: 700; color: #0029c0; letter-spacing: -0.3px; text-decoration: none; }
  .si-help { font-size: 14px; font-weight: 700; color: #0029c0; text-decoration: none; letter-spacing: 0.02em; transition: opacity 0.2s; }
  .si-help:hover { opacity: 0.75; }
  .si-page { display: flex; flex-direction: column; min-height: 100dvh; }
  .si-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 96px 24px 48px; }
  .si-card { width: 100%; max-width: 448px; }
  .si-card-header { text-align: center; margin-bottom: 32px; }
  .si-card-header h1 { font-size: 32px; font-weight: 600; line-height: 1.25; letter-spacing: -0.01em; color: #141b2b; margin-bottom: 8px; }
  .si-card-header p { font-size: 16px; font-weight: 400; line-height: 1.5; color: #444656; }
  .si-social-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
  .si-social-btn { width: 100%; height: 48px; display: flex; align-items: center; justify-content: center; gap: 12px; border: 1px solid #c5c5d9; background: #ffffff; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; color: #141b2b; cursor: pointer; transition: background 0.2s, transform 0.15s; }
  .si-social-btn:hover { background: #e9edff; }
  .si-social-btn:active { transform: scale(0.98); }
  .si-social-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .si-social-btn img, .si-social-btn svg { width: 20px; height: 20px; flex-shrink: 0; }
  .si-divider { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
  .si-divider-line { flex: 1; height: 1px; background: #c5c5d9; }
  .si-divider span { font-size: 14px; font-weight: 500; color: #757687; letter-spacing: 0.05em; }
  .si-form { display: flex; flex-direction: column; gap: 16px; }
  .si-field { display: flex; flex-direction: column; gap: 8px; }
  .si-field-row { display: flex; align-items: center; justify-content: space-between; margin-left: 4px; }
  .si-label { font-size: 14px; font-weight: 500; letter-spacing: 0.05em; color: #141b2b; margin-left: 4px; transition: color 0.2s; }
  .si-label.focused { color: #0029c0; }
  .si-forgot { font-size: 14px; font-weight: 600; color: #0029c0; text-decoration: none; letter-spacing: 0.02em; transition: opacity 0.2s; }
  .si-forgot:hover { opacity: 0.75; }
  .si-input-wrap { position: relative; border: 1px solid #c5c5d9; border-radius: 8px; background: #ffffff; transition: border-color 0.2s, box-shadow 0.2s; }
  .si-input-wrap:focus-within { border-color: #2142e7; box-shadow: 0 0 0 4px rgba(33,66,231,0.10); }
  .si-input { width: 100%; height: 48px; padding: 0 48px 0 16px; background: transparent; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 400; color: #141b2b; }
  .si-input::placeholder { color: #757687; }
  .si-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .si-input.no-toggle { padding-right: 16px; }
  .si-pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px; color: #c5c5d9; display: flex; align-items: center; transition: color 0.2s; }
  .si-pw-toggle:hover { color: #757687; }
  .si-name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 420px) { .si-name-row { grid-template-columns: 1fr; } }
  .si-error { padding: 10px 14px; background: rgba(186,26,26,0.08); border-radius: 8px; font-size: 14px; color: #ba1a1a; line-height: 1.5; }
  .si-success { padding: 10px 14px; background: rgba(0,41,192,0.08); border-radius: 8px; font-size: 14px; color: #0029c0; line-height: 1.5; }
  .si-submit { width: 100%; height: 48px; margin-top: 16px; background: #2142e7; color: #ffffff; border: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: opacity 0.2s, transform 0.15s; }
  .si-submit:hover { opacity: 0.92; }
  .si-submit:active { transform: scale(0.98); }
  .si-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .si-toggle { margin-top: 32px; text-align: center; font-size: 16px; font-weight: 400; color: #444656; }
  .si-toggle-btn { background: none; border: none; padding: 0; font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 700; color: #0029c0; cursor: pointer; margin-left: 4px; transition: opacity 0.2s; }
  .si-toggle-btn:hover { opacity: 0.75; }
  .si-toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .si-blob-wrap { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
  .si-blob { position: absolute; border-radius: 50%; filter: blur(80px); }
  .si-blob-1 { top: -10%; right: -10%; width: 500px; height: 500px; background: rgba(0,41,192,0.05); }
  .si-blob-2 { bottom: -10%; left: -10%; width: 400px; height: 400px; background: rgba(52,198,255,0.05); }
  .si-footer { border-top: 1px solid #c5c5d9; padding: 16px 24px; }
  .si-footer-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .si-footer-links { display: flex; gap: 16px; }
  .si-footer-links a { font-size: 14px; font-weight: 500; letter-spacing: 0.05em; color: #444656; text-decoration: none; transition: color 0.2s; }
  .si-footer-links a:hover { color: #0029c0; }
  .si-footer-copy { font-size: 14px; font-weight: 500; letter-spacing: 0.05em; color: #757687; }
`;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.95.58.11.79-.25.79-.56v-2.18c-3.21.7-3.89-1.38-3.89-1.38-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function TextField({ id, type = "text", label, value, onChange, placeholder, disabled, required = true }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="si-field">
      {label && (
        <label className={`si-label${focused ? " focused" : ""}`} htmlFor={id}>{label}</label>
      )}
      <div className="si-input-wrap">
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} className="si-input no-toggle" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, placeholder, disabled }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputWrap = (
    <div className="si-input-wrap">
      <input id={id} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} required minLength={6} disabled={disabled} className="si-input" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      <button type="button" className="si-pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{show ? "visibility_off" : "visibility"}</span>
      </button>
    </div>
  );

  if (!label) return inputWrap;

  return (
    <div className="si-field">
      <label className={`si-label${focused ? " focused" : ""}`} htmlFor={id}>{label}</label>
      {inputWrap}
    </div>
  );
}

export default function SignInOptimized({ onSignInSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = "si-global-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // Surface OAuth errors that Supabase returns in the URL hash/query
  // (e.g. "?error=server_error&error_description=Database+error+saving+new+user")
  useEffect(() => {
    const parse = (str) => new URLSearchParams(str.replace(/^[#?]/, ""));
    const hash = parse(window.location.hash);
    const query = parse(window.location.search);
    const desc = hash.get("error_description") || query.get("error_description");
    if (desc) {
      setError(decodeURIComponent(desc.replace(/\+/g, " ")));
      // Clean the URL so the error doesn't persist on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fail = (err) => {
    setError(err.message || "An error occurred. Please try again.");
    setMessage("");
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setError("");
    setMessage("");
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
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true); setError(""); setMessage("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || email.split("@")[0],
            last_name: lastName || "",
          },
        },
      });
      if (error) fail(error);
      else if (data.user) {
        // Profile row is created automatically by the create_profile_on_signup
        // trigger using the metadata above — no client-side insert needed here
        // (there's no session yet when email confirmation is enabled).
        setMessage("Account created! Check your email to confirm.");
        setTimeout(() => {
          setIsSignUp(false);
          clearForm();
        }, 2000);
      }
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) fail(error);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true); setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) fail(error);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp((s) => !s);
    clearForm();
  };

  return (
    <div className="si-page">
      <header className="si-header">
        <div className="si-header-inner">
          <span className="si-logo">Aikee AI</span>
          <a href="#" className="si-help">Help</a>
        </div>
      </header>

      <div className="si-blob-wrap" aria-hidden="true">
        <div className="si-blob si-blob-1" />
        <div className="si-blob si-blob-2" />
      </div>

      <main className="si-main">
        <div className="si-card">
          <div className="si-card-header">
            <h1>{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p>{isSignUp ? "Start your profile in under two minutes." : "Enter your details to access your account"}</p>
          </div>

          <div className="si-social-group">
            <button className="si-social-btn" onClick={handleGoogleSignIn} disabled={loading} type="button">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb5uCBUgvriLrbkDSSlwPVrmtoqw5cPRUEtM3xBgeCWfBITH64s8mvG6bypgUcodt3YZP269OK7MAkV308UpOv5ejhbW2fKcTHEMRKqe1PiBpuREpZLj423fNBsDGy9N5Sx-bZTtTz51x-X5wdjBNrBx7lIq3N9eCjE9pwwx9fYuDGVfYMsEDa1ybSsCbdj0LDWxp4I75ckCnB_zt8BHgxydDw3lzuurqlGIiStumRORaDhw_irZrDzViNNCdN_cVYk0AVsBINzjw" alt="Google" style={{ width: 20, height: 20 }} />
              <span>Continue with Google</span>
            </button>
            <button className="si-social-btn" onClick={handleGitHubSignIn} disabled={loading} type="button">
              <GitHubIcon />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="si-divider">
            <div className="si-divider-line" />
            <span>OR</span>
            <div className="si-divider-line" />
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="si-form">
            {isSignUp && (
              <div className="si-name-row">
                <TextField id="firstName" label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" disabled={loading} />
                <TextField id="lastName" label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" disabled={loading} />
              </div>
            )}

            <TextField id="email" type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" disabled={loading} />

            <div className="si-field">
              <div className="si-field-row">
                <label className="si-label" htmlFor="password">Password</label>
                {!isSignUp && <a href="#" className="si-forgot">Forgot password?</a>}
              </div>
              <PasswordField id="password" label="" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
            </div>

            {isSignUp && (
              <PasswordField id="confirmPassword" label="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" disabled={loading} />
            )}

            {error && <div className="si-error">{error}</div>}
            {message && <div className="si-success">{message}</div>}

            <button type="submit" className="si-submit" disabled={loading}>
              {loading ? "Loading…" : isSignUp ? "Create account" : "Sign In"}
            </button>
          </form>

          <div className="si-toggle">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button type="button" className="si-toggle-btn" onClick={switchMode} disabled={loading}>
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </main>

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

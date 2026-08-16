import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { userProfileOperations } from "../../utils/databaseHelpers";
import { colors, css } from "../../constants/theme";

export default function SignIn({ onSignInSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  useEffect(() => {
    const updateView = () => setIsCompactView(window.innerWidth < 980);
    updateView();
    window.addEventListener("resize", updateView);

    return () => window.removeEventListener("resize", updateView);
  }, []);

  const handleAuthError = (err) => {
    setError(err.message || "An error occurred. Please try again.");
    setMessage("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
      } else if (data.user) {
        setMessage("Sign in successful! Redirecting...");
        onSignInSuccess?.(data.user);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        handleAuthError(error);
      } else if (data.user) {
        // Save display name to user_profiles
        const profileResult = await userProfileOperations.saveUserProfile({
          firstName: firstName || email.split('@')[0],
          lastName: lastName || email.split('@')[0],
        }); 
        ;

        if (profileResult.success) {
          setMessage(
            "Sign up successful! Please check your email to confirm your account."
          );
          setTimeout(() => {
            setIsSignUp(false);
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
          }, 2000);
        } else {
          console.error('Failed to save profile:', profileResult.error);
          setMessage(
            "Sign up successful! Please check your email to confirm your account."
          );
          setTimeout(() => {
            setIsSignUp(false);
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
          }, 2000);
        }
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        handleAuthError(error);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
      });

      if (error) {
        handleAuthError(error);
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.shell,
          gridTemplateColumns: isCompactView ? "1fr" : "1.05fr 0.95fr",
        }}
      >
        <aside style={styles.heroPanel}>
          <div style={styles.eyebrow}>AI resume builder</div>
          <h1 style={styles.heroTitle}>Build your next career story with clarity.</h1>
          <p style={styles.heroText}>
            Create a polished CV, save your progress, and keep every draft in one place.
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>✨ Fast onboarding</div>
            <div style={styles.featureItem}>📄 Smart CV templates</div>
            <div style={styles.featureItem}>🔐 Secure account access</div>
          </div>

          <div style={styles.statCard}>
            <strong style={styles.statValue}>3x</strong>
            <span style={styles.statLabel}>faster than traditional CV editing</span>
          </div>
        </aside>

        <section style={styles.card}>
          <div style={styles.header}>
            <p style={styles.kicker}><span style={styles.titleAccent}>Nex</span>Hire</p>
            <h2 style={styles.title}>{isSignUp ? "Create your account" : "Sign in to continue"}</h2>
            <p style={styles.subtitle}>
              {isSignUp
                ? "Start your profile in under two minutes."
                : "Pick up where you left off and keep your CV moving."}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} style={styles.form}>
            {isSignUp && (
              <div
                style={{
                  ...styles.rowGroup,
                  gridTemplateColumns: isCompactView ? "1fr" : "1fr 1fr",
                }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={styles.togglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    style={styles.input}
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    style={styles.togglePassword}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {error && <div style={styles.errorMessage}>{error}</div>}
            {message && <div style={styles.successMessage}>{message}</div>}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div style={styles.divider}><span>Or continue with</span></div>

          <div
            style={{
              ...styles.oauthButtons,
              gridTemplateColumns: isCompactView ? "1fr" : "1fr 1fr",
            }}
          >
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                ...styles.oauthButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span style={styles.oauthIcon}>🔵</span> Google
            </button>
            <button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={loading}
              style={{
                ...styles.oauthButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <span style={styles.oauthIcon}>⚫</span> GitHub
            </button>
          </div>

          <div style={styles.toggleAuth}>
            <p style={styles.toggleText}>
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setMessage("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setFirstName("");
                  setLastName("");
                }}
                style={styles.toggleButton}
                disabled={loading}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.surfaceContainerLow} 45%, ${colors.surfaceContainer} 100%)`,
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shell: {
    width: "100%",
    maxWidth: "1180px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "1rem",
    alignItems: "stretch",
  },
  heroPanel: {
    background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.primaryContainer} 55%, #0f4cc8 100%)`,
    color: colors.onPrimary,
    borderRadius: "1.5rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 18px 40px rgba(0, 74, 198, 0.25)",
    minHeight: "520px",
  },
  eyebrow: {
    display: "inline-flex",
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.14)",
    borderRadius: "999px",
    padding: "0.4rem 0.7rem",
    fontSize: "0.85rem",
    fontWeight: "600",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    lineHeight: 1.05,
    fontWeight: "700",
    fontFamily: "'Manrope', sans-serif",
    margin: "1rem 0 0.75rem",
    letterSpacing: "-0.03em",
  },
  heroText: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.88)",
    maxWidth: "28rem",
  },
  featureList: {
    display: "grid",
    gap: "0.65rem",
    marginTop: "1rem",
  },
  featureItem: {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "0.95rem",
    padding: "0.65rem 0.8rem",
    fontSize: "0.95rem",
    backdropFilter: "blur(8px)",
  },
  statCard: {
    marginTop: "1.25rem",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "1rem",
    padding: "1rem",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
  },
  statValue: {
    display: "block",
    fontSize: "1.6rem",
    fontWeight: "700",
    lineHeight: 1,
  },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "0.95rem",
  },
  card: {
    background: colors.surfaceContainerLowest,
    borderRadius: "1.5rem",
    padding: "1.5rem",
    boxShadow: "0 18px 40px rgba(0, 23, 75, 0.12)",
    border: `1px solid ${colors.surfaceContainerHigh}`,
  },
  header: {
    marginBottom: "1rem",
    textAlign: "left",
  },
  kicker: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.primary,
    fontWeight: "700",
    marginBottom: "0.35rem",
  },
  titleAccent: {
    color: colors.onSurface,
  },
  title: {
    fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
    fontWeight: "700",
    margin: "0 0 0.35rem 0",
    color: colors.onSurface,
    fontFamily: "'Manrope', sans-serif",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: colors.onSurfaceVariant,
    margin: 0,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  rowGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: "'Inter', sans-serif",
  },
  passwordWrap: {
    position: "relative",
  },
  input: {
    padding: "0.75rem 0.85rem",
    border: "1px solid transparent",
    borderRadius: "0.9rem",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
    width: "100%",
    background: colors.surfaceContainerLow,
    color: colors.onSurface,
  },
  togglePassword: {
    position: "absolute",
    top: "50%",
    right: "0.3rem",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.9)",
    border: `1px solid ${colors.surfaceContainerHigh}`,
    borderRadius: "999px",
    cursor: "pointer",
    color: colors.primary,
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "0.28rem 0.45rem",
    fontFamily: "'Inter', sans-serif",
  },
  errorMessage: {
    padding: "0.65rem 0.75rem",
    background: "rgba(220, 38, 38, 0.08)",
    borderRadius: "0.75rem",
    color: "#dc2626",
    fontSize: "0.875rem",
    fontFamily: "'Inter', sans-serif",
  },
  successMessage: {
    padding: "0.65rem 0.75rem",
    background: "rgba(16, 185, 129, 0.1)",
    borderRadius: "0.75rem",
    color: colors.success,
    fontSize: "0.875rem",
    fontFamily: "'Inter', sans-serif",
  },
  button: {
    padding: "0.8rem 1rem",
    border: "none",
    borderRadius: "0.95rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  primaryButton: {
    background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryContainer})`,
    color: colors.onPrimary,
    boxShadow: "0 12px 24px rgba(0, 74, 198, 0.18)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1rem 0 0.75rem",
    color: colors.onSurfaceVariant,
    fontSize: "0.82rem",
    fontFamily: "'Inter', sans-serif",
  },
  oauthButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.65rem",
  },
  oauthButton: {
    padding: "0.75rem 0.8rem",
    border: `1px solid ${colors.surfaceContainerHigh}`,
    borderRadius: "0.95rem",
    background: colors.surfaceContainerLow,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    color: colors.onSurface,
    fontFamily: "'Inter', sans-serif",
  },
  oauthIcon: {
    fontSize: "1rem",
  },
  toggleAuth: {
    marginTop: "0.9rem",
    textAlign: "center",
  },
  toggleText: {
    fontSize: "0.9rem",
    color: colors.onSurfaceVariant,
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: colors.primary,
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "0.25rem",
    fontSize: "0.9rem",
    padding: 0,
    fontFamily: "'Inter', sans-serif",
  },
};

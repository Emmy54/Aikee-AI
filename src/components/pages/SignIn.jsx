import { useState } from "react";
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
        setTimeout(() => {
          onSignInSuccess(data.user);
        }, 1000);
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
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Nex<span color="#000000">Hire</span></h1>
          <p style={styles.subtitle}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} style={styles.form}>
          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(
                  e.target.value)}
                placeholder="Your First Name (e.g. John)"
                required
                style={styles.input}
                disabled={loading}
              />
            </div>
          )}

          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(
                  e.target.value)}
                placeholder="Your Last Name (e.g. Doe)"
                required
                style={styles.input}
                disabled={loading}
              />
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
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          {isSignUp && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
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
              {showConfirmPassword ? "Hide Password" : "Show Password"}
            </button>
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
            {loading
              ? "Loading..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div style={styles.divider}>
          <span>Or continue with</span>
        </div>

        <div style={styles.oauthButtons}>
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
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setMessage("");
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
              }}
              style={styles.toggleButton}
              disabled={loading}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: colors.surface,
    padding: "1.25rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: colors.surfaceContainerLowest,
    borderRadius: "1rem",
    padding: "2.5rem",
    boxShadow: "0 0.625rem 2.5rem rgba(0, 23, 75, 0.08)",
    maxWidth: "30rem",
    width: "100%",
  },
  header: {
    marginBottom: "1.875rem",
    textAlign: "center",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
    color: colors.primary,
    fontFamily: "'Manrope', sans-serif",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: colors.onSurfaceVariant,
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  form: {
    marginBottom: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: colors.onSurface,
    fontFamily: "'Inter', sans-serif",
  },
  input: {
    padding: "0.625rem 0.75rem",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    transition: "box-shadow 0.2s, background 0.2s",
    boxSizing: "border-box",
    width: "100%",
    background: colors.surfaceContainerLow,
    color: colors.onSurface,
  },
  togglePassword: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: colors.primary,
    fontSize: "0.75rem",
    fontWeight: "500",
    padding: "0.25rem 0.5rem",
    marginTop: "0.25rem",
    fontFamily: "'Inter', sans-serif",
    transition: "color 0.2s, opacity 0.2s",
    position: "absolute",
    right: "0.10rem",

  },
  
  errorMessage: {
    padding: "0.625rem 0.75rem",
    background: "rgba(220, 38, 38, 0.1)",
    border: "none",
    borderRadius: "0.5rem",
    color: "#dc2626",
    fontSize: "0.8125rem",
    marginTop: "0.3125rem",
    fontFamily: "'Inter', sans-serif",
  },
  successMessage: {
    padding: "0.625rem 0.75rem",
    background: "rgba(16, 185, 129, 0.1)",
    border: "none",
    borderRadius: "0.5rem",
    color: colors.success,
    fontSize: "0.8125rem",
    marginTop: "0.3125rem",
    fontFamily: "'Inter', sans-serif",
  },
  button: {
    padding: "0.625rem 1rem",
    border: "none",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    transition: "all 0.2s",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  primaryButton: {
    background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryContainer})`,
    color: colors.onPrimary,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1.25rem 0",
    color: colors.onSurfaceVariant,
    fontSize: "0.8125rem",
    fontFamily: "'Inter', sans-serif",
  },
  oauthButtons: {
    display: "flex",
    gap: "0.625rem",
  },
  oauthButton: {
    flex: 1,
    padding: "0.625rem 0.75rem",
    border: "none",
    borderRadius: "0.75rem",
    background: colors.surfaceContainerLow,
    cursor: "pointer",
    fontSize: "0.8125rem",
    fontWeight: "500",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    color: colors.onSurface,
    fontFamily: "'Inter', sans-serif",
  },
  oauthIcon: {
    fontSize: "1rem",
  },
  toggleAuth: {
    marginTop: "1.25rem",
    textAlign: "center",
  },
  toggleText: {
    fontSize: "0.8125rem",
    color: colors.onSurfaceVariant,
    margin: 0,
    fontFamily: "'Inter', sans-serif",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: colors.primary,
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "0.25rem",
    fontSize: "0.8125rem",
    padding: 0,
    fontFamily: "'Inter', sans-serif",
  },
};

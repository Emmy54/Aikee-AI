import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { userProfileOperations } from "./utils/databaseHelpers";
import { colors, css } from "./constants/theme";
import LandingPage from "./components/steps/LandingPage"
import Dashboard from "./components/steps/Dashboard";
import SignInOptimized from "./components/pages/SignInOptimized";
import BuilderApp from "./BuilderApp";

// Shown to a signed-in user whose email is NOT on the beta allowlist. The app
// itself stays fully locked (the server rejects every paid call), so this is
// the friendly explanation rather than the enforcement.
function WaitlistScreen({ email, onSignOut }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.surface,
        padding: "1.5rem",
      }}
    >
      <style>{css}</style>
      <div
        className="card"
        style={{ maxWidth: "34rem", textAlign: "center", padding: "3rem 2.5rem" }}
      >
        <div className="step-tag" style={{ justifyContent: "center" }}>
          Aikee AI · Private Beta
        </div>
        <h1 style={{ marginBottom: "0.75rem" }}>You're on the waitlist</h1>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          Thanks for your interest in Aikee AI! We're rolling out access to a
          small group of testers at a time. Your account
          {email ? (
            <>
              {" "}(<strong style={{ color: colors.onSurface }}>{email}</strong>)
            </>
          ) : null}{" "}
          isn't approved for the beta just yet — we'll email you the moment a
          spot opens up.
        </p>
        <button
          className="btn btn-primary"
          style={{ maxWidth: "16rem", margin: "0 auto" }}
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children, user, isLoading, onSignOut }) {
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div style={{ width: "50px", height: "50px", border: "4px solid rgba(255, 255, 255, 0.3)", borderTop: "4px solid white", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "16px" }}></div>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Beta gate (task #4): signed in but not allowlisted → waitlist screen.
  if (user.allowlisted === false) {
    return <WaitlistScreen email={user.email} onSignOut={onSignOut} />;
  }

  return children;
}

export default function AppRoutes() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch user profile data.
  // `authUser` is the user object we already have from getSession() or the
  // onAuthStateChange event — pass it straight through so getUserProfile does
  // NOT call supabase.auth.getUser() again (that re-acquires the GoTrue lock
  // and deadlocks when invoked from the auth callback → stuck loading spinner).
  const fetchUserWithProfile = async (authUser) => {
    try {
      const profileResult = await userProfileOperations.getUserProfile(authUser);
      const userWithProfile = {
        ...authUser,
        firstName: profileResult.success && profileResult.data
          ? profileResult.data.first_name
          : authUser.email?.split('@')[0] || 'User',
        lastName: profileResult.success && profileResult.data
          ? profileResult.data.last_name
          : authUser.email?.split('@')[0] || 'User',
      };

      // Beta gate: is this tester's email on the allowlist? (task #4)
      // This drives the waitlist screen only — the SERVER independently enforces
      // the allowlist on every paid API call, so we FAIL OPEN here: a transient
      // RPC error must not lock out a legitimate tester. `rpc()` is not an
      // auth.* call, so it's safe to run from here / the auth callback.
      try {
        const { data, error } = await supabase.rpc('get_my_generation_status');
        const status = Array.isArray(data) ? data[0] : data;
        userWithProfile.allowlisted = error ? true : status?.allowlisted !== false;
        userWithProfile.generationsUsed = status?.used ?? 0;
        userWithProfile.generationsCap = status?.cap ?? 2;
        userWithProfile.generationsRemaining = status?.remaining ?? null;
      } catch (statusErr) {
        console.warn('Allowlist status check failed (failing open):', statusErr?.message);
        userWithProfile.allowlisted = true;
      }

      return userWithProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        ...authUser,
        firstName: authUser.email?.split('@')[0] || 'User',
        lastName: authUser.email?.split('@')[0] || 'User',
        allowlisted: true,
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userWithProfile = await fetchUserWithProfile(session.user);
          if (mounted) setUser(userWithProfile);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes.
    // IMPORTANT: do NOT await supabase.auth.* calls directly inside this
    // callback — Supabase runs it while holding the GoTrue lock, so any auth
    // call re-acquires the lock and deadlocks (infinite spinner on reload).
    // Defer the async profile work to a microtask so the lock is released first.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setTimeout(async () => {
            const userWithProfile = await fetchUserWithProfile(session.user);
            if (mounted) setUser(userWithProfile);
            if (mounted) setAuthLoading(false);
          }, 0);
        } else {
          if (mounted) setUser(null);
          if (mounted) setAuthLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/signin"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignInOptimized
              onSignInSuccess={async (signedInUser) => {
                const userWithProfile = await fetchUserWithProfile(signedInUser);
                setUser(userWithProfile);
              }}
            />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} isLoading={authLoading} onSignOut={handleSignOut}>
            <Dashboard
              user={user}
              onSignOut={handleSignOut}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/*"
        element={
          <ProtectedRoute user={user} isLoading={authLoading} onSignOut={handleSignOut}>
            <BuilderApp initialUser={user} />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

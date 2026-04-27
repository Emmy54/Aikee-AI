import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { userProfileOperations } from "./utils/databaseHelpers";
import NexHireLanding from "./components/steps/NexHireLanding";
import Dashboard from "./components/steps/Dashboard";
import SignIn from "./components/pages/SignIn";
import BuilderApp from "./BuilderApp";

// Protected Route wrapper
function ProtectedRoute({ children, user, isLoading }) {
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

  return children;
}

export default function AppRoutes() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Fetch user profile data
  const fetchUserWithProfile = async (authUser) => {
    try {
      const profileResult = await userProfileOperations.getUserProfile();
      const userWithProfile = {
        ...authUser,
        firstName: profileResult.success && profileResult.data 
          ? profileResult.data.first_name 
          : authUser.email?.split('@')[0] || 'User',
        lastName: profileResult.success && profileResult.data 
          ? profileResult.data.last_name 
          : authUser.email?.split('@')[0] || 'User',
      };
      return userWithProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        ...authUser,
        firstName: authUser.email?.split('@')[0] || 'User',
        lastName: authUser.email?.split('@')[0] || 'User',
      };
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userWithProfile = await fetchUserWithProfile(session.user);
          setUser(userWithProfile);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userWithProfile = await fetchUserWithProfile(session.user);
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<NexHireLanding />} />
      <Route
        path="/signin"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignIn
              onSignInSuccess={(signedInUser) => {
                setUser(signedInUser);
              }}
            />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} isLoading={authLoading}>
            <Dashboard 
              user={user} 
              onSignOut={() => {
                supabase.auth.signOut();
                setUser(null);
              }} 
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/builder/*"
        element={
          <ProtectedRoute user={user} isLoading={authLoading}>
            <BuilderApp initialUser={user} />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

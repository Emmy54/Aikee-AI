import { supabase } from '../../lib/supabaseClient';
import { colors } from '../constants/theme';
import { useState, useEffect } from 'react';

export default function DebugAuthStatus() {
  const [authStatus, setAuthStatus] = useState({
    user: null,
    session: null,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Test RLS by trying to read auth.uid()
        const { data: testData, error: testError } = await supabase
          .from('cvs')
          .select('id')
          .limit(1);

        setAuthStatus({
          user,
          session,
          error: testError,
          testData,
        });
      } catch (error) {
        setAuthStatus((prev) => ({
          ...prev,
          error: error.message,
        }));
      }
    };

    checkAuth();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: 'white',
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '300px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>
        🔍 Auth Debug
      </h3>

      <div style={{ marginBottom: '10px' }}>
        <strong>User ID:</strong>
        <p style={{ margin: '4px 0', color: authStatus.user?.id ? colors.accent : '#d45c5c' }}>
          {authStatus.user?.id ? '✅ ' + authStatus.user.id.slice(0, 8) + '...' : '❌ NULL'}
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Email:</strong>
        <p style={{ margin: '4px 0' }}>
          {authStatus.user?.email || '❌ Not set'}
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Session:</strong>
        <p style={{ margin: '4px 0', color: authStatus.session ? colors.accent : '#d45c5c' }}>
          {authStatus.session ? '✅ Active' : '❌ No session'}
        </p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>RLS Test:</strong>
        <p style={{ margin: '4px 0', color: authStatus.error ? '#d45c5c' : colors.accent }}>
          {authStatus.error ? `❌ ${authStatus.error.message}` : '✅ Can read CVs'}
        </p>
      </div>

      <div
        style={{
          marginTop: '12px',
          padding: '8px',
          background: '#f5f5f5',
          borderRadius: '4px',
          maxHeight: '100px',
          overflowY: 'auto',
        }}
      >
        <strong>Raw Data:</strong>
        <pre style={{ margin: '4px 0', fontSize: '10px', overflow: 'auto' }}>
          {JSON.stringify(
            {
              user_id: authStatus.user?.id || null,
              email: authStatus.user?.email || null,
              session_active: !!authStatus.session,
              rls_error: authStatus.error?.message || null,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

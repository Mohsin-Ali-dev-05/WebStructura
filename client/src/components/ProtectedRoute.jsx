import { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import {
  buildLoginRedirectState,
  getAuthGateMessage,
} from '../utils/authGate.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const notifiedRef = useRef('');

  const from = `${location.pathname}${location.search}${location.hash}`;
  const authMessage = getAuthGateMessage(location.pathname);

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }

    if (notifiedRef.current === from) {
      return;
    }

    notifiedRef.current = from;
    toast(authMessage, {
      icon: '🔐',
      duration: 4500,
      id: `auth-gate-${location.pathname}`,
    });
  }, [loading, isAuthenticated, from, authMessage, location.pathname]);

  if (loading) {
    return (
      <div className="auth-session-loader" role="status" aria-live="polite">
        <span className="auth-session-spinner" aria-hidden="true" />
        <span className="visually-hidden">Checking your session…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={buildLoginRedirectState(from)} />
    );
  }

  return children;
}

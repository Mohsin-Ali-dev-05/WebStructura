import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../services/api.js';
import { fetchCurrentUser, loginUser, registerUser } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetchCurrentUser();
        if (!cancelled) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (!cancelled) {
          // Only wipe the session on auth failures — keep the token on
          // network / 5xx errors so a transient outage does not log the user out.
          if (err?.status === 401 || err?.status === 403) {
            clearStoredToken();
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    const response = await loginUser({ email, password });
    setStoredToken(response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const response = await registerUser({ name, email, password });
    setStoredToken(response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const applyUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      applyUser,
      logout,
    }),
    [user, token, loading, login, register, applyUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

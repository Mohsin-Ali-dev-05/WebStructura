import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fieldClass,
  getApiErrorMessage,
  validateLoginFields,
} from '../utils/formValidation.js';
import { startGoogleOAuth } from '../services/api.js';

function GoogleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function EyeIcon({ open = false, className = 'w-5 h-5' }) {
  if (open) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <path d="M1 1l22 22" />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

const inputBase =
  'w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors';

const passwordWrapBase =
  'relative flex items-center w-full border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-colors';

const passwordInputBase =
  'border-none focus:ring-0 focus:outline-none w-full px-4 py-2.5 bg-transparent pr-10 text-gray-900 placeholder:text-gray-400';

const passwordToggleBase =
  'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none border-none bg-transparent p-0 cursor-pointer';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    return new URLSearchParams(window.location.search).get('error') || '';
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    (typeof location.state?.from === 'string' && location.state.from) ||
    '/dashboard';

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setError('');
    const errors = validateLoginFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-standalone min-h-screen flex flex-col items-center justify-center bg-white relative overflow-x-hidden px-4 py-10 pb-12">
      <Link
        to="/"
        className="absolute top-6 right-6 z-20 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        aria-label="Close and go home"
        title="Back to home"
      >
        <CloseIcon className="w-5 h-5" />
      </Link>

      <div
        className="auth-blob absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[34rem] h-[22rem] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at center, rgba(244, 114, 182, 0.35) 0%, rgba(96, 165, 250, 0.28) 45%, rgba(255,255,255,0) 70%)',
        }}
      />

      <div className="w-full max-w-[400px] px-6 z-10 flex flex-col">
        <Link to="/" aria-label="WebStructura home">
          <img
            src="/images/logo.png"
            alt="WebStructura"
            className="h-10 w-auto object-contain mx-auto mb-6 mix-blend-multiply"
          />
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>

        <button
          type="button"
          className="w-full border border-gray-300 rounded-md py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors bg-white cursor-pointer disabled:opacity-60"
          onClick={() => startGoogleOAuth()}
          disabled={submitting}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
          <span className="text-gray-400 text-sm bg-white px-2">or</span>
          <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <input
              className={fieldClass(inputBase, Boolean(fieldErrors.email))}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Work email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              aria-label="Work email"
              aria-invalid={fieldErrors.email ? true : undefined}
            />
            {fieldErrors.email ? (
              <p className="text-sm text-red-600">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <div
              className={fieldClass(
                passwordWrapBase,
                Boolean(fieldErrors.password),
              )}
            >
              <input
                className={passwordInputBase}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                aria-label="Password"
                aria-invalid={fieldErrors.password ? true : undefined}
              />
              <button
                type="button"
                className={passwordToggleBase}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={submitting}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="text-sm text-red-600">{fieldErrors.password}</p>
            ) : null}
          </div>

          <div className="flex justify-end -mt-1">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="auth-standalone-footer text-xs text-gray-400 text-center mt-10 max-w-sm px-6 z-10">
        By continuing, you agree to our{' '}
        <Link to="/terms" className="underline hover:text-gray-600">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

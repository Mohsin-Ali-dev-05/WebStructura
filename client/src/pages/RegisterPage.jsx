import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import FieldError from '../components/FieldError.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fieldClass,
  getApiErrorMessage,
  validateRegisterFields,
} from '../utils/formValidation.js';

function CloseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const baseFieldClass =
  'w-full py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
    const errors = validateRegisterFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-shell auth-shell--register">
      <div className="auth-aside bg-gradient-to-br from-emerald-900 to-gray-900">
        <Link
          to="/"
          className="text-4xl font-extrabold tracking-tight text-white mb-8 inline-block hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="WebStructura home"
        >
          WebStructura
        </Link>
        <h1 className="text-white">Create your workspace</h1>
        <p className="text-emerald-100">
          Register once, then manage every website project from your dashboard.
        </p>
      </div>

      <div className="auth-panel relative flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white">
        <Link
          to="/"
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          aria-label="Close and go home"
          title="Back to home"
        >
          <CloseIcon className="w-5 h-5" />
        </Link>

        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Register</h2>
          <form
            className="auth-form auth-form--register"
            onSubmit={handleSubmit}
            noValidate
          >
            {error ? (
              <p className="error" role="alert">
                {error}
              </p>
            ) : null}

            <label>
              Name
              <input
                className={fieldClass(baseFieldClass, Boolean(fieldErrors.name))}
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.name ? true : undefined}
              />
              <FieldError message={fieldErrors.name} />
            </label>

            <label>
              Email
              <input
                className={fieldClass(baseFieldClass, Boolean(fieldErrors.email))}
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
                aria-invalid={fieldErrors.email ? true : undefined}
              />
              <FieldError message={fieldErrors.email} />
            </label>

            <PasswordField
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required={false}
              minLength={8}
              disabled={submitting}
              error={fieldErrors.password}
              inputClassName={fieldClass(
                baseFieldClass,
                Boolean(fieldErrors.password),
              )}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required={false}
              minLength={8}
              disabled={submitting}
              error={fieldErrors.confirmPassword}
              inputClassName={fieldClass(
                baseFieldClass,
                Boolean(fieldErrors.confirmPassword),
              )}
            />

            <button
              className="auth-register-cta w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-semibold shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

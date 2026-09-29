import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import FieldError from '../components/FieldError.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { forgotPassword } from '../services/authService.js';
import {
  fieldClass,
  getApiErrorMessage,
  validateForgotPasswordFields,
} from '../utils/formValidation.js';

const baseFieldClass =
  'w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 shadow-sm';

function CheckCircleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L9 10.94 7.28 9.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ForgotPassword() {
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    setError('');
    setSuccess('');
    const errors = validateForgotPasswordFields({ email });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await forgotPassword({ email: email.trim() });
      setSuccess(
        response?.message ||
          'If an account exists for that email, a password reset link has been sent.',
      );
    } catch (err) {
      setError(
        getApiErrorMessage(err, 'Unable to send reset email. Please try again.'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="forgot-password-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-center text-xl font-black tracking-tighter text-emerald-900 mb-6">
          WebStructura
        </p>
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Reset your password
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2 mb-6">
          Enter your email and we will send you a reset link.
        </p>

        {success ? (
          <div
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl flex gap-3 items-start mb-4"
            role="status"
          >
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        ) : null}

        {error ? (
          <p className="error text-sm mb-4" role="alert">
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-900">
            Email
            <input
              className={fieldClass(baseFieldClass, Boolean(fieldErrors.email))}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => {
                  if (!current.email) {
                    return current;
                  }
                  const next = { ...current };
                  delete next.email;
                  return next;
                });
              }}
              disabled={submitting}
              aria-invalid={fieldErrors.email ? true : undefined}
            />
            <FieldError message={fieldErrors.email} />
          </label>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors mt-6"
        >
          ← Back to log in
        </Link>
      </div>
    </div>
  );
}

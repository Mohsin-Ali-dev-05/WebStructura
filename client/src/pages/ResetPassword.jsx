import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PasswordField from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { resetPassword } from '../services/authService.js';
import {
  fieldClass,
  getApiErrorMessage,
  validateResetPasswordFields,
} from '../utils/formValidation.js';

const baseFieldClass =
  'w-full py-3 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

export default function ResetPassword() {
  const { token } = useParams();
  const { isAuthenticated, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function clearFieldError(name) {
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
    setSuccess('');

    if (!token) {
      setError(
        'This reset link is invalid. Request a new one from the login page.',
      );
      return;
    }

    const errors = validateResetPasswordFields({ password, confirmPassword });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await resetPassword({ token, password });
      setSuccess(
        response?.message ||
          'Password updated successfully. You can now log in.',
      );
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          'Unable to reset password. The link may be invalid or expired.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="forgot-password-page reset-password-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-center text-2xl font-extrabold text-emerald-900 mb-2">
          WebStructura
        </p>
        <h1 className="text-center text-xl font-bold text-gray-900">
          Set new password
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2 mb-6">
          Choose a strong password you have not used here before.
        </p>

        {success ? (
          <div className="flex flex-col gap-4" role="status">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </div>
            <Link
              to="/login"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors inline-flex items-center justify-center text-center"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            {error ? (
              <p className="error text-sm mb-4" role="alert">
                {error}
              </p>
            ) : null}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <PasswordField
                label="New Password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearFieldError('password');
                }}
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
                label="Confirm New Password"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  clearFieldError('confirmPassword');
                }}
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
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg mt-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? 'Updating...' : 'Update password'}
              </button>
            </form>

            <Link
              to="/login"
              className="text-center text-sm text-emerald-600 hover:text-emerald-700 mt-6 block"
            >
              ← Back to log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

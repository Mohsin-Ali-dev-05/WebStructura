import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  Input,
  SettingsPageShell,
} from '../../components/ui/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { changePassword } from '../../services/authService.js';
import {
  getApiErrorMessage,
  validateChangePasswordFields,
} from '../../utils/formValidation.js';

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const passwordAvailable =
    typeof user?.hasPassword === 'boolean'
      ? user.hasPassword
      : !user?.googleLinked;

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (submitting || !passwordAvailable) {
      return;
    }

    const errors = validateChangePasswordFields(form);
    setFieldErrors(errors);
    setError('');
    setSuccess('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Password updated successfully.');
      toast.success('Password updated.');
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        'Could not update your password. Please try again.',
      );
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SettingsPageShell
      title="Security"
      description="Protect your account with a strong password. Changes are saved to your local WebStructura account."
    >
      {passwordAvailable ? (
        <Card
          as="form"
          className="space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          {error ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="success" role="status">
              {success}
            </p>
          ) : null}

          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            error={fieldErrors.currentPassword}
            disabled={submitting}
          />

          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="At least 8 characters"
            error={fieldErrors.newPassword}
            disabled={submitting}
          />

          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            error={fieldErrors.confirmPassword}
            disabled={submitting}
          />

          <Button type="submit" className="mt-2" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </Button>
        </Card>
      ) : (
        <Card as="section">
          <h3 className="text-base font-bold text-gray-900 m-0">Password</h3>
          <p className="text-sm text-gray-500 mt-2 mb-0 leading-relaxed">
            This account signs in with Google and does not have a local password
            to change. Use Google account security settings to manage sign-in.
          </p>
        </Card>
      )}

      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 m-0">
            Two-factor authentication
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            Authenticator-based 2FA is not available in this local build yet.
          </p>
        </div>
        <span className="settings-unavailable-badge">Unavailable</span>
      </Card>
    </SettingsPageShell>
  );
}

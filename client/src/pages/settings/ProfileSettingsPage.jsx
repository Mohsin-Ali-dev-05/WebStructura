import { useEffect, useRef, useState } from 'react';
import { Button, Card, Input, SettingsPageShell } from '../../components/ui/index.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  deleteAvatar,
  updateProfile,
  uploadAvatar,
} from '../../services/authService.js';
import {
  getApiErrorMessage,
  validateSettingsFields,
} from '../../utils/formValidation.js';

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export default function ProfileSettingsPage() {
  const { user, applyUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user?.name, user?.email]);

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

  function handlePhotoButtonClick() {
    if (avatarBusy) {
      return;
    }
    fileInputRef.current?.click();
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setError('Please choose a JPEG, PNG, WebP, or GIF image.');
      setSuccess('');
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image must be 2MB or smaller.');
      setSuccess('');
      return;
    }

    setAvatarBusy(true);
    setError('');
    setSuccess('');

    try {
      const response = await uploadAvatar(file);
      applyUser(response.data.user);
      setSuccess('Profile photo updated successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not upload your profile photo.'));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleRemovePhoto() {
    if (avatarBusy || !user?.avatarUrl) {
      return;
    }

    setAvatarBusy(true);
    setError('');
    setSuccess('');

    try {
      const response = await deleteAvatar();
      applyUser(response.data.user);
      setSuccess('Profile photo removed.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not remove your profile photo.'));
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    if (submitting || avatarBusy) {
      return;
    }

    setError('');
    setSuccess('');
    const errors = validateSettingsFields(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await updateProfile({
        displayName: form.name,
        email: form.email,
      });
      applyUser(response.data.user);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not update your profile.'));
    } finally {
      setSubmitting(false);
    }
  }

  const initials =
    (user?.name || form.name || '?')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || '?';

  const avatarUrl = user?.avatarUrl || '';

  return (
    <SettingsPageShell
      title="Profile"
      description="Update the name, email, and photo shown across WebStructura."
    >
      {success ? (
        <p
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl m-0"
          role="status"
        >
          {success}
        </p>
      ) : null}

      {error ? (
        <p className="error text-sm m-0" role="alert">
          {error}
        </p>
      ) : null}

      <Card className="settings-photo-section flex flex-col sm:flex-row sm:items-center gap-6">
        <div
          className="settings-avatar w-24 h-24 rounded-full bg-emerald-50 border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-emerald-700 overflow-hidden shrink-0 ring-1 ring-gray-100"
          aria-hidden={avatarUrl ? undefined : true}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Your profile photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-bold tracking-normal">{initials}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoChange}
            disabled={avatarBusy}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePhotoButtonClick}
            disabled={avatarBusy}
          >
            {avatarBusy ? 'Uploading…' : 'Change photo'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleRemovePhoto}
            disabled={avatarBusy || !avatarUrl}
          >
            Remove
          </Button>
        </div>
      </Card>

      <Card
        as="form"
        className="space-y-6"
        onSubmit={handleProfileSubmit}
        noValidate
      >
        <Input
          label="Display name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          disabled={submitting || avatarBusy}
          error={fieldErrors.name || ''}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          disabled={submitting || avatarBusy}
          error={fieldErrors.email || ''}
        />

        <Button type="submit" className="mt-2" disabled={submitting || avatarBusy}>
          {submitting ? 'Saving…' : 'Save changes'}
        </Button>
      </Card>
    </SettingsPageShell>
  );
}

import { useEffect, useRef, useState } from 'react';
import FieldError from '../components/FieldError.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  deleteAvatar,
  updateProfile,
  uploadAvatar,
} from '../services/authService.js';
import { formatDate } from '../utils/formatDate.js';
import {
  fieldClass,
  getApiErrorMessage,
  validateSettingsFields,
} from '../utils/formValidation.js';

const baseFieldClass =
  'w-full py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
];

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export default function SettingsPage() {
  const { user, applyUser, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState('profile');
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
    <div className="settings-page">
      <header className="settings-header mb-8">
        <p className="settings-kicker">Account</p>
        <h1 className="text-3xl font-extrabold text-gray-900 m-0 tracking-normal">
          Settings
        </h1>
        <p className="text-gray-600 mt-2 m-0 leading-relaxed">
          Manage your profile details and account preferences.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <nav
          className="settings-nav flex md:flex-col gap-2 md:w-48 shrink-0"
          aria-label="Settings sections"
        >
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={[
                  'settings-tab text-sm font-medium px-4 py-2.5 rounded-xl text-left transition-colors border',
                  active
                    ? 'settings-tab--active bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'settings-tab--inactive text-gray-600 border-transparent hover:bg-gray-50',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  setTab(item.id);
                  setError('');
                  setSuccess('');
                  setFieldErrors({});
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <section className="settings-panel flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {tab === 'profile' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">
                Profile
              </h2>
              <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
                Update the name, email, and photo shown across WebStructura.
              </p>

              {success ? (
                <p
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl mb-4"
                  role="status"
                >
                  {success}
                </p>
              ) : null}

              {error ? (
                <p className="error text-sm mb-4" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="settings-photo-section flex items-center gap-5 mb-8">
                <div
                  className="settings-avatar w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-4xl text-gray-400 overflow-hidden shrink-0"
                  aria-hidden={avatarUrl ? undefined : true}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Your profile photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold tracking-normal">
                      {initials}
                    </span>
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
                  <button
                    type="button"
                    className="btn btn-secondary settings-photo-change disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handlePhotoButtonClick}
                    disabled={avatarBusy}
                  >
                    {avatarBusy ? 'Uploading…' : 'Change photo'}
                  </button>
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors disabled:opacity-40"
                    onClick={handleRemovePhoto}
                    disabled={avatarBusy || !avatarUrl}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <form
                className="space-y-4 max-w-lg"
                onSubmit={handleProfileSubmit}
                noValidate
              >
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Display name
                  </span>
                  <input
                    className={fieldClass(
                      baseFieldClass,
                      Boolean(fieldErrors.name),
                    )}
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={submitting || avatarBusy}
                    aria-invalid={fieldErrors.name ? true : undefined}
                  />
                  <FieldError message={fieldErrors.name} />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Email
                  </span>
                  <input
                    className={fieldClass(
                      baseFieldClass,
                      Boolean(fieldErrors.email),
                    )}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={submitting || avatarBusy}
                    aria-invalid={fieldErrors.email ? true : undefined}
                  />
                  <FieldError message={fieldErrors.email} />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={submitting || avatarBusy}
                >
                  {submitting ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">
                Account
              </h2>
              <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
                Overview of your WebStructura account.
              </p>

              <dl className="settings-account-meta space-y-4 m-0 mb-8">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
                    Signed in as
                  </dt>
                  <dd className="text-gray-900 font-medium mt-1 m-0">
                    {user?.email || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 m-0">
                    Member since
                  </dt>
                  <dd className="text-gray-900 font-medium mt-1 m-0">
                    {formatDate(user?.createdAt) || '—'}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-base font-bold text-gray-900 m-0 mb-2">
                  Sign out
                </h3>
                <p className="text-sm text-gray-500 mt-0 mb-4 leading-relaxed">
                  End your session on this device. You can sign back in anytime.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

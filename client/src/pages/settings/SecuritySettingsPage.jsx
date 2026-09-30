import { useState } from 'react';

const baseFieldClass =
  'w-full py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

export default function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">Security</h2>
      <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
        Protect your account with a strong password and optional two-factor
        authentication.
      </p>

      <form className="space-y-4 max-w-lg mb-5" onSubmit={handleSubmit} noValidate>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-900">
            Current password
          </span>
          <input
            className={baseFieldClass}
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-900">
            New password
          </span>
          <input
            className={baseFieldClass}
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-900">
            Confirm new password
          </span>
          <input
            className={baseFieldClass}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-all"
        >
          Update password
        </button>
      </form>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-start justify-between gap-4 max-w-lg">
          <div>
            <h3 className="text-base font-bold text-gray-900 m-0 mb-2">
              Two-factor authentication
            </h3>
            <p className="text-sm text-gray-500 mt-0 mb-0 leading-relaxed">
              Add an extra verification step when signing in from a new device.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactor}
            className={[
              'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors',
              twoFactor
                ? 'bg-emerald-600 border-emerald-600'
                : 'bg-gray-200 border-gray-200',
            ].join(' ')}
            onClick={() => setTwoFactor((value) => !value)}
          >
            <span
              className={[
                'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                twoFactor ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';

const baseFieldClass =
  'w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm';

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
    <div className="space-y-8 max-w-3xl">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          Security
        </h2>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Protect your account with a strong password and optional two-factor
          authentication.
        </p>
      </header>

      <form
        className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <label className="block space-y-2">
          <span className="text-sm font-bold text-gray-700">
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
          <span className="text-sm font-bold text-gray-700">New password</span>
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
          <span className="text-sm font-bold text-gray-700">
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
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 mt-2"
        >
          Update password
        </button>
      </form>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 m-0">
            Two-factor authentication
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            Add an extra verification step when signing in from a new device.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={twoFactor}
          aria-label="Two-factor authentication"
          className={[
            'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200',
            twoFactor
              ? 'bg-emerald-600 border-emerald-600'
              : 'bg-gray-200 border-gray-200',
          ].join(' ')}
          onClick={() => setTwoFactor((value) => !value)}
        >
          <span
            className={[
              'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
              twoFactor ? 'translate-x-6' : 'translate-x-1',
            ].join(' ')}
          />
        </button>
      </section>
    </div>
  );
}

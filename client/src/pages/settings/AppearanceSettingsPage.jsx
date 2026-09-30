import { useState } from 'react';

const THEME_OPTIONS = [
  { id: 'system', label: 'System', description: 'Match your device setting' },
  { id: 'light', label: 'Light', description: 'Bright canvas and panels' },
  { id: 'dark', label: 'Dark', description: 'Coming soon — preview only' },
];

const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
];

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState('system');
  const [density, setDensity] = useState('comfortable');
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">Appearance</h2>
      <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
        Customize how WebStructura looks in the builder and dashboard. Preview
        only — preferences are not saved yet.
      </p>

      <div className="space-y-4 max-w-lg mb-5">
        <p className="text-sm font-semibold text-gray-900 m-0">Theme</p>
        <div className="space-y-3">
          {THEME_OPTIONS.map((option) => {
            const active = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={[
                  'w-full text-left rounded-xl border px-4 py-3 transition-colors',
                  active
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:bg-gray-50',
                ].join(' ')}
                onClick={() => setTheme(option.id)}
                aria-pressed={active}
              >
                <span className="block text-sm font-semibold text-gray-900">
                  {option.label}
                </span>
                <span className="block text-sm text-gray-500 mt-1">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 max-w-lg mb-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-900">
            Interface density
          </span>
          <select
            className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={density}
            onChange={(event) => setDensity(event.target.value)}
          >
            {DENSITY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-start justify-between gap-4 max-w-lg">
          <div>
            <h3 className="text-base font-bold text-gray-900 m-0 mb-2">
              Reduce motion
            </h3>
            <p className="text-sm text-gray-500 mt-0 mb-0 leading-relaxed">
              Limit animations and transitions across the app shell.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reduceMotion}
            className={[
              'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors',
              reduceMotion
                ? 'bg-emerald-600 border-emerald-600'
                : 'bg-gray-200 border-gray-200',
            ].join(' ')}
            onClick={() => setReduceMotion((value) => !value)}
          >
            <span
              className={[
                'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                reduceMotion ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </div>
    </>
  );
}

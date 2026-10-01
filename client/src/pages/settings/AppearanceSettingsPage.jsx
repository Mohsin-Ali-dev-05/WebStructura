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
    <div className="space-y-8 max-w-3xl">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          Appearance
        </h2>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Customize how WebStructura looks in the builder and dashboard. Preview
          only — preferences are not saved yet.
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 m-0 mb-4">Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEME_OPTIONS.map((option) => {
            const active = theme === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={[
                  'relative flex flex-col text-left rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                  active
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-md transform scale-[1.02]'
                    : 'border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm',
                ].join(' ')}
                onClick={() => setTheme(option.id)}
                aria-pressed={active}
              >
                <span className="block text-base font-semibold text-gray-900">
                  {option.label}
                </span>
                <span className="block text-sm text-gray-500 mt-1 leading-relaxed">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 m-0">
              Interface density
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
              Control spacing across builder panels and lists.
            </p>
          </div>
          <select
            className="w-full md:w-48 py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
            value={density}
            onChange={(event) => setDensity(event.target.value)}
            aria-label="Interface density"
          >
            {DENSITY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-6 md:p-8 border-t border-gray-100 flex items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 m-0">
              Reduce motion
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
              Limit animations and transitions across the app shell.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reduceMotion}
            className={[
              'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200',
              reduceMotion
                ? 'bg-emerald-600 border-emerald-600'
                : 'bg-gray-200 border-gray-200',
            ].join(' ')}
            onClick={() => setReduceMotion((value) => !value)}
          >
            <span
              className={[
                'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                reduceMotion ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </section>
    </div>
  );
}

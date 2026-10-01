import { useState } from 'react';

const NOTIFICATION_ITEMS = [
  {
    id: 'product',
    title: 'Product updates',
    description: 'New features, template drops, and release notes.',
  },
  {
    id: 'project',
    title: 'Project activity',
    description: 'Saves, exports, and publishing status for your sites.',
  },
  {
    id: 'security',
    title: 'Security alerts',
    description: 'Sign-ins from new devices and password changes.',
  },
  {
    id: 'marketing',
    title: 'Tips & inspiration',
    description: 'Occasional emails with builder tips and examples.',
  },
];

export default function NotificationsSettingsPage() {
  const [prefs, setPrefs] = useState({
    product: true,
    project: true,
    security: true,
    marketing: false,
  });
  const [digest, setDigest] = useState('weekly');

  function togglePref(id) {
    setPrefs((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          Notifications
        </h2>
        <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed">
          Choose what WebStructura can email you. These controls are demo-only for
          now.
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
        {NOTIFICATION_ITEMS.map((item) => {
          const enabled = Boolean(prefs[item.id]);
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 border-b border-gray-100 last:border-b-0"
            >
              <div className="min-w-0">
                <h3 className="text-base font-bold text-gray-900 m-0">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={item.title}
                className={[
                  'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200',
                  enabled
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'bg-gray-200 border-gray-200',
                ].join(' ')}
                onClick={() => togglePref(item.id)}
              >
                <span
                  className={[
                    'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                    enabled ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          );
        })}
      </section>

      <section className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 m-0">Email digest</h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            Digests summarize project activity when you are not signed in.
          </p>
        </div>
        <select
          className="w-full md:w-48 py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm shrink-0"
          value={digest}
          onChange={(event) => setDigest(event.target.value)}
          aria-label="Email digest frequency"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="off">Off</option>
        </select>
      </section>
    </div>
  );
}

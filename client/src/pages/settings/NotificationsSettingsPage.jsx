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
    <>
      <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">
        Notifications
      </h2>
      <p className="text-sm text-gray-500 mt-0 mb-6 leading-relaxed">
        Choose what WebStructura can email you. These controls are demo-only for
        now.
      </p>

      <div className="space-y-4 mb-5 max-w-lg">
        {NOTIFICATION_ITEMS.map((item) => {
          const enabled = Boolean(prefs[item.id]);
          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              <div>
                <h3 className="text-base font-bold text-gray-900 m-0 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0 mb-0 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                className={[
                  'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors',
                  enabled
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'bg-gray-200 border-gray-200',
                ].join(' ')}
                onClick={() => togglePref(item.id)}
              >
                <span
                  className={[
                    'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                    enabled ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 pt-6 max-w-lg">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-gray-900">
            Email digest
          </span>
          <select
            className="w-full py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 outline-none transition-shadow shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={digest}
            onChange={(event) => setDigest(event.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="off">Off</option>
          </select>
        </label>
        <p className="text-sm text-gray-500 mt-2 mb-0 leading-relaxed">
          Digests summarize project activity when you are not signed in.
        </p>
      </div>
    </>
  );
}

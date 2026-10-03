import { useState } from 'react';
import {
  Card,
  Select,
  SettingsPageShell,
  Toggle,
} from '../../components/ui/index.js';

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
    <SettingsPageShell
      title="Notifications"
      description="Choose what WebStructura can email you. These controls are demo-only for now."
    >
      <Card
        as="section"
        padding="none"
        className="flex flex-col overflow-hidden"
      >
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
              <Toggle
                checked={enabled}
                aria-label={item.title}
                onChange={() => togglePref(item.id)}
              />
            </div>
          );
        })}
      </Card>

      <Card
        as="section"
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 m-0">Email digest</h3>
          <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
            Digests summarize project activity when you are not signed in.
          </p>
        </div>
        <Select
          className="shrink-0"
          value={digest}
          onChange={(event) => setDigest(event.target.value)}
          aria-label="Email digest frequency"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="off">Off</option>
        </Select>
      </Card>
    </SettingsPageShell>
  );
}

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  Select,
  SettingsPageShell,
  Toggle,
} from '../../components/ui/index.js';
import {
  loadUiPreferences,
  saveUiPreferences,
} from '../../preferences/uiPreferences.js';

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
  const initial = loadUiPreferences().notifications;
  const [prefs, setPrefs] = useState({
    product: Boolean(initial.product),
    project: Boolean(initial.project),
    security: Boolean(initial.security),
    marketing: Boolean(initial.marketing),
  });
  const [digest, setDigest] = useState(initial.digest || 'weekly');

  function togglePref(id) {
    setPrefs((current) => ({ ...current, [id]: !current[id] }));
  }

  function handleSave() {
    const current = loadUiPreferences();
    saveUiPreferences({
      ...current,
      notifications: {
        ...prefs,
        digest,
      },
    });
    toast.success('Notification preferences saved on this device.');
  }

  return (
    <SettingsPageShell
      title="Notifications"
      description="Choose what you want to hear about. Preferences are stored on this device (no email service is required)."
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
            Digests summarize project activity when you are away. Delivery needs
            mail setup later; your choice is still saved here.
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

      <div className="pt-1">
        <Button type="button" onClick={handleSave}>
          Save notification preferences
        </Button>
      </div>
    </SettingsPageShell>
  );
}

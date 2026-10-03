import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Card,
  Select,
  SettingsPageShell,
  Toggle,
} from '../../components/ui/index.js';
import {
  applyUiPreferences,
  loadUiPreferences,
  saveUiPreferences,
} from '../../preferences/uiPreferences.js';

const THEME_OPTIONS = [
  { id: 'system', label: 'System', description: 'Match your device setting' },
  { id: 'light', label: 'Light', description: 'Bright canvas and panels' },
  { id: 'dark', label: 'Dark', description: 'Dim surfaces for low-light work' },
];

const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
];

export default function AppearanceSettingsPage() {
  const initial = loadUiPreferences();
  const [theme, setTheme] = useState(initial.theme);
  const [density, setDensity] = useState(initial.density);
  const [reduceMotion, setReduceMotion] = useState(initial.reduceMotion);

  useEffect(() => {
    applyUiPreferences({
      ...loadUiPreferences(),
      theme,
      density,
      reduceMotion,
    });
  }, [theme, density, reduceMotion]);

  function persist(next) {
    saveUiPreferences({
      ...loadUiPreferences(),
      theme: next.theme ?? theme,
      density: next.density ?? density,
      reduceMotion:
        typeof next.reduceMotion === 'boolean' ? next.reduceMotion : reduceMotion,
    });
    toast.success('Appearance preferences saved.');
  }

  return (
    <SettingsPageShell
      title="Appearance"
      description="Customize how WebStructura looks in the builder and dashboard. Preferences are saved on this device."
    >
      <Card as="section">
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
                onClick={() => {
                  setTheme(option.id);
                  persist({ theme: option.id });
                }}
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
      </Card>

      <Card
        as="section"
        padding="none"
        className="flex flex-col overflow-hidden"
      >
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 m-0">
              Interface density
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-0 leading-relaxed">
              Control spacing across builder panels and lists.
            </p>
          </div>
          <Select
            value={density}
            onChange={(event) => {
              const value = event.target.value;
              setDensity(value);
              persist({ density: value });
            }}
            aria-label="Interface density"
          >
            {DENSITY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
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
          <Toggle
            checked={reduceMotion}
            onChange={() => {
              const next = !reduceMotion;
              setReduceMotion(next);
              persist({ reduceMotion: next });
            }}
          />
        </div>
      </Card>

      <div className="pt-1">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            setTheme('system');
            setDensity('comfortable');
            setReduceMotion(false);
            saveUiPreferences({
              theme: 'system',
              density: 'comfortable',
              reduceMotion: false,
              notifications: loadUiPreferences().notifications,
            });
            toast.success('Appearance reset to defaults.');
          }}
        >
          Reset appearance
        </Button>
      </div>
    </SettingsPageShell>
  );
}

const STORAGE_KEY = 'ws.uiPreferences';

export const DEFAULT_UI_PREFERENCES = {
  theme: 'system',
  density: 'comfortable',
  reduceMotion: false,
  notifications: {
    product: true,
    project: true,
    security: true,
    marketing: false,
    digest: 'weekly',
  },
};

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadUiPreferences() {
  if (!canUseStorage()) {
    return { ...DEFAULT_UI_PREFERENCES, notifications: { ...DEFAULT_UI_PREFERENCES.notifications } };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_UI_PREFERENCES, notifications: { ...DEFAULT_UI_PREFERENCES.notifications } };
    }

    const parsed = JSON.parse(raw);
    return {
      theme: ['system', 'light', 'dark'].includes(parsed?.theme)
        ? parsed.theme
        : DEFAULT_UI_PREFERENCES.theme,
      density: ['comfortable', 'compact'].includes(parsed?.density)
        ? parsed.density
        : DEFAULT_UI_PREFERENCES.density,
      reduceMotion: Boolean(parsed?.reduceMotion),
      notifications: {
        ...DEFAULT_UI_PREFERENCES.notifications,
        ...(parsed?.notifications && typeof parsed.notifications === 'object'
          ? parsed.notifications
          : {}),
      },
    };
  } catch {
    return { ...DEFAULT_UI_PREFERENCES, notifications: { ...DEFAULT_UI_PREFERENCES.notifications } };
  }
}

export function saveUiPreferences(next) {
  const merged = {
    ...DEFAULT_UI_PREFERENCES,
    ...next,
    notifications: {
      ...DEFAULT_UI_PREFERENCES.notifications,
      ...(next?.notifications || {}),
    },
  };

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  applyUiPreferences(merged);
  return merged;
}

export function resolveThemeMode(theme) {
  if (theme === 'light' || theme === 'dark') {
    return theme;
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return 'light';
}

export function applyUiPreferences(prefs = loadUiPreferences()) {
  if (typeof document === 'undefined') {
    return prefs;
  }

  const root = document.documentElement;
  const resolvedTheme = resolveThemeMode(prefs.theme);

  root.dataset.wsTheme = resolvedTheme;
  root.dataset.wsThemeChoice = prefs.theme;
  root.dataset.wsDensity = prefs.density;
  root.dataset.wsReduceMotion = prefs.reduceMotion ? 'true' : 'false';

  return prefs;
}

let mediaListenerBound = false;

export function bindSystemThemeListener() {
  if (typeof window === 'undefined' || mediaListenerBound || !window.matchMedia) {
    return;
  }

  mediaListenerBound = true;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => {
    const prefs = loadUiPreferences();
    if (prefs.theme === 'system') {
      applyUiPreferences(prefs);
    }
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onChange);
  }
}

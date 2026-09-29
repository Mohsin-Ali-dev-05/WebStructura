import { DEFAULT_THEME, THEME_CSS_VAR_MAP } from './defaultTheme.js';

/**
 * Convert #RGB / #RRGGBB to HSL channel string: "H S% L%"
 */
export function hexToHslChannels(hex) {
  if (typeof hex !== 'string') {
    return null;
  }

  let value = hex.trim().replace('#', '');

  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }

  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
    }

    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Normalize a color value into HSL channels for CSS variables.
 */
export function toHslChannels(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.startsWith('#')) {
    return hexToHslChannels(trimmed);
  }

  const hslMatch = trimmed.match(
    /^hsla?\(\s*([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%/i,
  );

  if (hslMatch) {
    return `${Math.round(Number(hslMatch[1]))} ${Math.round(Number(hslMatch[2]))}% ${Math.round(Number(hslMatch[3]))}%`;
  }

  // Already "H S% L%"
  if (/^[\d.]+\s+[\d.]+%\s+[\d.]+%$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function getByPath(object, path) {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      return current[key];
    }
    return undefined;
  }, object);
}

function flattenThemeEntries(theme) {
  const entries = [];

  Object.entries(THEME_CSS_VAR_MAP).forEach(([path, cssVar]) => {
    const raw = getByPath(theme, path);
    if (raw === undefined || raw === null || raw === '') {
      return;
    }

    const isColor = path.startsWith('colors.');
    const value = isColor ? toHslChannels(String(raw)) || String(raw) : String(raw);
    entries.push([cssVar, value]);
  });

  // Convenience: allow flat websiteData.theme shape from the builder
  if (theme.primaryColor) {
    const channels = toHslChannels(theme.primaryColor);
    if (channels) {
      entries.push(['--color-primary', channels]);
    }
  }
  if (theme.backgroundColor) {
    const channels = toHslChannels(theme.backgroundColor);
    if (channels) {
      entries.push(['--color-background', channels]);
      entries.push(['--color-surface', channels]);
    }
  }
  if (theme.textColor) {
    const channels = toHslChannels(theme.textColor);
    if (channels) {
      entries.push(['--color-text', channels]);
    }
  }
  if (theme.font) {
    entries.push(['--font-body', theme.font]);
    entries.push(['--font-display', theme.font]);
  }

  return entries;
}

/**
 * Apply a JSON theme object to a DOM element (defaults to document.documentElement).
 * Merges over DEFAULT_THEME so omitted keys keep the design-system defaults.
 *
 * @param {object} themeJson
 * @param {HTMLElement | null} [target]
 * @returns {() => void} cleanup that removes only the overrides written this call
 */
export function applyTheme(themeJson = {}, target = null) {
  const element =
    target || (typeof document !== 'undefined' ? document.documentElement : null);

  if (!element) {
    return () => {};
  }

  const merged = {
    ...DEFAULT_THEME,
    ...themeJson,
    colors: { ...DEFAULT_THEME.colors, ...(themeJson.colors || {}) },
    fonts: { ...DEFAULT_THEME.fonts, ...(themeJson.fonts || {}) },
    radius: { ...DEFAULT_THEME.radius, ...(themeJson.radius || {}) },
  };

  const applied = flattenThemeEntries(merged);

  applied.forEach(([cssVar, value]) => {
    element.style.setProperty(cssVar, value);
  });

  // Keep resolved aliases in sync when channels change
  element.style.setProperty('--primary', 'hsl(var(--color-primary))');
  element.style.setProperty('--bg', 'hsl(var(--color-background))');
  element.style.setProperty('--surface', 'hsl(var(--color-surface))');
  element.style.setProperty('--text', 'hsl(var(--color-text))');
  element.style.setProperty('--text-muted', 'hsl(var(--color-text-muted))');
  element.style.setProperty('--border', 'hsl(var(--color-border))');
  element.style.setProperty('--primary-hover', 'hsl(var(--color-primary-hover))');
  element.style.setProperty('--radius', 'var(--radius-md)');

  return () => {
    applied.forEach(([cssVar]) => {
      element.style.removeProperty(cssVar);
    });
  };
}

/**
 * Build a style object for React inline styles from a theme JSON.
 * Useful for scoped preview roots without touching :root.
 */
export function themeToStyleObject(themeJson = {}) {
  const merged = {
    ...DEFAULT_THEME,
    ...themeJson,
    colors: { ...DEFAULT_THEME.colors, ...(themeJson.colors || {}) },
    fonts: { ...DEFAULT_THEME.fonts, ...(themeJson.fonts || {}) },
    radius: { ...DEFAULT_THEME.radius, ...(themeJson.radius || {}) },
  };

  const style = {};
  flattenThemeEntries(merged).forEach(([cssVar, value]) => {
    style[cssVar] = value;
  });

  style['--primary'] = 'hsl(var(--color-primary))';
  style['--bg'] = 'hsl(var(--color-background))';
  style['--surface'] = 'hsl(var(--color-surface))';
  style['--text'] = 'hsl(var(--color-text))';
  style['--text-muted'] = 'hsl(var(--color-text-muted))';
  style['--border'] = 'hsl(var(--color-border))';
  style['--primary-hover'] = 'hsl(var(--color-primary-hover))';

  return style;
}

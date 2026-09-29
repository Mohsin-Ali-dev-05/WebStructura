/**
 * Default theme JSON — mirrors theme.css tokens.
 * Pass a partial object to applyTheme() / useTheme() to override.
 *
 * Color values may be:
 * - HSL channels: "175 72% 26%"
 * - hsl()/hsla() strings
 * - hex: "#0b4f4a"
 */
export const DEFAULT_THEME = {
  colors: {
    primary: '175 72% 26%',
    primaryForeground: '0 0% 100%',
    primaryHover: '174 68% 32%',
    primaryMuted: '172 35% 92%',
    background: '160 22% 97%',
    surface: '0 0% 100%',
    surfaceElevated: '150 20% 99%',
    border: '160 12% 84%',
    text: '200 16% 10%',
    textMuted: '200 8% 42%',
    textInverse: '0 0% 100%',
    success: '152 75% 28%',
    warning: '38 90% 36%',
    danger: '4 75% 40%',
    info: '200 80% 40%',
  },
  fonts: {
    display: "'Syne', system-ui, sans-serif",
    body: "'Instrument Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, monospace",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '999px',
  },
};

/** Map nested JSON keys → CSS custom property names */
export const THEME_CSS_VAR_MAP = {
  'colors.primary': '--color-primary',
  'colors.primaryForeground': '--color-primary-foreground',
  'colors.primaryHover': '--color-primary-hover',
  'colors.primaryMuted': '--color-primary-muted',
  'colors.background': '--color-background',
  'colors.surface': '--color-surface',
  'colors.surfaceElevated': '--color-surface-elevated',
  'colors.border': '--color-border',
  'colors.text': '--color-text',
  'colors.textMuted': '--color-text-muted',
  'colors.textInverse': '--color-text-inverse',
  'colors.success': '--color-success',
  'colors.warning': '--color-warning',
  'colors.danger': '--color-danger',
  'colors.info': '--color-info',
  'fonts.display': '--font-display',
  'fonts.body': '--font-body',
  'fonts.mono': '--font-mono',
  'radius.sm': '--radius-sm',
  'radius.md': '--radius-md',
  'radius.lg': '--radius-lg',
  'radius.xl': '--radius-xl',
  'radius.full': '--radius-full',
};

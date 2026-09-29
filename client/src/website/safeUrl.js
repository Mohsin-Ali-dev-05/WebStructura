/**
 * Sanitize user/AI-provided URLs before rendering in href/src.
 * Blocks javascript:/data:/vbscript: while allowing http(s), mailto, tel, anchors, and relatives.
 */

function hasDangerousScheme(value) {
  const lower = value.toLowerCase();
  return (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text') ||
    lower.startsWith('data:application')
  );
}

export function sanitizeHref(value, fallback = '#') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed || hasDangerousScheme(trimmed)) {
    return fallback;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('#') ||
    lower.startsWith('/') ||
    lower.startsWith('./') ||
    lower.startsWith('../') ||
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    !/^[a-z][a-z0-9+.-]*:/i.test(trimmed)
  ) {
    return trimmed;
  }

  return fallback;
}

export function sanitizeImageSrc(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmed = value.trim();
  if (!trimmed || hasDangerousScheme(trimmed)) {
    return '';
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('https://') ||
    lower.startsWith('http://') ||
    lower.startsWith('data:image/') ||
    lower.startsWith('/') ||
    lower.startsWith('./') ||
    lower.startsWith('../') ||
    !/^[a-z][a-z0-9+.-]*:/i.test(trimmed)
  ) {
    return trimmed;
  }

  return '';
}

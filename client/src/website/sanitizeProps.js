/**
 * React `style` must be an object. AI / JSON sometimes stores CSS as a string.
 * Convert when possible; otherwise drop (prefer className / theme tokens).
 */

function kebabToCamel(property) {
  if (property.startsWith('--')) {
    return property;
  }
  return property.replace(/-([a-z])/gi, (_, char) => char.toUpperCase());
}

export function cssStringToStyleObject(css) {
  if (typeof css !== 'string' || !css.trim()) {
    return null;
  }

  const result = {};

  css.split(';').forEach((declaration) => {
    const trimmed = declaration.trim();
    if (!trimmed) {
      return;
    }

    const colon = trimmed.indexOf(':');
    if (colon <= 0) {
      return;
    }

    const property = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    if (!property || !value) {
      return;
    }

    result[kebabToCamel(property)] = value;
  });

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * @returns {Record<string, string> | undefined}
 */
export function sanitizeReactStyle(value) {
  if (value == null || value === false) {
    return undefined;
  }

  if (typeof value === 'string') {
    return cssStringToStyleObject(value) || undefined;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const next = {};
    Object.entries(value).forEach(([key, entry]) => {
      if (typeof entry === 'string' || typeof entry === 'number') {
        next[key] = entry;
      }
    });
    return Object.keys(next).length > 0 ? next : undefined;
  }

  return undefined;
}

/**
 * Strip or coerce dangerous / invalid DOM props from website JSON before render.
 */
export function sanitizeComponentProps(props) {
  if (!props || typeof props !== 'object' || Array.isArray(props)) {
    return {};
  }

  const next = { ...props };

  if ('style' in next) {
    const style = sanitizeReactStyle(next.style);
    if (style) {
      next.style = style;
    } else {
      delete next.style;
    }
  }

  // Never let AI JSON run scripts via props
  delete next.dangerouslySetInnerHTML;

  return next;
}

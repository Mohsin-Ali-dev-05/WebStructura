/**
 * Build a LoremFlickr photo URL from a keyword/tag string.
 * Used when AI returns imageKeyword instead of a full URL.
 */
export function buildLoremFlickrUrl(keyword, width = 800, height = 600) {
  const cleaned = String(keyword || '')
    .toLowerCase()
    .replace(/[^a-z0-9,\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, ',')
    .replace(/,+/g, ',')
    .replace(/^,|,$/g, '')
    .slice(0, 80);

  const tags = cleaned || 'business';
  const w = Number.isFinite(width) ? Math.max(200, Math.min(1600, width)) : 800;
  const h = Number.isFinite(height) ? Math.max(200, Math.min(1200, height)) : 600;
  return `https://loremflickr.com/${w}/${h}/${tags}`;
}

/**
 * Resolve a displayable image src from an explicit URL or imageKeyword.
 */
export function resolveMediaSrc({ image = '', url = '', imageKeyword = '' } = {}) {
  const direct = String(image || url || '').trim();
  if (direct) {
    return direct;
  }
  if (imageKeyword) {
    return buildLoremFlickrUrl(imageKeyword);
  }
  return '';
}

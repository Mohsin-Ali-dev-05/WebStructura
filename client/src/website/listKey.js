/**
 * Stable React key for nested list rows (links, items, tiers, images).
 * Prefer persisted _editorId / id — never bare array index alone.
 */
export function listItemKey(item, index, prefix = 'row') {
  if (item && typeof item === 'object') {
    if (typeof item._editorId === 'string' && item._editorId) {
      return item._editorId;
    }
    if (typeof item.id === 'string' && item.id) {
      return item.id;
    }
  }
  return `${prefix}-${index}`;
}

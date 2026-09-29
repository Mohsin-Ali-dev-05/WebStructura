import { useEffect } from 'react';
import { applyTheme } from '../theme/applyTheme.js';

/**
 * Apply a JSON theme to :root (or a ref element) and clean up on change/unmount.
 *
 * @param {object} themeJson
 * @param {React.RefObject<HTMLElement>} [targetRef]
 */
export function useTheme(themeJson, targetRef = null) {
  useEffect(() => {
    const target = targetRef?.current || null;
    const cleanup = applyTheme(themeJson || {}, target);
    return cleanup;
  }, [themeJson, targetRef]);
}

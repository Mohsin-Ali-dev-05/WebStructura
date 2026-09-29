import { useLayoutEffect, useMemo, useRef } from 'react';
import ComponentRenderer from './ComponentRenderer.jsx';
import { normalizeWebsiteData } from './schema.js';
import { themeToStyleObject } from '../theme/index.js';
import { sanitizeReactStyle } from './sanitizeProps.js';
import './website.css';

/**
 * Renders structured websiteData by delegating the components array
 * to ComponentRenderer. Theme tokens are scoped to this preview root
 * via CSS variables (applied with setProperty — never a string style prop).
 */
export default function WebsiteRenderer({
  websiteData,
  className = '',
  interactive = false,
  selectedBlockId = '',
  onSelectBlock,
}) {
  const rootRef = useRef(null);
  const data = normalizeWebsiteData(websiteData);

  const themeStyle = useMemo(() => {
    const tokenStyle = themeToStyleObject({
      colors: {
        primary: data.theme.primaryColor,
        background: data.theme.backgroundColor,
        surface: data.theme.backgroundColor,
        text: data.theme.textColor,
      },
      fonts: {
        body: data.theme.font,
        display: data.theme.font,
      },
      // Builder stores flat theme keys — keep them for flattenThemeEntries
      primaryColor: data.theme.primaryColor,
      backgroundColor: data.theme.backgroundColor,
      textColor: data.theme.textColor,
      font: data.theme.font,
    });

    const merged = {
      ...tokenStyle,
      '--ws-primary': 'var(--primary)',
      '--ws-bg': 'var(--bg)',
      '--ws-text': 'var(--text)',
      '--ws-font': 'var(--font-body)',
    };

    // Guarantee a plain object of string values for DOM CSS variables
    return sanitizeReactStyle(merged) || {};
  }, [
    data.theme.primaryColor,
    data.theme.backgroundColor,
    data.theme.textColor,
    data.theme.font,
  ]);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return undefined;
    }

    const appliedKeys = Object.keys(themeStyle);

    appliedKeys.forEach((key) => {
      element.style.setProperty(key, String(themeStyle[key]));
    });

    return () => {
      appliedKeys.forEach((key) => {
        element.style.removeProperty(key);
      });
    };
  }, [themeStyle]);

  return (
    <div
      ref={rootRef}
      className={`ws-site ${className}`.trim()}
      data-website-root="true"
    >
      <ComponentRenderer
        components={data.components}
        interactive={interactive}
        selectedBlockId={selectedBlockId}
        onSelectBlock={onSelectBlock}
      />
    </div>
  );
}

import { sanitizeReactStyle } from '../sanitizeProps.js';
import { WS_CONTAINER, WS_SECTION } from './designSystem.js';

/**
 * Shared layout shell for generated website sections.
 * Responsive vertical padding + constrained content container.
 */
export default function SectionWrapper({
  children,
  id,
  className = '',
  as: Tag = 'section',
  style,
  ...rest
}) {
  const sectionClass = [WS_SECTION, className].filter(Boolean).join(' ');

  const safeStyle = sanitizeReactStyle(style);
  if ('style' in rest) {
    delete rest.style;
  }

  return (
    <Tag
      id={id}
      className={sectionClass}
      {...rest}
      {...(safeStyle ? { style: safeStyle } : {})}
    >
      <div className={WS_CONTAINER}>{children}</div>
    </Tag>
  );
}

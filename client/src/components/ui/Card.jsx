import { cx } from './cx.js';

const VARIANTS = {
  default: 'bg-white border border-gray-200 rounded-3xl shadow-sm',
  muted: 'bg-gray-50/50 border border-gray-200 rounded-3xl',
};

const PADDINGS = {
  md: 'p-6 md:p-8',
  none: '',
};

/**
 * Premium bento card used across settings (and similar surfaces).
 * Pass `as` to render as section, form, dl, etc. without changing layout.
 */
export default function Card({
  as: Component = 'div',
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={cx(VARIANTS[variant] || VARIANTS.default, PADDINGS[padding], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

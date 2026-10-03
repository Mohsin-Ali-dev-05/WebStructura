import { cx } from './cx.js';

/**
 * Premium iOS-style switch used on Appearance, Notifications, and Security.
 */
export default function Toggle({
  checked = false,
  onChange,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      className={cx(
        'settings-toggle shrink-0 relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200',
        checked
          ? 'bg-emerald-600 border-emerald-600'
          : 'bg-gray-200 border-gray-200',
        className,
      )}
      onClick={onChange}
      {...props}
    >
      <span
        className={cx(
          'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

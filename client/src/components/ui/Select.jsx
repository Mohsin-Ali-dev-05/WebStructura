import { cx } from './cx.js';

export const SELECT_BASE_CLASS =
  'w-full md:w-48 py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm';

/**
 * Compact select matching Appearance / Notifications settings controls.
 */
export default function Select({ className = '', children, ...props }) {
  return (
    <select className={cx(SELECT_BASE_CLASS, className)} {...props}>
      {children}
    </select>
  );
}

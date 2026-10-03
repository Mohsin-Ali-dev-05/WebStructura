import { cx } from './cx.js';

const VARIANTS = {
  primary:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5',
  secondary:
    'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50',
  danger:
    'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-red-600 hover:border-red-200',
  ghost:
    'text-sm font-medium text-gray-500 hover:text-rose-600 disabled:opacity-40',
};

const SIZES = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2.5 px-6',
  lg: 'py-3 px-6',
};

/**
 * Shared action button. Defaults match the premium settings CTAs.
 */
export default function Button({
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const isGhost = variant === 'ghost';

  return (
    <button
      type={type}
      className={cx(
        isGhost
          ? 'transition-colors'
          : 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant] || VARIANTS.primary,
        isGhost ? '' : SIZES[size] || SIZES.lg,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

import FieldError from '../FieldError.jsx';
import { fieldClass } from '../../utils/formValidation.js';
import { cx } from './cx.js';

/** Premium settings / form field surface (gray-50 shell, emerald focus). */
export const INPUT_BASE_CLASS =
  'w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-gray-50/50 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm';

export const LABEL_CLASS = 'text-sm font-bold text-gray-700';

/**
 * Labeled text input with optional FieldError. Visual match for settings forms.
 */
export default function Input({
  label,
  error = '',
  className = '',
  id,
  ...props
}) {
  const hasError = Boolean(error);

  const control = (
    <input
      id={id}
      className={cx(fieldClass(INPUT_BASE_CLASS, hasError), className)}
      aria-invalid={hasError ? true : undefined}
      {...props}
    />
  );

  if (!label && !error) {
    return control;
  }

  return (
    <label className="block space-y-2" htmlFor={id}>
      {label ? <span className={LABEL_CLASS}>{label}</span> : null}
      {control}
      <FieldError message={error} />
    </label>
  );
}

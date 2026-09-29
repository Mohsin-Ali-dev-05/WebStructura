import { useId, useState } from 'react';
import FieldError from './FieldError.jsx';

/**
 * Password input with show / hide toggle for auth forms.
 */
export default function PasswordField({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  autoComplete = 'current-password',
  required = true,
  minLength,
  disabled = false,
  inputClassName = '',
  error = '',
}) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  return (
    <label
      className={`password-field${hasError ? ' password-field--error' : ''}`}
      htmlFor={inputId}
    >
      {label}
      <div className="password-field-control">
        <input
          id={inputId}
          className={inputClassName || undefined}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
        />
        <button
          type="button"
          className="password-visibility-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          title={visible ? 'Hide password' : 'Show password'}
          disabled={disabled}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <FieldError id={errorId} message={error} />
    </label>
  );
}

/**
 * Inline field-level validation message.
 */
export default function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="field-error text-sm text-red-600 mt-1.5" role="alert">
      {message}
    </p>
  );
}

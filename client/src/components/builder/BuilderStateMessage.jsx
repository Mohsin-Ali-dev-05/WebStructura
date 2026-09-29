export default function BuilderStateMessage({
  variant = 'info',
  title,
  children,
  action = null,
}) {
  return (
    <div className={`builder-state builder-state--${variant}`} role="status">
      {title ? <h2>{title}</h2> : null}
      <div className="builder-state-body">{children}</div>
      {action}
    </div>
  );
}

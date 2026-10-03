/**
 * Shared settings content wrapper: page title, subtitle, and vertical stack.
 */
export default function SettingsPageShell({ title, description, children }) {
  return (
    <div className="space-y-8 w-full">
      <header>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
          {title}
        </h2>
        {description ? (
          <p className="text-base text-gray-500 mt-2 mb-0 leading-relaxed max-w-3xl">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

import { useEffect } from 'react';

const EXPORT_OPTIONS = [
  {
    id: 'react-zip',
    title: 'Download React App (ZIP)',
    description:
      'A ready-to-run Vite + React project with your components and theme.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 6.75a.75.75 0 0 0-1.5 0v2.69l-.72-.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72V8.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'static-html',
    title: 'Download Static HTML',
    description:
      'A single self-contained HTML file you can host anywhere instantly.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25ZM6 6.75A.75.75 0 0 1 6.75 6h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5ZM6 12.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 'raw-json',
    title: 'Export raw JSON',
    description:
      'Download the full websiteData schema for backup or API import.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 1c3.866 0 7 1.79 7 4v10c0 2.21-3.134 4-7 4s-7-1.79-7-4V5c0-2.21 3.134-4 7-4Zm0 1.5c-2.9 0-5.5 1.24-5.5 2.5S7.1 7.5 10 7.5s5.5-1.24 5.5-2.5S12.9 2.5 10 2.5Zm5.5 6.382V10c0 1.26-2.6 2.5-5.5 2.5S4.5 11.26 4.5 10V8.882c1.39.78 3.35 1.218 5.5 1.218s4.11-.438 5.5-1.218Zm0 4V15c0 1.26-2.6 2.5-5.5 2.5S4.5 16.26 4.5 15v-1.618c1.39.78 3.35 1.218 5.5 1.218s4.11-.438 5.5-1.218Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

/**
 * Premium export modal — overlay + selectable export targets.
 */
export default function ExportModal({
  open,
  onClose,
  onSelectOption,
  exporting = false,
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !exporting) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, exporting]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      onClick={() => {
        if (!exporting) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              id="export-modal-title"
              className="text-xl font-bold text-gray-900 tracking-tight"
            >
              Export Source Code
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {exporting
                ? 'Building your React + Vite + Tailwind ZIP…'
                : 'Choose how you want to take this site with you.'}
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all disabled:opacity-50"
            onClick={onClose}
            disabled={exporting}
            aria-label="Close export modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {EXPORT_OPTIONS.map((option) => {
            const isZip = option.id === 'react-zip';
            const busy = exporting && isZip;
            return (
              <button
                key={option.id}
                type="button"
                className="w-full text-left flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-emerald-200 hover:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => onSelectOption?.(option.id)}
                disabled={exporting}
                aria-busy={busy}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  {option.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {busy ? 'Exporting…' : option.title}
                  </span>
                  <span className="block text-sm text-gray-500 mt-0.5 leading-snug">
                    {option.description}
                  </span>
                </span>
                <span
                  className="text-gray-300 self-center shrink-0"
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
